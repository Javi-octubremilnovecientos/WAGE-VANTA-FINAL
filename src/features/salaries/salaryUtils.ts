/**
 * Salary Utilities
 *
 * Funciones para mapear valores del formulario a parámetros PostgREST de Supabase,
 * y para extraer/parsear datos de respuesta.
 */

import { formSteps } from './salaryConstants';
import type { ComparisonFormValues, SalaryRecord } from './types';

/**
 * Busca en formSteps el label correspondiente a un value de campo.
 * Los labels de formSteps coinciden exactamente con los valores de Supabase TABLE_1.
 *
 * Ej: resolveLabel('gender', 'male') → "Male"
 * Ej: resolveLabel('occupation', 'programmers') → "Applications programmers"
 */
export function resolveLabel(fieldId: string, value: string): string {
    for (const step of formSteps) {
        for (const field of step.fields) {
            if (field.id === fieldId && field.options) {
                const match = field.options.find((opt) => opt.value === value);
                if (match) return match.label;
            }
        }
    }
    return value; // Fallback: devolver el value tal cual
}

/** IDs de campos que tienen mapeo directo a columnas de Supabase con operador `eq` */
const EQ_FIELDS: Record<string, string> = {
    gender: 'GENDER',
};

/** IDs de campos que usan operador `ilike` (búsqueda parcial) */
const ILIKE_FIELDS: Record<string, string> = {
    occupation: 'OCCUPATION',
    occupationLevel: 'OCCUPATION LEVEL',
    economicActivity: 'ECONOMIC_ACTIVITY',
    educationLevel: 'EDUCATION_LEVEL',
};

/**
 * Construye el query string PostgREST para una petición a TABLE_1.
 * Solo incluye parámetros que ya tengan valor en formValues (progresivo).
 *
 * @param formValues - Valores acumulados del formulario
 * @param country - Label del país (ej: "Belgium")
 * @returns Query string listo para concatenar a la URL
 */
export function buildQueryString(
    formValues: ComparisonFormValues,
    country: string,
): string {
    const params = new URLSearchParams();

    // Country siempre presente (obligatorio)
    params.append('COUNTRY', `eq.${country}`);

    // Campos con operador eq
    for (const [fieldId, column] of Object.entries(EQ_FIELDS)) {
        const value = formValues[fieldId as keyof ComparisonFormValues];
        if (value) {
            params.append(column, `eq.${resolveLabel(fieldId, value)}`);
        }
    }

    // Campos con operador ilike
    for (const [fieldId, column] of Object.entries(ILIKE_FIELDS)) {
        const value = formValues[fieldId as keyof ComparisonFormValues];
        if (value) {
            params.append(column, `ilike.*${resolveLabel(fieldId, value)}*`);
        }
    }

    // Seleccionar solo la columna MEAN_MONTHLY_WAGE para optimizar
    params.append('select', 'COUNTRY,GENDER,OCCUPATION,OCCUPATION LEVEL,ECONOMIC_ACTIVITY,EDUCATION_LEVEL,MEAN_MONTHLY_WAGE,YEAR');

    return params.toString();
}

/**
 * Transforma un row de Supabase (UPPER_CASE keys) a SalaryRecord (camelCase).
 */
export function mapToSalaryRecord(row: Record<string, unknown>): SalaryRecord {
    return {
        country: row['COUNTRY'] as string,
        gender: row['GENDER'] as string,
        occupation: row['OCCUPATION'] as string,
        occupationLevel: row['OCCUPATION LEVEL'] as string,
        economicActivity: row['ECONOMIC_ACTIVITY'] as string,
        educationLevel: row['EDUCATION_LEVEL'] as string,
        meanMonthlyWage: row['MEAN_MONTHLY_WAGE'] as string,
        year: row['YEAR'] as number,
    };
}

/**
 * Extrae los salarios mensuales de un array de SalaryRecord.
 * Parsea de string a number y filtra valores inválidos.
 */
export function extractWages(records: SalaryRecord[]): number[] {
    return records
        .map((r) => parseFloat(r.meanMonthlyWage))
        .filter((n) => !isNaN(n) && n > 0);
}
