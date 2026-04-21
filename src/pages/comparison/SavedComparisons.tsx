import { ArrowLeftIcon, ChartBarSquareIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
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
                    {comparisons.map((comparison) => {
                        const savedDate = new Date(comparison.savedAt).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric',
                        });
                        const medians = comparison.computedStats.map(
                            (s) => `${s.category}: ${s.median.toLocaleString()}€`,
                        );
                        const activity = comparison.formValues['Economic Activity'];
                        const occupation = comparison.formValues['Occupation'];

                        return (
                            <div key={comparison.id} className="flex flex-col sm:flex-row sm:items-start gap-3">
                                <div
                                    onClick={() => handleLoadComparison(comparison)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === 'Enter' && handleLoadComparison(comparison)}
                                    aria-label={`Load comparison from ${savedDate}`}
                                    className="flex-1 rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur p-3 sm:p-4 shadow-lg hover:border-[#45d2fd]/50 hover:shadow-[#45d2fd]/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-gray-900"
                                >
                                    {/* Top row */}
                                    <div className="flex items-start justify-between mb-3">
                                        <ChartBarSquareIcon className="h-5 w-5 text-[#45d2fd]" />
                                        <span className="text-xs text-gray-500">{savedDate}</span>
                                    </div>

                                    {/* Country badges */}
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {comparison.selectedCountries.map((country) => (
                                            <span
                                                key={country}
                                                className="inline-flex items-center rounded-full border border-gray-600 bg-gray-700/60 px-2 py-0.5 text-xs text-gray-300"
                                            >
                                                {country}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Medians */}
                                    <div className="space-y-1 mb-3">
                                        {medians.map((m) => (
                                            <p key={m} className="text-xs text-gray-400">
                                                Median — {m}
                                            </p>
                                        ))}
                                    </div>

                                    {/* Context */}
                                    {(activity || occupation) && (
                                        <div className="border-t border-gray-700 pt-2 space-y-0.5">
                                            {activity && (
                                                <p className="text-xs text-gray-500 break-words">
                                                    <span className="text-gray-400">Sector:</span> {activity}
                                                </p>
                                            )}
                                            {occupation && (
                                                <p className="text-xs text-gray-500 break-words">
                                                    <span className="text-gray-400">Occupation:</span> {occupation}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Delete button */}
                                <button
                                    onClick={() => handleDeleteComparison(comparison.id)}
                                    className="self-start sm:mt-2 p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10 flex-shrink-0"
                                    aria-label="Delete comparison"
                                >
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </div>
                        );
                    })}
                </section>
            )}
        </div>
    );
}

export default SavedComparisons;
