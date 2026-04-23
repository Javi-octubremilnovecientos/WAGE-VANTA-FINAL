import { ArrowLeftIcon, ChartBarSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import SavedDataCard from '@/components/ui/cards/SavedDataCard';
import { selectUserComparisons, updateComparisons } from '@/features/auth/authSlice';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { useUpdateUserMutation } from '@/features/auth/authApi';
import PlanLimitBadge from '@/components/ui/PlanLimitBadge';
import { setSelectedCountries, setFormValues, setComputedStats } from '@/features/salaries/salarySlice';
import type { Comparison } from '@/lib/User';
import type { ComparisonFormValues, BoxPlotData } from '@/features/salaries/types';

function SavedComparisons() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const comparisons = useAppSelector(selectUserComparisons);
    const { maxComparisons } = usePlanLimits();
    const [updateUser] = useUpdateUserMutation();
    const hasComparisons = comparisons && comparisons.length > 0;

    const handleLoadComparison = (comparison: Comparison) => {
        dispatch(setSelectedCountries(comparison.selectedCountries));
        dispatch(setFormValues(comparison.formValues as ComparisonFormValues));
        dispatch(setComputedStats(comparison.computedStats as BoxPlotData[]));
        navigate('/comparison');
    };

    const handleDeleteComparison = async (comparisonId: number) => {
        try {
            const updatedComparisons = comparisons.filter((c) => c.id !== comparisonId);

            // Actualizar en Redux
            dispatch(updateComparisons(updatedComparisons));

            // Sincronizar con Supabase
            await updateUser({
                data: { comparisons: updatedComparisons },
            }).unwrap();
        } catch (err) {
            console.error('Error deleting comparison:', err);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#45d2fd] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Dashboard
                </Link>

                <div className="flex flex-col gap-2 sm:gap-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                            Saved Comparisons
                        </h1>
                        <PlanLimitBadge
                            current={comparisons.length}
                            max={maxComparisons}
                            label="Comparisons"
                            showWhenZero
                        />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                        Your previously saved wage comparisons
                    </p>
                </div>
            </div>

            {/* Empty State */}
            {!hasComparisons && (
                <section>
                    <div className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur px-4 py-14 text-center shadow-lg sm:px-6">
                        <div className="mx-auto flex max-w-md flex-col items-center gap-3">
                            <div className="inline-flex rounded-full bg-[#45d2fd]/20 p-2 text-[#45d2fd]">
                                <ChartBarSquareIcon className="h-5 w-5" />
                            </div>
                            <p className="text-sm font-medium text-gray-300">
                                No comparisons saved yet
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#45d2fd] transition-colors hover:text-[#22b8d9] mt-1"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Start comparing
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Comparisons Grid */}
            {hasComparisons && (
                <section className="space-y-4">
                    {comparisons.map((comparison) => (
                        <SavedDataCard
                            key={comparison.id}
                            comparison={comparison}
                            onView={() => handleLoadComparison(comparison)}
                            onDelete={() => handleDeleteComparison(comparison.id)}
                            variant="full"
                        />
                    ))}
                </section>
            )}
        </div>
    );
}

export default SavedComparisons;
