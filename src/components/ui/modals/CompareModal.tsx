import { useState } from 'react';
import CompareComboBox from '../CompareComboBox';
import type { CountryOption } from '../CompareComboBox';
import { formSteps } from '../../../features/salaries/salaryConstants';
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { addCountry, removeCountry, selectSelectedCountries } from '../../../features/salaries/salarySlice';
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
}: CompareModalProps) {
    const dispatch = useAppDispatch();
    const selectedCountries = useAppSelector(selectSelectedCountries);
    const { canAddCountry, isAuthenticated, isPremium } = usePlanLimits();

    // 2° país persistido en Redux
    const persistedSecondCountry = selectedCountries[1] ?? null;

    // Estado local para cambios pendientes (no commiteados aún)
    const [pendingCountry, setPendingCountry] = useState<CountryOption | null>(null);

    // Valor mostrado en el combobox: pendiente si existe, sino el persistido
    const displayedCountry = pendingCountry ??
        (persistedSecondCountry ? { label: persistedSecondCountry, value: persistedSecondCountry } : null);

    if (!isOpen) return null;

    const countryOptions = formSteps[0].fields[0].options ?? [];

    const handleCancel = () => {
        // Limpiar cambios pendientes sin tocar el store
        setPendingCountry(null);
        onCancel();
    };

    const handleConfirm = () => {
        if (pendingCountry) {
            // Si había un 2° país previo diferente, reemplazarlo (solo Premium llega aquí con reemplazo)
            if (persistedSecondCountry && persistedSecondCountry !== pendingCountry.value) {
                dispatch(removeCountry(persistedSecondCountry));
            }
            // Añadir el nuevo país si no está ya en selectedCountries
            if (!selectedCountries.includes(pendingCountry.value)) {
                dispatch(addCountry(pendingCountry.value));
            }
        }
        setPendingCountry(null);
        onConfirm();
    };

    const handleComboBoxChange = (country: CountryOption | null) => {
        if (!country) {
            // X del badge → eliminar del store inmediatamente (chart se actualiza en tiempo real)
            if (persistedSecondCountry) {
                dispatch(removeCountry(persistedSecondCountry));
            }
            setPendingCountry(null);
            return;
        }

        // Si ya hay un 2° país persistido (badge visible) y el usuario intenta cambiarlo
        if (persistedSecondCountry) {
            // Solo Premium puede reemplazar directamente sin eliminar el badge primero
            if (!isPremium) {
                onUpgradeRequired();
                return;
            }
        } else {
            // No hay 2° país aún → validar límites normales
            if (!canAddCountry) {
                if (!isAuthenticated || !isPremium) {
                    onUpgradeRequired();
                    return;
                }
            }
        }

        setPendingCountry(country);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            {/* Modal Container */}
            <div className="bg-[#121213] rounded-xl p-5 max-w-md w-full mx-4 shadow-2xl border border-white/10">
                {/* Title */}
                <h2 className="text-lg font-semibold text-white text-center mb-4">
                    Choose countries to compare
                </h2>

                {/* Country ComboBox */}
                <div className="mb-5">
                    <CompareComboBox
                        id="compareCountry"
                        label="Country"
                        countries={countryOptions}
                        value={displayedCountry}
                        onChange={handleComboBoxChange}
                        canAddMore={canAddCountry}
                        onUpgradeRequired={onUpgradeRequired}
                    />
                </div>

                {/* Buttons Container */}
                <div className="flex gap-3">
                    <button
                        onClick={handleConfirm}
                        className="flex-1 rounded-md px-3 py-2 text-center text-xs font-semibold text-white bg-brand-gradient hover:opacity-90 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                    >
                        {confirmText}
                    </button>
                    <button
                        onClick={handleCancel}
                        style={{ backgroundColor: cancelButtonColor }}
                        className="flex-1 rounded-md px-3 py-2 text-center text-xs font-semibold text-white hover:opacity-90 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500"
                    >
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
}
