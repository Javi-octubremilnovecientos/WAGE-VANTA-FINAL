/**
 * JWT Authentication helper for Supabase Edge Functions
 *
 * Validates the Bearer token sent by the client and extracts the user ID.
 * Used by Edge Functions that need to verify the caller's identity before
 * performing privileged operations (e.g. avatar upload/delete).
 *
 * Relies on SUPABASE_URL and SUPABASE_ANON_KEY env vars that Supabase
 * injects automatically into every Edge Function at runtime.
 *
 * Also uses WAGE_VANTAGE_SERVICE_ROLE_KEY secret to make authenticated
 * requests to Supabase API endpoints.
 */

export interface AuthResult {
    userId: string;
    error?: never;
}

export interface AuthError {
    userId?: never;
    error: string;
    status: number;
}

/**
 * Extracts and verifies the Bearer JWT from the Authorization header.
 * Returns the authenticated user's ID or an error object.
 *
 * @param req - The incoming HTTP Request
 */
export async function verifyJwt(
    req: Request,
): Promise<AuthResult | AuthError> {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Missing or invalid Authorization header', status: 401 };
    }

    const token = authHeader.replace('Bearer ', '').trim();

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !anonKey) {
        return { error: 'Server misconfiguration: missing Supabase env vars', status: 500 };
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        headers: {
            Authorization: `Bearer ${token}`,
            apikey: anonKey,
        },
    });

    if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const message = (body as Record<string, string>).message ?? 'Unauthorized';
        return { error: message, status: response.status };
    }

    const user = await response.json() as { id: string };
    return { userId: user.id };
}
