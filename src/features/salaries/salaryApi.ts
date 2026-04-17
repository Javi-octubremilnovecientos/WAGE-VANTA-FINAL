import { apiSlice } from '@/services/api';
import type { SalaryRecord, SalaryQueryParams } from './types';
import { buildQueryString } from './salaryUtils';

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
    }),
});

export const { useGetSalaryDataQuery } = salaryApi;

