import React, { useState, useEffect } from "react";

const ANNOUNCEMENTS = [
  "Free next-day delivery on orders over $50",
  "Two year warranty on everything we sell",
  "Price match on any stocked item, for 30 days"
];

export const AnnouncementBar: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#15161d] text-white py-2 border-b border-gray-800 text-center text-xs font-medium tracking-wider">
      <div className="max-w-7xl mx-auto px-4 transition-opacity duration-500">
        <span>{ANNOUNCEMENTS[index]}</span>
      </div>
    </div>
  );
};
