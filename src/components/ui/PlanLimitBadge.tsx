import { SparklesIcon } from '@heroicons/react/24/outline';

interface PlanLimitBadgeProps {
    /** Número actual de items (ej: templates guardados) */
    current: number;
    /** Número máximo permitido según el plan */
    max: number;
    /** Label descriptivo (ej: "Templates", "Comparisons") */
    label: string;
    /** Callback al hacer click en el botón de upgrade (opcional) */
    onUpgradeClick?: () => void;
    /** Mostrar siempre el badge completo, incluso si max es 0 */
    showWhenZero?: boolean;
}

/**
 * Badge reutilizable para mostrar límites de uso según el plan.
 * 
 * Muestra un indicador visual "X / Y" con estilos que cambian según el estado:
 * - Normal: Uso dentro del límite
 * - Warning: Límite alcanzado
 * - Con botón de upgrade si el usuario puede mejorar su plan
 * 
 * @example
 * ```tsx
 * <PlanLimitBadge 
 *   current={templates.length} 
 *   max={maxTemplates} 
 *   label="Templates"
 *   onUpgradeClick={() => setUpgradeModalOpen(true)}
 * />
 * ```
 */
export default function PlanLimitBadge({
    current,
    max,
    label,
    onUpgradeClick,
    showWhenZero = false,
}: PlanLimitBadgeProps) {
    // Si max es 0 y no queremos mostrar, retornar null
    if (max === 0 && !showWhenZero) {
        return null;
    }

    const isLimitReached = current >= max;
    const showUpgradeButton = isLimitReached && onUpgradeClick;

    return (
        <div className="inline-flex items-center gap-2">
            {/* Badge de contador */}
            <span
                className={`inline-flex items-center rounded-full border backdrop-blur px-2.5 py-0.5 text-xs font-medium shadow-sm transition-colors ${isLimitReached
                    ? 'border-orange-600/50 bg-orange-500/10 text-orange-300'
                    : 'border-gray-300 dark:border-gray-700 bg-gray-100/50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-300'
                    }`}
            >
                {label}: {current} / {max}
            </span>

            {/* Botón de upgrade (solo si está habilitado y límite alcanzado) */}
            {showUpgradeButton && (
                <button
                    onClick={onUpgradeClick}
                    className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#45d2fd] to-[#22b8d9] px-2 py-0.5 text-xs font-semibold text-gray-900 shadow-sm hover:opacity-90 transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-gray-900"
                    aria-label={`Upgrade to increase ${label} limit`}
                >
                    <SparklesIcon className="h-3 w-3" />
                    Upgrade
                </button>
            )}
        </div>
    );
}
