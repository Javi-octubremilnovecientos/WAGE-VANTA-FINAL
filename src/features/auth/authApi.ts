import { apiSlice } from '@/services/api';
import type { UserData, PayData } from '@/lib/User';
import type { User } from '@/features/auth/authSlice';
import type { Template, Comparison } from '@/lib/User';

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
    };
}

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
         * GET auth/v1/verify
         * 
         * Este endpoint convierte el token hash del email en un access_token (JWT) válido.
         * Se usa cuando el usuario hace click en el link del email de recuperación.
         * 
         * IMPORTANTE:
         * - El token es el hash que viene en la URL (?token=xxx)
         * - type debe ser "recovery"
         * - Devuelve un access_token válido que se puede usar para actualizar la contraseña
         */
        verifyRecoveryToken: builder.mutation<AuthResponse, { token: string; type: string }>({
            query: ({ token, type }) => ({
                url: `auth/v1/verify?token=${encodeURIComponent(token)}&type=${type}`,
                method: 'GET',
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
    }),
});

export const {
    useSignInMutation,
    useSignUpMutation,
    useUpdateUserMutation,
    useSendResetEmailMutation,
    useVerifyRecoveryTokenMutation,
    useResetPasswordWithTokenMutation,
} = authApi;
