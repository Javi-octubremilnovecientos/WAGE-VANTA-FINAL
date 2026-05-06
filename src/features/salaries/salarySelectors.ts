import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { DYNAMIC_FIELDS_ORDER, STATIC_FIELDS, DYNAMIC_API_FIELDS } from './salaryConstants';
import type { FormFieldId } from './types';
import { getPlanLimits, getCurrentPlanType } from '@/lib/planLimits';

const selectSalary = (state: RootState) => state.salary;
const selectAuth = (state: RootState) => state.auth;

/** True cuando hay al menos 1 país seleccionado y algún campo del form con valor */
export const selectComparisonReady = createSelector(
    [selectSalary],
    (salary) => {
        const hasCountry = salary.selectedCountries.length >= 1;
        const hasValues = Object.values(salary.formValues).some(
            (v) => v !== undefined && v !== '',
        );
        return hasCountry && hasValues;
    },
);

/** Valida si se puede añadir otro país según el plan (GUEST: max 2, FREE: max 2, PREMIUM: max 3) */
export const selectCanAddCountry = createSelector(
    [selectSalary, selectAuth],
    (salary, auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return salary.selectedCountries.length < limits.maxCountries;
    },
);

/** Extrae Monthly Wage del form parseado a number (para línea referencial en chart) */
export const selectUserMonthlyWage = createSelector(
    [selectSalary],
    (salary) => {
        const raw = salary.formValues['Monthly Wage'];
        if (!raw) return null;
        const parsed = parseFloat(raw);
        return isNaN(parsed) ? null : parsed;
    },
);

/**
 * Determina si un campo específico está habilitado para interacción.
 * Un campo dinámico está habilitado si todos los campos previos en DYNAMIC_FIELDS_ORDER tienen valor.
 * Los campos estáticos siempre están habilitados.
 */
export const selectIsFieldEnabled = createSelector(
    [selectSalary, (_state: RootState, fieldId: FormFieldId) => fieldId],
    (salary, fieldId): boolean => {
        // Los campos estáticos siempre están habilitados
        if (STATIC_FIELDS.has(fieldId)) {
            return true;
        }

        // Para campos dinámicos, verificar que todos los campos previos tengan valor
        const fieldIndex = DYNAMIC_FIELDS_ORDER.indexOf(fieldId);
        if (fieldIndex === -1) {
            // Campo no está en el orden dinámico (ej: Monthly Wage, Company Size)
            return true;
        }

        // Verificar todos los campos anteriores
        for (let i = 0; i < fieldIndex; i++) {
            const prevFieldId = DYNAMIC_FIELDS_ORDER[i];
            const value = (salary.formValues as Record<string, string>)[prevFieldId];
            if (!value || value.trim() === '') {
                return false;
            }
        }

        return true;
    },
);

/**
 * Obtiene las opciones disponibles para un campo específico.
 * Para campos dinámicos, devuelve las opciones cargadas desde la API.
 * Para campos estáticos, devuelve un array vacío (las opciones vienen de formSteps).
 */
export const selectAvailableOptionsFor = createSelector(
    [selectSalary, (_state: RootState, fieldId: FormFieldId) => fieldId],
    (salary, fieldId): string[] => {
        if (!DYNAMIC_API_FIELDS.has(fieldId)) {
            return [];
        }
        return salary.availableOptions[fieldId] ?? [];
    },
);

/**
 * Obtiene el estado de carga para un campo específico.
 */
export const selectIsFieldLoading = createSelector(
    [selectSalary, (_state: RootState, fieldId: FormFieldId) => fieldId],
    (salary, fieldId): boolean => {
        return salary.loadingOptions[fieldId] ?? false;
    },
);

// ==========================================
// Plan Limits & Validation Selectors
// ==========================================

/**
 * Retorna el número máximo de países permitidos según el plan actual
 */
export const selectMaxCountries = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return limits.maxCountries;
    },
);

/**
 * Retorna el número máximo de templates permitidos según el plan actual
 */
export const selectMaxTemplates = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return limits.maxTemplates;
    },
);

/**
 * Retorna el número máximo de comparisons guardadas permitidas según el plan actual
 */
export const selectMaxComparisons = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return limits.maxComparisons;
    },
);

/**
 * Valida si el usuario puede guardar un nuevo template
 */
export const selectCanSaveTemplate = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        const currentCount = auth.user?.templates?.length ?? 0;
        return currentCount < limits.maxTemplates;
    },
);

/**
 * Valida si el usuario puede guardar una nueva comparison
 */
export const selectCanSaveComparison = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        const currentCount = auth.user?.comparisons?.length ?? 0;
        return currentCount < limits.maxComparisons;
    },
);

/**
 * Valida si el usuario puede exportar gráficos (solo Premium)
 */
export const selectCanExport = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return limits.canExport;
    },
);

/**
 * Valida si el usuario puede acceder a múltiples vistas de gráfico (solo Premium)
 */
export const selectCanAccessMultipleChartViews = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return limits.maxChartViews > 1;
    },
);

/**
 * Retorna el número de vistas de gráfico disponibles
 */
export const selectMaxChartViews = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return limits.maxChartViews;
    },
);

/**
 * Valida si el usuario puede acceder a datos precisos/detallados (solo Premium)
 */
export const selectCanAccessAccurateData = createSelector(
    [selectAuth],
    (auth) => {
        const limits = getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
        return limits.hasAccurateData;
    },
);

/**
 * Retorna el tipo de plan actual del usuario
 */
export const selectCurrentPlanType = createSelector(
    [selectAuth],
    (auth) => {
        return getCurrentPlanType(auth.isAuthenticated, auth.user?.premium ?? false);
    },
);

/**
 * Retorna todos los límites del plan actual en un objeto
 */
export const selectPlanLimits = createSelector(
    [selectAuth],
    (auth) => {
        return getPlanLimits(auth.isAuthenticated, auth.user?.premium ?? false);
    },
);

/**
 * Retorna los BoxPlotData computados persistidos en el slice de salarios.
 * Se persisten desde Home.tsx para que estén disponibles en ComparisonSheet.
 */
export const selectComputedStats = createSelector(
    [selectSalary],
    (salary) => salary.computedStats,
);
