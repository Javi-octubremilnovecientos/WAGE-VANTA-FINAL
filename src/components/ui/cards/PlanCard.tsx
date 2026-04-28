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
        <div className="rounded-lg border border-white/10 bg-[#121213] backdrop-blur px-4 py-4 shadow-lg hover:shadow-xl hover:border-[#D84124]/30 transition-all">
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
                <span className="text-[#96969F] text-xs font-medium">/month</span>
            </div>

            {/* Annual Price Info */}
            {annualPrice && (
                <p className="text-xs font-medium text-[#D84124] mb-5">
                    {annualPrice} per month if paid annually
                </p>
            )}

            {/* Buy Button */}
            <button
                onClick={onSelect}
                disabled={isCurrent}
                className={`w-full py-1.5 rounded-md font-semibold transition mb-4 text-xs ${isCurrent
                        ? 'bg-white/10 text-[#96969F] cursor-default'
                        : 'text-white hover:opacity-90 bg-brand-gradient'
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
                        <CheckIcon className="h-3 w-3 text-[#D84124] flex-shrink-0 mt-0.5" />
                        <span className="text-[#96969F] text-xs font-medium">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PlanCard;
