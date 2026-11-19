import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight, Home as HomeIcon } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-[#d10024] uppercase tracking-wider">
        <Compass className="w-4 h-4" /> Error 404
      </div>
      <h1 className="text-5xl sm:text-6xl font-black text-[#15161d] tracking-tight">
        Page not found.
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
        The page you are looking for does not exist, was moved, or the address was typed incorrectly.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-6 py-3 bg-[#15161d] hover:bg-[#2a2c38] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          <HomeIcon className="w-4 h-4" /> Back Home
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#d10024] hover:bg-[#a7001d] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          Browse Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
