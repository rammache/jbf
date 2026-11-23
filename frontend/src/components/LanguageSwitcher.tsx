import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface LanguageSwitcherProps {
  variant?: "dark" | "light" | "header";
  showLabel?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = "header"
}) => {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  const nextLangLabel = language === "fr" ? "العربية" : "Français";

  const containerClasses =
    variant === "light"
      ? "bg-gray-100 border-gray-300"
      : "bg-[#1f2029] border-[#3a3d54]";

  const inactiveTextClass =
    variant === "light"
      ? "text-gray-600 hover:text-gray-900"
      : "text-gray-300 hover:text-white";

  return (
    <div
      role="group"
      aria-label="Language selection / اختيار اللغة"
      className={`inline-flex items-center gap-0.5 rounded-full border p-0.5 transition-all shadow-xs ${containerClasses}`}
      title={language === "fr" ? "Passer en Arabe (العربية)" : "Passer en Français"}
    >
      <button
        type="button"
        onClick={toggleLanguage}
        className="p-1 text-[#0077fe] hover:opacity-80 transition focus:outline-none"
        aria-label={`Switch to ${nextLangLabel}`}
      >
        <Globe className="w-3.5 h-3.5" />
      </button>
      <button
        type="button"
        onClick={() => setLanguage("fr")}
        className={`px-2 py-0.5 text-xs font-bold rounded-full transition-all duration-200 focus:outline-none ${
          language === "fr"
            ? "bg-[#0077fe] text-white shadow-xs"
            : inactiveTextClass
        }`}
        aria-pressed={language === "fr"}
        title="Passer en Français"
      >
        {language === "fr" ? "FR" : "Français"}
      </button>
      <span className="text-gray-500 text-[10px] select-none">|</span>
      <button
        type="button"
        onClick={() => setLanguage("ar")}
        className={`px-2 py-0.5 text-xs font-arabic font-bold rounded-full transition-all duration-200 focus:outline-none ${
          language === "ar"
            ? "bg-[#0077fe] text-white shadow-xs"
            : inactiveTextClass
        }`}
        aria-pressed={language === "ar"}
        title="التبديل إلى العربية"
      >
        العربية
      </button>
    </div >
  );
};
