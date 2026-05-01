/**
 * Edge Function: get-salary-data
 *
 * Proxy server-side para consultar TABLE_0 en Supabase REST.
 * El cliente envía los parámetros de filtro; esta función construye
 * la query PostgREST y la ejecuta con la service_role key, ocultando
 * el nombre real de la tabla y la clave privada del bundle del cliente.
 *
 * Deploy: supabase functions deploy get-salary-data --no-verify-jwt
 *
 * Query params esperados:
 *   - country     (string, required)  — País a filtrar
 *   - formValues  (JSON string, optional) — Valores del formulario { [fieldId]: value }
 *
 * Respuesta: SalaryRecord[] (JSON array)
 */

import { handleCors, corsHeaders } from '../_shared/cors.ts';

// ── Constantes internas (nunca expuestas al cliente) ───────────────────────────

const TABLE_NAME = 'TABLE_0';

const SELECT_COLUMNS = [
    'Country',
    'Gender',
    'Occupation',
    'Occupation Level',
    'Economic Activity',
    'Education Level',
    'Monthly Wage',
    'Year',
];

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

// ── Helper: construye query PostgREST ─────────────────────────────────────────

function buildParams(
    country: string,
    formValues: Record<string, string>,
    selectColumns: string[],
): URLSearchParams {
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

    params.append('select', selectColumns.join(','));
    return params;
}

// ── Handler principal ─────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    try {
        const url = new URL(req.url);
        const country = url.searchParams.get('country') ?? '';
        const formValuesRaw = url.searchParams.get('formValues') ?? '{}';

        // Validate country
        if (!country || !VALID_COUNTRIES.has(country)) {
            return new Response(
                JSON.stringify({ error: `Invalid or missing country: "${country}"` }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        // Parse formValues safely
        let formValues: Record<string, string> = {};
        try {
            formValues = JSON.parse(formValuesRaw);
        } catch {
            return new Response(
                JSON.stringify({ error: 'Invalid formValues JSON' }),
                { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const serviceKey = Deno.env.get('WAGE_VANTAGE_SERVICE_ROLE_KEY');

        if (!supabaseUrl || !serviceKey) {
            return new Response(
                JSON.stringify({ error: 'Server misconfiguration' }),
                { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const queryParams = buildParams(country, formValues, SELECT_COLUMNS);
        const apiUrl = `${supabaseUrl}/rest/v1/${TABLE_NAME}?${queryParams.toString()}`;

        const response = await fetch(apiUrl, {
            headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
                Accept: 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('[get-salary-data] Upstream error:', response.status, errorBody);
            return new Response(
                JSON.stringify({ error: 'Failed to fetch salary data' }),
                { status: response.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    } catch (err) {
        console.error('[get-salary-data] Unexpected error:', err);
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
    }
});
