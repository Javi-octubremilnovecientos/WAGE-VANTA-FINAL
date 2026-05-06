import { useEffect, useMemo, useRef } from 'react';
import type { SalaryRecord, BoxPlotData, ComparisonFormValues } from '@/features/salaries/types';
import { useComputeSalaryStats } from './useComputeSalaryStats';
import { useEnrichSalaryDataMutation } from '@/features/salaries/salaryApi';
import { mergeBoxPlots } from '@/features/salaries/salaryUtils';

/** Umbral de muestra escasa: por debajo de esto, disparamos el fallback de Gemini. */
const SCARCE_SAMPLE_THRESHOLD = 8;

interface UseEnrichedSalaryStatsResult {
    stats: BoxPlotData | null;
    isEnriching: boolean;
}

/**
 * Hook que computa BoxPlotData con fallback automático a Gemini cuando la
 * muestra de Supabase es escasa.
 *
 * Flujo:
 *   1. Calcula el BoxPlot a partir de los SalaryRecord[] de Supabase.
 *   2. Si records.length < 8, dispara la mutation `enrichSalaryData` que
 *      pide a Gemini un BoxPlot estimado para el mismo perfil.
 *   3. Fusiona ambos BoxPlots con `mergeBoxPlots` (si existe alguno) y
 *      devuelve el resultado.
 *
 * Si la mutation falla, se degrada elegantemente a los stats de Supabase
 * (que pueden ser null si la muestra estaba vacía).
 */
export function useEnrichedSalaryStats(
    records: SalaryRecord[] | undefined,
    country: string,
    formValues: ComparisonFormValues,
    color: string,
): UseEnrichedSalaryStatsResult {
    const sbStats = useComputeSalaryStats(records, country, color);

    const [enrich, { data: aiStats, isLoading: isEnriching, reset }] =
        useEnrichSalaryDataMutation();

    // Refs estables a las funciones de la mutation: RTK Query las recrea en cada
    // render, así que no las metemos en deps del useEffect (provocaría bucle).
    const enrichRef = useRef(enrich);
    const resetRef = useRef(reset);
    useEffect(() => { enrichRef.current = enrich; resetRef.current = reset; });

    // Última clave (country + formValues) para la que ya disparamos enrichment.
    // Evita re-llamar a Gemini cuando RTK Query re-emite el mismo `records`
    // como nueva referencia tras un refetch o invalidación de caché.
    const lastEnrichKeyRef = useRef<string | null>(null);

    const records_length = records?.length;
    const formValuesKey = useMemo(() => JSON.stringify(formValues), [formValues]);

    useEffect(() => {
        if (!country) {
            lastEnrichKeyRef.current = null;
            resetRef.current();
            return;
        }

        if (records_length === undefined) return;

        if (records_length < SCARCE_SAMPLE_THRESHOLD) {
            const key = `${country}|${formValuesKey}`;
            if (lastEnrichKeyRef.current === key) return;
            lastEnrichKeyRef.current = key;
            enrichRef.current({ country, formValues: JSON.parse(formValuesKey) });
        } else {
            lastEnrichKeyRef.current = null;
            resetRef.current();
        }
    }, [country, records_length, formValuesKey]);

    const stats = useMemo<BoxPlotData | null>(() => {
        if (!country) return null;
        if (records === undefined) return sbStats;

        if (records.length >= SCARCE_SAMPLE_THRESHOLD) {
            return sbStats;
        }

        // Muestra escasa: fusionar con el resultado de Gemini si ya llegó.
        // Si Gemini todavía no respondió (o falló), devolvemos lo que haya.
        const enrichedStats = aiStats
            ? { ...aiStats, category: country, color }
            : null;
        return mergeBoxPlots(sbStats, enrichedStats);
    }, [country, records, sbStats, aiStats, color]);

    return { stats, isEnriching };
}
