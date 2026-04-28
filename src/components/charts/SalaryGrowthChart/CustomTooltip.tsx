import React from 'react';
import type { GrowthTooltipProps } from './SalaryGrowthChart.types';

export const GrowthCustomTooltip: React.FC<GrowthTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-[#121213] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-[#96969F] mb-2">{label}</p>
            <div className="space-y-1">
                {payload.map((entry) => (
                    <div key={entry.dataKey} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                            <span
                                className="h-2 w-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-xs text-[#96969F]">{entry.dataKey}</span>
                        </div>
                        <span className="text-xs font-medium text-white">
                            {entry.value.toLocaleString('en-EU')}€
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
