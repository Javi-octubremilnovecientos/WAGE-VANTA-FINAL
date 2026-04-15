import type { SalaryStats } from '../../features/salaries/types';

export const chartUtils = {
    formatCurrency: (value: number, currency: string = 'EUR'): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    },

    formatPercentage: (value: number): string => {
        return `${(value * 100).toFixed(1)}%`;
    },

    calculatePercentileDifference: (
        stat1: SalaryStats,
        stat2: SalaryStats
    ): number => {
        return ((stat2.median - stat1.median) / stat1.median) * 100;
    },

    generateChartColors: (count: number): string[] => {
        const colors = [
            '#3b82f6', // blue
            '#ef4444', // red
            '#10b981', // green
            '#f59e0b', // amber
            '#8b5cf6', // purple
            '#ec4899', // pink
        ];
        return colors.slice(0, count);
    },

    normalizeDataForChart: (data: Record<string, SalaryStats>) => {
        return Object.entries(data).map(([country, stats]) => ({
            country,
            ...stats,
        }));
    },
};
