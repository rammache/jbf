import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { SEO } from "../components/SEO";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";

export const Shipping: React.FC = () => {
  const { settings, formatPrice } = useSettings();
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title={t("pages.shipping.title")}
        description={t("pages.shipping.subtitle")}
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#0077fe] uppercase tracking-wider">
          {t("pages.shipping.badge")}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          {t("pages.shipping.title")}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          {t("pages.shipping.subtitle")}
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0077fe] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">{t("pages.shipping.nextDayTitle")}</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {t("pages.shipping.nextDayDesc")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">{t("pages.shipping.codTitle")}</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {t("pages.shipping.codDesc")}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">{t("pages.shipping.insuredTitle")}</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {t("pages.shipping.insuredDesc")}
          </p>
        </div>
      </div>

      {/* Main Content Policy */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0077fe]" /> 1. {t("pages.shipping.zonesTitle")}
          </h2>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>
              {t("pages.shipping.zonesDesc")}
            </p>
            <p className="font-semibold text-gray-800">
              {formatPrice(settings.shippingFee)} - {t("announcements.freeShipping")}
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0077fe]" /> 2. {t("pages.shipping.processTitle")}
          </h2>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>
              {t("pages.shipping.processDesc")}
            </p>
          </div>
        </section>
      </div>

      {/* Quick link to catalog */}
      <div className="p-8 bg-[#15161d] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold">{t("home.shopByDepartment")}</h3>
          <p className="text-xs text-gray-400 mt-1">{t("announcements.freeShipping")}</p>
        </div>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#0077fe] hover:bg-[#005fc9] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          {t("hero.ctaShop")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
};
