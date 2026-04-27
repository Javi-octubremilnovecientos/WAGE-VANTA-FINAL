import type { BoxPlotData } from '@/features/salaries/types';
import type { YAxisConfig } from './MainChart.types';

const MAX_CHART_WAGE = 13000;

/**
 * Calcula el dominio y los ticks del YAxis de forma dinámica
 * en función del valor máximo real de los datos.
 *
 * Aplica granularidad progresiva: a menor rango de datos, mayor detalle en ticks.
 * Función pura — sin side effects.
 */
export function computeYAxisConfig(data: BoxPlotData[]): YAxisConfig {
    if (!data || data.length === 0) {
        return {
            domain: [0, MAX_CHART_WAGE],
            ticks: Array.from({ length: 14 }, (_, i) => i * 1000),
        };
    }

    // Doble protección: aunque el filtrado falle aguas arriba, el eje no pasa de 13.000.
    const effectiveMax = Math.min(
        Math.max(...data.map((d) => d.max)),
        MAX_CHART_WAGE,
    );

    let ceiling: number;
    let step: number;

    if (effectiveMax <= 1500) {
        // Salarios muy bajos: alta granularidad (250€)
        ceiling = 2000;
        step = 250;
    } else if (effectiveMax <= 2500) {
        // Salarios bajos: alta granularidad (250€)
        ceiling = 3000;
        step = 250;
    } else if (effectiveMax <= 4000) {
        // Salarios medios-bajos: granularidad media (500€)
        ceiling = 5000;
        step = 500;
    } else if (effectiveMax <= 6000) {
        // Salarios medios: granularidad media (500€)
        ceiling = 7000;
        step = 500;
    } else if (effectiveMax <= 8000) {
        // Salarios medios-altos: granularidad normal (1000€)
        ceiling = 9000;
        step = 1000;
    } else if (effectiveMax <= 10000) {
        // Salarios altos: granularidad normal (1000€)
        ceiling = 11000;
        step = 1000;
    } else {
        // Salarios muy altos: rango máximo (1000€)
        ceiling = MAX_CHART_WAGE;
        step = 1000;
    }

    const ticks: number[] = [];
    for (let i = 0; i <= ceiling; i += step) {
        ticks.push(i);
    }

    return { domain: [0, ceiling], ticks };
}
