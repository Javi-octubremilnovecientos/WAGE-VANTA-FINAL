import { useAppSelector } from './useRedux';
import {
    selectCanAddCountry,
    selectCanSaveTemplate,
    selectCanSaveComparison,
    selectCanExport,
    selectCanAccessMultipleChartViews,
    selectCanAccessAccurateData,
    selectMaxCountries,
    selectMaxTemplates,
    selectMaxComparisons,
    selectMaxChartViews,
    selectCurrentPlanType,
    selectPlanLimits,
} from '@/features/salaries/salarySelectors';
import {
    selectIsAuthenticated,
    selectUserPremium,
    selectUserTemplates,
    selectUserComparisons,
} from '@/features/auth/authSlice';

/**
 * Hook unificado para acceder a todas las validaciones y límites de planes.
 * 
 * Simplifica el acceso a los selectores de validación de features premium/free
 * y proporciona una API consistente para verificar permisos del usuario.
 * 
 * @returns Objeto con todas las validaciones y límites del plan actual
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { canSaveTemplate, maxTemplates, isPremium } = usePlanLimits();
 *   
 *   return (
 *     <button disabled={!canSaveTemplate}>
 *       Save Template ({templates.length}/{maxTemplates})
 *     </button>
 *   );
 * }
 * ```
 */
export function usePlanLimits() {
    // Selectores de autenticación
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isPremium = useAppSelector(selectUserPremium);
    const templates = useAppSelector(selectUserTemplates);
    const comparisons = useAppSelector(selectUserComparisons);

    // Selectores de validación (can*)
    const canAddCountry = useAppSelector(selectCanAddCountry);
    const canSaveTemplate = useAppSelector(selectCanSaveTemplate);
    const canSaveComparison = useAppSelector(selectCanSaveComparison);
    const canExport = useAppSelector(selectCanExport);
    const canAccessMultipleChartViews = useAppSelector(selectCanAccessMultipleChartViews);
    const canAccessAccurateData = useAppSelector(selectCanAccessAccurateData);

    // Selectores de límites máximos
    const maxCountries = useAppSelector(selectMaxCountries);
    const maxTemplates = useAppSelector(selectMaxTemplates);
    const maxComparisons = useAppSelector(selectMaxComparisons);
    const maxChartViews = useAppSelector(selectMaxChartViews);

    // Plan actual
    const currentPlan = useAppSelector(selectCurrentPlanType);
    const planLimits = useAppSelector(selectPlanLimits);

    // Contadores actuales
    const currentTemplatesCount = templates.length;
    const currentComparisonsCount = comparisons.length;

    return {
        // Estados de autenticación
        isAuthenticated,
        isPremium,

        // Validaciones de features (booleanos)
        canAddCountry,
        canSaveTemplate,
        canSaveComparison,
        canExport,
        canAccessMultipleChartViews,
        canAccessAccurateData,

        // Límites máximos
        maxCountries,
        maxTemplates,
        maxComparisons,
        maxChartViews,

        // Contadores actuales
        currentTemplatesCount,
        currentComparisonsCount,

        // Información del plan
        currentPlan,
        planLimits,

        // Helper: ¿Es guest?
        isGuest: !isAuthenticated,

        // Helper: ¿Es free?
        isFree: isAuthenticated && !isPremium,
    };
}
