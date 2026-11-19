import React from "react";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { SEO } from "../components/SEO";

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="Privacy Policy"
        description="Jabour Phone Privacy Policy. How we protect your personal information, delivery contacts, and customer privacy."
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          Data Protection &amp; Confidentiality
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Last updated: November 2026. We value your trust and safeguard all customer information.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm text-xs text-gray-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#d10024]" /> 1. Information We Collect
          </h2>
          <p>
            When you browse our store, place an order, or contact us through WhatsApp, we collect only the minimal data required to fulfill your order and provide warranty service:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li><strong>Order Information:</strong> Full name, delivery address, phone/WhatsApp number, and email.</li>
            <li><strong>Device Records:</strong> Hardware serial numbers and order invoices for warranty validation.</li>
            <li><strong>Technical Analytics:</strong> Standard browser session info for security and cart state persistence.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#d10024]" /> 2. How We Use Your Data
          </h2>
          <p>Your data is used strictly for:</p>
          <ul className="list-disc pl-5 space-y-1 text-gray-700">
            <li>Dispatching your order through our authorized courier delivery partners.</li>
            <li>Sending order confirmations, tracking references, and delivery updates.</li>
            <li>Verifying warranty status should your device require technical inspection or repair service.</li>
            <li>Customer newsletter updates (only if explicitly opted-in).</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#d10024]" /> 3. We Never Sell Your Data
          </h2>
          <p>
            Jabour Phone does not sell, rent, license, or monetize customer contact records with advertising networks or third-party marketers. Your contact number and address are shared solely with our contracted courier to execute physical doorstep delivery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#d10024]" /> 4. Data Security &amp; Retention
          </h2>
          <p>
            All administrative access is protected with strict session authentication and encrypted connections. You may contact our support team at any time to request inspection, modification, or removal of your contact details from our records.
          </p>
        </section>
      </div>
    </div>
  );
};
