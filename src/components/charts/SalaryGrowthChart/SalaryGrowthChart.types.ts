/** Punto de datos de crecimiento salarial por año */
export interface GrowthDataPoint {
    year: string;
    [country: string]: string | number;
}

export interface SalaryGrowthChartProps {
    /** Países seleccionados para mostrar barras */
    selectedCountries: string[];
    height?: number;
}

export interface GrowthTooltipProps {
    active?: boolean;
    payload?: Array<{
        dataKey: string;
        value: number;
        color: string;
    }>;
    label?: string;
}
