import { ReactNode } from 'react';

interface SettingsCardProps {
    title: string;
    description?: string;
    children: ReactNode;
}

function SettingsCard({ title, description, children }: SettingsCardProps) {
    return (
        <div className="p-6 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-gray-600 mb-4">{description}</p>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    );
}

export default SettingsCard;
