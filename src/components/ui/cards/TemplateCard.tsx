import { DocumentTextIcon } from '@heroicons/react/24/outline';
import type { Template } from '@/lib/User';

interface TemplateCardProps {
    /** Template data to display */
    template: Template;
    /** Callback when card is clicked */
    onClick?: (template: Template) => void;
    /** Show icon in header (default: true) */
    showIcon?: boolean;
}

/**
 * Reusable template card component.
 * 
 * Used in:
 * - TemplateStack.tsx (stack view with click to navigate or load)
 * - TemplateModal.tsx (list view with click to load)
 * 
 * @example
 * ```tsx
 * <TemplateCard
 *   template={template}
 *   onClick={handleNavigate}
 * />
 * ```
 */
function TemplateCard({ template, onClick, showIcon = true }: TemplateCardProps) {
    const handleCardClick = () => {
        onClick?.(template);
    };

    return (
        <div
            className="group relative rounded-lg border border-white/10 bg-[#121213]/60 backdrop-blur p-3 sm:p-4 hover:border-[#D84124]/30 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:shadow-[#D84124]/10"
            onClick={handleCardClick}
        >
            {/* Header with icon */}
            {showIcon && (
                <div className="flex items-start justify-start mb-3">
                    <DocumentTextIcon className="h-5 w-5 text-[#D84124]" />
                </div>
            )}

            {/* Country and Gender */}
            <h3 className="text-sm font-semibold text-white mb-1">
                {template.country} • {template.gender}
            </h3>

            {/* Wage */}
            <p className="text-xs font-medium text-[#ED8B34] mb-3">
                💰 ${template.monthlyWage.toLocaleString()}
            </p>

            {/* Details grid */}
            <div className="space-y-1.5 text-xs border-t border-white/10 pt-3">
                {template.occupation && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#96969F] flex-shrink-0">Role:</span>
                        <span className="font-medium break-words" style={{ color: '#ED8B34' }}>
                            {template.occupation}
                        </span>
                    </div>
                )}
                {template.position && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#96969F] flex-shrink-0">Level:</span>
                        <span className="font-medium break-words" style={{ color: '#ED8B34' }}>
                            {template.position}
                        </span>
                    </div>
                )}
                {template.economicActivity && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#96969F] flex-shrink-0">Sector:</span>
                        <span className="font-medium break-words" style={{ color: '#ED8B34' }}>
                            {template.economicActivity}
                        </span>
                    </div>
                )}
                {template.educationLevel && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#96969F] flex-shrink-0">Education:</span>
                        <span className="font-medium break-words" style={{ color: '#ED8B34' }}>
                            {template.educationLevel}
                        </span>
                    </div>
                )}
                {template.companySize && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#96969F] flex-shrink-0">Company:</span>
                        <span className="font-medium break-words" style={{ color: '#ED8B34' }}>
                            {template.companySize}
                        </span>
                    </div>
                )}
                {template.experienceYears !== undefined && template.experienceYears > 0 && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-2">
                        <span className="text-[#96969F] flex-shrink-0">Experience:</span>
                        <span className="font-medium" style={{ color: '#ED8B34' }}>
                            {template.experienceYears} {template.experienceYears === 1 ? 'year' : 'years'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TemplateCard;
