import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChartBarIcon, WindowIcon } from "@heroicons/react/24/outline";
import MainChart from "../components/charts/MainChart";
import FormLayout from "../components/form/FormLayout";
import CompareModal from "../components/ui/modals/CompareModal";
import AuthModal from "../components/ui/modals/AuthModal";
import UpgradeModal from "../components/ui/modals/UpgradeModal";
import { useAppSelector, useAppDispatch } from "../hooks/useRedux";
import { usePlanLimits } from "../hooks/usePlanLimits";
import type { PremiumFeature } from "../components/ui/modals/UpgradeModal";
import {
    selectSelectedCountries,
    selectFormValues,
    setComputedStats,
} from "../features/salaries/salarySlice";
import { selectUserMonthlyWage } from "../features/salaries/salarySelectors";
import { useGetSalaryDataQuery } from "../features/salaries/salaryApi";
import { useComputeSalaryStats } from "../hooks/useComputeSalaryStats";
import type { BoxPlotData } from "../features/salaries/types";

const CHART_COLORS = ['#8884d8', '#82ca9d', '#fbbf24'];

export default function Home() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const [upgradeFeature, setUpgradeFeature] = useState<PremiumFeature>('compare_countries');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | 'recovery'>('login');
    const [chartView, setChartView] = useState<'boxplot' | 'barchart'>('boxplot');

    const dispatch = useAppDispatch();
    const { isAuthenticated, canAccessMultipleChartViews } = usePlanLimits();
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

    // Persistir los stats computados en Redux para usarlos en ComparisonSheet
    useEffect(() => {
        dispatch(setComputedStats(chartData));
    }, [chartData, dispatch]);

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
        setUpgradeFeature('compare_countries');
        setIsUpgradeModalOpen(true);
    };

    const handleChartViewToggle = () => {
        // Si no está autenticado, mostrar AuthModal
        if (!isAuthenticated) {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
            return;
        }

        // Si está autenticado pero no tiene permisos de múltiples vistas, mostrar UpgradeModal
        if (!canAccessMultipleChartViews) {
            setUpgradeFeature('chart_views');
            setIsUpgradeModalOpen(true);
            return;
        }

        // Si tiene permisos, cambiar la vista del gráfico
        setChartView(chartView === 'boxplot' ? 'barchart' : 'boxplot');
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
                    <div className="w-full max-w-[480px] flex flex-col gap-4 lg:gap-2 animate-[fadeIn_0.4s_ease-in]">
                        <MainChart data={chartData} userWage={userWage} isLoading={isLoading} />

                        {/* Chart View Toggle Button and Countries Badges */}
                        <div className="flex items-center justify-center gap-4 mb-4 lg:mb-1">
                            {selectedCountries.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2">
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
                            <button
                                onClick={handleChartViewToggle}
                                className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700/60 hover:bg-gray-600/60 rounded border border-gray-600 transition-all flex-shrink-0 flex items-center justify-center"
                                aria-label="Toggle chart view"
                                title={chartView === 'boxplot' ? 'Switch to bar chart' : 'Switch to box plot'}
                            >
                                {chartView === 'boxplot' ? (
                                    <ChartBarIcon className="h-4 w-4" />
                                ) : (
                                    <WindowIcon className="h-4 w-4" />
                                )}
                            </button>
                        </div>

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
                <FormLayout onNavigateToSheet={() => navigate('/comparison')} />
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

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                mode={authModalMode}
                onSwitchMode={(mode) => setAuthModalMode(mode)}
            />

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={isUpgradeModalOpen}
                onClose={() => setIsUpgradeModalOpen(false)}
                feature={upgradeFeature}
            />
        </div>
    )
}
