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
        <div className="bg-[#121213] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-[#96969F] mb-2">{label}</p>
            <div className="space-y-1 text-xs">
                <div className="flex justify-between gap-4">
                    <span className="text-[#96969F]">P25</span>
                    <span className="font-medium text-white">{p25.toLocaleString()}€</span>
                </div>
                {median !== undefined && (
                    <div className="flex justify-between gap-4">
                        <span className="text-[#D84124]">Median</span>
                        <span className="font-medium text-white">{median.toLocaleString()}€</span>
                    </div>
                )}
                <div className="flex justify-between gap-4">
                    <span className="text-[#96969F]">P75</span>
                    <span className="font-medium text-white">{p75.toLocaleString()}€</span>
                </div>
            </div>
        </div>
    );
};
