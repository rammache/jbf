import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "dark" | "light" | "header";
  showLabel?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "header",
  showLabel = true
}) => {
  const { language, toggleLanguage } = useLanguage();

  const nextLangLabel = language === "fr" ? "العربية" : "Français";
  const currentBadge = language === "fr" ? "FR" : "AR";

  const colorClasses =
    variant === "dark"
      ? "bg-gray-800 text-gray-200 hover:text-white hover:bg-gray-700 border-gray-700"
      : variant === "light"
      ? "bg-white text-gray-700 hover:text-gray-900 hover:bg-gray-100 border-gray-300"
      : "bg-[#1f2029] text-gray-300 hover:text-white hover:bg-[#2b2d42] border-[#3a3d54]";

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#d10024] ${colorClasses}`}
      title={language === "fr" ? "Passer en Arabe (العربية)" : "Passer en Français"}
      aria-label={language === "fr" ? "Passer en Arabe (العربية)" : "Passer en Français"}
    >
      <Globe className="w-3.5 h-3.5 text-[#d10024]" />
      <span className="font-bold tracking-wider">{currentBadge}</span>
      {showLabel && (
        <>
          <span className="text-gray-500 text-[10px]">|</span>
          <span className="font-arabic font-normal text-[11px] text-gray-300 hover:text-white">
            {nextLangLabel}
          </span>
        </>
      )}
    </button>
  );
};
