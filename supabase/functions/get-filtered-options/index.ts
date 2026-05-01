/**
 * Edge Function: get-filtered-options
 *
 * Proxy server-side para consultar opciones dinámicas de combobox desde TABLE_0.
 * Similar a get-salary-data pero solo devuelve las columnas especificadas en
 * targetFields para minimizar el payload y alimentar los ComboBox del formulario.
 *
 * Deploy: supabase functions deploy get-filtered-options --no-verify-jwt
 *
 * Query params esperados:
 *   - country       (string, required)   — País a filtrar
 *   - formValues    (JSON string, optional) — Filtros activos del formulario
 *   - targetFields  (JSON string, required) — Columnas a devolver, ej: ["Occupation"]
 *
 * Respuesta: Array parcial de SalaryRecord (solo las columnas solicitadas)
 */

import { handleCors, corsHeaders } from '../_shared/cors.ts';

// ── Constantes internas ────────────────────────────────────────────────────────

const TABLE_NAME = 'TABLE_0';

const EQ_FIELDS = new Set(['Gender']);

const ILIKE_FIELDS = new Set([
    'Occupation',
    'Occupation Level',
    'Economic Activity',
    'Education Level',
]);

const EXCLUDED_FIELDS = new Set([
    'Country',
    'Monthly Wage',
    'Years Of Experience',
    'Company Size',
]);

const VALID_COUNTRIES = new Set([
    'Belgium', 'Bulgaria', 'Cyprus', 'Denmark', 'France',
    'Greece', 'Italy', 'Netherlands', 'Portugal', 'Spain', 'United Kingdom',
]);

// Columnas permitidas para evitar inyección de nombres de columna arbitrarios
const ALLOWED_COLUMNS = new Set([
    'Country', 'Gender', 'Occupation', 'Occupation Level',
    'Economic Activity', 'Education Level', 'Monthly Wage', 'Year',
]);

// ── Handler principal ─────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    const origin = req.headers.get('origin');

    try {
        const url = new URL(req.url);
        const country = url.searchParams.get('country') ?? '';
        const formValuesRaw = url.searchParams.get('formValues') ?? '{}';
        const targetFieldsRaw = url.searchParams.get('targetFields') ?? '[]';

        if (!country || !VALID_COUNTRIES.has(country)) {
            return new Response(
                JSON.stringify({ error: `Invalid or missing country: "${country}"` }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } },
            );
        }

        let formValues: Record<string, string> = {};
        let targetFields: string[] = [];

        try {
            formValues = JSON.parse(formValuesRaw);
            targetFields = JSON.parse(targetFieldsRaw);
        } catch {
            return new Response(
                JSON.stringify({ error: 'Invalid JSON in formValues or targetFields' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } },
            );
        }

        // Validate targetFields to prevent column injection
        const safeTargetFields = targetFields.filter((f) => ALLOWED_COLUMNS.has(f));
        if (safeTargetFields.length === 0) {
            return new Response(
                JSON.stringify({ error: 'No valid targetFields provided' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } },
            );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceKey = Deno.env.get('WAGE_VANTAGE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceKey) {
            return new Response(
                JSON.stringify({ error: 'Server misconfiguration' }),
                { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } },
            );
        }

        // Build PostgREST query
        const params = new URLSearchParams();
        params.append('Country', `eq.${country}`);

        for (const [fieldId, value] of Object.entries(formValues)) {
            if (!value || EXCLUDED_FIELDS.has(fieldId)) continue;

            if (EQ_FIELDS.has(fieldId)) {
                params.append(fieldId, `eq.${value}`);
            } else if (ILIKE_FIELDS.has(fieldId)) {
                const truncated = value.slice(0, 19);
                params.append(fieldId, `ilike.*${truncated}*`);
            }
        }

        params.append('select', safeTargetFields.join(','));

        const apiUrl = `${supabaseUrl}/rest/v1/${TABLE_NAME}?${params.toString()}`;

        const response = await fetch(apiUrl, {
            headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('[get-filtered-options] Upstream error:', response.status, errorBody);
            return new Response(
                JSON.stringify({ error: 'Failed to fetch filtered options' }),
                { status: response.status, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } },
            );
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
        });
    } catch (err) {
        console.error('[get-filtered-options] Unexpected error:', err);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } },
        );
    }
});
