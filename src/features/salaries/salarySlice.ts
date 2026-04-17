import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { SalarySliceState, ComparisonFormValues } from './types';

const initialState: SalarySliceState = {
    selectedCountries: [],
    formValues: {},
    currentStep: 0,
};

const salarySlice = createSlice({
    name: 'salary',
    initialState,
    reducers: {
        addCountry(state, action: PayloadAction<string>) {
            if (!state.selectedCountries.includes(action.payload)) {
                state.selectedCountries.push(action.payload);
            }
        },
        setPrimaryCountry(state, action: PayloadAction<string>) {
            if (state.selectedCountries.length === 0) {
                state.selectedCountries.push(action.payload);
            } else {
                state.selectedCountries[0] = action.payload;
            }
        },
        removeCountry(state, action: PayloadAction<string>) {
            state.selectedCountries = state.selectedCountries.filter(
                (c) => c !== action.payload,
            );
        },
        setSelectedCountries(state, action: PayloadAction<string[]>) {
            state.selectedCountries = action.payload;
        },
        updateFormValue(
            state,
            action: PayloadAction<{ fieldId: string; value: string }>,
        ) {
            const { fieldId, value } = action.payload;
            (state.formValues as Record<string, string>)[fieldId] = value;
        },
        setFormValues(state, action: PayloadAction<ComparisonFormValues>) {
            state.formValues = action.payload;
        },
        setCurrentStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        resetComparison() {
            return initialState;
        },
    },
});

export const {
    addCountry,
    removeCountry,
    setPrimaryCountry,
    setSelectedCountries,
    updateFormValue,
    setFormValues,
    setCurrentStep,
    resetComparison,
} = salarySlice.actions;

// Selectores inline
export const selectSelectedCountries = (state: { salary: SalarySliceState }) =>
    state.salary.selectedCountries;
export const selectFormValues = (state: { salary: SalarySliceState }) =>
    state.salary.formValues;
export const selectCurrentStep = (state: { salary: SalarySliceState }) =>
    state.salary.currentStep;

export default salarySlice.reducer;
