import { useState, useCallback } from 'react';
import { ArrowDownTrayIcon, BookmarkIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import {
    selectComputedStats,
    selectUserMonthlyWage,
    selectCanExport,
    selectCanSaveComparison,
} from '@/features/salaries/salarySelectors';
import { selectSelectedCountries, selectFormValues } from '@/features/salaries/salarySlice';
import { selectIsAuthenticated, selectUserComparisons, updateComparisons } from '@/features/auth/authSlice';
import { useUpdateUserMutation } from '@/features/auth/authApi';
import ExportModal from '@/components/ui/modals/ExportModal';
import UpgradeModal from '@/components/ui/modals/UpgradeModal';
import AuthModal from '@/components/ui/modals/AuthModal';
import MainChart from '@/components/charts/MainChart';
import { SalaryGrowthChart } from '@/components/charts/SalaryGrowthChart';
import { EconomicActivityChart } from '@/components/charts/EconomicActivityChart';
import { OccupationComparisonChart } from '@/components/charts/OccupationComparisonChart';


function ComparisonSheet() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'recovery'>('login');
    const [savedFeedback, setSavedFeedback] = useState(false);

    const [updateUser] = useUpdateUserMutation();

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const computedStats = useAppSelector(selectComputedStats);
    const selectedCountries = useAppSelector(selectSelectedCountries);
    const formValues = useAppSelector(selectFormValues);
    const userWage = useAppSelector(selectUserMonthlyWage);
    const canExport = useAppSelector(selectCanExport);
    const canSaveComparison = useAppSelector(selectCanSaveComparison);
    const existingComparisons = useAppSelector(selectUserComparisons);

    const economicActivity = formValues['Economic Activity'];
    const occupation = formValues['Occupation'];

    const handleSaveComparison = useCallback(async () => {
        // Requiere autenticación
        if (!isAuthenticated) {
            setAuthMode('login');
            setAuthModalOpen(true);
            return;
        }
        // Requiere capacidad de guardar según el plan
        if (!canSaveComparison) {
            setUpgradeModalOpen(true);
            return;
        }

        try {
            const newComparison = {
                id: Date.now(),
                savedAt: new Date().toISOString(),
                selectedCountries,
                formValues,
                computedStats,
                userWage,
            };

            const updatedComparisons = [...existingComparisons, newComparison];

            // Actualizar en Redux
            dispatch(updateComparisons(updatedComparisons));

            // Sincronizar con Supabase
            await updateUser({
                data: { comparisons: updatedComparisons },
            }).unwrap();

            // Feedback temporal de 2 segundos
            setSavedFeedback(true);
            setTimeout(() => setSavedFeedback(false), 2000);
        } catch (err) {
            console.error('Error saving comparison:', err);
            // Revertir cambio en Redux si falla Supabase
            dispatch(updateComparisons(existingComparisons));
        }
    }, [isAuthenticated, canSaveComparison, selectedCountries, formValues, computedStats, userWage, existingComparisons, dispatch, updateUser]);

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12">

            {/* Back to Home */}
            <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[#45d2fd] transition-colors mb-6"
                aria-label="Back to home"
            >
                <ArrowLeftIcon className="h-3 w-3" />
                Back to Home
            </button>

            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-4 mb-8 sm:mb-12 text-center">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight mb-3">
                        Comparison Sheet
                    </h1>
                    {selectedCountries.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                            {selectedCountries.map((country) => (
                                <span
                                    key={country}
                                    className="inline-flex items-center rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-800/60 px-2 py-0.5 text-xs text-gray-700 dark:text-gray-300"
                                >
                                    {country}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex flex-shrink-0 items-center gap-2 w-full justify-center">
                    {/* Save Comparison */}
                    <button
                        onClick={handleSaveComparison}
                        aria-label="Save comparison"
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 ${savedFeedback
                            ? 'border-green-500/40 bg-green-500/10 text-green-400 focus:ring-green-500'
                            : 'border-gray-300 dark:border-gray-600 bg-gray-100/60 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white focus:ring-gray-300 dark:focus:ring-gray-500'
                            }`}
                    >
                        {savedFeedback ? (
                            <>
                                <CheckIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Saved!</span>
                            </>
                        ) : (
                            <>
                                <BookmarkIcon className="h-4 w-4" />
                                <span className="hidden sm:inline">Save</span>
                            </>
                        )}
                    </button>

                    {/* Export */}
                    <button
                        onClick={() => setExportModalOpen(true)}
                        aria-label="Export comparison"
                        className="inline-flex items-center gap-2 rounded-lg border border-[#45d2fd]/30 bg-[#45d2fd]/10 px-3 py-2 text-xs font-medium text-[#45d2fd] transition-colors hover:bg-[#45d2fd]/20 focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Charts Grid — 2 columnas en lg, 1 en mobile */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* 1 — BoxPlot: distribución salarial */}
                <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4 backdrop-blur">
                    <h2 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Salary Distribution
                    </h2>
                    <MainChart
                        data={computedStats}
                        userWage={userWage}
                        isLoading={false}
                    />
                </div>

                {/* 2 — Bar Chart: crecimiento salarial últimos 10 años */}
                <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4 backdrop-blur">
                    <h2 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Salary Growth — Last 10 Years
                    </h2>
                    <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                        Estimated monthly median wage (€) · provisional data
                    </p>
                    <SalaryGrowthChart selectedCountries={selectedCountries} height={280} />
                </div>

                {/* 3 — Area: distribución dentro de la misma actividad económica */}
                <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4 backdrop-blur">
                    <h2 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Sector Distribution
                        {economicActivity && (
                            <span className="ml-1.5 font-normal text-[#45d2fd]">
                                · {economicActivity}
                            </span>
                        )}
                    </h2>
                    <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                        Share of workers per salary bracket · dashed lines = your median
                    </p>
                    <EconomicActivityChart
                        computedStats={computedStats}
                        economicActivity={economicActivity}
                        height={280}
                    />
                </div>

                {/* 4 — Area + Band: comparativa por nivel dentro de la ocupación */}
                <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 p-4 backdrop-blur">
                    <h2 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Occupation Salary Bands
                        {occupation && (
                            <span className="ml-1.5 font-normal text-[#45d2fd]">
                                · {occupation}
                            </span>
                        )}
                    </h2>
                    <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
                        P25–P75 range by level · cyan line = sector median · dashed = your median
                    </p>
                    <OccupationComparisonChart
                        computedStats={computedStats}
                        occupation={occupation}
                        height={280}
                    />
                </div>
            </div>

            {/* Modals */}
            <ExportModal
                isOpen={exportModalOpen}
                onClose={() => setExportModalOpen(false)}
                chartData={computedStats}
                userWage={userWage}
                canExport={canExport}
                onUpgradeRequired={() => {
                    setExportModalOpen(false);
                    setUpgradeModalOpen(true);
                }}
            />

            <UpgradeModal
                isOpen={upgradeModalOpen}
                onClose={() => setUpgradeModalOpen(false)}
                feature="save_comparisons"
            />

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                mode={authMode}
                onSwitchMode={(m) => setAuthMode(m)}
            />
        </div>
    );
}








export default ComparisonSheet;
