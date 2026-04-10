interface TemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    mode: 'save' | 'load';
    templates?: Array<{ id: string; name: string; date: string }>;
}

function TemplateModal({
    isOpen,
    onClose,
    onSave,
    mode,
    templates = [],
}: TemplateModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black bg-opacity-50"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        {mode === 'save' ? 'Save Template' : 'Load Template'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {mode === 'save' ? (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const name = formData.get('templateName') as string;
                            onSave(name);
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Template Name
                            </label>
                            <input
                                type="text"
                                name="templateName"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="My Template"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Save Template
                        </button>
                    </form>
                ) : (
                    <div className="space-y-3">
                        {templates.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">
                                No templates saved yet
                            </p>
                        ) : (
                            templates.map((template) => (
                                <div
                                    key={template.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                    onClick={() => onSave(template.id)}
                                >
                                    <h3 className="font-semibold">{template.name}</h3>
                                    <p className="text-sm text-gray-500">{template.date}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TemplateModal;
