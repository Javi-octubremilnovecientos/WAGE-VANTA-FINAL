/**
 * Plan Limits and Constants
 * 
 * Centralizes all feature limits for different user plan types.
 * Used across the app to validate permissions and display upgrade prompts.
 * 
 * Plan Types:
 * - Guest: No authentication, can compare 2 countries (1 + 1 additional)
 * - Free: Logged in, can compare 2 countries + save 1 template/comparison
 * - Premium: Logged in with premium subscription, all features unlocked
 */

export type PlanType = 'guest' | 'free' | 'premium';

export interface PlanLimits {
    /** Maximum number of countries that can be compared simultaneously */
    maxCountries: number;
    /** Maximum number of templates that can be saved */
    maxTemplates: number;
    /** Maximum number of comparison sheets that can be saved */
    maxComparisons: number;
    /** Number of chart views available (1 = BoxPlot only, 3 = BoxPlot + Bar + Line) */
    maxChartViews: number;
    /** Whether export functionality (PDF, PNG, CSV) is enabled */
    canExport: boolean;
    /** Whether accurate/detailed salary data is available */
    hasAccurateData: boolean;
}

/**
 * Guest Plan Limits
 * - Not authenticated
 * - Can compare 2 countries (1 from FormLayout + 1 from CompareModal)
 * - Cannot save anything
 * - Basic visualization only
 */
export const GUEST_LIMITS: PlanLimits = {
    maxCountries: 2, // 1 desde FormLayout + 1 desde CompareModal
    maxTemplates: 0,
    maxComparisons: 0,
    maxChartViews: 1, // Solo BoxPlot
    canExport: false,
    hasAccurateData: false,
};

/**
 * Free Plan Limits
 * - Authenticated user with free plan
 * - Can compare up to 2 countries (1 from FormLayout + 1 from CompareModal)
 * - Limited saves
 * - Basic visualization
 */
export const FREE_LIMITS: PlanLimits = {
    maxCountries: 2, // 1 desde FormLayout + 1 desde CompareModal
    maxTemplates: 1,
    maxComparisons: 1,
    maxChartViews: 1, // Solo BoxPlot
    canExport: false,
    hasAccurateData: false,
};

/**
 * Premium Plan Limits
 * - Authenticated user with premium subscription
 * - All features unlocked
 * - Higher limits for saves
 * - Advanced visualizations and export
 */
export const PREMIUM_LIMITS: PlanLimits = {
    maxCountries: 3, // 1 desde FormLayout + 2 desde CompareModal
    maxTemplates: 4,
    maxComparisons: 4,
    maxChartViews: 3, // BoxPlot + Bar + Line
    canExport: true,
    hasAccurateData: true,
};

/**
 * Get plan limits based on authentication state and premium status
 * 
 * @param isAuthenticated - Whether the user is logged in
 * @param isPremium - Whether the user has a premium subscription
 * @returns PlanLimits object for the current user state
 */
export function getPlanLimits(
    isAuthenticated: boolean,
    isPremium: boolean,
): PlanLimits {
    if (!isAuthenticated) {
        return GUEST_LIMITS;
    }
    return isPremium ? PREMIUM_LIMITS : FREE_LIMITS;
}

/**
 * Get the current plan type based on authentication state
 * 
 * @param isAuthenticated - Whether the user is logged in
 * @param isPremium - Whether the user has a premium subscription
 * @returns Current plan type
 */
export function getCurrentPlanType(
    isAuthenticated: boolean,
    isPremium: boolean,
): PlanType {
    if (!isAuthenticated) {
        return 'guest';
    }
    return isPremium ? 'premium' : 'free';
}

/**
 * Helper to get user-friendly plan name
 * 
 * @param planType - The plan type
 * @returns Human-readable plan name
 */
export function getPlanName(planType: PlanType): string {
    switch (planType) {
        case 'guest':
            return 'Guest';
        case 'free':
            return 'Free Plan';
        case 'premium':
            return 'Premium Plan';
        default:
            return 'Unknown Plan';
    }
}
