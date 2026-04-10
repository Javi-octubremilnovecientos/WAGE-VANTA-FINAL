interface CompareButtonProps {
    onClick: () => void;
    disabled?: boolean;
    isLoading?: boolean;
}

function CompareButton({
    onClick,
    disabled = false,
    isLoading = false,
}: CompareButtonProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
            {isLoading ? 'Comparing...' : 'Compare'}
        </button>
    );
}

export default CompareButton;
