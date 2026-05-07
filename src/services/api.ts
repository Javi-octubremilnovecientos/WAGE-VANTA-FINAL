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
    baseUrl: import.meta.env.VITE_SUPABASE_URL,
    prepareHeaders: (headers, { getState, endpoint }) => {
        // Supabase API Key requerida en todas las peticiones
        const apiKey = import.meta.env.VITE_SUPABASE_API_KEY;
        if (apiKey) {
            headers.set('apikey', apiKey);
        }

        // Token de autorización si el usuario está autenticado
        // Las peticiones a las Edge Functions de salarios son públicas (no requieren Bearer)
        // El token Bearer solo es necesario para operaciones de usuario (auth, profile, avatar)
        const state = getState() as { auth: { token: string | null } };
        const token = state.auth.token;

        // Endpoints que NO requieren autenticación (solo apikey)
        const publicEndpoints = ['getSalaryData', 'getFilteredOptions'];
        const isPublicEndpoint = endpoint && publicEndpoints.includes(endpoint);

        // Solo agregar Authorization header si tenemos token válido Y no es un endpoint público
        if (token && !isPublicEndpoint) {
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
 * Si un request falla con 401/403 Unauthorized + "JWT expired" o "exp" claim error:
 * 1. Intenta refrescar el token usando el refreshToken
 * 2. Actualiza el token en Redux
 * 3. Repite el request original con el nuevo token
 * 4. Si el refresh falla, hace logout automático
 */
const baseQueryWithTokenRefresh: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    // Si falla con 401 o 403 por token inválido/expirado, intentar refresh
    if (result.error && (result.error.status === 401 || result.error.status === 403)) {
        const errorData = result.error.data as Record<string, any>;
        const errorMessage = errorData?.message || errorData?.msg || errorData?.error || '';
        // Cubre: "JWT expired", "exp claim", "token is expired", "missing sub claim", "bad_jwt", "Invalid JWT"
        const isInvalidToken =
            errorMessage.includes('JWT expired') ||
            errorMessage.includes('exp') ||
            errorMessage.includes('expired') ||
            errorMessage.includes('missing sub') ||
            errorMessage.includes('bad_jwt') ||
            errorMessage.includes('Invalid JWT') ||
            result.error.status === 401;

        if (isInvalidToken) {
            const state = api.getState() as { auth: { refreshToken: string | null } };
            const refreshToken = state.auth.refreshToken;

            if (refreshToken) {
                console.log('[RTK Query] Token inválido/expirado, intentando refrescar...');

                try {
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

                        if (authResponse.access_token && authResponse.refresh_token) {
                            // Solo actualizar tokens — no sobreescribir user para no perder avatarUrl u otros campos
                            api.dispatch({ type: 'auth/setTokens', payload: { token: authResponse.access_token, refreshToken: authResponse.refresh_token } });

                            console.log('[RTK Query] Token refrescado, reintentando request...');
                            return baseQuery(args, api, extraOptions);
                        } else {
                            api.dispatch({ type: 'auth/logout' });
                        }
                    } else if (refreshResult.error) {
                        api.dispatch({ type: 'auth/logout' });
                    }
                } catch {
                    api.dispatch({ type: 'auth/logout' });
                }
            } else {
                api.dispatch({ type: 'auth/logout' });
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
    keepUnusedDataFor: 120, // Mantener datos en caché por X segundos después de desmontar
    refetchOnMountOrArgChange: 120, // Solo refetch si los datos tienen más de X segundos
    refetchOnFocus: false, // Deshabilitado para evitar refetch excesivo
    refetchOnReconnect: true, // Refetch cuando se reconecta a la red
});

export default apiSlice;
