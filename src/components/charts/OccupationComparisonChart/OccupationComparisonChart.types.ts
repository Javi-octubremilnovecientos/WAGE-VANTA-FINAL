import type { BoxPlotData } from '@/features/salaries/types';

/** Datos de banda salarial por nivel de ocupación */
export interface OccupationBandPoint {
    level: string;
    p25: number;
    median: number;
    p75: number;
}

/** Datos transformados para el área apilada (base invisible + rango visible) */
export interface BandChartPoint {
    level: string;
    /** Base invisible: va desde 0 hasta P25 */
    p25: number;
    /** Rango visible: P75 − P25 */
    range: number;
    /** Línea de mediana */
    median: number;
}

export interface OccupationComparisonChartProps {
    /** Stats computados por país — se usan para líneas de referencia horizontales */
    computedStats?: BoxPlotData[];
    /** Nombre de la ocupación seleccionada */
    occupation?: string;
    height?: number;
}

export interface OccupationTooltipProps {
    active?: boolean;
    payload?: Array<{
        name: string;
        value: number;
        color: string;
    }>;
    label?: string;
}
