



import { useState } from "react";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import "./StandardComboBox.css";

// Props interface
interface StandardComboBoxProps {
    label?: string;
    value?: string;
    onChange?: (value: string) => void;
    options?: Array<{ id: string; name: string }>;
    placeholder?: string;
    className?: string;
}

// Opciones provisionales
const defaultPeople = [
    { id: "1", name: "Wade Cooper" },
    { id: "2", name: "Arlene Mccoy" },
    { id: "3", name: "Devon Webb" },
    { id: "4", name: "Tom Cook" },
    { id: "5", name: "Tanya Fox" },
    { id: "6", name: "Hellen Schmidt" },
    { id: "7", name: "Caroline Schultz" },
];

export default function StandardComboBox({
    label = "Assigned to",
    value: controlledValue,
    onChange,
    options = defaultPeople,

    className = "",
}: StandardComboBoxProps) {
    const [internalSelected, setInternalSelected] = useState(options[1]);

    // Si es controlado, usar el valor externo
    const selectedPerson = controlledValue
        ? options.find((p) => p.id === controlledValue) || options[0]
        : internalSelected;

    const handleChange = (person: { id: string; name: string }) => {
        if (onChange) {
            onChange(person.id);
        } else {
            setInternalSelected(person);
        }
    };

    return (
        <div className={className}>
            <Listbox value={selectedPerson} onChange={handleChange}>
                <div className="relative">
                    {/* Label */}
                    {label && (
                        <label className="block text-sm font-medium text-white mb-2">
                            {label}
                        </label>
                    )}

                    {/* Button */}
                    <ListboxButton className="relative w-full cursor-pointer rounded-lg bg-gray-800 py-3 pl-4 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-gray-700 sm:text-sm hover:bg-gray-700 transition-colors">
                        <span className="block truncate">{selectedPerson.name}</span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                aria-hidden="true"
                                className="h-5 w-5 text-gray-400"
                            />
                        </span>
                    </ListboxButton>

                    {/* Options */}
                    <ListboxOptions
                        transition
                        className="combobox-options absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 backdrop-blur-md py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none data-closed:opacity-0 data-leave:opacity-0 transition duration-100 ease-in sm:text-sm"
                    >
                        {options.map((person) => (
                            <ListboxOption
                                key={person.id}
                                value={person}
                                className="group relative cursor-pointer select-none py-3 pl-4 pr-9 text-white hover:bg-[#45d2fd] data-focus:bg-[#45d2fd] transition-colors hover:text-gray-900 data-focus:text-gray-900"
                            >
                                <span className="block truncate font-normal group-data-selected:font-semibold">
                                    {person.name}
                                </span>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-white group-data-selected:flex group-[&:not([data-selected])]:hidden">
                                    <CheckIcon aria-hidden="true" className="h-5 w-5" />
                                </span>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
}
