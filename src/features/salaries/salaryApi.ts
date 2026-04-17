import { apiSlice } from '@/services/api';
import type { SalaryRecord, SalaryQueryParams, ComparisonFormValues } from './types';
import { buildQueryString, buildOptionsQueryString } from './salaryUtils';

/** Parámetros para obtener opciones filtradas de un campo específico */
export interface FilteredOptionsParams {
    country: string;
    formValues: ComparisonFormValues;
    /** Columnas objetivo para extraer opciones únicas */
    targetFields: string[];
}

/**
 * RTK Query API para datos salariales de Supabase TABLE_0.
 *
 * Endpoint `getSalaryData`:
 * - Recibe { country, formValues }
 * - Construye query PostgREST progresiva (solo params con valor)
 * - La respuesta de TABLE_0 ya tiene la forma de SalaryRecord (sin transformación)
 * - Cache key automática por combinación de params (RTK Query default)
 */
export const salaryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSalaryData: builder.query<SalaryRecord[], SalaryQueryParams>({
            query: ({ country, formValues }) => ({
                url: `rest/v1/TABLE_0?${buildQueryString(formValues, country)}`,
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
                url: `rest/v1/TABLE_0?${buildOptionsQueryString(formValues, country, targetFields)}`,
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

