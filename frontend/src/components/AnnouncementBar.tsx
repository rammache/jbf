import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const AnnouncementBar: React.FC = () => {
  const { settings, formatPrice } = useSettings();
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);

  const announcements = [
    settings.announcement || `Livraison express gratuite dès ${formatPrice(settings.freeShippingThreshold)}`,
    t("announcements.genuine"),
    `${t("announcements.whatsapp")} ${settings.whatsapp}`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-[#15161d] text-white py-1.5 border-b border-gray-800 text-xs font-medium tracking-wide">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 text-center transition-opacity duration-500 overflow-hidden text-ellipsis whitespace-nowrap">
          <span>{announcements[index]}</span>
        </div>
        <div className="flex-shrink-0 ms-2">
          <LanguageSwitcher variant="dark" />
        </div>
      </div>
    </div>
  );
};
