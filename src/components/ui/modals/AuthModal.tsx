import { type ReactNode, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/20/solid';
import { Google, Github } from '../../../assets/icons/Solidicons';
import { useSignInMutation, useSignUpMutation, useSendResetEmailMutation, mapSupabaseResponseToUser, buildOAuthUrl } from '@/features/auth/authApi';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
    setCredentials,
    setRememberMe as setRememberMeAction,
    selectRememberMe,
    selectSavedEmail,
} from '@/features/auth/authSlice';
import { createDefaultUserData } from '@/lib/User';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function BaseModal({ isOpen, onClose, children }: BaseModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-[#121213] rounded-xl shadow-2xl max-w-md w-full border border-white/10">
                {children}
            </div>
        </div>
    );
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'login' | 'signup' | 'recovery';
    onSwitchMode?: (mode: 'login' | 'signup' | 'recovery') => void;
    initialError?: string | null; // Error inicial (ej: de OAuth callback)
}

function AuthModal({ isOpen, onClose, mode, onSwitchMode, initialError }: AuthModalProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // Leer preferencias guardadas desde Redux (persistido por redux-persist)
    const storedRememberMe = useAppSelector(selectRememberMe);
    const storedEmail = useAppSelector(selectSavedEmail);

    const [email, setEmail] = useState(
        mode === 'login' && storedRememberMe && storedEmail ? storedEmail : ''
    );
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(
        mode === 'login' ? storedRememberMe : false
    );

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [formError, setFormError] = useState<string | null>(initialError || null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
    const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();
    const [sendResetEmail, { isLoading: isSendingReset }] = useSendResetEmailMutation();

    const isLoading = isSigningIn || isSigningUp || isSendingReset;

    // Error a mostrar: priorizar initialError (OAuth) sobre formError (validación)
    const displayError = initialError || formError;

    // Sincronizar state local con Redux cuando se abre el modal o cambia el modo
    useEffect(() => {
        if (isOpen && mode === 'login') {
            // Cargar credenciales guardadas si Remember Me está activo
            if (storedRememberMe && storedEmail) {
                setEmail(storedEmail);
                setRememberMe(true);
            } else {
                setEmail('');
                setRememberMe(false);
            }
        }
    }, [isOpen, mode, storedRememberMe, storedEmail]);

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setFormError(null);
        setSuccessMessage(null);
        setEmailSent(false);
        setShowPassword(false);
        setShowConfirmPassword(false);
        // NO resetear rememberMe aquí para mantener el estado del checkbox
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleGoogleSignIn = () => {
        // Construir URL de OAuth con Google provider
        const redirectUrl = `${window.location.origin}/`;
        const oauthUrl = buildOAuthUrl('google', redirectUrl);

        // Redirigir al flujo de OAuth de Google
        window.location.href = oauthUrl;
    };

    const handleRecovery = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setSuccessMessage(null);
        setEmailSent(false);

        try {
            await sendResetEmail({
                email,
                redirectTo: `${window.location.origin}/password-recovery`,
            }).unwrap();

            // Mostrar mensaje de éxito
            setEmailSent(true);
            setSuccessMessage('Recovery email sent! Check your inbox and click the link to reset your password.');
        } catch (err: unknown) {
            const error = err as { status?: number; data?: { msg?: string; error_description?: string; message?: string } };
            const message = error.data?.error_description ?? error.data?.message ?? error.data?.msg;
            setFormError(message ?? 'Failed to send recovery email. Please try again.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);
        setSuccessMessage(null);

        // Validación para signup: confirmar que las contraseñas coincidan
        if (mode === 'signup' && password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        try {
            if (mode === 'login') {
                // LOGIN: Proceso normal
                const response = await signIn({ email, password }).unwrap();

                dispatch(
                    setCredentials({
                        user: mapSupabaseResponseToUser(response.user),
                        token: response.access_token,
                        refreshToken: response.refresh_token,
                    }),
                );

                // Persistir preferencia de Remember Me en Redux (redux-persist lo guarda en localStorage)
                dispatch(setRememberMeAction({ rememberMe, email: rememberMe ? email : null }));

                resetForm();
                onClose();
                navigate('/');
            } else {
                // SIGNUP: Mostrar mensaje de confirmación de email
                await signUp({
                    email,
                    password,
                    data: createDefaultUserData(name),
                }).unwrap();

                // Signup exitoso - Mostrar mensaje de confirmación
                setSuccessMessage('Account created! Please check your email and click the confirmation link to complete your registration.');

                // Limpiar campos pero mantener el mensaje visible
                setPassword('');
                setConfirmPassword('');
                setName('');
                setShowPassword(false);
                setShowConfirmPassword(false);
            }
        } catch (err: unknown) {
            const error = err as { status?: number; data?: { msg?: string; error_description?: string; message?: string } };
            const message = error.data?.error_description ?? error.data?.message ?? error.data?.msg;

            if (error.status === 400) {
                setFormError(message ?? 'Invalid email or password');
            } else if (error.status === 422) {
                setFormError('This email is already registered');
            } else {
                setFormError(message ?? 'Something went wrong. Please try again.');
            }
        }
    };

    return (
        <BaseModal isOpen={isOpen} onClose={handleClose}>
            {/* Close button */}
            <div className="flex justify-end p-3 border-b border-white/10">
                <button
                    onClick={handleClose}
                    className="text-[#96969F] hover:text-white transition-colors focus:outline-none"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h1 className="text-xl font-bold text-white mb-4">
                    {mode === 'login' ? 'Sign in to your account' : mode === 'signup' ? 'Create your account' : 'Reset your password'}
                </h1>

                {/* Error message */}
                {displayError && (
                    <div className="mb-3 p-2.5 bg-red-900/30 border border-red-700 rounded-lg">
                        <p className="text-xs text-red-400">{displayError}</p>
                    </div>
                )}

                {/* Recovery Mode */}
                {mode === 'recovery' ? (
                    <form className="space-y-3" onSubmit={handleRecovery}>
                        {!emailSent ? (
                            <>
                                <p className="text-sm text-[#96969F] mb-3">
                                    Enter your email address and we'll send you a link to reset your password.
                                </p>
                                <div>
                                    <label className="block text-xs font-medium text-white mb-1.5">
                                        Email address
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white placeholder-[#96969F] focus:border-[#D84124] focus:ring-1 focus:ring-[#D84124] focus:outline-none transition-colors text-sm"
                                        placeholder="your@email.com"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-white font-semibold py-2 rounded-lg transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] mt-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-brand-gradient hover:opacity-90"
                                >
                                    {isLoading ? 'Sending...' : 'Send recovery email'}
                                </button>
                            </>
                        ) : (
                            <div className="py-4">
                                <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
                                    <p className="text-sm text-green-400">{successMessage}</p>
                                </div>
                            </div>
                        )}

                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={() => { resetForm(); onSwitchMode?.('login'); }}
                                className="text-xs text-[#D84124] hover:text-[#ED8B34] font-medium transition-colors"
                            >
                                ← Back to login
                            </button>
                        </div>
                    </form>
                ) : (
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs font-medium text-white mb-1.5">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white placeholder-[#96969F] focus:border-[#D84124] focus:ring-1 focus:ring-[#D84124] focus:outline-none transition-colors text-sm"
                                    placeholder="Your name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-medium text-white mb-1.5">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white placeholder-[#96969F] focus:border-[#D84124] focus:ring-1 focus:ring-[#D84124] focus:outline-none transition-colors text-sm"
                                placeholder="your@email.com"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white placeholder-[#96969F] focus:border-[#D84124] focus:ring-1 focus:ring-[#D84124] focus:outline-none transition-colors text-sm pr-10"
                                    placeholder="••••••••"
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
                                        <EyeSlashIcon className="w-4 h-4" />
                                    ) : (
                                        <EyeIcon className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {mode === 'signup' && (
                            <div>
                                <label className="block text-xs font-medium text-white mb-1.5">
                                    Confirm password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white placeholder-[#96969F] focus:border-[#D84124] focus:ring-1 focus:ring-[#D84124] focus:outline-none transition-colors text-sm pr-10"
                                        placeholder="••••••••"
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
                                            <EyeSlashIcon className="w-4 h-4" />
                                        ) : (
                                            <EyeIcon className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Remember me & Forgot password */}
                        {mode === 'login' && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-1.5 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-3 h-3 bg-[#0A0A0B] border border-white/20 rounded focus:ring-2 focus:ring-[#D84124] cursor-pointer"
                                    />
                                    <span className="text-xs text-[#96969F]">Remember me</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => { resetForm(); onSwitchMode?.('recovery'); }}
                                    className="text-xs text-[#D84124] hover:text-[#ED8B34] transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full text-white font-semibold py-2 rounded-lg transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] mt-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed bg-brand-gradient hover:opacity-90"
                        >
                            {isLoading
                                ? (mode === 'login' ? 'Signing in...' : 'Signing up...')
                                : (mode === 'login' ? 'Sign in' : 'Sign up')}
                        </button>

                        {/* Success message (solo para signup) */}
                        {successMessage && (
                            <div className="mt-3 p-2.5 bg-green-900/30 border border-green-700 rounded-lg">
                                <p className="text-xs text-green-400">{successMessage}</p>
                            </div>
                        )}
                    </form>
                )}

                {/* Divider - Solo para login/signup */}
                {mode !== 'recovery' && (
                    <>
                        <div className="my-4 flex items-center gap-3">
                            <div className="flex-1 border-t border-white/10" />
                            <span className="text-xs text-[#96969F]">Or continue with</span>
                            <div className="flex-1 border-t border-white/10" />
                        </div>

                        {/* OAuth Buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                            >
                                <Google />
                                <span className="text-xs font-medium">Google</span>
                            </button>
                            <button
                                type="button"
                                disabled={isLoading}
                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0A0A0B] border border-white/10 rounded-lg text-white hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                            >
                                <Github />
                                <span className="text-xs font-medium">GitHub</span>
                            </button>
                        </div>

                        {/* Register/Login link */}
                        <div className="mt-4 text-center">
                            {mode === 'login' ? (
                                <span className="text-xs text-[#96969F]">
                                    Not a member?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { resetForm(); onSwitchMode?.('signup'); }}
                                        className="text-[#D84124] hover:text-[#ED8B34] font-medium transition-colors"
                                    >
                                        Sign up
                                    </button>
                                </span>
                            ) : (
                                <span className="text-xs text-[#96969F]">
                                    Already have an account?{' '}
                                    <button
                                        type="button"
                                        onClick={() => { resetForm(); onSwitchMode?.('login'); }}
                                        className="text-[#D84124] hover:text-[#ED8B34] font-medium transition-colors"
                                    >
                                        Sign in
                                    </button>
                                </span>
                            )}
                        </div>
                    </>
                )}
            </div>
        </BaseModal>
    );
}

export default AuthModal;