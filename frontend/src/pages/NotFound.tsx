import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight, Home as HomeIcon, HelpCircle } from "lucide-react";
import { SEO } from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";

export const NotFound: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6">
      <SEO title={t("notFound.title")} description={t("notFound.desc")} />
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-[#d10024] uppercase tracking-wider">
        <Compass className="w-4 h-4" /> {t("notFound.badge")}
      </div>
      <h1 className="text-5xl sm:text-6xl font-black text-[#15161d] tracking-tight">
        {t("notFound.title")}
      </h1>
      <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
        {t("notFound.desc")}
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-6 py-3 bg-[#15161d] hover:bg-[#2a2c38] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          <HomeIcon className="w-4 h-4" /> {t("notFound.backHome")}
        </Link>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#d10024] hover:bg-[#a7001d] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          {t("notFound.browseCatalog")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
        <Link
          to="/contact"
          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          <HelpCircle className="w-4 h-4" /> {t("notFound.contactUs")}
        </Link>
      </div>
    </div>
  );
};
