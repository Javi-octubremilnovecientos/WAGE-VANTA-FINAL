import type { BoxPlotData } from '@/features/salaries/types';

export type { BoxPlotData };

export interface YAxisConfig {
    domain: [number, number];
    ticks: number[];
}

export interface MainChartProps {
    data: BoxPlotData[];
    userWage?: number | null;
    isLoading?: boolean;
}
