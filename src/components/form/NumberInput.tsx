import React, { useState, useEffect } from 'react';

interface NumberInputProps {
    /** Unique identifier for the input */
    id: string;
    /** Label text displayed above the input */
    label: string;
    /** Placeholder text */
    placeholder?: string;
    /** Whether the field is required */
    required?: boolean;
    /** Current value */
    value: string | number;
    /** Change handler — only fires on blur or Enter, not on every keystroke */
    onChange: (value: string) => void;
    /** Input change handler — fires on every keystroke (for real-time UI updates) */
    onInputChange?: (value: string) => void;
    /** Additional CSS classes */
    className?: string;
    /** Minimum value */
    min?: number;
    /** Maximum value */
    max?: number;
    /** Step value for increment/decrement */
    step?: number;
}

const NumberInput: React.FC<NumberInputProps> = ({
    id,
    label,
    placeholder = '',
    required = false,
    value,
    onChange,
    onInputChange,
    className = '',
    min,
    max,
    step,
}) => {
    const [localValue, setLocalValue] = useState(String(value));

    useEffect(() => {
        setLocalValue(String(value));
    }, [value]);

    const commit = () => {
        if (localValue !== String(value)) {
            onChange(localValue);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        // Notify parent en tiempo real para actualizar UI
        onInputChange?.(newValue);
    };

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-xs lg:text-sm font-medium text-white mb-2 lg:mb-3">
                {label}
                {required && <span className="text-[#D84124] ml-1">*</span>}
            </label>
            <input
                type="number"
                id={id}
                name={id}
                placeholder={placeholder}
                required={required}
                value={localValue}
                onChange={handleInputChange}
                onBlur={commit}
                onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
                min={min}
                max={max}
                step={step}
                className="
          w-full rounded-md
          bg-[#0A0A0B] py-1.5 lg:py-2 px-2.5
          text-white shadow-sm text-xs lg:text-sm
          ring-1 ring-inset ring-white/10
          placeholder:text-[#96969F]
          focus:ring-2 focus:ring-[#D84124]
          transition-colors
        "
            />
        </div>
    );
};

export default NumberInput;
