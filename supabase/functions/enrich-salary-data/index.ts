/**
 * Edge Function: enrich-salary-data
 *
 * Fallback de datos salariales cuando TABLE_0 devuelve una muestra escasa
 * (< 8 registros). Llama a la API de Gemini con prompt engineering para
 * que investigue datos salariales realistas basándose en los formValues
 * del usuario, y devuelve un BoxPlotData ya calculado (q1, median, q3,
 * min, max) listo para fusionarse con el BoxPlot de Supabase.
 *
 * Deploy: supabase functions deploy enrich-salary-data --no-verify-jwt
 * Secret:  supabase secrets set WAGE_VANTAGE_GEMINI_API_KEY=<key>
 *
 * Body esperado (POST, JSON):
 *   - country     (string, required) — País a investigar
 *   - formValues  (object, optional) — Valores del formulario { [fieldId]: value }
 *
 * Respuesta: BoxPlotData (JSON)
 */

import { handleCors, corsHeaders } from '../_shared/cors.ts';

const GEMINI_MODEL = 'gemini-3-flash-preview';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const VALID_COUNTRIES = new Set([
    'Belgium', 'Bulgaria', 'Cyprus', 'Denmark', 'France',
    'Greece', 'Italy', 'Netherlands', 'Portugal', 'Spain', 'United Kingdom',
]);

const RESPONSE_SCHEMA = {
    type: 'object',
    properties: {
        min: { type: 'number' },
        q1: { type: 'number' },
        median: { type: 'number' },
        q3: { type: 'number' },
        max: { type: 'number' },
    },
    required: ['min', 'q1', 'median', 'q3', 'max'],
};

interface BoxPlotPercentiles {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
}

function buildPrompt(country: string, formValues: Record<string, string>): string {
    const criteria = [
        `Country: ${country}`,
        `Gender: ${formValues['Gender'] ?? 'any'}`,
        `Occupation: ${formValues['Occupation'] ?? 'any'}`,
        `Occupation Level: ${formValues['Occupation Level'] ?? 'any'}`,
        `Economic Activity: ${formValues['Economic Activity'] ?? 'any'}`,
        `Education Level: ${formValues['Education Level'] ?? 'any'}`,
        `Years of Experience: ${formValues['Years Of Experience'] ?? 'any'}`,
        `Company Size: ${formValues['Company Size'] ?? 'any'}`,
    ].join('\n- ');

    return [
        'You are a salary research assistant with access to public salary data sources,',
        'government statistics, Eurostat,ILOSTAT, OECD reports, and industry compensation surveys',
        'from 2024-2025.',
        '',
        'Based on the following profile, estimate a realistic monthly GROSS wage distribution',
        `in EUR for matching workers in ${country}. Always respect local market conditions,`,
        'cost of living, and regulatory minimum wages.',
        '',
        `Profile:\n- ${criteria}`,
        '',
        'Return five percentile values that describe the wage distribution:',
        '- min:    realistic low end (5th percentile)',
        '- q1:     25th percentile',
        '- median: 50th percentile',
        '- q3:     75th percentile',
        '- max:    realistic high end (95th percentile)',
        '',
        'All values must be in EUR (monthly, gross), positive, and strictly increasing',
        '(min < q1 < median < q3 < max). Sensible range: 200 to 50000.',
    ].join('\n');
}

function isValidPercentiles(p: unknown): p is BoxPlotPercentiles {
    if (!p || typeof p !== 'object') return false;
    const o = p as Record<string, unknown>;
    const keys = ['min', 'q1', 'median', 'q3', 'max'] as const;
    for (const k of keys) {
        if (typeof o[k] !== 'number' || !Number.isFinite(o[k] as number)) return false;
    }
    const { min, q1, median, q3, max } = o as BoxPlotPercentiles;
    if (min < 0 || max > 100000) return false;
    return min <= q1 && q1 <= median && median <= q3 && q3 <= max;
}

Deno.serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ error: 'Method not allowed' }),
            { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
    }

    try {
        let body: { country?: string; formValues?: Record<string, string> };
        try {
            body = await req.json();
        } catch {
            return new Response(
                JSON.stringify({ error: 'Invalid JSON body' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const country = body.country ?? '';
        const formValues = body.formValues ?? {};

        if (!country || !VALID_COUNTRIES.has(country)) {
            return new Response(
                JSON.stringify({ error: `Invalid or missing country: "${country}"` }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const geminiKey = Deno.env.get('WAGE_VANTAGE_GEMINI_API_KEY');
        if (!geminiKey) {
            console.error('[enrich-salary-data] Missing WAGE_VANTAGE_GEMINI_API_KEY');
            return new Response(
                JSON.stringify({ error: 'Server misconfiguration' }),
                { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const prompt = buildPrompt(country, formValues);

        const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: RESPONSE_SCHEMA,
                },
            }),
        });

        if (!geminiResponse.ok) {
            const errorBody = await geminiResponse.text();
            console.error('[enrich-salary-data] Gemini error:', geminiResponse.status, errorBody);
            return new Response(
                JSON.stringify({ error: 'Failed to fetch enrichment data' }),
                { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const geminiJson = await geminiResponse.json();
        const text: string | undefined = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error('[enrich-salary-data] Empty Gemini response:', geminiJson);
            return new Response(
                JSON.stringify({ error: 'Empty response from enrichment service' }),
                { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        let percentiles: unknown;
        try {
            percentiles = JSON.parse(text);
        } catch {
            console.error('[enrich-salary-data] Non-JSON Gemini text:', text);
            return new Response(
                JSON.stringify({ error: 'Malformed enrichment response' }),
                { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        if (!isValidPercentiles(percentiles)) {
            console.error('[enrich-salary-data] Invalid percentiles:', percentiles);
            return new Response(
                JSON.stringify({ error: 'Invalid enrichment percentiles' }),
                { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const boxPlot = {
            category: country,
            min: percentiles.min,
            q1: percentiles.q1,
            median: percentiles.median,
            q3: percentiles.q3,
            max: percentiles.max,
        };

        return new Response(JSON.stringify(boxPlot), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (err) {
        console.error('[enrich-salary-data] Unexpected error:', err);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
    }
});
