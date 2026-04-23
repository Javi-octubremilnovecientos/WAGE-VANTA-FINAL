import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    ComposedChart,
    Area,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from 'recharts';
import type { OccupationComparisonChartProps } from './OccupationComparisonChart.types';
import { MOCK_OCCUPATION_BANDS, transformToBandData } from './OccupationComparisonChart.utils';
import { OccupationTooltip } from './CustomTooltip';

const OccupationComparisonChartComponent: React.FC<OccupationComparisonChartProps> = ({
    computedStats = [],
    height = 300,
}) => {
    const bandData = useMemo(() => transformToBandData(MOCK_OCCUPATION_BANDS), []);
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const axisColor = isDark ? '#e5e7eb' : '#111827';

    return (
        <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
                data={bandData}
                margin={{ top: 10, right: 16, left: 0, bottom: 5 }}
            >
                <defs>
                    <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.08} />
                    </linearGradient>
                </defs>

                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-500 dark:stroke-gray-600" />

                <XAxis
                    dataKey="level"
                    tick={{ fill: axisColor, fontSize: 10 }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                />
                <YAxis
                    width={52}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k€`}
                    tick={{ fill: axisColor, fontSize: 10 }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                />

                <Tooltip content={<OccupationTooltip />} cursor={{ fill: '#ffffff08' }} />

                {/* Base invisible — eleva el área de rango hasta P25 */}
                <Area
                    type="monotone"
                    dataKey="p25"
                    fill="transparent"
                    stroke="transparent"
                    stackId="band"
                    name="p25"
                    legendType="none"
                />

                {/* Banda visible P25→P75 */}
                <Area
                    type="monotone"
                    dataKey="range"
                    fill="url(#bandGradient)"
                    stroke="#8b5cf6"
                    strokeWidth={1.5}
                    stackId="band"
                    name="range"
                    legendType="none"
                />

                {/* Línea de mediana */}
                <Line
                    type="monotone"
                    dataKey="median"
                    stroke="#45d2fd"
                    strokeWidth={2}
                    dot={{ fill: '#45d2fd', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#45d2fd', strokeWidth: 0 }}
                    name="median"
                    legendType="none"
                />

                {/* Líneas de referencia horizontales — mediana por país */}
                {computedStats.map((stat) => (
                    <ReferenceLine
                        key={stat.category}
                        y={stat.median}
                        stroke={stat.color ?? '#fbbf24'}
                        strokeDasharray="6 3"
                        strokeWidth={1.5}
                        label={{
                            value: `${stat.category} med.`,
                            fill: stat.color ?? '#fbbf24',
                            fontSize: 9,
                            position: 'insideTopRight',
                        }}
                    />
                ))}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export const OccupationComparisonChart = React.memo(OccupationComparisonChartComponent);
