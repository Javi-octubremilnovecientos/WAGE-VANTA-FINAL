

import { useNavigate } from 'react-router-dom';

export type PremiumFeature =
    | 'compare_countries'
    | 'export'
    | 'chart_views'
    | 'save_templates';

const featureMessages: Record<PremiumFeature, JSX.Element> = {
    compare_countries: <>Wanna chose more countries? Upgrade Premium plan and chose <span className="font-semibold text-accent-500">up to 3 countries</span>
    </>,
    export: <>to export this comprasions on .csv,.pdf or .png files, you have to upgrade to premium plan</>,
    chart_views: <>to unlock multiple chart views, you need to upgrade to a Premium plan</>,
    save_templates: <>to save up to 4 templates (Free plan allows 1 only), you need to upgrade to a Premium plan</>,
};

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    feature: PremiumFeature;
}

function UpgradeModal({ isOpen, onClose, feature }: UpgradeModalProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleUpgrade = () => {
        onClose();
        navigate('/plans');
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
        >
            <div className="w-full max-w-md bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl">
                {/* Title */}
                <h2
                    id="upgrade-modal-title"
                    className="text-lg font-bold mb-3 text-accent-500 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]"
                >
                    Upgrade now
                </h2>

                {/* Dynamic description */}
                <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                    {featureMessages[feature]}.
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleUpgrade}
                        className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-white bg-[#45D2FD] hover:bg-[#22b8d9] transition-colors focus:outline-none focus:ring-2 focus:ring-[#45D2FD] focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Upgrade to Premium
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpgradeModal;
