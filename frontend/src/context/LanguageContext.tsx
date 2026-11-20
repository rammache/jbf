import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SupportedLanguage, translations } from "../i18n/translations";

interface LanguageContextType {
  language: SupportedLanguage;
  direction: "ltr" | "rtl";
  isRTL: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  currencySymbol: string;
}

const STORAGE_KEY = "jabour-lang";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ar" || stored === "fr") {
        return stored;
      }
    } catch {
      // ignore localStorage errors
    }
    return "fr";
  });

  const direction: "ltr" | "rtl" = language === "ar" ? "rtl" : "ltr";
  const isRTL = direction === "rtl";
  const currencySymbol = language === "ar" ? "د.م." : "DH";

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // ignore localStorage errors
    }

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("dir", direction);
      document.documentElement.setAttribute("lang", language);
      if (language === "ar") {
        document.body.classList.add("font-arabic");
      } else {
        document.body.classList.remove("font-arabic");
      }
    }
  }, [language, direction]);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => (prev === "fr" ? "ar" : "fr"));
  }, []);

  /**
   * Translates dot-delimited key, e.g. "nav.home", "cart.freeShippingProgress"
   */
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[language] as any;
      const parts = key.split(".");
      let val: any = dict;

      for (const part of parts) {
        if (val && typeof val === "object" && part in val) {
          val = val[part];
        } else {
          val = undefined;
          break;
        }
      }

      // Fallback to French if missing
      if (typeof val !== "string" && language !== "fr") {
        let fallbackVal: any = translations.fr as any;
        for (const part of parts) {
          if (fallbackVal && typeof fallbackVal === "object" && part in fallbackVal) {
            fallbackVal = fallbackVal[part];
          } else {
            fallbackVal = undefined;
            break;
          }
        }
        val = fallbackVal;
      }

      if (typeof val !== "string") {
        return key;
      }

      if (params) {
        let result = val;
        for (const [pKey, pVal] of Object.entries(params)) {
          result = result.replace(new RegExp(`\\{${pKey}\\}`, "g"), String(pVal));
        }
        return result;
      }

      return val;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        isRTL,
        setLanguage,
        toggleLanguage,
        t,
        currencySymbol
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
