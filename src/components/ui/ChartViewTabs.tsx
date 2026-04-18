import { ChartBarIcon, ChartBarSquareIcon, PresentationChartLineIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import type { ChartViewMode } from '@/features/salaries/types';

interface ChartViewTabsProps {
    /** Vista de gráfico actualmente seleccionada */
    activeView: ChartViewMode;
    /** Callback al cambiar de vista */
    onViewChange: (view: ChartViewMode) => void;
    /** Vistas disponibles según el plan del usuario */
    availableViews: ChartViewMode[];
    /** Si el usuario tiene plan Premium (para mostrar locks en tabs deshabilitados) */
    isPremium: boolean;
    /** Callback al hacer click en una vista bloqueada (para mostrar upgrade modal) */
    onUpgradeRequired?: () => void;
}

const VIEW_CONFIG: Record<ChartViewMode, { label: string; icon: typeof ChartBarSquareIcon }> = {
    boxplot: {
        label: 'Box Plot',
        icon: ChartBarSquareIcon,
    },
    bar: {
        label: 'Bar Chart',
        icon: ChartBarIcon,
    },
    line: {
        label: 'Line Chart',
        icon: PresentationChartLineIcon,
    },
};

/**
 * Componente de tabs para alternar entre diferentes vistas de gráfico.
 * 
 * - Muestra tabs activos para vistas disponibles según el plan
 * - Muestra tabs bloqueados con candado para vistas Premium (si no es Premium)
 * - Al hacer click en tab bloqueado, dispara callback de upgrade
 * 
 * @example
 * ```tsx
 * <ChartViewTabs
 *   activeView={chartViewMode}
 *   onViewChange={(view) => dispatch(setChartViewMode(view))}
 *   availableViews={isPremium ? ['boxplot', 'bar', 'line'] : ['boxplot']}
 *   isPremium={isPremium}
 *   onUpgradeRequired={() => setUpgradeModalOpen(true)}
 * />
 * ```
 */
export default function ChartViewTabs({
    activeView,
    onViewChange,
    availableViews,
    onUpgradeRequired,
}: ChartViewTabsProps) {
    const allViews: ChartViewMode[] = ['boxplot', 'bar', 'line'];

    return (
        <div className="flex items-center gap-1 rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur p-1">
            {allViews.map((view) => {
                const isAvailable = availableViews.includes(view);
                const isActive = view === activeView;
                const config = VIEW_CONFIG[view];
                const Icon = config.icon;

                const handleClick = () => {
                    if (isAvailable) {
                        onViewChange(view);
                    } else if (onUpgradeRequired) {
                        onUpgradeRequired();
                    }
                };

                return (
                    <button
                        key={view}
                        onClick={handleClick}
                        disabled={!isAvailable && !onUpgradeRequired}
                        className={`
                            relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all
                            ${isActive && isAvailable
                                ? 'bg-[#45d2fd] text-gray-900 shadow-sm'
                                : isAvailable
                                    ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                    : 'text-gray-500 cursor-pointer hover:text-gray-400'
                            }
                            disabled:cursor-not-allowed disabled:opacity-50
                            focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-gray-900
                        `}
                        aria-label={`Switch to ${config.label} view${!isAvailable ? ' (Premium feature)' : ''}`}
                        aria-current={isActive ? 'true' : undefined}
                    >
                        <Icon className="h-4 w-4" />
                        <span>{config.label}</span>

                        {/* Lock icon para vistas bloqueadas */}
                        {!isAvailable && (
                            <LockClosedIcon className="h-3 w-3 ml-0.5" aria-hidden="true" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
