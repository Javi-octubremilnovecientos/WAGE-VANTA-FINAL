import { type ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Google, Github } from '../../../assets/icons/Solidicons';
import { useSignInMutation, useSignUpMutation } from '@/features/auth/authApi';
import { useAppDispatch } from '@/hooks/useRedux';
import { setCredentials } from '@/features/auth/authSlice';

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
            <div className="relative bg-gray-900 rounded-xl shadow-2xl max-w-md w-full border border-gray-800">
                {children}
            </div>
        </div>
    );
}

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'login' | 'signup';
    onSwitchMode?: (mode: 'login' | 'signup') => void;
}

function AuthModal({ isOpen, onClose, mode, onSwitchMode }: AuthModalProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [formError, setFormError] = useState<string | null>(null);

    const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
    const [signUp, { isLoading: isSigningUp }] = useSignUpMutation();

    const isLoading = isSigningIn || isSigningUp;

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
        setFormError(null);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        // Validación para signup: confirmar que las contraseñas coincidan
        if (mode === 'signup' && password !== confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        try {
            const response = mode === 'login'
                ? await signIn({ email, password }).unwrap()
                : await signUp({
                    email,
                    password,
                    data: { name },
                }).unwrap();

            dispatch(
                setCredentials({
                    user: {
                        id: response.user.id,
                        email: response.user.email ?? '',
                        name: (response.user.user_metadata?.name as string) ?? '',
                    },
                    token: response.access_token,
                    refreshToken: response.refresh_token,
                }),
            );

            resetForm();
            onClose();
            navigate('/');
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
            <div className="flex justify-end p-3 border-b border-gray-800">
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h1 className="text-xl font-bold text-white mb-4">
                    {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                </h1>

                {/* Error message */}
                {formError && (
                    <div className="mb-3 p-2.5 bg-red-900/30 border border-red-700 rounded-lg">
                        <p className="text-xs text-red-400">{formError}</p>
                    </div>
                )}

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
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#45d2fd] focus:ring-1 focus:ring-[#45d2fd] focus:outline-none transition-colors text-sm"
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
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#45d2fd] focus:ring-1 focus:ring-[#45d2fd] focus:outline-none transition-colors text-sm"
                            placeholder="your@email.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-white mb-1.5">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#45d2fd] focus:ring-1 focus:ring-[#45d2fd] focus:outline-none transition-colors text-sm"
                            placeholder="••••••••"
                            required
                            minLength={6}
                            disabled={isLoading}
                        />
                    </div>

                    {mode === 'signup' && (
                        <div>
                            <label className="block text-xs font-medium text-white mb-1.5">
                                Confirm password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#45d2fd] focus:ring-1 focus:ring-[#45d2fd] focus:outline-none transition-colors text-sm"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    {/* Remember me & Forgot password */}
                    {mode === 'login' && (
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-3 h-3 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-[#45d2fd] cursor-pointer"
                                />
                                <span className="text-xs text-gray-300">Remember me</span>
                            </label>
                            <a
                                href="#"
                                className="text-xs text-[#45d2fd] hover:text-[#22b8d9] transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#45d2fd] hover:bg-[#22b8d9] text-gray-900 font-semibold py-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-gray-900 mt-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading
                            ? (mode === 'login' ? 'Signing in...' : 'Signing up...')
                            : (mode === 'login' ? 'Sign in' : 'Sign up')}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-4 flex items-center gap-3">
                    <div className="flex-1 border-t border-gray-700" />
                    <span className="text-xs text-gray-400">Or continue with</span>
                    <div className="flex-1 border-t border-gray-700" />
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        type="button"
                        disabled={isLoading}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50"
                    >
                        <Google />
                        <span className="text-xs font-medium">Google</span>
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600 disabled:opacity-50"
                    >
                        <Github />
                        <span className="text-xs font-medium">GitHub</span>
                    </button>
                </div>

                {/* Register/Login link */}
                <div className="mt-4 text-center">
                    {mode === 'login' ? (
                        <span className="text-xs text-gray-400">
                            Not a member?{' '}
                            <button
                                type="button"
                                onClick={() => { resetForm(); onSwitchMode?.('signup'); }}
                                className="text-[#45d2fd] hover:text-[#22b8d9] font-medium transition-colors"
                            >
                                Sign up
                            </button>
                        </span>
                    ) : (
                        <span className="text-xs text-gray-400">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => { resetForm(); onSwitchMode?.('login'); }}
                                className="text-[#45d2fd] hover:text-[#22b8d9] font-medium transition-colors"
                            >
                                Sign in
                            </button>
                        </span>
                    )}
                </div>
            </div>
        </BaseModal>
    );
}

export default AuthModal;