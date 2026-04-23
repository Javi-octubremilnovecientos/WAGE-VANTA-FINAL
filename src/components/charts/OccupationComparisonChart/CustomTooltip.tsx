import React from 'react';
import type { OccupationTooltipProps } from './OccupationComparisonChart.types';

export const OccupationTooltip: React.FC<OccupationTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const p25Entry = payload.find((p) => p.name === 'p25');
    const rangeEntry = payload.find((p) => p.name === 'range');
    const medianEntry = payload.find((p) => p.name === 'median');

    const p25 = p25Entry?.value ?? 0;
    const p75 = (p25Entry?.value ?? 0) + (rangeEntry?.value ?? 0);
    const median = medianEntry?.value;

    return (
        <div className="bg-white dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-300 mb-2">{label}</p>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                    <span className="text-gray-500 dark:text-gray-400">P25</span>
                    <span className="font-medium text-gray-900 dark:text-white">{p25.toLocaleString()}€</span>
                </div>
                {median !== undefined && (
                    <div className="flex justify-between gap-4">
                        <span className="text-[#45d2fd]">Median</span>
                        <span className="font-medium text-gray-900 dark:text-white">{median.toLocaleString()}€</span>
                    </div>
                )}
                <div className="flex justify-between gap-4">
                    <span className="text-gray-500 dark:text-gray-400">P75</span>
                    <span className="font-medium text-gray-900 dark:text-white">{p75.toLocaleString()}€</span>
                </div>
            </div>
        </div>
    );
};
