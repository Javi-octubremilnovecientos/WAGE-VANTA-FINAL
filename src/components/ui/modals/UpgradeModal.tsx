
import { useNavigate } from 'react-router-dom';

export type PremiumFeature =
    | 'compare_countries'
    | 'export'
    | 'chart_views'
    | 'save_templates'
    | 'save_comparisons'
    | 'accurate_data';

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

    const getFeatureMessage = () => {
        switch (feature) {
            case 'compare_countries':
                return (
                    <>
                        Wanna chose more than one country? Upgrade to premium and chose up to{' '}
                        <span className="font-semibold text-[#ED8B34]">3 countries</span> to compare
                    </>
                );
            case 'export':
                return 'To export comparisons as .csv, .pdf, or .png files, you need to upgrade to the Premium plan';
            case 'chart_views':
                return 'To unlock multiple chart views, you need to upgrade to a Premium plan';
            case 'save_templates':
                return 'To save up to 4 templates (Free plan allows 1 only), you need to upgrade to a Premium plan';
            case 'save_comparisons':
                return 'To save up to 4 comparison sheets (Free plan allows 1 only), you need to upgrade to a Premium plan';
            case 'accurate_data':
                return 'To access accurate and detailed salary data, you need to upgrade to a Premium plan';
            default:
                return 'Upgrade to Premium to unlock this feature';
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="upgrade-modal-title"
        >
            <div className="w-full max-w-md bg-[#121213] border border-white/10 rounded-lg p-4 shadow-xl">
                {/* Title */}
                <h2
                    id="upgrade-modal-title"
                    className="text-lg font-bold mb-3 text-[#D84124]"
                >
                    Upgrade now
                </h2>

                {/* Dynamic description */}
                <p className="text-[#96969F] text-sm mb-5 leading-relaxed">
                    {getFeatureMessage()}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={handleUpgrade}
                        className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-[#0A0A0B] bg-brand-gradient"
                    >
                        Upgrade to Premium
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 rounded-md px-3 py-2 text-sm font-semibold text-[#96969F] bg-white/5 hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-[#0A0A0B]"
                    >
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UpgradeModal;
