import React from "react";
import { useNavigate } from "react-router-dom";

export interface BackToHomeButtonProps {
  className?: string;
}

/**
 * Botón atómico para volver a la Home. Mobile-first, accesible y con estilos consistentes.
 */
export const BackToHomeButton: React.FC<BackToHomeButtonProps> = ({ className }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      aria-label="Volver a inicio"
      onClick={() => navigate("/")}
      className={[
        "inline-flex items-center gap-1.5",
        "px-3 py-1.5 rounded-md",
        "bg-white/5 text-[#96969F] border border-white/10",
        "hover:bg-[#D84124]/20 hover:text-white hover:border-[#D84124]/30 focus:ring-2 focus:ring-[#D84124] focus:ring-offset-2 focus:ring-offset-[#0A0A0B]",
        "transition-colors duration-200",
        "font-medium text-xs md:text-sm",
        className,
      ].filter(Boolean).join(" ")}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      Back to Home
    </button>
  );
};
