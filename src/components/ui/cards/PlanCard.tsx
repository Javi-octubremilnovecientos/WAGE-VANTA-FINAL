interface PlanCardProps {
    name: string;
    price: string;
    features: string[];
    isRecommended?: boolean;
    isCurrent?: boolean;
    onSelect: () => void;
}

function PlanCard({
    name,
    price,
    features,
    isRecommended = false,
    isCurrent = false,
    onSelect,
}: PlanCardProps) {
    return (
        <div
            className={`p-6 bg-white rounded-lg shadow-lg border-2 ${isRecommended ? 'border-blue-600' : 'border-gray-200'
                }`}
        >
            {isRecommended && (
                <div className="text-sm font-semibold text-blue-600 mb-2">
                    RECOMMENDED
                </div>
            )}
            <h3 className="text-2xl font-bold mb-4">{name}</h3>
            <p className="text-3xl font-bold mb-6">
                {price}
                <span className="text-sm font-normal">/month</span>
            </p>
            <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <button
                onClick={onSelect}
                disabled={isCurrent}
                className={`w-full py-3 rounded-lg font-semibold transition ${isCurrent
                        ? 'bg-gray-200 text-gray-800 cursor-default'
                        : isRecommended
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
            >
                {isCurrent ? 'Current Plan' : 'Select Plan'}
            </button>
        </div>
    );
}

export default PlanCard;
