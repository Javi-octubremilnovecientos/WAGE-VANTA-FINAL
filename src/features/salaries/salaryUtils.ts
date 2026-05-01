/**
 * Salary Utilities
 *
 * Funciones de utilidad para procesar la respuesta de la API de salarios.
 * La lógica de construcción de queries PostgREST se trasladó a las
 * Supabase Edge Functions (get-salary-data, get-filtered-options).
 */

import type { SalaryRecord } from './types';

/**
 * Extrae los salarios mensuales de un array de SalaryRecord.
 * Monthly Wage es numérico en TABLE_0, solo filtramos valores inválidos.
 */
export function extractWages(records: SalaryRecord[]): number[] {
    return records
        .map((r) => r['Monthly Wage'])
        .filter((w) => Number.isFinite(w) && w > 0);
}

/**
 * Extrae valores únicos de una columna específica de un array de SalaryRecord.
 * Se usa para poblar las opciones de los ComboBox dinámicos.
 * @param records - Registros de salario de la API
 * @param fieldId - ID del campo/columna a extraer
 * @returns Array de valores únicos ordenados alfabéticamente
 */
export function extractUniqueOptions(
    records: SalaryRecord[],
    fieldId: keyof SalaryRecord,
): string[] {
    const uniqueSet = new Set<string>();

    for (const record of records) {
        const value = record[fieldId];
        if (typeof value === 'string' && value.trim() !== '') {
            uniqueSet.add(value);
        }
    }

    return Array.from(uniqueSet).sort((a, b) => a.localeCompare(b));
}
