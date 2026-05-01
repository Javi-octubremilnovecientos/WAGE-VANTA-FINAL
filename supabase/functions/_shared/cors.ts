/**
 * CORS headers for Supabase Edge Functions
 *
 * All Edge Functions must respond to OPTIONS preflight requests and include
 * these headers on every response so the browser allows cross-origin requests.
 *
 * ALLOWED_ORIGINS is read from the ALLOWED_ORIGINS secret in Supabase.
 * If not set, it falls back to '*' (suitable for development only).
 * For production set the secret to your actual domain, e.g.:
 *   supabase secrets set --env-file .env.local ALLOWED_ORIGINS=https://wagevantage.com
 */

function resolveOrigin(requestOrigin: string | null): string {
    const allowed = Deno.env.get('ALLOWED_ORIGINS') ?? '*';

    if (allowed === '*') return '*';

    const origins = allowed.split(',').map((o) => o.trim());
    if (requestOrigin && origins.includes(requestOrigin)) {
        return requestOrigin;
    }
    // Fallback to first allowed origin if request origin doesn't match
    return origins[0];
}

export function corsHeaders(requestOrigin: string | null = null): HeadersInit {
    return {
        'Access-Control-Allow-Origin': resolveOrigin(requestOrigin),
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers':
            'authorization, x-client-info, apikey, content-type',
    };
}

/**
 * Handles preflight OPTIONS requests.
 * Call at the top of every Edge Function handler.
 */
export function handleCors(req: Request): Response | null {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: corsHeaders(req.headers.get('origin')),
        });
    }
    return null;
}
