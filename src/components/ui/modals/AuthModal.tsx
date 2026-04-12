import { ReactNode } from 'react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Google, Github } from '../../../assets/icons/Solidicons';

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
}

function AuthModal({ isOpen, onClose, mode }: AuthModalProps) {
    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            {/* Close button */}
            <div className="flex justify-end p-4 border-b border-gray-800">
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                    aria-label="Close modal"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                <h1 className="text-3xl font-bold text-white mb-6">
                    {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
                </h1>


                <form className="space-y-4">
                    {mode === 'signup' && (
                        <div>
                            <label className="block text-sm font-medium text-white mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#45d2fd] focus:ring-1 focus:ring-[#45d2fd] focus:outline-none transition-colors"
                                placeholder="Your name"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Email address
                        </label>
                        <input
                            type="email"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#45d2fd] focus:ring-1 focus:ring-[#45d2fd] focus:outline-none transition-colors"
                            placeholder="your@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-[#45d2fd] focus:ring-1 focus:ring-[#45d2fd] focus:outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Remember me & Forgot password */}
                    {mode === 'login' && (
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 bg-gray-800 border border-gray-700 rounded focus:ring-2 focus:ring-[#45d2fd] cursor-pointer"
                                />
                                <span className="text-sm text-gray-300">Remember me</span>
                            </label>
                            <a
                                href="#"
                                className="text-sm text-[#45d2fd] hover:text-[#22b8d9] transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-[#45d2fd] hover:bg-[#22b8d9] text-gray-900 font-semibold py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-gray-900 mt-6"
                    >
                        {mode === 'login' ? 'Sign in' : 'Sign up'}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 border-t border-gray-700" />
                    <span className="text-sm text-gray-400">Or continue with</span>
                    <div className="flex-1 border-t border-gray-700" />
                </div>

                {/* OAuth Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                        <Google />
                        <span className="text-sm font-medium">Google</span>
                    </button>
                    <button
                        type="button"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                        <Github />
                        <span className="text-sm font-medium">GitHub</span>
                    </button>
                </div>

                {/* Register/Login link */}
                <div className="mt-6 text-center">
                    {mode === 'login' ? (
                        <span className="text-base text-gray-400">
                            Not a member?{' '}
                            <a href="#" className="text-[#45d2fd] hover:text-[#22b8d9] font-medium transition-colors">Sign up</a>
                        </span>
                    ) : (
                        <span className="text-base text-gray-400">
                            Already have an account?{' '}
                            <a href="#" className="text-[#45d2fd] hover:text-[#22b8d9] font-medium transition-colors">Sign in</a>
                        </span>
                    )}
                </div>
            </div>
        </BaseModal>
    );
}

export default AuthModal;
