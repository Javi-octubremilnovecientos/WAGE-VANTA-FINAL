import type { OccupationBandPoint, BandChartPoint } from './OccupationComparisonChart.types';

/**
 * Bandas salariales mock por nivel de ocupación (€/mes).
 * Representan los percentiles P25, mediana y P75 típicos en cada nivel.
 * Se reemplazará con datos reales de la API cuando estén disponibles.
 */
export const MOCK_OCCUPATION_BANDS: OccupationBandPoint[] = [
    { level: 'Entry', p25: 880, median: 1200, p75: 1600 },
    { level: 'Junior', p25: 1350, median: 1850, p75: 2400 },
    { level: 'Mid-level', p25: 1980, median: 2700, p75: 3600 },
    { level: 'Senior', p25: 2750, median: 3800, p75: 5200 },
    { level: 'Lead', p25: 3700, median: 5100, p75: 7000 },
    { level: 'Principal', p25: 5000, median: 7000, p75: 10000 },
];

/**
 * Transforma OccupationBandPoint[] al formato de área apilada de Recharts.
 * El truco: "p25" es la base invisible y "range" es el ancho visible del band.
 * Apilando p25 (fill transparent) + range (fill visible) → band visual de P25 a P75.
 */
export function transformToBandData(data: OccupationBandPoint[]): BandChartPoint[] {
    return data.map((d) => ({
        level: d.level,
        p25: d.p25,
        range: d.p75 - d.p25,
        median: d.median,
    }));
}
