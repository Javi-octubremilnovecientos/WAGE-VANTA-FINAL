/**
 * Hook para cargar opciones dinámicas de ComboBox desde la API.
 *
 * Este hook orquesta la carga progresiva de opciones para campos dinámicos
 * del formulario de comparación salarial. Las opciones se filtran según
 * los valores seleccionados en campos anteriores.
 *
 * @example
 * ```tsx
 * const { options, isLoading, isEnabled } = useDynamicOptions('Economic Activity');
 * ```
 */

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from './useRedux';
import { useGetFilteredOptionsQuery } from '@/features/salaries/salaryApi';
import {
    selectFormValues,
    setAvailableOptions,
    setLoadingOptions,
} from '@/features/salaries/salarySlice';
import {
    selectIsFieldEnabled,
    selectAvailableOptionsFor,
    selectIsFieldLoading,
} from '@/features/salaries/salarySelectors';
import { extractUniqueOptions } from '@/features/salaries/salaryUtils';
import {
    DYNAMIC_FIELDS_ORDER,
    DYNAMIC_API_FIELDS,
} from '@/features/salaries/salaryConstants';
import type { FormFieldId, ComparisonFormValues, SalaryRecord } from '@/features/salaries/types';

export interface UseDynamicOptionsResult {
    /** Opciones disponibles para el campo (strings) */
    options: string[];
    /** True si se están cargando las opciones desde la API */
    isLoading: boolean;
    /** True si el campo está habilitado para interacción */
    isEnabled: boolean;
    /** Error de la API, si existe */
    error: string | null;
}

/**
 * Hook que gestiona la carga dinámica de opciones para un campo específico.
 *
 * @param fieldId - ID del campo del formulario
 * @returns Objeto con opciones, estado de carga y habilitación
 */
export function useDynamicOptions(fieldId: FormFieldId): UseDynamicOptionsResult {
    const dispatch = useAppDispatch();
    const formValues = useAppSelector(selectFormValues);
    const isEnabled = useAppSelector((state) => selectIsFieldEnabled(state, fieldId));
    const cachedOptions = useAppSelector((state) => selectAvailableOptionsFor(state, fieldId));
    const isLoadingFromStore = useAppSelector((state) => selectIsFieldLoading(state, fieldId));

    // Determinar si este campo necesita carga dinámica
    const isDynamicField = DYNAMIC_API_FIELDS.has(fieldId);

    // Construir los valores de filtro para la query (solo campos previos con valor)
    const filterValues = useMemo(() => {
        if (!isDynamicField || !isEnabled) {
            return null;
        }

        const fieldIndex = DYNAMIC_FIELDS_ORDER.indexOf(fieldId);
        if (fieldIndex <= 0) {
            return null;
        }

        const values: ComparisonFormValues = {};
        for (let i = 0; i < fieldIndex; i++) {
            const prevFieldId = DYNAMIC_FIELDS_ORDER[i];
            const value = (formValues as Record<string, string>)[prevFieldId];
            if (value && value.trim() !== '') {
                (values as Record<string, string>)[prevFieldId] = value;
            }
        }

        // Verificar que tengamos Country como mínimo
        if (!values.Country) {
            return null;
        }

        return values;
    }, [fieldId, formValues, isDynamicField, isEnabled]);

    // Determinar las columnas objetivo para la query
    const targetFields = useMemo(() => {
        // Solo necesitamos la columna del campo actual
        return [fieldId];
    }, [fieldId]);

    // Ejecutar la query solo si es un campo dinámico y está habilitado
    const shouldSkip = !isDynamicField || !isEnabled || !filterValues;

    const {
        data: records,
        isLoading: isQueryLoading,
        isFetching,
        error: queryError,
    } = useGetFilteredOptionsQuery(
        {
            country: filterValues?.Country ?? '',
            formValues: filterValues ?? {},
            targetFields,
        },
        { skip: shouldSkip },
    );

    // Extraer opciones únicas de los registros y actualizar el store
    useEffect(() => {
        if (shouldSkip) return;

        // Indicar que estamos cargando
        if (isQueryLoading || isFetching) {
            dispatch(setLoadingOptions({ fieldId, loading: true }));
            return;
        }

        // Extraer opciones únicas de los registros
        if (records && records.length > 0) {
            const uniqueOptions = extractUniqueOptions(
                records as SalaryRecord[],
                fieldId as keyof SalaryRecord,
            );
            dispatch(setAvailableOptions({ fieldId, options: uniqueOptions }));
        } else {
            dispatch(setAvailableOptions({ fieldId, options: [] }));
        }

        dispatch(setLoadingOptions({ fieldId, loading: false }));
    }, [records, isQueryLoading, isFetching, fieldId, dispatch, shouldSkip]);

    // Determinar el estado final
    const isLoading = isDynamicField && (isQueryLoading || isFetching || isLoadingFromStore);
    const options = isDynamicField ? cachedOptions : [];
    const error = queryError ? 'Error al cargar opciones' : null;

    return {
        options,
        isLoading,
        isEnabled,
        error,
    };
}

export default useDynamicOptions;
