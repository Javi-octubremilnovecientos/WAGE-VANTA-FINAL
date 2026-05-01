import { useState, useCallback } from 'react';
import { ArrowDownTrayIcon, BookmarkIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
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


interface ComparisonSheetNavState {
    fromSavedComparison?: boolean;
    selectedCountries?: string[];
    economicActivity?: string;
    occupation?: string;
    userWage?: number;
}

function ComparisonSheet() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [exportModalOpen, setExportModalOpen] = useState(false);
    const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup' | 'recovery'>('login');
    const [savedFeedback, setSavedFeedback] = useState(false);

    const [updateUser] = useUpdateUserMutation();

    // Leer navigation state (viene de SavedComparisons) o Redux (viene de FormLayout)
    const navState = location.state as ComparisonSheetNavState | null;

    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const computedStats = useAppSelector(selectComputedStats);
    const reduxSelectedCountries = useAppSelector(selectSelectedCountries);
    const reduxFormValues = useAppSelector(selectFormValues);
    const reduxUserWage = useAppSelector(selectUserMonthlyWage);
    const canExport = useAppSelector(selectCanExport);
    const canSaveComparison = useAppSelector(selectCanSaveComparison);
    const existingComparisons = useAppSelector(selectUserComparisons);

    // Usar navigation state si viene de SavedComparisons, sino Redux (FormLayout)
    const selectedCountries = navState?.selectedCountries ?? reduxSelectedCountries;
    const economicActivity = navState?.economicActivity ?? reduxFormValues['Economic Activity'];
    const occupation = navState?.occupation ?? reduxFormValues['Occupation'];
    const userWage = navState?.userWage ?? reduxUserWage;
    const formValues = reduxFormValues; // Mantener referencia para formValues completo en Redux

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
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96969F] hover:text-[#D84124] transition-colors mb-6"
                aria-label="Back to home"
            >
                <ArrowLeftIcon className="h-3 w-3" />
                Back to Home
            </button>

            {/* Header */}
            <div className="flex flex-col items-center justify-center gap-4 mb-8 sm:mb-12 text-center">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
                        Comparison Sheet
                    </h1>
                    {selectedCountries.length > 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                            {selectedCountries.map((country) => (
                                <span
                                    key={country}
                                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-[#96969F]"
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
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black ${savedFeedback
                            ? 'border-green-500/40 bg-green-500/10 text-green-400 focus:ring-green-500'
                            : 'border-white/10 bg-white/5 text-[#96969F] hover:border-white/20 hover:text-white focus:ring-white/10'
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
                        className="inline-flex items-center gap-2 rounded-lg border border-[#D84124]/30 bg-[#D84124]/10 px-3 py-2 text-xs font-medium text-[#D84124] transition-colors hover:bg-[#D84124]/20 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-black"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                        <span className="hidden sm:inline">Export</span>
                    </button>
                </div>
            </div>

            {/* Charts Grid — 2 columnas en lg, 1 en mobile */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

                {/* 1 — BoxPlot: distribución salarial */}
                <div className="rounded-xl border border-white/10 bg-[#121213]/50 p-4 backdrop-blur">
                    <h2 className="mb-3 text-sm font-semibold text-[#96969F]">
                        Salary Distribution
                    </h2>
                    <MainChart
                        data={computedStats}
                        userWage={userWage}
                        isLoading={false}
                    />
                </div>

                {/* 2 — Bar Chart: crecimiento salarial últimos 10 años */}
                <div className="rounded-xl border border-white/10 bg-[#121213]/50 p-4 backdrop-blur">
                    <h2 className="mb-1 text-sm font-semibold text-[#96969F]">
                        Salary Growth — Last 10 Years
                    </h2>
                    <p className="mb-3 text-xs text-[#96969F]">
                        Estimated monthly median wage (€) · provisional data
                    </p>
                    <SalaryGrowthChart selectedCountries={selectedCountries} height={280} />
                </div>

                {/* 3 — Area: distribución dentro de la misma actividad económica */}
                <div className="rounded-xl border border-white/10 bg-[#121213]/50 p-4 backdrop-blur">
                    <h2 className="mb-1 text-sm font-semibold text-[#96969F]">
                        Sector Distribution
                        {economicActivity && (
                            <span className="ml-1.5 font-normal text-[#D84124]">
                                · {economicActivity}
                            </span>
                        )}
                    </h2>
                    <p className="mb-3 text-xs text-[#96969F]">
                        Share of workers per salary bracket · dashed lines = your median
                    </p>
                    <EconomicActivityChart
                        computedStats={computedStats}
                        economicActivity={economicActivity}
                        height={280}
                    />
                </div>

                {/* 4 — Area + Band: comparativa por nivel dentro de la ocupación */}
                <div className="rounded-xl border border-white/10 bg-[#121213]/50 p-4 backdrop-blur">
                    <h2 className="mb-1 text-sm font-semibold text-[#96969F]">
                        Occupation Salary Bands
                        {occupation && (
                            <span className="ml-1.5 font-normal text-[#D84124]">
                                · {occupation}
                            </span>
                        )}
                    </h2>
                    <p className="mb-3 text-xs text-[#96969F]">
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
