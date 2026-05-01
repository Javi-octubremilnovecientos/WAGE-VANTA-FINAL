/**
 * CORS headers for Supabase Edge Functions
 *
 * Uses the exact pattern recommended in Supabase official documentation.
 * Static '*' origin is safe for Edge Functions since auth is handled
 * via the apikey/Authorization headers, not cookies.
 */

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function handleCors(req: Request): Response | null {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }
    return null;
}

