import React from "react";
import { Link } from "react-router-dom";
import { RotateCcw, ShieldCheck, CheckCircle2, AlertCircle, Phone } from "lucide-react";
import { SEO } from "../components/SEO";

export const Returns: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="Returns & Warranty Policy"
        description="Jabour Phone 30-day return policy and 1-2 year warranty guarantee. Transparent terms, bench diagnostics, and hassle-free replacements."
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          Customer Protection &amp; Guarantee
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          Returns &amp; Warranty Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          We back every piece of hardware we sell with straightforward warranties and a 30-day return window.
        </p>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d10024] flex items-center justify-center">
            <RotateCcw className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">30-Day Return Window</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            If your item arrives with any manufacturing flaw or fails during initial bench testing, you have a full 30 days to request an exchange or return.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">1 to 2 Year Hardware Warranty</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            All new smartphones and electronics carry official warranty coverage against defects in motherboard, display, charging, and radios.
          </p>
        </div>
      </div>

      {/* Detailed Policy Sections */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#d10024]" /> 1. Return Eligibility
          </h2>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>To qualify for a return or replacement under our 30-day guarantee:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>The device must be in original condition without accidental physical damage, drops, or liquid ingress.</li>
              <li>All original accessories (charger, cable, documentation, SIM tray tool) and original packaging must be returned.</li>
              <li>Cloud accounts (iCloud, Google Account, Samsung Account) and security passcodes must be logged out and removed.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#d10024]" /> 2. Diagnostic Bench Verification
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            When a return is received at our facility, our technicians conduct a thorough diagnostic check on our testing bench. Once the issue is confirmed, your replacement or refund is processed within 24 to 48 hours.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-[#d10024]" /> 3. Exclusions
          </h2>
          <div className="text-xs text-gray-600 leading-relaxed space-y-1">
            <p>The following are not covered under warranty or return policy:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Physical screen shattering, cracks, or casing dents caused by drops.</li>
              <li>Liquid damage or submersion beyond manufacturer IP ratings.</li>
              <li>Unauthorized third-party disassembly, unofficial software rooting, or modified ROMs.</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Support CTA */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-base font-bold text-[#15161d]">Need to initiate a warranty or return claim?</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Contact our support team with your Order Reference ID. We will guide you through the return pickup.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-[#15161d] hover:bg-[#d10024] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> Contact Support Team
          </Link>
        </div>
      </div>
    </div>
  );
};
