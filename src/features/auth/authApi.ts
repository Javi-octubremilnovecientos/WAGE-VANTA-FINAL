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
         * PATCH auth/v1/user
         * Centraliza actualizaciones de email, password, name, premium, payData, etc.
         */
        updateUser: builder.mutation<SupabaseUser, UpdateUserRequest>({
            query: (body) => ({
                url: 'auth/v1/user',
                method: 'PATCH',
                body,
            }),
            invalidatesTags: ['Profile'],
        }),
    }),
});

export const {
    useSignInMutation,
    useSignUpMutation,
    useUpdateUserMutation,
} = authApi;
