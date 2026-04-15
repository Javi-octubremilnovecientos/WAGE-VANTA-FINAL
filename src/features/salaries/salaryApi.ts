import { apiSlice } from '@/services/api';
import type { SalaryRecord, SalaryQueryParams } from './types';
import { buildQueryString, mapToSalaryRecord } from './salaryUtils';

/**
 * RTK Query API para datos salariales de Supabase TABLE_1.
 *
 * Endpoint `getSalaryData`:
 * - Recibe { country, formValues }
 * - Construye query PostgREST progresiva (solo params con valor)
 * - Transforma respuesta UPPER_CASE → camelCase SalaryRecord
 * - Cache key automática por combinación de params (RTK Query default)
 */
export const salaryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getSalaryData: builder.query<SalaryRecord[], SalaryQueryParams>({
            query: ({ country, formValues }) => ({
                url: `rest/v1/TABLE_1?${buildQueryString(formValues, country)}`,
                method: 'GET',
            }),
            transformResponse: (response: Record<string, unknown>[]) =>
                response.map(mapToSalaryRecord),
            providesTags: (_result, _error, { country }) => [
                { type: 'Salaries', id: country },
            ],
        }),
    }),
});

export const { useGetSalaryDataQuery } = salaryApi;

