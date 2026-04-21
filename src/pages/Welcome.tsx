import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    SparklesIcon,
    DocumentTextIcon,
    ChartBarSquareIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';
import AuthModal from '../components/ui/modals/AuthModal';

/**
 * Welcome page for newly registered users who have confirmed their email.
 * Shows unlocked features and guides them to start using the platform.
 */
function Welcome() {
    const navigate = useNavigate();
    const [authModalOpen, setAuthModalOpen] = useState(false);

    const handleStartCreating = () => {
        // replace: true evita que el usuario vuelva a /welcome con el botón de retroceder
        navigate('/', { replace: true });
    };

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            {/* Welcome Message */}
            <section className="text-center space-y-4">
                <div className="inline-flex rounded-full bg-green-500/20 p-3 text-green-400 mb-2">
                    <SparklesIcon className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Welcome to Wage Vantage!
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                    Your account is now active.Powerful features has already unlocked!.
                </p>
            </section>

            {/* Features Unlocked Cards */}
            <section className="grid gap-5 md:grid-cols-2 mt-6">
                {/* Template Feature Card */}
                <div className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur p-6 shadow-lg hover:shadow-xl hover:shadow-[#45d2fd]/10 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="inline-flex rounded-lg bg-[#45d2fd]/20 p-3 text-[#45d2fd] flex-shrink-0">
                            <DocumentTextIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Quick Fill Templates
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Save your comparison data as templates and quickly fill forms with a single click.
                                No need to enter the same information repeatedly.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Save Comparisons Feature Card */}
                <div className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur p-6 shadow-lg hover:shadow-xl hover:shadow-[#45d2fd]/10 transition-all">
                    <div className="flex items-start gap-4">
                        <div className="inline-flex rounded-lg bg-[#45d2fd]/20 p-3 text-[#45d2fd] flex-shrink-0">
                            <ChartBarSquareIcon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-2">
                                Save Your Comparisons
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Store your salary comparisons and access them whenever you need.
                                Keep track of your research and revisit your data anytime.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="mt-8 text-center space-y-4">
                <p className="text-gray-300 text-base font-medium">
                    Ready to get started?
                </p>
                <div className="flex flex-col items-center gap-3">
                    <button
                        onClick={handleStartCreating}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#45d2fd] px-6 py-3 text-base font-semibold text-gray-900 hover:bg-[#22b8d9] transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#45d2fd] focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
                    >
                        Start Creating New Template
                        <ArrowRightIcon className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setAuthModalOpen(true)}
                        className="text-sm text-gray-400 hover:text-[#45d2fd] font-medium transition-colors"
                    >
                        Sign In
                    </button>
                </div>
            </section>

            {/* Optional: Quick Links */}
            <section className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-center text-sm text-gray-400 mb-4">
                    Explore more features
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <button
                        onClick={() => setAuthModalOpen(true)}
                        className="text-sm text-[#45d2fd] hover:text-[#22b8d9] font-medium transition-colors"
                    >
                        View My Templates
                    </button>
                    <span className="text-gray-600">•</span>
                    <button
                        onClick={() => setAuthModalOpen(true)}
                        className="text-sm text-[#45d2fd] hover:text-[#22b8d9] font-medium transition-colors"
                    >
                        View Saved Comparisons
                    </button>
                    <span className="text-gray-600">•</span>
                    <button
                        onClick={() => navigate('/plans', { replace: true })}
                        className="text-sm text-[#45d2fd] hover:text-[#22b8d9] font-medium transition-colors"
                    >
                        Explore Premium Plans
                    </button>
                </div>
            </section>

            {/* Auth Modal */}
            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                mode="login"
            />
        </div>
    );
}

export default Welcome;
