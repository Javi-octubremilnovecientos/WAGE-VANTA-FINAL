import { useState } from 'react';

interface UserAvatarProps {
    avatarUrl?: string | null;
    userName?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * Genera un color basado en un string (nombre de usuario)
 * Usa hash simple para asignar colores consistentes
 */
function getColorFromString(str: string): string {
    const colors = [
        'bg-blue-500',
        'bg-green-500',
        'bg-yellow-500',
        'bg-red-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
    ];

    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
}

/**
 * Extrae iniciales del nombre (máximo 2 caracteres)
 */
function getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/**
 * Componente reutilizable para mostrar avatar de usuario
 * 
 * Jerarquía de fallbacks:
 * 1. Imagen de avatar si avatarUrl existe
 * 2. Iniciales del usuario con color aleatorio basado en nombre
 * 3. Icono genérico de usuario
 * 
 * Soporta 3 tamaños:
 * - sm: 32px (Header, list items)
 * - md: 40px (Dropdowns, cards)
 * - lg: 150px (Profile settings, upload preview)
 */
function UserAvatar({ avatarUrl, userName = '', size = 'md', className = '' }: UserAvatarProps) {
    const [imageError, setImageError] = useState(false);

    // Determinar tamaño en píxeles
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-36 h-36 text-4xl',
    };

    const sizeClass = sizeClasses[size] || sizeClasses.md;

    // Si hay avatarUrl y no hubo error al cargar
    if (avatarUrl && !imageError) {
        return (
            <img
                src={avatarUrl}
                alt={userName ? `${userName}'s avatar` : 'User avatar'}
                className={`${sizeClass} rounded-full object-cover border-2 border-gray-600 ${className}`}
                onError={() => setImageError(true)}
            />
        );
    }

    // Fallback: mostrar iniciales si hay nombre
    if (userName) {
        const initials = getInitials(userName);
        const bgColor = getColorFromString(userName);

        return (
            <div
                className={`${sizeClass} rounded-full ${bgColor} flex items-center justify-center text-white font-semibold border-2 border-gray-600 ${className}`}
                aria-label={`${userName}'s avatar`}
            >
                {initials}
            </div>
        );
    }

    // Fallback final: icono genérico de usuario
    return (
        <div
            className={`${sizeClass} rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border-2 border-gray-600 ${className}`}
            aria-label="Default user avatar"
        >
            <svg
                className="w-2/3 h-2/3"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fillRule="evenodd"
                    d="M12 4a4 4 0 100 8 4 4 0 000-8zm-6 4a6 6 0 1112 0 6 6 0 01-12 0zm6 10c-3.866 0-7 1.79-7 4v1a1 1 0 102 0v-1c0-.905 1.865-2 5-2s5 1.095 5 2v1a1 1 0 102 0v-1c0-2.21-3.134-4-7-4z"
                    clipRule="evenodd"
                />
            </svg>
        </div>
    );
}

export default UserAvatar;
