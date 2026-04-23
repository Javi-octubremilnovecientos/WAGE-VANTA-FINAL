import { useState } from 'react';
import CompareComboBox from '../CompareComboBox';
import type { CountryOption } from '../CompareComboBox';
import { formSteps } from '../../../features/salaries/salaryConstants';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { addCountry, selectSelectedCountries } from '../../../features/salaries/salarySlice';
import { usePlanLimits } from '../../../hooks/usePlanLimits';

interface CompareModalProps {
    isOpen: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    onUpgradeRequired: () => void;
    cancelText?: string;
    confirmText?: string;
    cancelButtonColor?: string;
    confirmButtonColor?: string;
}

export default function CompareModal({
    isOpen,
    onCancel,
    onConfirm,
    onUpgradeRequired,
    cancelText = "Cancel",
    confirmText = "Compare",
    cancelButtonColor = "#374151",
    confirmButtonColor = "#6366F1",
}: CompareModalProps) {
    const [selectedCountry, setSelectedCountry] = useState<CountryOption | null>(null);
    const dispatch = useAppDispatch();
    const selectedCountries = useAppSelector(selectSelectedCountries);
    const { canAddCountry, isAuthenticated, isPremium, maxCountries } = usePlanLimits();

    if (!isOpen) return null;

    // Obtener opciones de países del step-1
    const countryOptions = formSteps[0].fields[0].options ?? [];

    const handleCancel = () => {
        setSelectedCountry(null);
        onCancel();
    };

    const handleConfirm = () => {
        if (!selectedCountry) return;

        // Validar si puede añadir más países
        if (!canAddCountry) {
            if (!isAuthenticated) {
                onUpgradeRequired(); // Mostrar modal de login/signup
                return;
            }
            if (!isPremium) {
                onUpgradeRequired(); // Mostrar modal de upgrade a premium
                return;
            }
            // Si llegamos aquí es un edge case (no debería pasar)
            return;
        }

        // Añadir país al array de selectedCountries en Redux
        dispatch(addCountry(selectedCountry.label));
        setSelectedCountry(null);
        onConfirm();
    };

    // Mensaje dinámico según el estado del plan
    const getHelperText = () => {
        const remainingSlots = maxCountries - selectedCountries.length;

        // Si no puede agregar más países (límite alcanzado)
        if (!canAddCountry) {
            if (!isAuthenticated) {
                return `You've reached the limit (${maxCountries} countries). Login for Premium (3 countries)`;
            }
            if (!isPremium) {
                return 'Upgrade to Premium to compare 3 countries';
            }
            return 'Maximum countries reached';
        }

        // Si puede agregar más países
        if (!isAuthenticated) {
            return `You can add ${remainingSlots} more ${remainingSlots === 1 ? 'country' : 'countries'}`;
        }

        if (!isPremium && remainingSlots === 1) {
            return 'Add 1 more country (Upgrade to Premium for 3 total)';
        }

        return selectedCountry ? `Selected: ${selectedCountry.label}` : '';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-gradient-to-b from-slate-100 dark:from-slate-800 to-white dark:to-slate-900 rounded-xl p-5 max-w-md w-full mx-4 shadow-2xl border border-slate-200 dark:border-slate-700">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-4">
                    Choose countries to compare
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {getHelperText()}
                    </span>
                </h2>

                {/* Country ComboBox */}
                <div className="mb-5">
                    <CompareComboBox
                        id="compareCountry"
                        label="Country"
                        countries={countryOptions}
                        value={selectedCountry}
                        onChange={setSelectedCountry}
                        canAddMore={canAddCountry}
                        onUpgradeRequired={onUpgradeRequired}
                    />
                </div>

                {/* Buttons Container */}
                <div className="flex gap-3">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedCountry || !canAddCountry}
                        style={{ backgroundColor: confirmButtonColor }}
                        className="flex-1 rounded-md px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={handleCancel}
                        style={{ backgroundColor: cancelButtonColor }}
                        className="flex-1 rounded-md px-3 py-2 text-center text-xs font-semibold text-white shadow-sm hover:opacity-90 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
