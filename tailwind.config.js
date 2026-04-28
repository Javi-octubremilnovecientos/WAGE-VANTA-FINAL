/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      colors: {
        brand: {
          dark: "#0A0A0B",
          surface: "#121213",
          muted: "#96969F",
        },
        gradient: {
          start: "#D84124",
          end: "#ED8B34",
        },
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        secondary: {
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        accent: {
          500: "#f59e0b",
          600: "#d97706",
        },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #D84124 0%, #ED8B34 100%)",
      },
      borderRadius: {
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};
