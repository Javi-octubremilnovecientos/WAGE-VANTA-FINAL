import React, { useMemo } from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import type { SalaryGrowthChartProps } from './SalaryGrowthChart.types';
import { MOCK_GROWTH_DATA, GROWTH_COLORS, getFilteredGrowthData } from './SalaryGrowthChart.utils';
import { GrowthCustomTooltip } from './CustomTooltip';

const SalaryGrowthChartComponent: React.FC<SalaryGrowthChartProps> = ({
    selectedCountries,
    height = 300,
}) => {
    const chartData = useMemo(
        () => getFilteredGrowthData(MOCK_GROWTH_DATA, selectedCountries),
        [selectedCountries],
    );

    const activeCountries = useMemo(
        () => selectedCountries.filter((c) => c in MOCK_GROWTH_DATA[0]),
        [selectedCountries],
    );

    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const axisColor = isDark ? '#e5e7eb' : '#1f2937';

    if (selectedCountries.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                Select countries to see salary growth
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={height}>
            <BarChart
                data={chartData}
                margin={{ top: 10, right: 16, left: 0, bottom: 5 }}
                barCategoryGap="20%"
                barGap={2}
            >
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-500 dark:stroke-gray-600" />
                <XAxis
                    dataKey="year"
                    tick={{ fill: axisColor, fontSize: 10 }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                />
                <YAxis
                    width={52}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k€`}
                    tick={{ fill: axisColor, fontSize: 10 }}
                    tickLine={{ stroke: axisColor }}
                    axisLine={{ stroke: axisColor }}
                />
                <Tooltip content={<GrowthCustomTooltip />} cursor={{ fill: '#ffffff08' }} />
                <Legend
                    wrapperStyle={{ paddingTop: '10px', fontSize: '11px', color: '#9ca3af' }}
                />
                {activeCountries.map((country) => (
                    <Bar
                        key={country}
                        dataKey={country}
                        fill={GROWTH_COLORS[country] ?? '#6b7280'}
                        radius={[3, 3, 0, 0]}
                        maxBarSize={18}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

export const SalaryGrowthChart = React.memo(SalaryGrowthChartComponent);
