import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';
import { DYNAMIC_FIELDS_ORDER, STATIC_FIELDS, DYNAMIC_API_FIELDS } from './salaryConstants';
import type { FormFieldId } from './types';

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

/** Valida si se puede añadir otro país según el plan (FREE: max 2, PREMIUM: max 3) */
export const selectCanAddCountry = createSelector(
    [selectSalary, selectAuth],
    (salary, auth) => {
        const max = auth.user?.premium ? 3 : 2;
        return salary.selectedCountries.length < max;
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

/**
 * Obtiene los IDs de campos que deben usarse como filtro para cargar opciones de un campo.
 * Devuelve todos los campos anteriores en DYNAMIC_FIELDS_ORDER que tengan valor.
 */
export const selectFilterFieldsFor = createSelector(
    [selectSalary, (_state: RootState, fieldId: FormFieldId) => fieldId],
    (salary, fieldId): FormFieldId[] => {
        const fieldIndex = DYNAMIC_FIELDS_ORDER.indexOf(fieldId);
        if (fieldIndex <= 0) {
            return [];
        }

        const filterFields: FormFieldId[] = [];
        for (let i = 0; i < fieldIndex; i++) {
            const prevFieldId = DYNAMIC_FIELDS_ORDER[i];
            const value = (salary.formValues as Record<string, string>)[prevFieldId];
            if (value && value.trim() !== '') {
                filterFields.push(prevFieldId);
            }
        }

        return filterFields;
    },
);
