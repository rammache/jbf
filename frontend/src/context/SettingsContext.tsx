import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { StoreSettings } from "../types";
import { formatPrice as formatPriceUtil } from "../utils/currency";
import { useLanguage } from "./LanguageContext";

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 1,
  storeName: "Jabour Phone",
  phone: "+212 5 22 12 34 56",
  whatsapp: "+212 6 61 12 34 56",
  email: "contact@jabourphone.ma",
  address: "Boulevard Al Massira Al Khadra, Maarif",
  city: "Casablanca",
  country: "Morocco",
  currency: "MAD",
  currencySymbol: "DH",
  shippingFee: 35.0,
  freeShippingThreshold: 300.0,
  announcement: "Livraison express gratuite partout au Maroc dès 300 DH | 100% Authentique",
  workingHours: "Lun - Sam: 09:00 - 20:00",
  facebook: "https://facebook.com/jabourphone",
  instagram: "https://instagram.com/jabourphone",
  tiktok: "https://tiktok.com/@jabourphone",
  twitter: "https://twitter.com/jabourphone",
  aboutText: "Jabour Phone est votre spécialiste des smartphones, accessoires et produits connectés au Maroc, garantissant authenticité, garantie officielle et livraison rapide."
};

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  formatPrice: (amount: number | string | null | undefined, customSymbol?: string) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (json.success && json.data) {
        setSettings({
          ...DEFAULT_STORE_SETTINGS,
          ...json.data
        });
      }
    } catch (err: any) {
      console.warn("Could not load remote store settings, using defaults:", err);
      setError(err.message || "Failed to load store settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const { language, currencySymbol: langCurrencySymbol } = useLanguage();

  const formatPrice = useCallback(
    (amount: number | string | null | undefined, customSymbol?: string) => {
      let activeSymbol = customSymbol;
      if (!activeSymbol) {
        if (!settings.currencySymbol || settings.currencySymbol === "DH" || settings.currencySymbol === "MAD") {
          activeSymbol = langCurrencySymbol;
        } else {
          activeSymbol = settings.currencySymbol;
        }
      }
      return formatPriceUtil(amount, activeSymbol || "DH", language);
    },
    [settings.currencySymbol, langCurrencySymbol, language]
  );

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        error,
        refreshSettings: fetchSettings,
        formatPrice
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};
