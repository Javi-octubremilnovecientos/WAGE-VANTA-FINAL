import { useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import UpgradeModal from "./modals/UpgradeModal";
import "../form/StandardComboBox.css";

export interface CountryOption {
    label: string;
    value: string;
}

interface CompareComboBoxProps {
    id: string;
    label?: string;
    placeholder?: string;
    countries: CountryOption[];
    value: CountryOption | null;
    canAddMore?: boolean;
    /** Called when a country is selected or removed */
    onChange?: (country: CountryOption | null) => void;
    onUpgradeRequired?: () => void;
}

export default function CompareComboBox({
    id,
    label,
    placeholder = "Choose a country",
    countries,
    value,
    canAddMore = true,
    onChange,
    onUpgradeRequired,
}: CompareComboBoxProps) {
    const [query, setQuery] = useState("");
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

    const filteredCountries =
        query === ""
            ? countries
            : countries.filter((country) =>
                country.label.toLowerCase().includes(query.toLowerCase())
            );

    const handleChange = (country: CountryOption | null) => {
        if (!country) {
            onChange?.(null);
            return;
        }

        // Si NO puede añadir más países, mostrar modal de upgrade
        if (!canAddMore) {
            if (onUpgradeRequired) {
                onUpgradeRequired();
            } else {
                setIsUpgradeOpen(true);
            }
            return;
        }

        // Notificar al padre
        onChange?.(country);
    };

    const handleRemoveBadge = () => {
        onChange?.(null);
    };

    return (
        <div>
            <Combobox value={value} onChange={handleChange} onClose={() => setQuery("")}>
                <div className="relative">
                    {/* Label */}
                    {label && (
                        <label htmlFor={id} className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            {label}
                        </label>
                    )}

                    {/* Badge container */}
                    {value && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-blue-100 to-blue-50 dark:from-gray-700 dark:to-gray-700 px-2.5 py-1 text-xs font-medium text-gray-900 dark:text-white ring-1 ring-inset ring-blue-300 dark:ring-gray-600">
                                {value.label}
                                <button
                                    type="button"
                                    onClick={handleRemoveBadge}
                                    aria-label={`Remove ${value.label}`}
                                    className="rounded-sm hover:text-[#45d2fd] transition-colors focus:outline-none"
                                >
                                    <XMarkIcon className="h-3.5 w-3.5" />
                                </button>
                            </span>
                        </div>
                    )}

                    {/* Input + Button */}
                    <div className="relative">
                        <ComboboxInput
                            id={id}
                            className="w-full rounded-lg bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-blue-200 dark:ring-gray-700 sm:text-sm hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-[#45d2fd] focus:outline-none"
                            displayValue={(country: CountryOption | null) => country?.label || ""}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={value ? "Add another country..." : placeholder}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-500 dark:text-gray-400"
                            />
                        </ComboboxButton>
                    </div>

                    {/* Options */}
                    <ComboboxOptions
                        transition
                        className="combobox-options absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-800 backdrop-blur-md py-1 text-base shadow-lg ring-1 ring-blue-200 dark:ring-gray-700 focus:outline-none data-closed:opacity-0 data-leave:opacity-0 transition duration-100 ease-in sm:text-sm"
                    >
                        {filteredCountries.length === 0 && query !== "" ? (
                            <div className="py-3 pl-4 pr-9 text-gray-500 dark:text-gray-400 sm:text-sm">
                                No countries found
                            </div>
                        ) : (
                            filteredCountries.map((country) => {
                                const isSelected = value?.value === country.value;
                                return (
                                    <ComboboxOption
                                        key={country.value}
                                        value={country}
                                        disabled={isSelected}
                                        className={`group relative select-none py-3 pl-4 pr-9 transition-colors ${isSelected
                                            ? "cursor-not-allowed text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700"
                                            : "cursor-pointer text-gray-900 dark:text-white hover:bg-[#45d2fd] data-focus:bg-[#45d2fd] hover:text-gray-900 data-focus:text-gray-900 dark:hover:text-gray-900"
                                            }`}
                                    >
                                        <span className="block truncate font-normal">
                                            {country.label}
                                        </span>
                                    </ComboboxOption>
                                );
                            })
                        )}
                    </ComboboxOptions>
                </div>
            </Combobox>

            <UpgradeModal
                isOpen={isUpgradeOpen}
                onClose={() => setIsUpgradeOpen(false)}
                feature="compare_countries"
            />
        </div>
    );
}
