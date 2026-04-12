import { useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
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
    /** Called when a country badge is confirmed */
    onChange?: (value: string | null) => void;
}

export default function CompareComboBox({
    id,
    label,
    placeholder = "Choose a country",
    countries,
    onChange,
}: CompareComboBoxProps) {
    const [query, setQuery] = useState("");
    const [selectedBadge, setSelectedBadge] = useState<CountryOption | null>(null);
    const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

    const filteredCountries =
        query === ""
            ? countries
            : countries.filter((country) =>
                country.label.toLowerCase().includes(query.toLowerCase())
            );

    const handleChange = (country: CountryOption | null) => {
        if (!country) return;

        if (selectedBadge) {
            // Ya hay un país seleccionado → abrir UpgradeModal
            setIsUpgradeOpen(true);
            return;
        }

        // Primera selección → crear badge
        setSelectedBadge(country);
        onChange?.(country.value);
    };

    const handleRemoveBadge = () => {
        setSelectedBadge(null);
        onChange?.(null);
    };

    return (
        <div>
            <Combobox value={null} onChange={handleChange} onClose={() => setQuery("")}>
                <div className="relative">
                    {/* Label */}
                    {label && (
                        <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
                            {label}
                        </label>
                    )}

                    {/* Badge container */}
                    {selectedBadge && (
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-700 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-inset ring-gray-600">
                                {selectedBadge.label}
                                <button
                                    type="button"
                                    onClick={handleRemoveBadge}
                                    aria-label={`Remove ${selectedBadge.label}`}
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
                            className="w-full rounded-lg bg-gray-800 py-3 pl-4 pr-10 text-white shadow-sm ring-1 ring-inset ring-gray-700 sm:text-sm hover:bg-gray-700 transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-[#45d2fd] focus:outline-none"
                            displayValue={() => ""}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={selectedBadge ? "Add another country..." : placeholder}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-400"
                            />
                        </ComboboxButton>
                    </div>

                    {/* Options */}
                    <ComboboxOptions
                        transition
                        className="combobox-options absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 backdrop-blur-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-closed:opacity-0 data-leave:opacity-0 transition duration-100 ease-in sm:text-sm"
                    >
                        {filteredCountries.length === 0 && query !== "" ? (
                            <div className="py-3 pl-4 pr-9 text-gray-400 sm:text-sm">
                                No countries found
                            </div>
                        ) : (
                            filteredCountries.map((country) => {
                                const isSelected = selectedBadge?.value === country.value;
                                return (
                                    <ComboboxOption
                                        key={country.value}
                                        value={country}
                                        disabled={isSelected}
                                        className={`group relative select-none py-3 pl-4 pr-9 transition-colors ${isSelected
                                                ? "cursor-not-allowed text-gray-500 bg-gray-700"
                                                : "cursor-pointer text-white hover:bg-[#45d2fd] data-focus:bg-[#45d2fd] hover:text-gray-900 data-focus:text-gray-900"
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

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={isUpgradeOpen}
                onClose={() => setIsUpgradeOpen(false)}
                feature="compare_countries"
            />
        </div>
    );
}
