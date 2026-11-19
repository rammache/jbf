import React, { useState } from "react";
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle } from "lucide-react";
import { SEO } from "../components/SEO";

export const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    setName("");
    setEmail("");
    setPhone("");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <SEO
        title="Contact Us"
        description="Get in touch with Jabour Phone. Phone, WhatsApp, direct email, location, and bench testing customer support."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          Direct Customer Service
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          Speak With Our Team
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Questions about phone specifications, stock availability, bench test results, or custom orders? Reach out directly.
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d10024] flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">Phone Support</h2>
          <p className="text-xs text-gray-500">Direct phone line for quick stock inquiries and orders.</p>
          <a
            href="tel:+96170123456"
            className="block text-sm font-bold text-[#15161d] hover:text-[#d10024] transition font-mono"
          >
            +961 70 123 456
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 text-green-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">WhatsApp Chat</h2>
          <p className="text-xs text-gray-500">Instant answers, photo requests, and direct chat orders.</p>
          <a
            href="https://wa.me/96170123456?text=Hello%20Jabour%20Phone,%20I%20have%20an%20inquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 transition"
          >
            Chat On WhatsApp &rarr;
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">Direct Email</h2>
          <p className="text-xs text-gray-500">Warranty inquiries, business requests, and general support.</p>
          <a
            href="mailto:info@jabourphone.com"
            className="block text-sm font-bold text-[#15161d] hover:text-[#d10024] transition"
          >
            info@jabourphone.com
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-gray-100 text-gray-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-black uppercase text-[#15161d]">Working Hours</h2>
          <p className="text-xs text-gray-500">Showroom &amp; dispatch center schedule.</p>
          <p className="text-xs font-semibold text-gray-800">
            Mon - Sat: 9:00 AM - 8:00 PM<br />
            Sunday: Closed
          </p>
        </div>
      </div>

      {/* Main Grid: Inquiry Form + Store Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Contact Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-[#15161d]">
              Send Us a Message
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              We respond to inquiries within 2 hours during store hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
              <h3 className="text-base font-bold text-green-900">Message Received!</h3>
              <p className="text-xs text-green-800 leading-relaxed max-w-sm mx-auto">
                Thank you for reaching out to Jabour Phone. Our team will review your inquiry and contact you shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-green-900 underline"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sami Jabour"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sami@example.com"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+961 70 000 000"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Phone Availability"
                    className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can our bench team assist you?"
                  className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#15161d] hover:bg-[#d10024] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow"
              >
                <Send className="w-4 h-4" /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Store Location Card */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 text-[#d10024] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase text-[#15161d]">Store Location &amp; Bench</h2>
                <p className="text-xs text-gray-500">Main Commercial Center, Mount Lebanon</p>
              </div>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Visit our testing bench to inspect hardware in person before purchase. We keep popular models unboxed for tactile evaluation, display testing, and battery health verification.
            </p>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-2">
              <p className="font-bold text-gray-800">Delivery &amp; Courier Coverage:</p>
              <p className="text-gray-600">
                All regions covered with Cash on Delivery (COD). Inspection of package condition is welcomed prior to payment.
              </p>
            </div>

            <div className="pt-2">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded-lg transition"
              >
                <MapPin className="w-3.5 h-3.5" /> View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
