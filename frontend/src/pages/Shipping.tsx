import React from "react";
import { Link } from "react-router-dom";
import { Truck, Clock, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { SEO } from "../components/SEO";

export const Shipping: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="Shipping & Delivery Policy"
        description="Learn about Jabour Phone shipping policies, Cash on Delivery courier options, delivery timeframes, and inspection rights."
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          Courier &amp; Delivery Logistics
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          Shipping &amp; Delivery
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Fast, insured delivery across all regions with verified bench-inspection before every dispatch.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d10024] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">Next-Day Dispatch</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Orders confirmed by 4:00 PM are verified on the diagnostic bench and handed to our courier partners for next-day transit.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">Cash On Delivery</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Zero upfront risk. Pay cash directly to the delivery courier once your package arrives at your home or workplace.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">Insured Transit</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Every device is packed in tamper-evident security packaging with shock absorption. Full replacement if damaged in transit.
          </p>
        </div>
      </div>

      {/* Main Content Policy */}
      <div className="bg-white border border-gray-200 rounded-2xl p-8 space-y-8 shadow-sm">
        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#d10024]" /> 1. Delivery Rates &amp; Schedules
          </h2>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>
              We partner with trusted nationwide courier networks to deliver orders promptly and securely.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li><strong>Central &amp; Major Cities:</strong> 24 to 48 business hours.</li>
              <li><strong>Regional / Outlying Districts:</strong> 2 to 3 business days.</li>
              <li><strong>Delivery Fee:</strong> Flat rate calculated at checkout based on destination zone. Free shipping offers may apply during promotions.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#d10024]" /> 2. Package Inspection Rights
          </h2>
          <div className="text-xs text-gray-600 leading-relaxed space-y-2">
            <p>
              At Jabour Phone, customer confidence is paramount. When the courier delivers your package:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>You may inspect the outer box and security seals for any evidence of tampering.</li>
              <li>Verify that the delivery receipt matches your order details.</li>
              <li>Once confirmed, pay the exact cash amount stated on the official invoice.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-black uppercase tracking-tight text-[#15161d] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#d10024]" /> 3. Order Verification Call
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            Before dispatching higher-value smartphone and hardware orders, our dispatch coordinator will place a quick confirmation call or WhatsApp message to re-confirm your address and availability.
          </p>
        </section>
      </div>

      {/* Track order CTA */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#15161d]">Already have an active order?</h3>
          <p className="text-xs text-gray-500 mt-0.5">Track your bench verification and shipping status live.</p>
        </div>
        <Link
          to="/track"
          className="px-5 py-2.5 bg-[#15161d] hover:bg-[#d10024] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-2"
        >
          Track My Order <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
