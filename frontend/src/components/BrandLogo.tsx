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
    sm: "h-8 text-lg",
    md: "h-10 text-2xl",
    lg: "h-14 text-3xl",
  }[size];

  const logoDimension = {
    sm: "w-7 h-7 min-w-[28px]",
    md: "w-9 h-9 min-w-[36px]",
    lg: "w-12 h-12 min-w-[48px]",
  }[size];

  const content = (
    <div className={`flex items-center gap-2.5 font-black uppercase tracking-tight select-none ${sizeClasses} ${className}`}>
      {/* Jabour Phone JP Electric Blue Emblem */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <img
          src="/logo.png"
          alt="Jabour Phone Logo"
          className={`${logoDimension} rounded-full object-cover shadow-[0_0_12px_rgba(0,119,254,0.45)] ring-1 ring-[#0077fe]/70`}
          loading="eager"
        />
      </div>

      {/* Brand Name Text */}
      <div className="flex items-baseline tracking-tight">
        <span className={variant === "light" ? "text-white" : "text-[#15161d]"}>
          JABOUR
        </span>
        <span className="text-[#0077fe] ml-1">PHONE</span>
        <span className="text-[#0077fe] text-xs leading-none ml-0.5 font-black">.</span>
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
