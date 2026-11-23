import React from "react";
import { RotateCcw, ShieldCheck, CheckCircle2, MessageCircle } from "lucide-react";
import { SEO } from "../components/SEO";
import { useLanguage } from "../context/LanguageContext";
import { useSettings } from "../context/SettingsContext";

export const Returns: React.FC = () => {
  const { t, language } = useLanguage();
  const { settings } = useSettings();
  const isAr = language === "ar";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title={t("pages.returns.title")}
        description={t("pages.returns.subtitle")}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#0077fe] uppercase tracking-wider">
          {t("pages.returns.badge")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          {t("pages.returns.title")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          {t("pages.returns.subtitle")}
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0077fe] flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">{t("pages.returns.exchangeTitle")}</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {t("pages.returns.exchangeDesc")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">{t("pages.returns.warrantyTitle")}</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {t("pages.returns.warrantyDesc")}
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0077fe]" /> 1. {t("pages.returns.eligibilityTitle")}
          </h2>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>{t("pages.returns.eligibilityDesc")}</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0077fe]" /> 2. {t("pages.returns.processTitle")}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {t("pages.returns.processDesc")}
          </p>
        </section>
      </div>

      {/* Assistance CTA */}
      <div className="p-8 bg-[#15161d] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold">{t("pages.faq.needMoreHelp")}</h3>
          <p className="text-xs text-gray-400 mt-1">{t("pages.contact.subtitle")}</p>
        </div>
        <a
          href={`https://wa.me/${(settings.whatsapp || "212661123456").replace(/[^\d]/g, "")}?text=${encodeURIComponent(
            isAr ? "مرحباً، أود الاستفسار عن خدمة الضمان." : "Bonjour, je souhaite une assistance garantie."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          <MessageCircle className="w-4 h-4" /> {t("pages.faq.whatsappCta")}
        </a>
      </div>
    </div>
  );
};
