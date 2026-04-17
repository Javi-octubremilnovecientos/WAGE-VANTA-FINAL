/**
 * Salary Comparison Types
 *
 * Interfaces para la core feature de comparación salarial.
 * Keys coinciden exactamente con los nombres de columna de Supabase TABLE_0
 * y los field IDs de formSteps — eliminando toda capa de mapeo.
 */

/** Row de TABLE_0 en Supabase. Keys = column names (Title Case). */
export interface SalaryRecord {
    Country: string;
    Gender: string;
    Occupation: string;
    'Occupation Level': string;
    'Economic Activity': string;
    'Education Level': string;
    'Monthly Wage': number;
    Year: number;
}

/** Parámetros para construir la query PostgREST a TABLE_0. Country obligatorio, resto progresivo. */
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

/** Valores acumulados del formulario multi-paso. Keys = field IDs de formSteps = column names de TABLE_0. */
export interface ComparisonFormValues {
    Country?: string;
    Gender?: string;
    'Monthly Wage'?: string;
    'Economic Activity'?: string;
    Occupation?: string;
    'Occupation Level'?: string;
    'Education Level'?: string;
    'Years Of Experience'?: string;
    'Company Size'?: string;
}

/** Estado del slice de salarios en Redux */
export interface SalarySliceState {
    selectedCountries: string[];
    formValues: ComparisonFormValues;
    currentStep: number;
}
