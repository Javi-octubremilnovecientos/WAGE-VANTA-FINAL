import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import type { Template } from '@/lib/User';
import TemplateCard from './cards/TemplateCard';

interface TemplateStackProps {
    /** Array of templates to display */
    templates: Template[];
    /** Callback when a template card is clicked */
    onTemplateClick: (template: Template) => void;
    /** Callback when delete button is clicked (optional - shows delete button if provided) */
    onTemplateDelete?: (templateId: number) => void;
}

/**
 * Componente que muestra templates como un "taco de folios" con pestañas superiores.
 * Las pestañas funcionan como carpeta clasificadora, mostrando una template a la vez.
 * 
 * Features:
 * - Pestañas tipo carpeta en la parte superior
 * - Efecto de stack (tarjetas apiladas) con sombras
 * - Transiciones suaves al cambiar de pestaña
 * - Indicador visual de pestaña activa
 * 
 * @example
 * ```tsx
 * <TemplateStack
 *   templates={userTemplates}
 *   onTemplateClick={handleLoad}
 *   onTemplateDelete={handleDelete}
 * />
 * ```
 */
function TemplateStack({ templates, onTemplateClick, onTemplateDelete }: TemplateStackProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (templates.length === 0) {
        return null;
    }

    // Si solo hay una template, mostrarla directamente sin pestañas
    if (templates.length === 1) {
        return (
            <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="flex-1">
                    <TemplateCard
                        template={templates[0]}
                        onClick={onTemplateClick}
                    />
                </div>
                {onTemplateDelete && (
                    <button
                        onClick={() => onTemplateDelete(templates[0].id)}
                        className="self-start sm:mt-2 p-2 text-[#D84124] hover:text-[#ED8B34] transition-colors rounded-lg hover:bg-[#D84124]/10 flex-shrink-0"
                        aria-label="Delete template"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        );
    }

    const activeTemplate = templates[activeIndex];

    return (
        <div className="w-full">
            {/* Pestañas tipo carpeta clasificadora */}
            <div className="flex gap-1 mb-0 overflow-x-auto scrollbar-hide">
                {templates.map((template, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <button
                            key={template.id}
                            onClick={() => setActiveIndex(index)}
                            className={`
                                relative px-4 py-2 text-xs font-medium transition-all duration-200
                                rounded-t-lg border-t-2 border-x-2 border-b-0
                                min-w-[120px] max-w-[180px] truncate
                                ${isActive
                                    ? 'bg-white/5 border-[#D84124] text-white z-10 -mb-[2px]'
                                    : 'bg-[#0A0A0B]/60 border-white/10 text-[#96969F] hover:text-white hover:border-white/20'
                                }
                            `}
                            style={{
                                clipPath: isActive
                                    ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                                    : 'polygon(6px 0%, calc(100% - 6px) 0%, 100% 100%, 0% 100%)',
                            }}
                        >
                            <span className="block truncate">
                                {template.country} • {template.gender}
                            </span>
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5" />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Stack de tarjetas con efecto de profundidad y botón delete */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 relative">
                <div className="flex-1 relative">
                    {/* Tarjetas de fondo (efecto de stack) */}
                    {templates.length > 1 && (
                        <>
                            <div
                                className="absolute top-2 left-2 right-2 h-full rounded-lg bg-white/5 border border-white/10 -z-10"
                                style={{ transform: 'translateY(4px)' }}
                            />
                            {templates.length > 2 && (
                                <div
                                    className="absolute top-4 left-4 right-4 h-full rounded-lg bg-white/3 border border-white/5 -z-20"
                                    style={{ transform: 'translateY(8px)' }}
                                />
                            )}
                        </>
                    )}

                    {/* Tarjeta activa con animación */}
                    <div
                        key={activeTemplate.id}
                        className="relative z-0 animate-[fadeIn_0.3s_ease-in-out] border-t-2 border-[#D84124] rounded-t-none"
                    >
                        <TemplateCard
                            template={activeTemplate}
                            onClick={onTemplateClick}
                            showIcon={false} // No mostrar icono porque ya tenemos pestañas
                        />
                    </div>
                </div>

                {/* Delete button al lado */}
                {onTemplateDelete && (
                    <button
                        onClick={() => onTemplateDelete(activeTemplate.id)}
                        className="self-start sm:mt-2 p-2 text-[#D84124] hover:text-[#ED8B34] transition-colors rounded-lg hover:bg-[#D84124]/10 flex-shrink-0"
                        aria-label="Delete template"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default TemplateStack;
