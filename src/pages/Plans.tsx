
import PlanCard from '../components/ui/cards/PlanCard';
import { BackToHomeButton } from '../components/ui/buttons/BackToHomeButton';

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
        isCurrent: true,
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
            'Full accurate data displayed on comparison sheet (Full wage increase, historical data etc)',
        ],
        isCurrent: false,
    },
];

function Plans() {
    const handleSelectPlan = (planName: string) => {
        console.log(`Selected plan: ${planName}`);
        // Aquí se implementaría la lógica de upgrade/downgrade
    };

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-5 sm:px-4 lg:px-6">
            {/* Back to Home Button */}
            <div className="mb-1">
                <BackToHomeButton className="" />
            </div>
            {/* Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl mb-3">
                    Plans & Pricing
                </h1>
                <p className="text-sm font-medium text-gray-400">
                    Choose the plan that fits your needs
                </p>
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
                        isCurrent={plan.isCurrent}
                        onSelect={() => handleSelectPlan(plan.name)}
                    />
                ))}
            </div>
        </div>
    );
}

export default Plans;
