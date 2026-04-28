import type { Config } from 'tailwindcss';

export default {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Design System — WageVantage
                brand: {
                    DEFAULT: '#D84124',
                    start: '#D84124',
                    end: '#ED8B34',
                    50: '#fef3ee',
                    100: '#fde4d3',
                    200: '#fac4a6',
                    300: '#f79d6e',
                    400: '#f36d35',
                    500: '#D84124',
                    600: '#c93a1f',
                    700: '#a92e1a',
                    800: '#88251b',
                    900: '#6f221b',
                },
                surface: {
                    primary: '#0A0A0B',
                    secondary: '#121213',
                },
                muted: '#96969F',
                // Alias primary → brand for backward compatibility
                primary: {
                    DEFAULT: '#D84124',
                    50: '#fef3ee',
                    100: '#fde4d3',
                    200: '#fac4a6',
                    300: '#f79d6e',
                    400: '#f36d35',
                    500: '#D84124',
                    600: '#c93a1f',
                    700: '#a92e1a',
                    800: '#88251b',
                    900: '#6f221b',
                },
            },
            fontFamily: {
                sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'brand-gradient': 'linear-gradient(135deg, #D84124 0%, #ED8B34 100%)',
            },
            borderRadius: {
                'lg': '0.5rem',
                'xl': '0.75rem',
                '2xl': '1rem',
            },
            boxShadow: {
                'brand': '0 4px 16px rgba(216, 65, 36, 0.5)',
                'brand-lg': '0 8px 32px rgba(216, 65, 36, 0.6)',
            },
        },
    },
    plugins: [],
} satisfies Config;
