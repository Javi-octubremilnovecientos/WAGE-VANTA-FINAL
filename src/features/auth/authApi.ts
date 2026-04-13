import { apiSlice } from '@/services/api';

/**
 * Interfaces para autenticación con Supabase
 */

export interface SignUpRequest {
    email: string;
    password: string;
    data?: {
        name?: string;
        [key: string]: unknown;
    };
}

export interface SignInRequest {
    email: string;
    password: string;
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
    }),
});

export const { useSignInMutation, useSignUpMutation } = authApi;
