import React from "react";
import { Scale, CheckCircle2, AlertCircle } from "lucide-react";
import { SEO } from "../components/SEO";

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="Terms of Service"
        description="Jabour Phone Terms of Service and Conditions of Sale. Transparent customer agreements and store policies."
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          Legal Agreement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Last revised: November 2026. Please read these terms carefully before placing orders.
        </p>
      </div>

      {/* Main Content */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm text-xs text-gray-600 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#d10024]" /> 1. Overview &amp; Acceptance
          </h2>
          <p>
            By accessing or purchasing from the Jabour Phone website, storefront, or official WhatsApp channels, you agree to be bound by these Terms of Service. These terms govern all sales, warranties, and device transactions.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#d10024]" /> 2. Pricing &amp; Availability
          </h2>
          <p>
            All listed prices are denominated in USD (or local currency as displayed) and reflect verified inventory in stock. While we strive for absolute accuracy, in the rare event of an inadvertent typographical pricing error, we reserve the right to contact the customer and clarify or cancel the affected order prior to physical dispatch.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#d10024]" /> 3. Order Placement &amp; Fulfillment
          </h2>
          <p>
            Orders placed via the website or WhatsApp constitute an offer to purchase. An order is formally accepted and binding once confirmed by our dispatch team via phone or messaging. Cash on Delivery requires payment of the exact invoice total upon package receipt.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-[#d10024]" /> 4. Warranty &amp; Limitation of Liability
          </h2>
          <p>
            Warranties cover factory defects under normal operating conditions. Jabour Phone is not liable for data loss stored on devices. Customers are strongly encouraged to maintain independent backups of their contacts, photos, and files prior to submitting any device for warranty bench inspection.
          </p>
        </section>
      </div>
    </div>
  );
};
