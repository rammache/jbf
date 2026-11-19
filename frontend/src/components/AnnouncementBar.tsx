import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";

export const AnnouncementBar: React.FC = () => {
  const { settings } = useSettings();
  const [index, setIndex] = useState(0);

  const announcements = [
    settings.announcement || `Free express delivery on orders over $${settings.freeShippingThreshold}`,
    `Certified authentic devices with official Jabour Phone warranty`,
    `Need assistance? WhatsApp us at ${settings.whatsapp}`
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-[#15161d] text-white py-2 border-b border-gray-800 text-center text-xs font-medium tracking-wider">
      <div className="max-w-7xl mx-auto px-4 transition-opacity duration-500">
        <span>{announcements[index]}</span>
      </div>
    </div>
  );
};
