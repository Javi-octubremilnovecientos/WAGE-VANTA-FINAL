/**
 * Salary Comparison Types
 *
 * Interfaces para la core feature de comparación salarial.
 * Mapean a Supabase TABLE_1 y al flujo de datos del formulario → RTK Query → BoxPlot.
 */

/** Row de TABLE_1 en Supabase (keys en camelCase, transformadas desde UPPER_CASE) */
export interface SalaryRecord {
    country: string;
    gender: string;
    occupation: string;
    occupationLevel: string;
    economicActivity: string;
    educationLevel: string;
    meanMonthlyWage: string; // Supabase lo almacena como text → parsear a number
    year: number;
}

/** Parámetros para construir la query PostgREST a TABLE_1. Country obligatorio, resto progresivo. */
export interface SalaryQueryParams {
    country: string;
    formValues: ComparisonFormValues;
}

/** Datos computados para renderizar un BoxPlot en Recharts */
export interface BoxPlotData {
    category: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    color?: string;
}

/** Alias de BoxPlotData para compatibilidad con ChartUtils */
export type SalaryStats = BoxPlotData;

/** Valores acumulados del formulario multi-paso */
export interface ComparisonFormValues {
    country?: string;
    gender?: string;
    monthlyWage?: string;
    economicActivity?: string;
    occupation?: string;
    occupationLevel?: string;
    educationLevel?: string;
    yearsOfExperience?: string;
    companySize?: string;
}

/** Estado del slice de salarios en Redux */
export interface SalarySliceState {
    selectedCountries: string[];
    formValues: ComparisonFormValues;
    currentStep: number;
}
