import { useState } from 'react';
import StandardComboBox from '../../form/StandardComboBox';
import { formSteps } from '../../../features/salaries/salaryConstants';

interface CompareModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    cancelText?: string;
    confirmText?: string;
    cancelButtonColor?: string;
    confirmButtonColor?: string;
}

export default function CompareModal({
    isOpen,
    onCancel,
    onConfirm,
    cancelText = "Cancel",
    confirmText = "Confirm",
    cancelButtonColor = "#374151",
    confirmButtonColor = "#6366F1",
}: CompareModalProps) {
    const [selectedCountry, setSelectedCountry] = useState<string>('');

    if (!isOpen) return null;

    // Obtener el campo country del step-1
    const countryField = formSteps[0].fields[0];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-slate-700">
                {/* Title */}
                <h2 className="text-2xl font-semibold text-white text-center mb-6">
                    Chose a country to compare
                </h2>

                {/* Country ComboBox */}
                <div className="mb-8">
                    <StandardComboBox
                        id={countryField.id}
                        label={countryField.label}
                        options={countryField.options || []}
                        placeholder={countryField.placeholder}
                        required={countryField.required}
                        value={selectedCountry}
                        onChange={(value) => setSelectedCountry(value)}
                    />
                </div>

                {/* Buttons Container */}
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        style={{ backgroundColor: cancelButtonColor }}
                        className="flex-1 rounded-lg px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{ backgroundColor: confirmButtonColor }}
                        className="flex-1 rounded-lg px-4 py-3 text-center text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
