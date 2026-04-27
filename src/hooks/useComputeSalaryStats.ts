import { useMemo } from 'react';
import type { SalaryRecord, BoxPlotData } from '@/features/salaries/types';
import { extractWages } from '@/features/salaries/salaryUtils';

const COUNTRY_EUR_EXCHANGE_RATES: Record<string, number> = {
    denmark: 0.134,
    'united kingdom': 1.17,
    uk: 1.17,
};

function convertWagesToEur(wages: number[], country: string): number[] {
    const normalizedCountry = country.trim().toLowerCase();
    const rate = COUNTRY_EUR_EXCHANGE_RATES[normalizedCountry];

    if (!rate) {
        return wages;
    }

    return wages.map((wage) => wage * rate);
}

/**
 * Calcula estadísticas de BoxPlot (min, Q1, median, Q3, max) a partir de un array de wages.
 * Usa interpolación lineal para percentiles.
 */
export function computeBoxPlotStats(
    wages: number[],
    category: string,
    color?: string,
): BoxPlotData {
    const sorted = [...wages].sort((a, b) => a - b);
    const n = sorted.length;

    const percentile = (p: number): number => {
        const index = (p / 100) * (n - 1);
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        if (lower === upper) return sorted[lower];
        return sorted[lower] + (index - lower) * (sorted[upper] - sorted[lower]);
    };

    return {
        category,
        min: sorted[0],
        q1: percentile(25),
        median: percentile(50),
        q3: percentile(75),
        max: sorted[n - 1],
        color,
    };
}

/**
 * Hook que computa BoxPlotData a partir de SalaryRecord[].
 * Extrae wages, filtra outliers extremos, calcula percentiles, y memoiza el resultado.
 *
 * @returns BoxPlotData o null si no hay datos suficientes
 */
export function useComputeSalaryStats(
    records: SalaryRecord[] | undefined,
    country: string,
    color: string,
): BoxPlotData | null {
    return useMemo(() => {
        // Si no hay país definido, retornar null inmediatamente
        if (!country) return null;

        if (!records || records.length === 0) return null;
        const wages = extractWages(records);
        if (wages.length === 0) return null;

        // Normalizar a EUR para países con moneda distinta (ej. DKK, GBP).
        const wagesInEur = convertWagesToEur(wages, country);

        // Filtrar outliers extremos: eliminar salarios < 200€ o > 13000€
        const filteredWages = wagesInEur.filter((wage) => wage >= 200 && wage <= 13000);

        // Si después de filtrar no quedan datos, retornar null
        if (filteredWages.length === 0) return null;

        return computeBoxPlotStats(filteredWages, country, color);
    }, [records, country, color]);
}
