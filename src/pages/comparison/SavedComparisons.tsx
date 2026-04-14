import { ArrowLeftIcon, ChartBarSquareIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useRedux';
import { selectUserComparisons } from '@/features/auth/authSlice';

function SavedComparisons() {
    const comparisons = useAppSelector(selectUserComparisons);
    const hasComparisons = comparisons && comparisons.length > 0;
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

                <div className="flex flex-col gap-1.5">
                    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Saved Comparisons
                    </h1>
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
                <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {comparisons.map((comparison) => (
                        <div
                            key={comparison.id}
                            className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur p-4 shadow-lg hover:border-[#45d2fd]/50 hover:shadow-lg hover:shadow-[#45d2fd]/10 transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <ChartBarSquareIcon className="h-5 w-5 text-[#45d2fd]" />
                            </div>
                            <h3 className="text-sm font-semibold text-white mb-2">Comparison #{comparison.id}</h3>
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">Median: ${comparison.median.median.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">Min: ${comparison.median.min.toLocaleString()}</p>
                                <p className="text-xs text-gray-400">Max: ${comparison.median.max.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </section>
            )}
        </div>
    );
}

export default SavedComparisons;
