import { useState } from 'react';
import CompareComboBox from '../CompareComboBox';
import type { CountryOption } from '../CompareComboBox';
import { formSteps } from '../../../features/salaries/salaryConstants';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { addCountry } from '../../../features/salaries/salarySlice';
import { selectCanAddCountry } from '../../../features/salaries/salarySelectors';
import {
    selectIsAuthenticated,
    selectUserPremium,
} from '../../../features/auth/authSlice';

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
    const canAddCountry = useAppSelector(selectCanAddCountry);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const isPremium = useAppSelector(selectUserPremium);

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
        if (!isAuthenticated) {
            return 'Login to compare up to 2 countries';
        }
        if (!isPremium && !canAddCountry) {
            return 'Upgrade to Premium to compare 3 countries';
        }
        return selectedCountry ? `Selected: ${selectedCountry.label}` : '';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-5 max-w-md w-full mx-4 shadow-2xl border border-slate-700">
                {/* Title */}
                <h2 className="text-lg font-semibold text-white text-center mb-4">
                    Choose countries to compare
                    <span className="block text-xs text-gray-400 mt-1">
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
