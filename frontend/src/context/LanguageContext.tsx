import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { SupportedLanguage, translations, categoryTranslations } from "../i18n/translations";

interface LanguageContextType {
  language: SupportedLanguage;
  direction: "ltr" | "rtl";
  isRTL: boolean;
  setLanguage: (lang: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tCategory: (nameOrSlug: string) => string;
  currencySymbol: string;
}

const STORAGE_KEY = "jabour-lang";

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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

  const tCategory = useCallback(
    (nameOrSlug: string): string => {
      if (!nameOrSlug) return "";
      const langDict = categoryTranslations[language] || categoryTranslations.fr;
      if (langDict[nameOrSlug]) return langDict[nameOrSlug];
      const lower = nameOrSlug.toLowerCase().trim();
      if (langDict[lower]) return langDict[lower];
      return nameOrSlug;
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
        tCategory,
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
    return {
      language: "fr",
      direction: "ltr",
      isRTL: false,
      setLanguage: () => { },
      toggleLanguage: () => { },
      t: (key: string, params?: Record<string, string | number>) => {
        const parts = key.split(".");
        let val: any = translations.fr;
        for (const part of parts) {
          if (val && typeof val === "object" && part in val) {
            val = val[part];
          } else {
            val = undefined;
            break;
          }
        }
        if (typeof val !== "string") return key;
        if (params) {
          let res = val;
          for (const [pk, pv] of Object.entries(params)) {
            res = res.replace(new RegExp(`\\{${pk}\\}`, "g"), String(pv));
          }
          return res;
        }
        return val;
      },
      tCategory: (nameOrSlug: string) => {
        if (!nameOrSlug) return "";
        return categoryTranslations.fr[nameOrSlug] || nameOrSlug;
      },
      currencySymbol: "DH"
    };
  }
  return context;
};
