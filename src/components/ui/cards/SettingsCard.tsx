import { ReactNode } from 'react';

interface SettingsCardProps {
    title: string;
    description?: string;
    children: ReactNode;
}

function SettingsCard({ title, description, children }: SettingsCardProps) {
    return (
        <div className="p-6 bg-[#121213] rounded-lg shadow border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-[#96969F] mb-4">{description}</p>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    );
}

export default SettingsCard;
