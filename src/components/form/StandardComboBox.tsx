



import { useState } from "react";
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import "./StandardComboBox.css";

// Option interface matching formSteps structure
export interface SelectOption {
    label: string;
    value: string;
    selected?: boolean;
}

// Props interface
interface StandardComboBoxProps {
    id: string;
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    options: SelectOption[];
    placeholder?: string;
    required?: boolean;
    className?: string;
}

export default function StandardComboBox({
    id,
    label,
    value: controlledValue,
    onChange,
    options,
    placeholder = "Select an option",
    required = false,
    className = "",
}: StandardComboBoxProps) {
    const [internalSelected, setInternalSelected] = useState<SelectOption | null>(null);
    const [query, setQuery] = useState("");

    // Si es controlado, usar el valor externo; si no, usar el interno
    const selectedOption = controlledValue
        ? options.find((opt) => opt.value === controlledValue) || null
        : internalSelected;

    const filteredOptions =
        query === ""
            ? options
            : options.filter((option) =>
                option.label.toLowerCase().includes(query.toLowerCase())
            );

    const handleChange = (option: SelectOption | null) => {
        if (!option) return;
        setInternalSelected(option);
        onChange?.(option.value);
    };

    return (
        <div className={className}>
            <Combobox value={selectedOption} onChange={handleChange} onClose={() => setQuery("")}>
                <div className="relative">
                    {/* Label */}
                    {label && (
                        <label htmlFor={id} className="block text-sm font-medium text-white mb-2">
                            {label}
                        </label>
                    )}

                    {/* Input + Button */}
                    <div className="relative">
                        <ComboboxInput
                            id={id}
                            className="w-full rounded-lg bg-gray-800 py-3 pl-4 pr-10 text-white shadow-sm ring-1 ring-inset ring-gray-700 sm:text-sm hover:bg-gray-700 transition-colors placeholder:text-gray-400 focus:ring-2 focus:ring-[#45d2fd] focus:outline-none"
                            displayValue={(option: SelectOption | null) => option?.label ?? ""}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
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
                        {filteredOptions.length === 0 && query !== "" ? (
                            <div className="py-3 pl-4 pr-9 text-gray-400 sm:text-sm">
                                No results found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <ComboboxOption
                                    key={option.value}
                                    value={option}
                                    className="group relative cursor-pointer select-none py-3 pl-4 pr-9 text-white hover:bg-[#45d2fd] data-focus:bg-[#45d2fd] transition-colors hover:text-gray-900 data-focus:text-gray-900"
                                >
                                    <span className="block truncate font-normal group-data-selected:font-semibold">
                                        {option.label}
                                    </span>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white group-data-selected:flex group-[&:not([data-selected])]:hidden">
                                        <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                    </span>
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </div>
            </Combobox>
        </div>
    );
}
