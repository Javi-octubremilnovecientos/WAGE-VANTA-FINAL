import type { SectorDistributionPoint } from './EconomicActivityChart.types';

/**
 * Distribución mock de salarios dentro de una actividad económica.
 * Eje X: tramos salariales en €. Eje Y: % de trabajadores en ese tramo.
 * Representa una curva de densidad típica (asimétrica derecha).
 * Se reemplazará con datos reales de la API cuando estén disponibles.
 */
export const MOCK_SECTOR_DISTRIBUTION: SectorDistributionPoint[] = [
    { salary: 500, frequency: 0.8 },
    { salary: 750, frequency: 1.9 },
    { salary: 1000, frequency: 4.5 },
    { salary: 1250, frequency: 9.2 },
    { salary: 1500, frequency: 14.8 },
    { salary: 1750, frequency: 18.5 },
    { salary: 2000, frequency: 17.2 },
    { salary: 2250, frequency: 13.6 },
    { salary: 2500, frequency: 9.4 },
    { salary: 2750, frequency: 5.8 },
    { salary: 3000, frequency: 3.2 },
    { salary: 3500, frequency: 1.4 },
    { salary: 4000, frequency: 0.5 },
    { salary: 5000, frequency: 0.1 },
];
