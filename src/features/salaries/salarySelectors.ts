import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/core/store';

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

/** Extrae monthlyWage del form parseado a number (para línea referencial en chart) */
export const selectUserMonthlyWage = createSelector(
    [selectSalary],
    (salary) => {
        const raw = salary.formValues.monthlyWage;
        if (!raw) return null;
        const parsed = parseFloat(raw);
        return isNaN(parsed) ? null : parsed;
    },
);
