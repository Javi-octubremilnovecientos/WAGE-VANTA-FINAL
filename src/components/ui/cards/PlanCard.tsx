import { CheckIcon } from '@heroicons/react/24/solid';

interface PlanCardProps {
    name: string;
    price: string;
    annualPrice?: string;
    description: string;
    features: string[];
    isCurrent?: boolean;
    onSelect: () => void;
}

function PlanCard({
    name,
    price,
    annualPrice,
    description,
    features,
    isCurrent = false,
    onSelect,
}: PlanCardProps) {
    return (
        <div className="rounded-lg border border-gray-700 bg-gray-800/40 backdrop-blur px-4 py-4 shadow-lg">
            {/* Plan Name with Badge */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold text-white">{name}</h3>
                </div>
                {isCurrent && (
                    <span className="inline-flex items-center rounded-md bg-green-500/20 px-2 py-0.5 text-xs font-semibold text-green-400 border border-green-500/30">
                        Active
                    </span>
                )}
            </div>

            {/* Price */}
            <div className="mb-1">
                <span className="text-2xl font-bold text-white">{price}</span>
                <span className="text-gray-400 text-xs font-medium">/month</span>
            </div>

            {/* Annual Price Info */}
            {annualPrice && (
                <p className="text-xs font-medium text-[#45d2fd] mb-5">
                    {annualPrice} per month if paid annually
                </p>
            )}

            {/* Buy Button */}
            <button
                onClick={onSelect}
                disabled={isCurrent}
                className={`w-full py-1.5 rounded-md font-semibold transition mb-4 text-xs ${isCurrent
                    ? 'bg-gray-700 text-gray-400 cursor-default'
                    : 'bg-[#45d2fd] text-gray-900 hover:bg-[#22b8d9]'
                    }`}
            >
                {isCurrent ? 'Current Plan' : 'Buy plan'}
            </button>

            {/* Description */}
            <p className="text-white text-xs font-semibold mb-3">{description}</p>

            {/* Features List */}
            <ul className="space-y-2">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-1.5">
                        <CheckIcon className="h-3 w-3 text-[#45d2fd] flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-xs font-medium">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlanCard;
