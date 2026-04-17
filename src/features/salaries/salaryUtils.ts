/**
 * Salary Utilities
 *
 * Funciones para construir parámetros PostgREST de Supabase TABLE_0
 * y extraer datos de respuesta.
 *
 * Tras la refactorización, los field IDs de formSteps coinciden exactamente
 * con los column names de TABLE_0 y label === value, eliminando toda capa de mapeo.
 */

import {
    SUPABASE_SELECT_COLUMNS,
    VALID_COUNTRIES,
} from './salaryConstants';
import type { ComparisonFormValues, SalaryRecord } from './types';

/** Campos que se filtran con operador PostgREST `eq` (coincidencia exacta) */
const EQ_FIELDS = new Set<string>(['Gender']);

/** Campos que se filtran con operador PostgREST `ilike` (coincidencia parcial) */
const ILIKE_FIELDS = new Set<string>([
    'Occupation',
    'Occupation Level',
    'Economic Activity',
    'Education Level',
]);

/** Campos del formulario que NO son columnas de filtro en TABLE_0 */
const EXCLUDED_FIELDS = new Set<string>([
    'Country',
    'Monthly Wage',
    'Years Of Experience',
    'Company Size',
]);

/**
 * Construye el query string PostgREST para una petición a TABLE_0.
 * Solo incluye parámetros que ya tengan valor en formValues (progresivo).
 *
 * Como los field IDs coinciden con los column names de TABLE_0 y
 * label === value, se puede iterar formValues directamente sin mapeos.
 */
export function buildQueryString(
    formValues: ComparisonFormValues,
    country: string,
): string {
    const params = new URLSearchParams();

    if (!VALID_COUNTRIES.has(country)) {
        throw new Error(`Invalid country provided to buildQueryString: ${country}`);
    }

    // Country siempre presente (obligatorio)
    params.append('Country', `eq.${country}`);

    // Iterar formValues: cada key es un column name de TABLE_0
    for (const [fieldId, value] of Object.entries(formValues)) {
        if (!value || EXCLUDED_FIELDS.has(fieldId)) continue;

        if (EQ_FIELDS.has(fieldId)) {
            params.append(fieldId, `eq.${value}`);
        } else if (ILIKE_FIELDS.has(fieldId)) {
            params.append(fieldId, `ilike.*${value}*`);
        }
    }

    // Seleccionar solo las columnas necesarias para optimizar payload
    params.append('select', SUPABASE_SELECT_COLUMNS.join(','));

    return params.toString();
}

/**
 * Extrae los salarios mensuales de un array de SalaryRecord.
 * Monthly Wage es numérico en TABLE_0, solo filtramos valores inválidos.
 */
export function extractWages(records: SalaryRecord[]): number[] {
    return records
        .map((r) => r['Monthly Wage'])
        .filter((w) => Number.isFinite(w) && w > 0);
}
