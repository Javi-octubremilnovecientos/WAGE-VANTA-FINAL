import { useState, useMemo } from 'react';
import { useAppSelector } from '@/hooks/useRedux';
import {
    selectSelectedCountries,
    selectFormValues,
} from '@/features/salaries/salarySlice';
import { selectUserMonthlyWage } from '@/features/salaries/salarySelectors';
import { useGetSalaryDataQuery } from '@/features/salaries/salaryApi';
import { useComputeSalaryStats } from '@/hooks/useComputeSalaryStats';
import FormLayout from '@/components/form/FormLayout';
import MainChart from '@/components/charts/MainChart';
import CompareModal from '@/components/ui/modals/CompareModal';
import UpgradeModal from '@/components/ui/modals/UpgradeModal';
import type { BoxPlotData } from '@/features/salaries/types';

const CHART_COLORS = ['#8884d8', '#82ca9d', '#fbbf24'];

function ComparisonSheet() {
    const [compareModalOpen, setCompareModalOpen] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

    const selectedCountries = useAppSelector(selectSelectedCountries);
    const formValues = useAppSelector(selectFormValues);
    const userWage = useAppSelector(selectUserMonthlyWage);

    // Query para País 1
    const country1Query = useGetSalaryDataQuery(
        { country: selectedCountries[0], formValues },
        { skip: !selectedCountries[0] },
    );

    // Query para País 2
    const country2Query = useGetSalaryDataQuery(
        { country: selectedCountries[1], formValues },
        { skip: !selectedCountries[1] },
    );

    // Query para País 3 (solo premium)
    const country3Query = useGetSalaryDataQuery(
        { country: selectedCountries[2], formValues },
        { skip: !selectedCountries[2] },
    );

    // Computar BoxPlot stats para cada país
    const stats1 = useComputeSalaryStats(
        country1Query.data,
        selectedCountries[0] ?? '',
        CHART_COLORS[0],
    );
    const stats2 = useComputeSalaryStats(
        country2Query.data,
        selectedCountries[1] ?? '',
        CHART_COLORS[1],
    );
    const stats3 = useComputeSalaryStats(
        country3Query.data,
        selectedCountries[2] ?? '',
        CHART_COLORS[2],
    );

    // Combinar datos para el chart
    const chartData: BoxPlotData[] = useMemo(
        () => [stats1, stats2, stats3].filter((s): s is BoxPlotData => s !== null),
        [stats1, stats2, stats3],
    );

    const isLoading =
        country1Query.isLoading || country2Query.isLoading || country3Query.isLoading;

    return (
        <div className="container mx-auto px-4 py-6 max-w-6xl">
            {/* Header + Compare Button */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-white">Comparison Tool</h1>
                <button
                    type="button"
                    onClick={() => setCompareModalOpen(true)}
                    disabled={!selectedCountries[0]}
                    className="rounded-md bg-[#45d2fd] px-3 py-1.5 text-xs font-semibold text-gray-900 shadow-sm hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                    Compare Now
                </button>
            </div>

            {/* Selected Countries Badges */}
            {selectedCountries.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {selectedCountries.map((country, i) => (
                        <span
                            key={country}
                            className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                            style={{ backgroundColor: CHART_COLORS[i] + '40', borderColor: CHART_COLORS[i], borderWidth: 1 }}
                        >
                            <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: CHART_COLORS[i] }}
                            />
                            {country}
                        </span>
                    ))}
                </div>
            )}

            {/* Main Content: Form + Chart */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Form */}
                <div className="w-full lg:w-1/2">
                    <FormLayout />
                </div>

                {/* Chart */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
                    {isLoading && (
                        <div className="flex items-center justify-center w-full aspect-square">
                            <div className="animate-pulse text-gray-400 text-sm">Loading salary data...</div>
                        </div>
                    )}

                    <MainChart data={chartData} userWage={userWage} isLoading={isLoading} />

                    {/* Record count info */}
                    {!isLoading && chartData.length > 0 && (
                        <div className="flex gap-4 mt-2 text-xs text-gray-400">
                            {country1Query.data && (
                                <span>{selectedCountries[0]}: {country1Query.data.length} records</span>
                            )}
                            {country2Query.data && (
                                <span>{selectedCountries[1]}: {country2Query.data.length} records</span>
                            )}
                            {country3Query.data && (
                                <span>{selectedCountries[2]}: {country3Query.data.length} records</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Compare Modal */}
            <CompareModal
                isOpen={compareModalOpen}
                onCancel={() => setCompareModalOpen(false)}
                onConfirm={() => setCompareModalOpen(false)}
                onUpgradeRequired={() => {
                    setCompareModalOpen(false);
                    setUpgradeModalOpen(true);
                }}
            />

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={upgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
            />
        </div>
    );
}

export default ComparisonSheet;
