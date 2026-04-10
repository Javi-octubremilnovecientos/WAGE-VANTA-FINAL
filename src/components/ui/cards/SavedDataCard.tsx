interface SavedDataCardProps {
    title: string;
    date: string;
    description?: string;
    onView: () => void;
    onDelete: () => void;
}

function SavedDataCard({
    title,
    date,
    description,
    onView,
    onDelete,
}: SavedDataCardProps) {
    return (
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200 hover:shadow-lg transition">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-gray-500 mb-3">{date}</p>
            {description && (
                <p className="text-sm text-gray-600 mb-4">{description}</p>
            )}
            <div className="flex gap-2">
                <button
                    onClick={onView}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm"
                >
                    View
                </button>
                <button
                    onClick={onDelete}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition text-sm"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default SavedDataCard;
