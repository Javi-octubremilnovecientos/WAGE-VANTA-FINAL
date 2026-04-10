import { ReactNode } from 'react';

interface FormLayoutProps {
    children: ReactNode;
    onSubmit?: (e: React.FormEvent) => void;
    title?: string;
}

function FormLayout({ children, onSubmit, title }: FormLayoutProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(e);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
            {children}
        </form>
    );
}

export default FormLayout;
