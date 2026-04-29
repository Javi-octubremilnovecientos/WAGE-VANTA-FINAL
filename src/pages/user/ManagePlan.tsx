import { ArrowLeftIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import PlanCard from '../../components/ui/cards/PlanCard';
import { useAppSelector } from '@/hooks/useRedux';
import { selectUserPremium, selectUserPayData } from '@/features/auth/authSlice';
import type { PayState } from '@/lib/User';

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
    const payData = useAppSelector(selectUserPayData);
    const paymentHistory = payData?.history ?? [];

    const handleSelectPlan = (planName: string) => {
        console.log(`Selected plan: ${planName}`);
        // Aquí se implementaría la lógica de upgrade/downgrade
    };

    // Helper: Formatear fecha ISO a legible
    const formatDate = (isoDate: string): string => {
        const date = new Date(isoDate);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Helper: Obtener icono y color según estado
    const getStateDisplay = (state: PayState) => {
        switch (state) {
            case 'done':
                return {
                    icon: CheckCircleIcon,
                    label: 'Completed',
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-600/50',
                };
            case 'pending':
                return {
                    icon: ExclamationCircleIcon,
                    label: 'Pending',
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-600/50',
                };
            case 'refused':
                return {
                    icon: XCircleIcon,
                    label: 'Declined',
                    color: 'text-red-400',
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-600/50',
                };
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-5 sm:px-4 lg:px-6">
            {/* Header with Back link */}
            <div>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#96969F] hover:text-[#D84124] transition-colors mb-4"
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
            <section className="rounded-lg border-2 border-[#D84124]/40 bg-gradient-to-br from-[#D84124]/15 to-[#D84124]/8 backdrop-blur px-5 py-6 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="h-4 w-4 text-[#D84124]" />
                    <h2 className="text-base font-semibold text-[#D84124]">Payment History</h2>
                </div>

                {paymentHistory.length === 0 ? (
                    <div className="mx-auto flex max-w-md flex-col items-center gap-2 text-center py-4">
                        <div className="inline-flex rounded-full bg-[#D84124]/30 p-2 text-[#D84124]">
                            <ClockIcon className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-medium text-[#96969F]">
                            No payment history yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {paymentHistory.map((charge) => {
                            const stateDisplay = getStateDisplay(charge.state);
                            const StateIcon = stateDisplay.icon;

                            return (
                                <div
                                    key={charge.id}
                                    className={`flex items-center justify-between rounded-md border ${stateDisplay.borderColor} ${stateDisplay.bgColor} px-4 py-3 transition-colors`}
                                >
                                    <div className="flex items-center gap-3">
                                        <StateIcon className={`h-5 w-5 ${stateDisplay.color} shrink-0`} />
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                •••• {charge.cardFourDigits}
                                            </p>
                                            <p className="text-xs text-[#96969F] mt-0.5">
                                                {formatDate(charge.chargeDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold ${stateDisplay.color}`}>
                                        {stateDisplay.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ManagePlan;
