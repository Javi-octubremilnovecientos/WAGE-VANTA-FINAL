import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';

/**
 * RTK Query API Base Configuration
 * 
 * Este archivo centraliza la configuración de RTK Query para todo el proyecto.
 * Los endpoints específicos de cada feature se inyectan usando `injectEndpoints`.
 */

// Configuración del baseQuery con fetchBaseQuery
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://idrgqvtgllamddukkkvx.supabase.co/',
    prepareHeaders: (headers, { getState }) => {
        // Supabase API Key requerida en todas las peticiones
        const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
        if (apiKey) {
            headers.set('apikey', apiKey);
        }

        // Token de autorización si el usuario está autenticado
        const state = getState() as { auth: { token: string | null } };
        const token = state.auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }

        // IMPORTANTE: NO setear Content-Type aquí
        // - Para FormData: el navegador lo setea automáticamente con boundary
        // - Para JSON: fetchBaseQuery lo detecta automáticamente
        // - Setear manualmente aquí causa conflictos con uploads de archivo

        return headers;
    },
});

/**
 * Custom baseQuery que maneja token refresh automático
 * Si un request falla con 403 Unauthorized + "exp" claim error:
 * 1. Intenta refrescar el token usando el refreshToken
 * 2. Actualiza el token en Redux
 * 3. Repite el request original con el nuevo token
 * 4. Si falla, deja que el error pase
 */
const baseQueryWithTokenRefresh: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Si falla con 403 Unauthorized y tiene error de "exp" (token expirado)
    if (result.error && result.error.status === 403) {
        const errorData = result.error.data as Record<string, any>;
        const isExpiredToken = errorData?.message?.includes('exp') || errorData?.error?.includes('Unauthorized');

        if (isExpiredToken) {
            const state = api.getState() as { auth: { refreshToken: string | null } };
            const refreshToken = state.auth.refreshToken;

            if (refreshToken) {
                console.log('Token expirado, intentando refrescar...');

                try {
                    // Intentar refrescar el token
                    const refreshResult = await baseQuery(
                        {
                            url: 'auth/v1/token?grant_type=refresh_token',
                            method: 'POST',
                            body: { refresh_token: refreshToken },
                        },
                        api,
                        extraOptions
                    );

                    if (refreshResult.data) {
                        const authResponse = refreshResult.data as any;
                        // Actualizar el token en Redux
                        api.dispatch({
                            type: 'auth/setCredentials',
                            payload: {
                                user: authResponse.user,
                                token: authResponse.access_token,
                                refreshToken: authResponse.refresh_token,
                            },
                        });

                        console.log('Token refrescado exitosamente, reintentando request...');

                        // Repetir el request original con el nuevo token
                        return baseQuery(args, api, extraOptions);
                    }
                } catch (refreshError) {
                    console.error('Error refrescando token:', refreshError);
                    // Dejar que el error original pase - el usuario deberá loguearse de nuevo
                }
            }
        }
    }

    return result;
};

/**
 * API Slice principal
 * 
 * - `reducerPath`: identificador único para el reducer en el store
 * - `tagTypes`: etiquetas para invalidación inteligente de caché
 * - `endpoints`: endpoints compartidos (opcional)
 * 
 * IMPORTANTE: 
 * - FormData: El navegador setea Content-Type automáticamente con boundary
 * - Los headers de Authorization (token) se preservan en prepareHeaders
 * - Token refresh automático: si falla con 403 "exp", intenta refrescar
 */
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithTokenRefresh,
    tagTypes: [
        'Salaries',
        'Users',
        'Templates',
        'Comparisons',
        'Auth',
        'Profile',
    ],
    endpoints: () => ({}), // Los endpoints se inyectan desde cada feature
    refetchOnMountOrArgChange: 30, // Refetch después de 30 segundos si cambió el argumento
    refetchOnFocus: true, // Refetch cuando la ventana gana el foco
    refetchOnReconnect: true, // Refetch cuando se reconecta a la red
});

export default apiSlice;
