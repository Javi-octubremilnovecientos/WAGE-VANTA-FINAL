import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { LockClosedIcon, EyeIcon, EyeSlashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useVerifyRecoveryTokenMutation, useResetPasswordWithTokenMutation } from '@/features/auth/authApi';

function PasswordRecovery() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Detectar tokens desde query params o hash fragment
    const { token, type } = useMemo(() => {
        // 1. Intentar desde query params (?access_token=xxx)
        const accessTokenFromQuery = searchParams.get('access_token');
        const tokenHashFromQuery = searchParams.get('token_hash') || searchParams.get('token');
        const typeFromQuery = searchParams.get('type');

        // 2. Intentar desde hash fragment (#access_token=xxx)
        const hash = window.location.hash.substring(1); // Quitar el #
        const hashParams = new URLSearchParams(hash);
        const accessTokenFromHash = hashParams.get('access_token');
        const tokenHashFromHash = hashParams.get('token_hash') || hashParams.get('token');
        const typeFromHash = hashParams.get('type');

        // Priorizar access_token sobre token_hash, y query params sobre hash
        const finalToken = accessTokenFromQuery || accessTokenFromHash || tokenHashFromQuery || tokenHashFromHash;
        const finalType = typeFromQuery || typeFromHash;

        return { token: finalToken, type: finalType };
    }, [searchParams]);

    const isValidToken = token && type === 'recovery';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [verifyRecoveryToken, { isLoading: isVerifying }] = useVerifyRecoveryTokenMutation();
    const [resetPasswordWithToken, { isLoading: isResetting }] = useResetPasswordWithTokenMutation();

    const isLoading = isVerifying || isResetting;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validaciones
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validar que tengamos el token
        if (!token || !type) {
            setError('Invalid recovery token');
            return;
        }

        try {
            // PASO 1: Verificar el token hash y obtener access_token
            const verifyResponse = await verifyRecoveryToken({ token, type }).unwrap();

            // PASO 2: Usar el access_token para actualizar la contraseña
            await resetPasswordWithToken({
                password,
                accessToken: verifyResponse.access_token,
            }).unwrap();

            // Mostrar éxito
            setSuccess(true);

            // Redirigir a home después de 3 segundos
            setTimeout(() => {
                navigate('/');
            }, 3000);
        } catch (err: unknown) {
            const error = err as { status?: number; data?: { message?: string; error_description?: string } };
            const errorMessage = error.data?.error_description || error.data?.message;

            if (error?.status === 403 || errorMessage?.includes('expired')) {
                setError('Recovery link has expired. Please request a new one.');
            } else if (errorMessage?.includes('Invalid') || errorMessage?.includes('invalid')) {
                setError('Invalid recovery link. Please request a new one.');
            } else {
                setError(errorMessage || 'Failed to reset password. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0B]">
            <div className="w-full max-w-md">
                {/* Card */}
                <div className="bg-[#0A0A0B] border border-white/10 rounded-xl shadow-2xl p-6">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex rounded-full bg-[#D84124]/20 p-3">
                            <LockClosedIcon className="h-8 w-8 text-[#D84124]" />
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-white text-center mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-sm text-[#96969F] text-center mb-6">
                        Enter your new password below
                    </p>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg flex items-start gap-2">
                            <XCircleIcon className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-400">{error}</p>
                        </div>
                    )}

                    {/* Success Message */}
                    {success ? (
                        <div className="py-8">
                            <div className="mb-4 p-4 bg-green-900/30 border border-green-700 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <CheckCircleIcon className="h-6 w-6 text-green-400 shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-green-400 mb-1">
                                            Password reset successful!
                                        </p>
                                        <p className="text-xs text-green-300">
                                            Redirecting you to the home page...
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : !isValidToken ? (
                        /* Invalid Token State */
                        <div className="py-4">
                            <p className="text-sm text-[#96969F] text-center mb-4">
                                The recovery link is invalid or has expired.
                            </p>
                            <Link
                                to="/"
                                className="block w-full text-center bg-brand-gradient text-white hover:opacity-90 font-semibold py-2 rounded-lg transition duration-200 text-sm"
                            >
                                Go to Home
                            </Link>
                        </div>
                    ) : (
                        /* Form */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* New Password */}
                            <div>
                                <label htmlFor="new-password" className="block text-xs font-medium text-white mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white placeholder-[#96969F] focus:border-[#D84124] focus:ring-1 focus:ring-[#D84124] focus:outline-none transition-colors text-sm pr-10"
                                        placeholder="Enter new password (min 6 characters)"
                                        required
                                        minLength={6}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96969F] hover:text-white transition-colors focus:outline-none"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirm-password" className="block text-xs font-medium text-white mb-1.5">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white placeholder-[#96969F] focus:border-[#D84124] focus:ring-1 focus:ring-[#D84124] focus:outline-none transition-colors text-sm pr-10"
                                        placeholder="Re-enter new password"
                                        required
                                        minLength={6}
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#96969F] hover:text-white transition-colors focus:outline-none"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                        tabIndex={-1}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="w-5 h-5" />
                                        ) : (
                                            <EyeIcon className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-brand-gradient text-white hover:opacity-90 font-semibold py-2.5 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-black text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                            >
                                {isLoading ? 'Resetting password...' : 'Reset Password'}
                            </button>

                            {/* Back to Home Link */}
                            <div className="text-center pt-2">
                                <Link
                                    to="/"
                                    className="text-xs text-[#96969F] hover:text-[#D84124] transition-colors"
                                >
                                    ← Back to Home
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PasswordRecovery;
