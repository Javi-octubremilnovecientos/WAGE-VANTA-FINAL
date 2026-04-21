import type { BoxPlotData } from '@/features/salaries/types';

/** Punto de distribución de salarios dentro de un sector económico */
export interface SectorDistributionPoint {
    salary: number;
    frequency: number;
}

export interface EconomicActivityChartProps {
    /** Stats computados por país — se usan para pintar líneas de referencia */
    computedStats?: BoxPlotData[];
    /** Nombre de la actividad económica seleccionada */
    economicActivity?: string;
    height?: number;
}

export interface DistributionTooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        payload: SectorDistributionPoint;
    }>;
    label?: string | number;
}
