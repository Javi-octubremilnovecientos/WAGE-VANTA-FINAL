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

    return (
        <div className={className}>
            <label htmlFor={id} className="block text-xs font-medium text-white mb-2">
                {label}
                {required && <span className="text-[#45d2fd] ml-1">*</span>}
            </label>
            <input
                type="number"
                id={id}
                name={id}
                placeholder={placeholder}
                required={required}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
                min={min}
                max={max}
                step={step}
                className="
          w-full rounded-md
          bg-gray-800 py-1.5 px-2.5
          text-white shadow-sm text-xs
          ring-1 ring-inset ring-gray-700
          placeholder:text-gray-400
          focus:ring-2 focus:ring-[#45d2fd]
          transition-colors
        "
            />
        </div>
    );
};

export default NumberInput;
