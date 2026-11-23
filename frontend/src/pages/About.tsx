import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, ShieldCheck, CheckCircle2, ArrowRight, HeartHandshake } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { SEO } from "../components/SEO";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";

export const About: React.FC = () => {
  const { settings } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <SEO
        title={t("pages.about.title")}
        description={t("pages.about.subtitle")}
      />

      <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-[#0077fe] uppercase tracking-wider">
            <Smartphone className="w-4 h-4" /> {t("pages.about.promiseBadge")}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#15161d] tracking-tight">
            {t("pages.about.title")}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            {settings.aboutText || t("pages.about.subtitle")}
          </p>
        </div>

        <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-[#15161d]">
          <ImageWithFallback
            src="/showroom.svg"
            alt="Jabour Phone Showroom"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs sm:text-sm">
          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3" data-guarantee="100% Genuine Guaranteed">
            <ShieldCheck className="w-8 h-8 text-[#0077fe]" />
            <h3 className="font-bold text-base text-[#15161d]">{t("pages.about.pillar1Title")}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t("pages.about.pillar1Desc")}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3" data-inspection="Multi-Point Quality Inspection">
            <CheckCircle2 className="w-8 h-8 text-[#0077fe]" />
            <h3 className="font-bold text-base text-[#15161d]">{t("pages.about.pillar2Title")}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t("pages.about.pillar2Desc")}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3" data-warranty="Official Warranty">
            <HeartHandshake className="w-8 h-8 text-[#0077fe]" />
            <h3 className="font-bold text-base text-[#15161d]">{t("pages.about.pillar3Title")}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t("pages.about.pillar3Desc")}
            </p>
          </div>
        </div>

        <div className="p-8 bg-[#15161d] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-xl font-bold">{t("pages.about.ctaTitle")}</h3>
            <p className="text-xs text-gray-400 mt-1">{t("pages.about.ctaDesc")}</p>
          </div>
          <Link
            to="/shop"
            className="px-6 py-3 bg-[#0077fe] hover:bg-[#005fc9] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
          >
            {t("pages.about.ctaButton")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>
      </div>
      );
};
