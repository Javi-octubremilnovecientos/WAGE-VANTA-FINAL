import { DocumentTextIcon } from '@heroicons/react/24/outline';
import type { Template } from '@/lib/User';

interface TemplateCardProps {
    /** Template data to display */
    template: Template;
    /** Callback when card is clicked */
    onClick?: (template: Template) => void;
    /** Callback when delete button is clicked (optional - shows delete button if provided) */
    onDelete?: (templateId: number) => void;
    /** Show icon in header (default: true) */
    showIcon?: boolean;
}

/**
 * Reusable template card component.
 * 
 * Used in:
 * - MyTemplates.tsx (grid view with click to navigate)
 * - TemplateModal.tsx (list view with click to load and delete option)
 * 
 * @example
 * ```tsx
 * // In MyTemplates (no delete button)
 * <TemplateCard
 *   template={template}
 *   onClick={handleNavigate}
 * />
 * 
 * // In TemplateModal (with delete button)
 * <TemplateCard
 *   template={template}
 *   onClick={handleLoad}
 *   onDelete={handleDelete}
 * />
 * ```
 */
function TemplateCard({ template, onClick, onDelete, showIcon = true }: TemplateCardProps) {
    const handleCardClick = () => {
        onClick?.(template);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(template.id);
    };

    return (
        <div
            className="group relative rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur p-4 hover:bg-gray-700/50 hover:border-[#45d2fd]/50 transition-all cursor-pointer shadow-lg hover:shadow-lg hover:shadow-[#45d2fd]/10"
            onClick={handleCardClick}
        >
            {/* Header with icon and/or delete button */}
            {(showIcon || onDelete) && (
                <div className="flex items-start justify-between mb-3">
                    {showIcon && <DocumentTextIcon className="h-5 w-5 text-[#45d2fd]" />}
                    {!showIcon && <div />} {/* Spacer when no icon */}
                    {onDelete && (
                        <button
                            onClick={handleDeleteClick}
                            className="text-gray-500 hover:text-red-400 text-lg leading-none opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                            aria-label="Delete template"
                        >
                            ×
                        </button>
                    )}
                </div>
            )}

            {/* Country and Gender */}
            <h3 className="text-sm font-semibold text-white mb-1">
                {template.country} • {template.gender}
            </h3>

            {/* Wage */}
            <p className="text-xs font-medium text-[#45d2fd] mb-3">
                💰 ${template.monthlyWage.toLocaleString()}
            </p>

            {/* Details grid */}
            <div className="space-y-1.5 text-xs text-gray-300 border-t border-gray-700/50 pt-3">
                {template.occupation && (
                    <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500">Role:</span>
                        <span className="text-right text-white font-medium truncate">
                            {template.occupation}
                        </span>
                    </div>
                )}
                {template.position && (
                    <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500">Level:</span>
                        <span className="text-right text-white font-medium truncate">
                            {template.position}
                        </span>
                    </div>
                )}
                {template.economicActivity && (
                    <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500">Sector:</span>
                        <span className="text-right text-white font-medium truncate">
                            {template.economicActivity}
                        </span>
                    </div>
                )}
                {template.educationLevel && (
                    <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500">Education:</span>
                        <span className="text-right text-white font-medium truncate">
                            {template.educationLevel}
                        </span>
                    </div>
                )}
                {template.companySize && (
                    <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500">Company:</span>
                        <span className="text-right text-white font-medium truncate">
                            {template.companySize}
                        </span>
                    </div>
                )}
                {template.experienceYears !== undefined && template.experienceYears > 0 && (
                    <div className="flex justify-between items-start gap-2">
                        <span className="text-gray-500">Experience:</span>
                        <span className="text-right text-white font-medium">
                            {template.experienceYears} {template.experienceYears === 1 ? 'year' : 'years'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TemplateCard;
