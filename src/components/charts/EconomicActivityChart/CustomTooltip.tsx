import React from 'react';
import type { DistributionTooltipProps } from './EconomicActivityChart.types';

export const DistributionTooltip: React.FC<DistributionTooltipProps> = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
        <div className="bg-gray-900/95 border border-gray-700 rounded-lg p-3 shadow-xl backdrop-blur-sm">
            <p className="text-xs font-semibold text-gray-300 mb-1">
                {Number(label).toLocaleString()}€ / month
            </p>
            <p className="text-xs text-gray-400">
                Share of workers:{' '}
                <span className="font-medium text-white">{payload[0]?.value}%</span>
            </p>
        </div>
    );
};
