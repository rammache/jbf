import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, HelpCircle, Phone, MessageCircle } from "lucide-react";
import { SEO } from "../components/SEO";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    category: "Ordering & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We primarily operate via Cash on Delivery (COD). You only hand over payment once the courier delivers your package to your doorstep. You can inspect the outer packaging and security seal before completing payment."
  },
  {
    category: "Ordering & Payment",
    question: "Can I place an order directly through WhatsApp?",
    answer:
      "Yes! Every product page features an 'Order via WhatsApp' button. Clicking it opens a pre-composed chat with Jabour Phone referencing the exact product, price, and finish you want to purchase."
  },
  {
    category: "Ordering & Payment",
    question: "How do I know my order is confirmed?",
    answer:
      "Upon submitting checkout or ordering on WhatsApp, you will receive an immediate order reference ID. Our dispatch team also contacts you via phone or WhatsApp to verify your delivery address before shipment."
  },
  {
    category: "Testing & Quality",
    question: "What is the Jabour Phone Quality Guarantee?",
    answer:
      "Every device we sell is thoroughly inspected by our technicians. We verify battery health, display responsiveness, cellular and Wi-Fi connectivity, speaker clarity, and authentic IMEI registration prior to dispatch."
  },
  {
    category: "Testing & Quality",
    question: "Are your phones and hardware 100% genuine?",
    answer:
      "Yes, absolutely. We source all hardware directly from authorized distributors. Every device carries authentic serial numbers and is backed by official manufacturer warranties."
  },
  {
    category: "Delivery & Shipping",
    question: "How long does delivery take?",
    answer:
      "Orders placed before 4:00 PM are typically dispatched the same day for next-business-day delivery in central zones. Remote or regional destinations take between 2 to 3 business days."
  },
  {
    category: "Delivery & Shipping",
    question: "Can I track my order status?",
    answer:
      "Yes! Visit our dedicated Order Tracking page, input your Order Reference ID and your email address, and you can view live verification, packing, and dispatch progress."
  },
  {
    category: "Warranty & Returns",
    question: "What warranty is included with my purchase?",
    answer:
      "Every new smartphone and tablet includes our official 1-year warranty against hardware manufacturer defects, handled directly through our team rather than third-party bureaucracy."
  },
  {
    category: "Warranty & Returns",
    question: "What is your return policy?",
    answer:
      "We offer a 14-day exchange and return policy for manufacturer defects. If a device has any verified factory fault, we provide immediate exchange, repair, or refund. Items must be returned with all original box accessories and packaging."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(FAQ_DATA.map((item) => item.category)))];

  const filtered =
    selectedCategory === "All"
      ? FAQ_DATA
      : FAQ_DATA.filter((item) => item.category === selectedCategory);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="Frequently Asked Questions (FAQ)"
        description="Find answers to common questions about Jabour Phone orders, Cash on Delivery, device inspection, delivery times, and warranty."
      />

      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          Help &amp; Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xl mx-auto">
          Everything you need to know about purchasing, warranty coverage, quality inspection, and delivery.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition ${
              selectedCategory === cat
                ? "bg-[#15161d] text-white shadow"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {filtered.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all shadow-xs"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition"
              >
                <span className="text-sm font-bold text-[#15161d]">{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-gray-500 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-[#d10024]" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help callout */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center space-y-4">
        <HelpCircle className="w-8 h-8 text-[#d10024] mx-auto" />
        <h3 className="text-base font-bold text-[#15161d]">Have a question not listed here?</h3>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Our team is available 6 days a week to clarify technical specifications, stock counts, or bulk orders.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-[#15161d] hover:bg-[#a7001d] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-2"
          >
            <Phone className="w-3.5 h-3.5" /> Contact Us
          </Link>
          <a
            href="https://wa.me/96170123456"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center gap-2"
          >
            <MessageCircle className="w-3.5 h-3.5" /> Chat On WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
