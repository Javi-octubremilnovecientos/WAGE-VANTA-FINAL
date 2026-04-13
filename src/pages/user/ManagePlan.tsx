import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import PlanCard from '../../components/ui/cards/PlanCard';

const freePlanFeatures = [
    'Compare up to 2 countries',
    'Save 1 form template (logged in)',
    'Save 1 comparison sheet',
    'Box-plot chart view',
];

const premiumFeatures = [
    'Compare up to 3 countries',
    'Save up to 4 templates',
    'Save up to 4 comparisons',
    'Unlimited exports (PDF, CSV, PNG)',
    'Multiple chart views',
    'Full historical wage data',
];

function ManagePlan() {
    const handleUpgrade = () => {
        console.log('Upgrading to Premium');
        // Lógica de upgrade
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#45d2fd] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Dashboard
                </Link>

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Manage Plan
                </h1>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-5">
                {/* Current Plan */}
                <PlanCard
                    name="Free Plan"
                    price="$0"
                    description="Free forever"
                    features={freePlanFeatures}
                    isCurrent={true}
                    onSelect={() => { }}
                />

                {/* Upgrade to Premium */}
                <PlanCard
                    name="Premium"
                    price="$2.99"
                    description="Unlock advanced charts, multiple comparisons, exports and more."
                    features={premiumFeatures}
                    isCurrent={false}
                    onSelect={handleUpgrade}
                />
            </div>

            {/* Payment History Section */}
            <section className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur px-5 py-8 shadow-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <ClockIcon className="h-4 w-4 text-[#45d2fd]" />
                    <h2 className="text-base font-semibold text-white">Payment History</h2>
                </div>
                <div className="mx-auto flex max-w-md flex-col items-center gap-2">
                    <div className="inline-flex rounded-full bg-gray-700/50 p-2 text-gray-400">
                        <ClockIcon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-gray-400">
                        No payment history yet
                    </p>
                </div>
            </section>
        </div>
    );
}

export default ManagePlan;
