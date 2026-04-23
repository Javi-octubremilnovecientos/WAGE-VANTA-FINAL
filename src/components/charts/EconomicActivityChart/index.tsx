import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from 'recharts';
import type { EconomicActivityChartProps } from './EconomicActivityChart.types';
import { MOCK_SECTOR_DISTRIBUTION } from './EconomicActivityChart.utils';
import { DistributionTooltip } from './CustomTooltip';

const EconomicActivityChartComponent: React.FC<EconomicActivityChartProps> = ({
    computedStats = [],
    economicActivity,
    height = 300,
}) => {
    /** Líneas de referencia verticales en la posición del salario mediano computado */
    const referenceLines = useMemo(
        () =>
            computedStats.map((stat) => ({
                medianSalary: Math.round(stat.median),
                label: `${stat.category}`,
                color: stat.color ?? '#45d2fd',
            })),
        [computedStats],
    );

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
                data={MOCK_SECTOR_DISTRIBUTION}
                margin={{ top: 10, right: 16, left: 0, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="sectorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#45d2fd" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#45d2fd" stopOpacity={0.04} />
                    </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />

                {/* Eje X numérico para permitir ReferenceLine en posición exacta */}
                <XAxis
                    dataKey="salary"
                    type="number"
                    domain={[500, 5000]}
                    tickFormatter={(v: number) => `${v}€`}
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    className="text-gray-600 dark:text-gray-400"
                    tickLine={{ stroke: 'currentColor' }}
                    axisLine={{ stroke: 'currentColor' }}
                    ticks={[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000]}
                />
                <YAxis
                    width={38}
                    tickFormatter={(v: number) => `${v}%`}
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    className="text-gray-600 dark:text-gray-400"
                    tickLine={{ stroke: 'currentColor' }}
                    axisLine={{ stroke: 'currentColor' }}
                />

                <Tooltip content={<DistributionTooltip />} cursor={{ stroke: '#ffffff20' }} />

                <Area
                    type="monotone"
                    dataKey="frequency"
                    fill="url(#sectorGradient)"
                    stroke="#45d2fd"
                    strokeWidth={2}
                    name={economicActivity ?? 'Sector distribution'}
                    dot={false}
                    activeDot={{ r: 4, fill: '#45d2fd', strokeWidth: 0 }}
                />

                {/* Línea vertical para el salario mediano de cada país computado */}
                {referenceLines.map((ref) => (
                    <ReferenceLine
                        key={ref.label}
                        x={ref.medianSalary}
                        stroke={ref.color}
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{
                            value: ref.label,
                            fill: ref.color,
                            fontSize: 9,
                            position: 'insideTopRight',
                        }}
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export const EconomicActivityChart = React.memo(EconomicActivityChartComponent);
