import { useState, useMemo } from "react";
import MainChart from "../components/charts/MainChart";
import FormLayout from "../components/form/FormLayout";
import CompareModal from "../components/ui/modals/CompareModal";
import UpgradeModal from "../components/ui/modals/UpgradeModal";
import { useAppSelector } from "../hooks/useRedux";
import {
    selectSelectedCountries,
    selectFormValues,
} from "../features/salaries/salarySlice";
import { selectUserMonthlyWage } from "../features/salaries/salarySelectors";
import { useGetSalaryDataQuery } from "../features/salaries/salaryApi";
import { useComputeSalaryStats } from "../hooks/useComputeSalaryStats";
import type { BoxPlotData } from "../features/salaries/types";

const CHART_COLORS = ['#8884d8', '#82ca9d', '#fbbf24'];

export default function Home() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const selectedCountries = useAppSelector(selectSelectedCountries);
    const formValues = useAppSelector(selectFormValues);
    const userWage = useAppSelector(selectUserMonthlyWage);

    const hasCountry = selectedCountries.length > 0;

    // Queries progresivas por país
    const country1Query = useGetSalaryDataQuery(
        { country: selectedCountries[0], formValues },
        { skip: !selectedCountries[0] },
    );
    const country2Query = useGetSalaryDataQuery(
        { country: selectedCountries[1], formValues },
        { skip: !selectedCountries[1] },
    );
    const country3Query = useGetSalaryDataQuery(
        { country: selectedCountries[2], formValues },
        { skip: !selectedCountries[2] },
    );

    // Computar BoxPlot stats
    const stats1 = useComputeSalaryStats(country1Query.data, selectedCountries[0] ?? '', CHART_COLORS[0]);
    const stats2 = useComputeSalaryStats(country2Query.data, selectedCountries[1] ?? '', CHART_COLORS[1]);
    const stats3 = useComputeSalaryStats(country3Query.data, selectedCountries[2] ?? '', CHART_COLORS[2]);

    const chartData: BoxPlotData[] = useMemo(
        () => [stats1, stats2, stats3].filter((s): s is BoxPlotData => s !== null),
        [stats1, stats2, stats3],
    );

    const isLoading = country1Query.isLoading || country2Query.isLoading || country3Query.isLoading;

    const handleCompare = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleConfirm = () => {
        setIsModalOpen(false);
    };

    const handleUpgradeRequired = () => {
        setIsModalOpen(false);
        setIsUpgradeModalOpen(true);
    };

    return (
        <div className="min-h-screen relative flex flex-col lg:flex-row-reverse items-start lg:items-center justify-around gap-5 lg:gap-3 py-8 px-4 lg:px-6">
            {/* Left Side: Hero title or Chart + Compare Button */}
            <div className="w-full lg:w-1/2 flex flex-col gap-5 lg:gap-3 lg:justify-start items-center">
                {!hasCountry ? (
                    /* Hero state: no country selected yet */
                    <div className="flex flex-col gap-3 text-center items-center">
                        <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight">
                            Wage Vantage
                        </h1>
                        <h3 className="text-sm lg:text-base font-medium text-gray-400">
                            Select a country to start comparing
                        </h3>
                    </div>
                ) : (
                    /* Active state: chart + compare button */
                    <div className="w-full max-w-[480px] flex flex-col gap-2 animate-[fadeIn_0.4s_ease-in]">
                        {isLoading ? (
                            <div className="flex items-center justify-center w-full aspect-square">
                                <div className="animate-pulse text-gray-400 text-sm">Loading salary data...</div>
                            </div>
                        ) : (
                            <MainChart data={chartData} userWage={userWage} />
                        )}

                        {/* Selected Countries Badges */}
                        {selectedCountries.length > 0 && (
                            <div className="flex flex-wrap justify-center gap-2 mb-1">
                                {selectedCountries.map((country, i) => (
                                    <span
                                        key={country}
                                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium text-white"
                                        style={{ backgroundColor: CHART_COLORS[i] + '40', borderColor: CHART_COLORS[i], borderWidth: 1 }}
                                    >
                                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                                        {country}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex items-center justify-center">
                            <button
                                onClick={handleCompare}
                                style={{ backgroundColor: "#45d2fd" }}
                                className="block w-3/4 lg:w-1/2 rounded-md px-2.5 py-2 text-center text-xs font-semibold text-gray-900 shadow-xs hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all"
                            >
                                Compare Now
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Form Section */}
            <div className="w-full lg:w-1/2 px-4 lg:px-6">
                <FormLayout />
            </div>

            {/* Compare Modal */}
            <CompareModal
                isOpen={isModalOpen}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
                onUpgradeRequired={handleUpgradeRequired}
                cancelText="Cancel"
                confirmText="Compare"
                cancelButtonColor="#6b7280"
                confirmButtonColor="#45d2fd"
            />

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
            />
        </div>
    )
}
