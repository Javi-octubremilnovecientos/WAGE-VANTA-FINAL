import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  SalarySliceState,
  ComparisonFormValues,
  FormFieldId,
  ChartViewMode,
  BoxPlotData,
} from "./types";
import { DYNAMIC_FIELDS_ORDER } from "./salaryConstants";

const initialState: SalarySliceState = {
  selectedCountries: [],
  formValues: {},
  currentStep: 0,
  availableOptions: {},
  loadingOptions: {},
  chartViewMode: "boxplot", // Vista por defecto
  computedStats: [],
};

const salarySlice = createSlice({
  name: "salary",
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
    /** Establece las opciones disponibles para un campo específico */
    setAvailableOptions(
      state,
      action: PayloadAction<{ fieldId: string; options: string[] }>,
    ) {
      const { fieldId, options } = action.payload;
      state.availableOptions[fieldId] = options;
    },
    /** Establece el estado de carga de opciones para un campo */
    setLoadingOptions(
      state,
      action: PayloadAction<{ fieldId: string; loading: boolean }>,
    ) {
      const { fieldId, loading } = action.payload;
      state.loadingOptions[fieldId] = loading;
    },
    /**
     * Limpia los valores y opciones de todos los campos posteriores a fromFieldId.
     * Se usa cuando el usuario cambia un campo que afecta las opciones downstream.
     */
    clearDownstreamData(state, action: PayloadAction<FormFieldId>) {
      const fromFieldId = action.payload;
      const fieldIndex = DYNAMIC_FIELDS_ORDER.indexOf(fromFieldId);

      if (fieldIndex === -1) return;

      // Limpiar todos los campos posteriores
      for (let i = fieldIndex + 1; i < DYNAMIC_FIELDS_ORDER.length; i++) {
        const fieldId = DYNAMIC_FIELDS_ORDER[i];
        delete (state.formValues as Record<string, string>)[fieldId];
        delete state.availableOptions[fieldId];
        delete state.loadingOptions[fieldId];
      }
    },
    /** Establece la vista de gráfico actual (solo accesible para usuarios Premium con múltiples vistas) */
    setChartViewMode(state, action: PayloadAction<ChartViewMode>) {
      state.chartViewMode = action.payload;
    },
    /** Persiste los BoxPlotData computados para uso en ComparisonSheet */
    setComputedStats(state, action: PayloadAction<BoxPlotData[]>) {
      state.computedStats = action.payload;
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
  setAvailableOptions,
  setLoadingOptions,
  clearDownstreamData,
  setChartViewMode,
  setComputedStats,
} = salarySlice.actions;

// Selectores inline básicos
export const selectSelectedCountries = (state: { salary: SalarySliceState }) =>
  state.salary.selectedCountries;
export const selectFormValues = (state: { salary: SalarySliceState }) =>
  state.salary.formValues;
export const selectCurrentStep = (state: { salary: SalarySliceState }) =>
  state.salary.currentStep;
export const selectChartViewMode = (state: { salary: SalarySliceState }) =>
  state.salary.chartViewMode;

export default salarySlice.reducer;
