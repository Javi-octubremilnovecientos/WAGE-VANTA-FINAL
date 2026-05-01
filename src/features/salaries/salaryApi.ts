import { apiSlice } from '@/services/api';
import type { SalaryRecord, SalaryQueryParams, ComparisonFormValues } from './types';

/** Parámetros para obtener opciones filtradas de un campo específico */
export interface FilteredOptionsParams {
    country: string;
    formValues: ComparisonFormValues;
    /** Columnas objetivo para extraer opciones únicas */
    targetFields: string[];
}

/**
 * RTK Query API para datos salariales via Supabase Edge Functions.
 *
 * Las peticiones van a las Edge Functions `get-salary-data` y `get-filtered-options`
 * que actúan como proxy server-side. El nombre real de la tabla y la service_role
 * key nunca se exponen al cliente.
 *
 * Endpoint `getSalaryData`:
 * - Recibe { country, formValues }
 * - Llama a functions/v1/get-salary-data con los parámetros serializados
 * - La Edge Function construye la query PostgREST y retorna SalaryRecord[]
 * - Cache key automática por combinación de params (RTK Query default)
 */
export const salaryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSalaryData: builder.query<SalaryRecord[], SalaryQueryParams>({
            query: ({ country, formValues }) => ({
                url: `functions/v1/get-salary-data?country=${encodeURIComponent(country)}&formValues=${encodeURIComponent(JSON.stringify(formValues))}`,
                method: 'GET',
            }),
            providesTags: (_result, _error, { country }) => [
                { type: 'Salaries', id: country },
            ],
        }),

        /**
         * Obtiene registros filtrados para extraer opciones dinámicas.
         * Se usa para poblar los ComboBox con valores disponibles según filtros previos.
         *
         * El cache key incluye country, formValues y targetFields para evitar
         * colisiones y permitir refetch cuando cambian los filtros.
         */
        getFilteredOptions: builder.query<SalaryRecord[], FilteredOptionsParams>({
            query: ({ country, formValues, targetFields }) => ({
                url: `functions/v1/get-filtered-options?country=${encodeURIComponent(country)}&formValues=${encodeURIComponent(JSON.stringify(formValues))}&targetFields=${encodeURIComponent(JSON.stringify(targetFields))}`,
                method: 'GET',
            }),
            // No invalidamos cache por país ya que las opciones dependen de múltiples filtros
            providesTags: (_result, _error, { country, formValues }) => [
                { type: 'Salaries', id: `options-${country}-${JSON.stringify(formValues)}` },
            ],
        }),
    }),
});

export const { useGetSalaryDataQuery, useGetFilteredOptionsQuery } = salaryApi;

