import { ArrowLeftIcon, ClockIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import PlanCard from '../../components/ui/cards/PlanCard';
import { useAppSelector } from '@/hooks/useRedux';
import { selectUserPremium } from '@/features/auth/authSlice';

const plans = [
    {
        name: 'FREE',
        price: '$0',
        description: 'Everything necessary to get started.',
        features: [
            'Choose up to 2 countries to compare',
            'Save form as a template (one)',
            'Save comparison (one)',
            "Can't export comparison",
            'Only one chart view',
            'Limited data displayed on comparison sheet',
        ],
    },
    {
        name: 'PREMIUM',
        price: '$2.99',
        description: 'Everything in Basic, plus essential tools for growing your analysis.',
        features: [
            'Choose up to 3 countries to compare',
            'Save form as a template (up to 4)',
            'Save comparison (up to 4)',
            'Unlimited comparison exports (PDF, CSV, PNG)',
            'Multiple chart views',
            'Full accurate data displayed on comparison sheet (full wage increase, historical data etc)',
        ],
    },
];
function ManagePlan() {
    const isPremium = useAppSelector(selectUserPremium);

    const handleSelectPlan = (planName: string) => {
        console.log(`Selected plan: ${planName}`);
        // Aquí se implementaría la lógica de upgrade/downgrade
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-[#45d2fd] transition-colors mb-4"
                >
                    <ArrowLeftIcon className="h-3 w-3" />
                    Back to Dashboard
                </Link>

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Manage Plan
                </h1>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto w-full">
                {plans.map((plan) => (
                    <PlanCard
                        key={plan.name}
                        name={plan.name}
                        price={plan.price}
                        description={plan.description}
                        features={plan.features}
                        isCurrent={isPremium ? plan.name === 'PREMIUM' : plan.name === 'FREE'}
                        onSelect={() => handleSelectPlan(plan.name)}
                    />
                ))}
            </div>

            {/* Payment History Section */}
            <section className="rounded-lg border-2 border-[#45d2fd]/40 bg-gradient-to-br from-[#45d2fd]/15 to-[#45d2fd]/8 backdrop-blur px-5 py-8 shadow-lg text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <ClockIcon className="h-4 w-4 text-[#0891b2]" />
                    <h2 className="text-base font-semibold text-[#0891b2]">Payment History</h2>
                </div>
                <div className="mx-auto flex max-w-md flex-col items-center gap-2">
                    <div className="inline-flex rounded-full bg-[#45d2fd]/30 p-2 text-[#0891b2]">
                        <ClockIcon className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-medium text-[#0d7377]">
                        No payment history yet
                    </p>
                </div>
            </section>
        </div>
    );
}

export default ManagePlan;
