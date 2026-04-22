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

        // Content-Type para JSON (pero NO para FormData - el navegador lo setea automáticamente)
        // Esto se sobrescribe en cada request si es necesario
        if (!headers.has('Content-Type')) {
            headers.set('Content-Type', 'application/json');
        }

        return headers;
    },
});

/**
 * Custom baseQuery que envuelve fetchBaseQuery para manejar FormData correctamente
 * Cuando el body es FormData, no seteamos Content-Type para que el navegador lo maneje
 */
const baseQueryWithFormData: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    // Si args es un objeto FetchArgs y el body es FormData
    if (typeof args === 'object' && args.body instanceof FormData) {
        // No setear Content-Type manualmente - dejar que el navegador lo haga
        // Crear nuevos headers sin Content-Type
        const headers = new Headers(args.headers);
        headers.delete('Content-Type');
        args.headers = headers;
    }

    // Llamar al baseQuery original
    return baseQuery(args, api, extraOptions);
};

/**
 * API Slice principal
 * 
 * - `reducerPath`: identificador único para el reducer en el store
 * - `tagTypes`: etiquetas para invalidación inteligente de caché
 * - `endpoints`: endpoints compartidos (opcional)
 */
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithFormData,
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
