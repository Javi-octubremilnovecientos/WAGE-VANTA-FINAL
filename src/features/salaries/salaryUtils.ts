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
 * Función auxiliar para aplicar filtros comunes de formValues a un URLSearchParams.
 * Reduce duplicación entre buildQueryString y buildOptionsQueryString.
 */
function applyFormFilters(
    params: URLSearchParams,
    formValues: ComparisonFormValues,
): void {
    // Iterar formValues: cada key es un column name de TABLE_0
    for (const [fieldId, value] of Object.entries(formValues)) {
        if (!value || EXCLUDED_FIELDS.has(fieldId)) continue;

        if (EQ_FIELDS.has(fieldId)) {
            params.append(fieldId, `eq.${value}`);
        } else if (ILIKE_FIELDS.has(fieldId)) {
            // Truncar a 19 caracteres para optimizar búsqueda parcial
            const truncatedValue = value.slice(0, 19);
            params.append(fieldId, `ilike.*${truncatedValue}*`);
        }
    }
}

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

    // Aplicar filtros comunes
    applyFormFilters(params, formValues);

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
 * Construye query string PostgREST para obtener opciones filtradas.
 * Similar a buildQueryString pero solo selecciona las columnas especificadas
 * para extraer opciones dinámicas.
 * @param formValues - Valores actuales del formulario
 * @param country - País seleccionado
 * @param targetFields - Columnas a seleccionar en la respuesta
 */
export function buildOptionsQueryString(
    formValues: ComparisonFormValues,
    country: string,
    targetFields: string[],
): string {
    const params = new URLSearchParams();

    if (!VALID_COUNTRIES.has(country)) {
        throw new Error(`Invalid country provided to buildOptionsQueryString: ${country}`);
    }

    // Country siempre presente
    params.append('Country', `eq.${country}`);

    // Aplicar filtros comunes (misma lógica que buildQueryString)
    applyFormFilters(params, formValues);

    // Seleccionar solo las columnas objetivo para minimizar payload
    params.append('select', targetFields.join(','));

    return params.toString();
}
