import { ChartBarSquareIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Comparison } from '@/lib/User';

interface SavedDataCardProps {
    comparison: Comparison;
    onView: () => void;
    onDelete?: () => void;
    variant?: 'compact' | 'full';
}

function SavedDataCard({
    comparison,
    onView,
    onDelete,
    variant = 'full',
}: SavedDataCardProps) {
    const savedDate = new Date(comparison.savedAt).toLocaleDateString(
        variant === 'compact' ? 'en-US' : 'en-GB',
        variant === 'compact'
            ? { year: 'numeric', month: 'short', day: 'numeric' }
            : { day: '2-digit', month: 'short', year: 'numeric' }
    );

    const medians = comparison.computedStats.map(
        (s) => `${s.category}: ${s.median.toLocaleString()}€`
    );
    const activity = comparison.formValues['Economic Activity'];
    const occupation = comparison.formValues['Occupation'];

    if (variant === 'compact') {
        return (
            <button
                onClick={onView}
                className="w-full rounded-lg border border-transparent dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800/40 dark:to-gray-800/20 backdrop-blur px-4 py-4 shadow-lg hover:shadow-xl hover:border-[#45d2fd] dark:hover:bg-gray-800/60 dark:hover:border-gray-600 transition-all text-left"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {comparison.selectedCountries.map((country) => (
                                <span
                                    key={country}
                                    className="inline-flex items-center rounded-full border border-[#45d2fd]/30 bg-[#45d2fd]/10 px-2 py-0.5 text-xs font-medium text-[#45d2fd]"
                                >
                                    {country}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400">
                            Saved on {savedDate}
                        </p>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-500" />
                </div>
            </button>
        );
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
            <div
                onClick={onView}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onView()}
                aria-label={`Load comparison from ${savedDate}`}
                className="flex-1 rounded-lg border border-transparent dark:border-gray-700 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800/40 dark:to-gray-800/20 backdrop-blur p-3 sm:p-4 shadow-lg hover:shadow-xl hover:border-[#45d2fd] dark:hover:border-[#45d2fd]/50 hover:shadow-[#45d2fd]/20 dark:hover:shadow-[#45d2fd]/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
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
                            className="inline-flex items-center rounded-full border border-blue-300 dark:border-gray-600 bg-blue-50 dark:bg-gray-700/60 px-2 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-300"
                        >
                            {country}
                        </span>
                    ))}
                </div>

                {/* Medians */}
                <div className="space-y-1 mb-3">
                    {medians.map((m) => (
                        <p key={m} className="text-xs text-gray-500 dark:text-gray-400">
                            Median — <span style={{ color: '#45d2fd' }}>{m.split(': ')[1]}</span>
                        </p>
                    ))}
                </div>

                {/* Context */}
                {(activity || occupation) && (
                    <div className="border-t border-transparent dark:border-gray-700 pt-2 space-y-0.5\">
                        {activity && (
                            <p className="text-xs break-words">
                                <span className="text-gray-500 dark:text-gray-400">Sector:</span> <span style={{ color: '#45d2fd' }}>{activity}</span>
                            </p>
                        )}
                        {occupation && (
                            <p className="text-xs break-words">
                                <span className="text-gray-500 dark:text-gray-400">Occupation:</span> <span style={{ color: '#45d2fd' }}>{occupation}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Delete button (only in full variant) */}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="self-start sm:mt-2 p-2 text-[#45d2fd] hover:text-[#22b8d9] transition-colors rounded-lg hover:bg-[#45d2fd]/10 flex-shrink-0"
                    aria-label="Delete comparison"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}

export default SavedDataCard;
