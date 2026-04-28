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
                className="w-full rounded-lg border border-white/10 bg-[#121213]/60 backdrop-blur px-4 py-4 shadow-lg hover:shadow-xl hover:border-[#D84124]/30 transition-all text-left"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                            {comparison.selectedCountries.map((country) => (
                                <span
                                    key={country}
                                    className="inline-flex items-center rounded-full border border-[#D84124]/30 bg-[#D84124]/10 px-2 py-0.5 text-xs font-medium text-[#D84124]"
                                >
                                    {country}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-[#96969F]">
                            Saved on {savedDate}
                        </p>
                    </div>
                    <ChevronRightIcon className="h-4 w-4 shrink-0 text-[#96969F]" />
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
                className="flex-1 rounded-lg border border-white/10 bg-[#121213]/60 backdrop-blur p-3 sm:p-4 shadow-lg hover:shadow-xl hover:border-[#D84124]/30 hover:shadow-[#D84124]/10 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
            >
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                    <ChartBarSquareIcon className="h-5 w-5 text-[#D84124]" />
                    <span className="text-xs text-[#96969F]">{savedDate}</span>
                </div>

                {/* Country badges */}
                <div className="flex flex-wrap gap-1 mb-3">
                    {comparison.selectedCountries.map((country) => (
                        <span
                            key={country}
                            className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-white"
                        >
                            {country}
                        </span>
                    ))}
                </div>

                {/* Medians */}
                <div className="space-y-1 mb-3">
                    {medians.map((m) => (
                        <p key={m} className="text-xs text-[#96969F]">
                            Median — <span style={{ color: '#ED8B34' }}>{m.split(': ')[1]}</span>
                        </p>
                    ))}
                </div>

                {/* Context */}
                {(activity || occupation) && (
                    <div className="border-t border-white/10 pt-2 space-y-0.5">
                        {activity && (
                            <p className="text-xs break-words">
                                <span className="text-[#96969F]">Sector:</span> <span style={{ color: '#ED8B34' }}>{activity}</span>
                            </p>
                        )}
                        {occupation && (
                            <p className="text-xs break-words">
                                <span className="text-[#96969F]">Occupation:</span> <span style={{ color: '#ED8B34' }}>{occupation}</span>
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Delete button (only in full variant) */}
            {onDelete && (
                <button
                    onClick={onDelete}
                    className="self-start sm:mt-2 p-2 text-[#D84124] hover:text-[#ED8B34] transition-colors rounded-lg hover:bg-[#D84124]/10 flex-shrink-0"
                    aria-label="Delete comparison"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            )}
        </div>
    );
}

export default SavedDataCard;
