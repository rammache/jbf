import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, ShieldCheck, CheckCircle2, ArrowRight, HeartHandshake } from "lucide-react";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { SEO } from "../components/SEO";
import { useSettings } from "../context/SettingsContext";

export const About: React.FC = () => {
  const { settings } = useSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <SEO
        title="About Us - Authentic Smartphones & Quality Service"
        description="Discover Jabour Phone: 100% genuine smartphones, multi-point device inspection, official warranties, and honest local customer care."
      />

      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs font-bold text-[#d10024] uppercase tracking-wider">
          <Smartphone className="w-4 h-4" /> The Jabour Phone Promise
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-[#15161d] tracking-tight">
          Technology Without The Gimmicks.
        </h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          {settings.aboutText ||
            "Jabour Phone was founded with a single mission: to deliver authentic smartphones and electronics with transparent pricing, official warranties, and honest customer support."}
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
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <ShieldCheck className="w-8 h-8 text-[#d10024]" />
          <h3 className="font-bold text-base text-[#15161d]">1. 100% Genuine Guaranteed</h3>
          <p className="text-gray-500 leading-relaxed">
            Every device in our catalog is authentic, factory sealed or certified pre-owned with verified IMEI numbers and full network carrier compatibility. No counterfeits, ever.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <CheckCircle2 className="w-8 h-8 text-[#d10024]" />
          <h3 className="font-bold text-base text-[#15161d]">2. Multi-Point Quality Inspection</h3>
          <p className="text-gray-500 leading-relaxed">
            Before any order leaves for delivery, our technicians verify battery health, screen touch accuracy, speaker clarity, and charging stability so your phone is ready to go out of the box.
          </p>
        </div>

        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm space-y-3">
          <HeartHandshake className="w-8 h-8 text-[#d10024]" />
          <h3 className="font-bold text-base text-[#15161d]">3. Official Warranty &amp; Direct Care</h3>
          <p className="text-gray-500 leading-relaxed">
            All devices come backed by authentic manufacturer or store warranties. If you need setup help or warranty assistance, reach Jabour directly via WhatsApp without automated call queues.
          </p>
        </div>
      </div>

      <div className="p-8 bg-[#15161d] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-xl font-bold">Looking for your next smartphone?</h3>
          <p className="text-xs text-gray-400 mt-1">Explore our verified catalog with Cash on Delivery nationwide.</p>
        </div>
        <Link
          to="/shop"
          className="px-6 py-3 bg-[#d10024] hover:bg-[#a7001d] text-white text-xs font-bold uppercase tracking-wider rounded transition flex items-center gap-2"
        >
          Explore Catalog <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
