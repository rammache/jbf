import React from "react";
import { Shield, Lock, Eye } from "lucide-react";
import { SEO } from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";

export const Privacy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title={t("pages.privacy.title")}
        description={t("pages.privacy.subtitle")}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          {t("pages.privacy.badge")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          {t("pages.privacy.title")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          {t("pages.privacy.subtitle")}
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm text-xs text-gray-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#d10024]" /> {t("pages.privacy.s1Title")}
          </h2>
          <p>{t("pages.privacy.s1Desc")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#d10024]" /> {t("pages.privacy.s2Title")}
          </h2>
          <p>{t("pages.privacy.s2Desc")}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#d10024]" /> {t("pages.privacy.s3Title")}
          </h2>
          <p>{t("pages.privacy.s3Desc")}</p>
        </section>
      </div>
    </div>
  );
};
