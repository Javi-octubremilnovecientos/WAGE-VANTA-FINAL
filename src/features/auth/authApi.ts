import { apiSlice } from '@/services/api';
import type { UserData, PayData } from '@/lib/User';
import type { User } from '@/features/auth/authSlice';
import type { Template, Comparison } from '@/lib/User';
import { AVATAR_BUCKET_NAME } from '@/lib/imageUtils';

/**
 * Interfaces para autenticación con Supabase
 */

export interface SignUpRequest {
    email: string;
    password: string;
    data: UserData;
}

export interface SignInRequest {
    email: string;
    password: string;
}

export interface UpdateUserRequest {
    email?: string;
    password?: string;
    current_password?: string; // Requerido para cambiar password
    data?: Partial<UserData>;
}

export interface SupabaseUser {
    id: string;
    aud: string;
    role?: string;
    email?: string;
    email_confirmed_at?: string;
    phone?: string;
    confirmed_at?: string;
    last_sign_in_at?: string;
    app_metadata?: Record<string, unknown>;
    user_metadata?: Record<string, unknown>;
    identities?: Array<Record<string, unknown>>;
    created_at?: string;
    updated_at?: string;
    new_email?: string; // Email pendiente de confirmación
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at?: number;
    refresh_token: string;
    user: SupabaseUser;
}

/**
 * Helper: Obtiene la URL base de Supabase desde variables de entorno
 */
export const getSupabaseUrl = (): string => {
    return import.meta.env.VITE_SUPABASE_URL || 'https://idrgqvtgllamddukkkvx.supabase.co';
};

/**
 * Helper: Construye la URL de OAuth authorize para un provider
 * @param provider - OAuth provider (google, github, etc)
 * @param redirectTo - URL de callback después de auth exitoso
 */
export const buildOAuthUrl = (provider: string, redirectTo: string): string => {
    return `${getSupabaseUrl()}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`;
};

/**
 * Helper: Detecta si un usuario es nuevo (registrado hace menos de 5 minutos)
 * @param createdAt - Timestamp ISO de created_at del usuario
 */
export const isNewUser = (createdAt: string): boolean => {
    const created = new Date(createdAt).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return (now - created) < fiveMinutes;
};

/**
 * Mapea la respuesta de Supabase a nuestro modelo de User en Redux.
 * Aplica valores por defecto para campos que aún no existan en user_metadata.
 */
export function mapSupabaseResponseToUser(supabaseUser: SupabaseUser): User {
    const meta = supabaseUser.user_metadata ?? {};
    return {
        id: supabaseUser.id,
        email: supabaseUser.email ?? '',
        newEmail: supabaseUser.new_email, // Email pendiente de confirmación
        name: (meta.name as string) ?? '',
        premium: (meta.premium as boolean) ?? false,
        templates: (meta.templates as Template[]) ?? [],
        comparisons: (meta.comparisons as Comparison[]) ?? [],
        payData: (meta.payData as PayData) ?? { card: null, history: [] },
        avatarUrl: (meta.avatarUrl as string | null) ?? null,
    };
}

/**
 * Helper: Construye la URL pública para un avatar en Supabase Storage
 * @param userId - ID del usuario propietario del avatar
 * @param filename - Nombre del archivo (ej: avatar_1234567890.jpg)
 */
export const getAvatarPublicUrl = (userId: string, filename: string): string => {
    const supabaseUrl = getSupabaseUrl();
    return `${supabaseUrl}/storage/v1/object/public/${AVATAR_BUCKET_NAME}/${userId}/${filename}`;
};

/**
 * RTK Query API para Autenticación
 * 
 * Inyecta endpoints de auth en el apiSlice.
 * 
 * Uso en componentes:
 * ```ts
 * const [signIn] = useSignInMutation();
 * const [signUp] = useSignUpMutation();
 * ```
 */

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Iniciar sesión con Supabase
         * POST auth/v1/token?grant_type=password
         */
        signIn: builder.mutation<AuthResponse, SignInRequest>({
            query: (credentials) => ({
                url: 'auth/v1/token?grant_type=password',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth', 'Profile'],
        }),

        /**
         * Registrar nuevo usuario en Supabase
         * POST auth/v1/signup
         */
        signUp: builder.mutation<AuthResponse, SignUpRequest>({
            query: (userData) => ({
                url: 'auth/v1/signup',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['Auth', 'Profile'],
        }),
        /**
         * Actualizar datos del usuario en Supabase
         * PUT auth/v1/user
         * 
         * IMPORTANTE:
         * - Al cambiar email, Supabase NO lo actualiza inmediatamente.
         *   Coloca el nuevo email en 'new_email' y requiere confirmación por correo.
         *   Solo después de confirmar, 'email' se actualiza con el valor de 'new_email'.
         * - Al cambiar password, Supabase REQUIERE 'current_password' para validar
         *   que el usuario conoce su contraseña actual (error 400 si no se envía).
         * 
         * Centraliza actualizaciones de email, password, name, premium, payData, etc.
         */
        updateUser: builder.mutation<SupabaseUser, UpdateUserRequest>({
            query: (body) => ({
                url: 'auth/v1/user',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),

        /**
         * Enviar email de recuperación de contraseña
         * POST auth/v1/recover
         * 
         * Supabase enviará un email con un link que incluye el token de recuperación.
         * El link redirige a la URL especificada en redirectTo con query params:
         * redirectTo?token=xxx&type=recovery
         * 
         * IMPORTANTE: La URL de redirectTo debe estar en la whitelist de Supabase
         * (Dashboard → Authentication → URL Configuration → Redirect URLs)
         */
        sendResetEmail: builder.mutation<void, { email: string; redirectTo?: string }>({
            query: ({ email, redirectTo }) => ({
                url: 'auth/v1/recover',
                method: 'POST',
                body: {
                    email,
                    options: {
                        redirectTo: redirectTo || `${window.location.origin}/password-recovery`,
                    },
                },
            }),
        }),

        /**
         * Verificar token de recuperación y obtener session
         * POST auth/v1/verify
         *
         * Intercambia el token_hash del email por un access_token (JWT) válido.
         * Se usa cuando el usuario llega a /password-recovery con ?token=xxx&type=recovery.
         *
         * IMPORTANTE:
         * - Se debe usar POST con el token en el body (token_hash), NO GET con query params.
         *   El endpoint GET es un flow de redirección para navegador (303 See Other) y no
         *   devuelve JSON — fetch/RTK Query no puede consumirlo correctamente.
         * - POST /auth/v1/verify es lo que usa internamente el Supabase JS SDK en
         *   supabase.auth.verifyOtp({ token_hash, type }) y devuelve AuthResponse como JSON.
         * - type debe ser "recovery"
         */
        verifyRecoveryToken: builder.mutation<AuthResponse, { token: string; type: string }>({
            query: ({ token, type }) => ({
                url: 'auth/v1/verify',
                method: 'POST',
                body: {
                    token_hash: token,
                    type,
                },
            }),
        }),

        /**
         * Resetear contraseña usando access_token (JWT)
         * PUT auth/v1/user
         * 
         * Este endpoint actualiza la contraseña usando un JWT válido.
         * Debe usarse DESPUÉS de verificar el token hash con verifyRecoveryToken.
         * 
         * IMPORTANTE:
         * - El token debe ser un JWT completo (access_token), no el hash del email
         * - NO requiere current_password (el token ya valida la identidad)
         */
        resetPasswordWithToken: builder.mutation<SupabaseUser, { password: string; accessToken: string }>({
            query: ({ password, accessToken }) => ({
                url: 'auth/v1/user',
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: { password },
            }),
            invalidatesTags: ['Auth', 'Profile'],
        }),

        /**
         * Obtener datos del usuario desde access_token (OAuth callback)
         * GET auth/v1/user
         * 
         * Obtiene los datos completos del usuario usando un access_token válido.
         * Se usa principalmente después del callback de OAuth para obtener user_metadata.
         * 
         * IMPORTANTE:
         * - Requiere access_token válido en el header Authorization
         * - Retorna SupabaseUser completo con metadata
         * - No invalida tags (es solo lectura)
         */
        getSessionFromTokens: builder.mutation<SupabaseUser, { accessToken: string }>({
            query: ({ accessToken }) => ({
                url: 'auth/v1/user',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }),
        }),

        /**
         * Subir avatar a Supabase Storage
         * POST storage/v1/object/{bucket}/{userId}/{filename}
         * 
         * Sube un archivo de imagen al bucket de avatares en Supabase Storage.
         * El bucket debe estar configurado como público y tener policies para INSERT (authenticated).
         * 
         * IMPORTANTE:
         * - El body debe ser FormData con el file binario
         * - El navegador setea automáticamente Content-Type: multipart/form-data con boundary
         * - El Authorization header (Bearer token) se setea en prepareHeaders
         * - El path incluye userId para organizar avatares por usuario
         * - Retorna el path relativo del archivo en el bucket
         * 
         * Si falla con error 403 "exp" claim timestamp check failed:
         * - El token JWT está expirado → necesita refrescar sesión
         * - Verificar que el token se está enviando correctamente en Authorization header
         * 
         * @param userId - ID del usuario propietario
         * @param filename - Nombre del archivo (ej: avatar_1234567890.jpg)
         * @param file - Archivo de imagen (File object)
         */
        uploadAvatar: builder.mutation<{ path: string }, { userId: string; filename: string; file: File }>({
            query: ({ userId, filename, file }) => {
                const formData = new FormData();
                formData.append('', file); // Supabase Storage espera el file sin key o con key vacía

                return {
                    url: `storage/v1/object/${AVATAR_BUCKET_NAME}/${userId}/${filename}`,
                    method: 'POST',
                    body: formData,
                };
            },
            invalidatesTags: ['Profile'],
        }),

        /**
         * Eliminar avatar de Supabase Storage
         * DELETE storage/v1/object/{bucket}/{path}
         * 
         * Elimina un archivo del bucket de avatares.
         * El bucket debe tener policies para DELETE (authenticated).
         * 
         * IMPORTANTE:
         * - El path debe ser la ruta completa: {userId}/{filename}
         * - Se usa para eliminar avatares antiguos antes de subir uno nuevo
         * 
         * @param path - Path completo del archivo (ej: "user123/avatar_1234567890.jpg")
         */
        deleteAvatar: builder.mutation<void, { path: string }>({
            query: ({ path }) => ({
                url: `storage/v1/object/${AVATAR_BUCKET_NAME}/${path}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Profile'],
        }),

        /**
         * Refrescar token de acceso usando refresh_token
         * POST auth/v1/token?grant_type=refresh_token
         * 
         * Intercambia el refresh_token por un nuevo access_token válido.
         * Se usa para obtener un nuevo token cuando el actual ha expirado.
         * 
         * IMPORTANTE:
         * - El refresh_token debe ser válido y no ha expirado
         * - Supabase mantiene el refresh_token válido por 30 días
         * - NO requiere Authorization header (usa refresh_token en body)
         */
        refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
            query: ({ refreshToken }) => ({
                url: 'auth/v1/token?grant_type=refresh_token',
                method: 'POST',
                body: { refresh_token: refreshToken },
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const {
    useSignInMutation,
    useSignUpMutation,
    useUpdateUserMutation,
    useSendResetEmailMutation,
    useVerifyRecoveryTokenMutation,
    useResetPasswordWithTokenMutation,
    useGetSessionFromTokensMutation,
    useUploadAvatarMutation,
    useDeleteAvatarMutation,
    useRefreshTokenMutation,
} = authApi;
