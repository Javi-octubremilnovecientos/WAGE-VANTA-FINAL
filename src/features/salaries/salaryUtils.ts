/**
 * Salary Utilities
 *
 * Funciones de utilidad para procesar la respuesta de la API de salarios.
 * La lógica de construcción de queries PostgREST se trasladó a las
 * Supabase Edge Functions (get-salary-data, get-filtered-options).
 */

import type { SalaryRecord, BoxPlotData } from './types';

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

/**
 * Fusiona dos BoxPlotData en uno. Se usa cuando combinamos los stats
 * calculados desde Supabase con los stats enriquecidos por Gemini en
 * casos de muestra escasa (< 8 registros).
 *
 * Estrategia:
 *  - min/max: extremos absolutos (rango total observado entre ambas fuentes).
 *  - q1/median/q3: promedio simple (zona central combinada).
 *  - category/color: heredan del primario para mantener identidad visual.
 *
 * Si una de las fuentes es null, se devuelve la otra tal cual.
 */
export function mergeBoxPlots(
    primary: BoxPlotData | null,
    secondary: BoxPlotData | null,
): BoxPlotData | null {
    if (!primary && !secondary) return null;
    if (!primary) return secondary;
    if (!secondary) return primary;

    return {
        category: primary.category,
        min: Math.min(primary.min, secondary.min),
        q1: (primary.q1 + secondary.q1) / 2,
        median: (primary.median + secondary.median) / 2,
        q3: (primary.q3 + secondary.q3) / 2,
        max: Math.max(primary.max, secondary.max),
        color: primary.color,
    };
}
