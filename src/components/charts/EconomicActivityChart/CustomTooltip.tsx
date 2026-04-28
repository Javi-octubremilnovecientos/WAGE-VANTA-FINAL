import React from 'react';
import type { DistributionTooltipProps } from './EconomicActivityChart.types';

export const DistributionTooltip: React.FC<DistributionTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-[#121213] border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-[#96969F] mb-1">
                {Number(label).toLocaleString()}€ / month
            </p>
            <p className="text-xs text-[#96969F]">
                Share of workers:{' '}
                <span className="font-medium text-white">{payload[0]?.value}%</span>
            </p>
        </div>
    );
};
