/**
 * Edge Function: avatar-handler
 *
 * Proxy autenticado para operaciones de avatar en Supabase Storage.
 * Valida el JWT del usuario antes de operar y verifica que el userId
 * del path coincide con el del token (un usuario no puede subir/borrar
 * avatares de otro usuario).
 *
 * Deploy: supabase functions deploy avatar-handler
 *  (sin --no-verify-jwt: el JWT se verifica manualmente para extraer userId)
 *
 * Rutas:
 *   POST   /avatar-handler/{userId}/{filename}  — Sube un avatar
 *   DELETE /avatar-handler/{userId}/{filename}  — Elimina un avatar
 *
 * El body del POST debe ser el archivo binario (File/Blob) con el
 * Content-Type correcto (image/jpeg, image/png, image/webp).
 */

import { handleCors, corsHeaders } from '../_shared/cors.ts';
import { verifyJwt } from '../_shared/auth.ts';

const BUCKET_NAME = 'Avatars';

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    const corsResponse = handleCors(req);
    if (corsResponse) return corsResponse;

    // Verify JWT and extract userId
    const auth = await verifyJwt(req);
    if ('error' in auth) {
        return new Response(
            JSON.stringify({ error: auth.error }),
            { status: auth.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
    }

    const { userId: tokenUserId } = auth;

    // Parse path: /avatar-handler/{userId}/{filename}
    const url = new URL(req.url);
    // pathname: /avatar-handler/abc123/avatar_1234.jpg
    const pathParts = url.pathname.replace(/^\/avatar-handler\/?/, '').split('/');
    const pathUserId = pathParts[0];
    const filename = pathParts.slice(1).join('/');

    if (!pathUserId || !filename) {
        return new Response(
            JSON.stringify({ error: 'Missing userId or filename in path' }),
            { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
    }

    // Security check: user can only operate on their own avatar
    if (pathUserId !== tokenUserId) {
        return new Response(
            JSON.stringify({ error: 'Forbidden: userId mismatch' }),
            { status: 403, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
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

    const storageObjectPath = `${BUCKET_NAME}/${pathUserId}/${filename}`;
    const storageUrl = `${supabaseUrl}/storage/v1/object/${storageObjectPath}`;

    // ── POST: Upload avatar ────────────────────────────────────────────────────
    if (req.method === 'POST') {
        const contentType = req.headers.get('content-type') ?? 'application/octet-stream';
        const body = await req.arrayBuffer();

        const uploadResponse = await fetch(storageUrl, {
            method: 'POST',
            headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
                'Content-Type': contentType,
                'x-upsert': 'true', // Overwrite if exists (useful for re-uploads)
            },
            body,
        });

        if (!uploadResponse.ok) {
            const errorBody = await uploadResponse.text();
            console.error('[avatar-handler] Upload error:', uploadResponse.status, errorBody);
            return new Response(
                JSON.stringify({ error: 'Failed to upload avatar' }),
                { status: uploadResponse.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        const result = await uploadResponse.json() as { Key: string };
        return new Response(
            JSON.stringify({ path: result.Key ?? `${pathUserId}/${filename}` }),
            { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
        );
    }

    // ── DELETE: Remove avatar ──────────────────────────────────────────────────
    if (req.method === 'DELETE') {
        const deleteResponse = await fetch(storageUrl, {
            method: 'DELETE',
            headers: {
                apikey: serviceKey,
                Authorization: `Bearer ${serviceKey}`,
            },
        });

        if (!deleteResponse.ok) {
            const errorBody = await deleteResponse.text();
            console.error('[avatar-handler] Delete error:', deleteResponse.status, errorBody);
            return new Response(
                JSON.stringify({ error: 'Failed to delete avatar' }),
                { status: deleteResponse.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
            );
        }

        return new Response(null, {
            status: 204,
            headers: corsHeaders,
        });
    }

    return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } },
    );
});
