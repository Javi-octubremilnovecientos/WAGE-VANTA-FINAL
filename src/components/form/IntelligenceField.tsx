import { useState } from 'react';

interface IntelligenceFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    suggestions: string[];
    placeholder?: string;
}

function IntelligenceField({
    label,
    value,
    onChange,
    suggestions,
    placeholder = 'Start typing...',
}: IntelligenceFieldProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const handleChange = (inputValue: string) => {
        onChange(inputValue);

        if (inputValue.length > 0) {
            const filtered = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (suggestion: string) => {
        onChange(suggestion);
        setShowSuggestions(false);
    };

    return (
        <div className="space-y-2 relative">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => value && setShowSuggestions(filteredSuggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder={placeholder}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            {showSuggestions && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                        >
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default IntelligenceField;
