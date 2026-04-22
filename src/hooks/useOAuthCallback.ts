import { useState, useEffect } from 'react';

/**
 * Hook para capturar y parsear tokens OAuth del URL hash
 * 
 * Supabase redirige después de OAuth exitoso con tokens en el hash:
 * #access_token=xxx&refresh_token=yyy&expires_in=3600&token_type=bearer
 * 
 * Si hay error:
 * #error=access_denied&error_description=User+cancelled+login
 * 
 * @returns {Object} - Tokens, error, y estado de loading
 */
export function useOAuthCallback() {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Solo ejecutar si hay hash en el URL
        if (!window.location.hash) {
            return;
        }

        setIsLoading(true);

        try {
            // Remover el '#' inicial y parsear parámetros
            const hash = window.location.hash.substring(1);
            const params = new URLSearchParams(hash);

            // Extraer tokens
            const token = params.get('access_token');
            const refresh = params.get('refresh_token');

            // Extraer errores
            const errorCode = params.get('error');
            const errorDesc = params.get('error_description');

            if (token && refresh) {
                // OAuth exitoso
                setAccessToken(token);
                setRefreshToken(refresh);
                setError(null);
                setErrorDescription(null);
            } else if (errorCode) {
                // OAuth con error
                setError(errorCode);
                setErrorDescription(errorDesc ? decodeURIComponent(errorDesc.replace(/\+/g, ' ')) : 'OAuth authentication failed');
                setAccessToken(null);
                setRefreshToken(null);
            }

            // Limpiar hash del URL sin recargar la página
            window.history.replaceState(
                null,
                '',
                window.location.pathname + window.location.search
            );
        } catch (err) {
            console.error('Error parsing OAuth callback:', err);
            setError('parse_error');
            setErrorDescription('Failed to parse OAuth callback parameters');
        } finally {
            setIsLoading(false);
        }
    }, []); // Solo ejecutar una vez al montar

    return {
        accessToken,
        refreshToken,
        error,
        errorDescription,
        isLoading,
    };
}
