import type { GrowthDataPoint } from './SalaryGrowthChart.types';

/**
 * Datos mock de salario mensual medio (€) por país — últimos 10 años.
 * Se reemplazará con datos reales cuando se integre el campo Year en la API.
 */
export const MOCK_GROWTH_DATA: GrowthDataPoint[] = [
    { year: '2015', Belgium: 2820, Germany: 2580, Spain: 1640, France: 2080, Italy: 1520, Poland: 960, Bulgaria: 470, Denmark: 3380, Portugal: 1050, Netherlands: 2640, Romania: 580, Greece: 1020, Sweden: 3050, Finland: 2950, Austria: 2680 },
    { year: '2016', Belgium: 2880, Germany: 2650, Spain: 1680, France: 2120, Italy: 1540, Poland: 1000, Bulgaria: 495, Denmark: 3450, Portugal: 1080, Netherlands: 2700, Romania: 620, Greece: 1000, Sweden: 3120, Finland: 2990, Austria: 2740 },
    { year: '2017', Belgium: 2940, Germany: 2730, Spain: 1720, France: 2170, Italy: 1560, Poland: 1060, Bulgaria: 525, Denmark: 3530, Portugal: 1110, Netherlands: 2780, Romania: 670, Greece: 990, Sweden: 3210, Finland: 3060, Austria: 2800 },
    { year: '2018', Belgium: 3010, Germany: 2820, Spain: 1780, France: 2240, Italy: 1590, Poland: 1140, Bulgaria: 565, Denmark: 3630, Portugal: 1150, Netherlands: 2870, Romania: 750, Greece: 1010, Sweden: 3320, Finland: 3130, Austria: 2870 },
    { year: '2019', Belgium: 3090, Germany: 2930, Spain: 1850, France: 2310, Italy: 1620, Poland: 1240, Bulgaria: 615, Denmark: 3740, Portugal: 1200, Netherlands: 2970, Romania: 850, Greece: 1030, Sweden: 3440, Finland: 3210, Austria: 2960 },
    { year: '2020', Belgium: 3080, Germany: 2880, Spain: 1790, France: 2280, Italy: 1580, Poland: 1250, Bulgaria: 630, Denmark: 3710, Portugal: 1190, Netherlands: 2940, Romania: 870, Greece: 1000, Sweden: 3430, Finland: 3200, Austria: 2940 },
    { year: '2021', Belgium: 3150, Germany: 2970, Spain: 1870, France: 2360, Italy: 1640, Poland: 1350, Bulgaria: 680, Denmark: 3820, Portugal: 1250, Netherlands: 3060, Romania: 960, Greece: 1050, Sweden: 3550, Finland: 3310, Austria: 3040 },
    { year: '2022', Belgium: 3280, Germany: 3080, Spain: 1960, France: 2470, Italy: 1700, Poland: 1450, Bulgaria: 740, Denmark: 3980, Portugal: 1340, Netherlands: 3200, Romania: 1080, Greece: 1120, Sweden: 3710, Finland: 3470, Austria: 3190 },
    { year: '2023', Belgium: 3410, Germany: 3200, Spain: 2060, France: 2580, Italy: 1780, Poland: 1540, Bulgaria: 800, Denmark: 4100, Portugal: 1430, Netherlands: 3350, Romania: 1200, Greece: 1200, Sweden: 3870, Finland: 3630, Austria: 3350 },
    { year: '2024', Belgium: 3520, Germany: 3330, Spain: 2150, France: 2680, Italy: 1850, Poland: 1630, Bulgaria: 860, Denmark: 4250, Portugal: 1520, Netherlands: 3490, Romania: 1320, Greece: 1290, Sweden: 4020, Finland: 3780, Austria: 3490 },
];

/** Paleta de colores por país */
export const GROWTH_COLORS: Record<string, string> = {
    Belgium: '#3b82f6',
    Germany: '#10b981',
    Spain: '#f59e0b',
    France: '#8b5cf6',
    Italy: '#ef4444',
    Poland: '#ec4899',
    Bulgaria: '#14b8a6',
    Denmark: '#f97316',
    Portugal: '#06b6d4',
    Netherlands: '#84cc16',
    Romania: '#a855f7',
    Greece: '#0ea5e9',
    Sweden: '#22c55e',
    Finland: '#e879f9',
    Austria: '#fb923c',
};

/**
 * Filtra los datos de crecimiento para mostrar solo los países seleccionados.
 */
export function getFilteredGrowthData(
    data: GrowthDataPoint[],
    countries: string[],
): GrowthDataPoint[] {
    return data.map((point) => {
        const filtered: GrowthDataPoint = { year: point.year };
        countries.forEach((country) => {
            if (country in point) {
                filtered[country] = point[country];
            }
        });
        return filtered;
    });
}
