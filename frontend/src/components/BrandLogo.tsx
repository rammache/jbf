import React from "react";
import { Link } from "react-router-dom";

interface BrandLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "dark" | "light";
  showLink?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = "",
  size = "md",
  variant = "light",
  showLink = true,
}) => {
  const sizeClasses = {
    sm: "h-7 text-lg",
    md: "h-9 text-2xl",
    lg: "h-12 text-3xl",
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 font-black uppercase tracking-tight select-none ${sizeClasses} ${className}`}>
      {/* Sleek Smartphone Icon with Signal Waves */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          className={size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8"}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Phone outline */}
          <rect
            x="7"
            y="3"
            width="18"
            height="26"
            rx="4"
            className="fill-[#15161d] stroke-[#d10024]"
            strokeWidth="2"
          />
          {/* Inner screen */}
          <rect
            x="9.5"
            y="6.5"
            width="13"
            height="18"
            rx="1.5"
            className="fill-[#1e1f29]"
          />
          {/* Speaker notch */}
          <line
            x1="13"
            y1="4.5"
            x2="19"
            y2="4.5"
            stroke="#d10024"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Home button / fingerprint */}
          <circle cx="16" cy="26" r="1.25" fill="#d10024" />
          {/* Tech wave */}
          <path
            d="M26.5 10C28 11.5 28 14 26.5 15.5"
            stroke="#d10024"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Brand Name Text */}
      <div className="flex items-baseline tracking-tight">
        <span className={variant === "light" ? "text-white" : "text-[#15161d]"}>
          JABOUR
        </span>
        <span className="text-[#d10024] ml-1">PHONE</span>
        <span className="text-[#d10024] text-xs leading-none ml-0.5 font-black">.</span>
      </div>
    </div>
  );

  if (showLink) {
    return (
      <Link to="/" className="inline-block group focus:outline-none" aria-label="Jabour Phone Home">
        {content}
      </Link>
    );
  }

  return content;
};
