import { createSelector } from '@reduxjs/toolkit';
import type { SalaryStats } from './salaryService';

// Example selector structure for when salary data is added to the store
// This demonstrates the pattern for memoized selectors

interface SalaryState {
    data: Record<string, SalaryStats>;
    isLoading: boolean;
    error: string | null;
}

// Base selectors
const selectSalaryData = (state: { salary?: SalaryState }) =>
    state.salary?.data || {};

const selectIsLoading = (state: { salary?: SalaryState }) =>
    state.salary?.isLoading || false;

const selectError = (state: { salary?: SalaryState }) =>
    state.salary?.error || null;

// Memoized selectors for Recharts transformation
export const selectFormattedSalaryData = createSelector(
    [selectSalaryData],
    (data): Array<{ country: string } & SalaryStats> => {
        return Object.entries(data).map(([country, stats]) => ({
            country,
            ...stats,
        }));
    }
);

export const selectBoxPlotData = createSelector(
    [selectSalaryData],
    (data) => {
        return Object.entries(data).map(([country, stats]) => ({
            name: country,
            min: stats.min,
            q1: stats.q1,
            median: stats.median,
            q3: stats.q3,
            max: stats.max,
        }));
    }
);

export const selectBarChartData = createSelector(
    [selectSalaryData],
    (data) => {
        return Object.entries(data).map(([country, stats]) => ({
            country,
            median: stats.median,
            mean: stats.mean,
        }));
    }
);

export const salarySelectors = {
    selectSalaryData,
    selectIsLoading,
    selectError,
    selectFormattedSalaryData,
    selectBoxPlotData,
    selectBarChartData,
};
