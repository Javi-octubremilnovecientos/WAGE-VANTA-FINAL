
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
    /** Deshabilita el combobox (campos que dependen de selecciones previas) */
    disabled?: boolean;
    /** Muestra skeleton mientras se cargan las opciones */
    loading?: boolean;
}

/** Componente Skeleton para estado de carga */
function ComboBoxSkeleton({ label, id }: { label: string; id: string }) {
    return (
        <div className="animate-pulse">
            {label && (
                <label htmlFor={id} className="block text-xs font-medium text-white mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <div className="w-full h-[34px] rounded-md bg-white/10 shimmer" />
            </div>
        </div>
    );
}

export default function StandardComboBox({
    id,
    label,
    value: controlledValue,
    onChange,
    options,
    placeholder = "Select an option",
    // required = false,
    className = "",
    disabled = false,
    loading = false,
}: StandardComboBoxProps) {
    const [internalSelected, setInternalSelected] = useState<SelectOption | null>(null);
    const [query, setQuery] = useState("");

    // Si está cargando, mostrar skeleton
    if (loading) {
        return (
            <div className={className}>
                <ComboBoxSkeleton label={label} id={id} />
            </div>
        );
    }

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
        if (!option || disabled) return;
        setInternalSelected(option);
        onChange?.(option.value);
    };

    // Estilos para estado deshabilitado
    const disabledStyles = disabled
        ? "opacity-50 cursor-not-allowed pointer-events-none"
        : "";

    return (
        <div className={`${className} ${disabledStyles}`}>
            <Combobox value={selectedOption} onChange={handleChange} onClose={() => setQuery("")} disabled={disabled}>
                <div className="relative">
                    {/* Label */}
                    {label && (
                        <label htmlFor={id} className="block text-xs lg:text-sm font-medium text-white mb-2 lg:mb-3">
                            {label}
                        </label>
                    )}

                    {/* Input + Button */}
                    <div className="relative">
                        <ComboboxInput
                            id={id}
                            className="w-full rounded-md bg-[#0A0A0B] py-1.5 lg:py-2 pl-2.5 pr-7 text-white shadow-sm ring-1 ring-inset ring-white/10 text-xs lg:text-sm hover:bg-white/5 transition-colors placeholder:text-[#96969F] focus:ring-1 focus:ring-white/20 focus:outline-none"
                            displayValue={(option: SelectOption | null) => option?.label ?? ""}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={placeholder}
                        />
                        <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="h-4 w-4 text-[#96969F]"
                            />
                        </ComboboxButton>
                    </div>

                    {/* Options */}
                    <ComboboxOptions
                        transition
                        className="combobox-options absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-[#121213] backdrop-blur-md py-1 text-xs lg:text-sm shadow-lg ring-1 ring-white/10 focus:outline-none data-closed:opacity-0 data-leave:opacity-0 transition duration-100 ease-in"
                    >
                        {filteredOptions.length === 0 && query !== "" ? (
                            <div className="py-1.5 pl-2.5 pr-6 text-[#96969F] text-xs lg:text-sm">
                                No results found
                            </div>
                        ) : (
                            filteredOptions.map((option) => (
                                <ComboboxOption
                                    key={option.value}
                                    value={option}
                                    className="group relative cursor-pointer select-none py-1.5 lg:py-2 pl-2.5 pr-6 text-white hover:bg-[#D84124]/20 data-focus:bg-[#D84124]/20 transition-colors hover:text-white data-focus:text-white"
                                >
                                    <span className="block truncate font-normal group-data-selected:font-semibold text-xs lg:text-sm">
                                        {option.label}
                                    </span>

                                    <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white group-data-selected:flex group-[&:not([data-selected])]:hidden">
                                        <CheckIcon aria-hidden="true" className="h-4 w-4" />
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
