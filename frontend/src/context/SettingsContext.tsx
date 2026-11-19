import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { StoreSettings } from "../types";
import { formatPrice as formatPriceUtil } from "../utils/currency";

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 1,
  storeName: "Jabour Phone",
  phone: "+961 70 123 456",
  whatsapp: "+961 70 123 456",
  email: "contact@jabourphone.com",
  address: "Beirut, Lebanon",
  city: "Beirut",
  country: "Lebanon",
  currency: "USD",
  currencySymbol: "$",
  shippingFee: 5.0,
  freeShippingThreshold: 50.0,
  announcement: "Free express delivery on orders over $50 | 100% Genuine phones guaranteed",
  workingHours: "Mon - Sat: 9:00 AM - 8:00 PM",
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
  twitter: "https://twitter.com",
  aboutText: "Jabour Phone is your premier source for certified smartphones, authentic accessories, and guaranteed hardware in Lebanon."
};

interface SettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  error: string | null;
  refreshSettings: () => Promise<void>;
  formatPrice: (amount: number | string | null | undefined) => string;
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

  const formatPrice = useCallback(
    (amount: number | string | null | undefined) => {
      return formatPriceUtil(amount, settings.currencySymbol || "$");
    },
    [settings.currencySymbol]
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
