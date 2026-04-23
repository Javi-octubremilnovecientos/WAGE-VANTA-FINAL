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
                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-gray-300 dark:stroke-gray-700" />
                <XAxis
                    dataKey="year"
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    className="text-gray-600 dark:text-gray-400"
                    tickLine={{ stroke: 'currentColor' }}
                    axisLine={{ stroke: 'currentColor' }}
                />
                <YAxis
                    width={52}
                    tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}k€`}
                    tick={{ fill: 'currentColor', fontSize: 10 }}
                    className="text-gray-600 dark:text-gray-400"
                    tickLine={{ stroke: 'currentColor' }}
                    axisLine={{ stroke: 'currentColor' }}
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
