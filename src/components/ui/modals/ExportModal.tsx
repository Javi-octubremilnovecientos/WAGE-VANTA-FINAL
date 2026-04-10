interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (format: 'pdf' | 'csv' | 'png') => void;
}

function ExportModal({ isOpen, onClose, onExport }: ExportModalProps) {
  if (!isOpen) return null;

  const exportOptions = [
    { format: 'pdf' as const, label: 'PDF Document', icon: '📄' },
    { format: 'csv' as const, label: 'CSV Spreadsheet', icon: '📊' },
    { format: 'png' as const, label: 'PNG Image', icon: '🖼️' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Export Comparison</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="space-y-3">
          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => onExport(option.format)}
              className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-600 transition"
            >
              <span className="text-2xl">{option.icon}</span>
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ExportModal;
