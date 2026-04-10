interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpgrade: () => void;
    feature: string;
}

function UpgradeModal({ isOpen, onClose, onUpgrade, feature }: UpgradeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Upgrade Required</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>
                <div className="mb-6">
                    <p className="text-gray-700 mb-4">
                        You've reached the limit for <strong>{feature}</strong> on the FREE plan.
                    </p>
                    <p className="text-gray-700">
                        Upgrade to PREMIUM to unlock more features and remove all limits.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition"
                    >
                        Maybe Later
                    </button>
                    <button
                        onClick={onUpgrade}
                        className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Upgrade Now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpgradeModal;
