import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2, Phone, Mail, MapPin } from "lucide-react";
import { useCategories } from "../context/CategoryContext";
import { useSettings } from "../context/SettingsContext";
import { BrandLogo } from "./BrandLogo";

export const Footer: React.FC = () => {
  const { categories } = useCategories();
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage("Thanks for subscribing to Jabour Phone updates.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Subscription failed.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not connect to server.");
    }
  };

  return (
    <footer className="bg-[#15161d] text-gray-300 pt-16 pb-12 border-t border-[#2b2d42]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand info */}
          <div className="space-y-4">
            <BrandLogo variant="light" size="md" />
            <p className="text-xs text-gray-400 leading-relaxed">
              {settings.aboutText || "Technology without the markup. Certified smartphones, authentic accessories, and guaranteed electronics in Lebanon."}
            </p>
            <div className="space-y-1.5 pt-1 text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#d10024]" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#d10024]" />
                <span>{settings.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#d10024]" />
                <span>{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Quick shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-xs">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      to={`/shop?category=${encodeURIComponent(cat.slug || cat.name)}`}
                      className="hover:text-[#d10024] transition"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link to="/shop" className="hover:text-[#d10024] transition">
                    All Products
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Customer Care</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/track" className="hover:text-[#d10024] transition font-semibold text-gray-200">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#d10024] transition">
                  Contact Us &amp; Location
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#d10024] transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-[#d10024] transition">
                  Shipping &amp; Cash on Delivery
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-[#d10024] transition">
                  14-Day Returns &amp; Warranty
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d10024] transition">
                  Quality Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Newsletter</h3>
            <p className="text-xs text-gray-400 mb-3">
              Restocks, price drops and the occasional hardware teardown. No launch hype.
            </p>

            {status === "success" ? (
              <div className="flex items-center gap-2 text-green-400 text-xs font-semibold py-2">
                <Check className="w-4 h-4" /> {message}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-[#1e1f29] text-xs px-3 py-2.5 rounded-l text-white placeholder-gray-500 border border-gray-700 focus:outline-none focus:border-[#d10024]"
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="bg-[#d10024] hover:bg-[#a7001d] text-white text-xs font-bold uppercase px-4 py-2.5 rounded-r transition flex items-center justify-center"
                  >
                    {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
                  </button>
                </div>
                {status === "error" && (
                  <p className="text-xs text-red-400">{message}</p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2b2d42] flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p>© 2026 Jabour Phone. All rights reserved.</p>
            <p className="text-[11px] text-gray-500">
              Theme base inspired by <a href="https://colorlib.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-400">Colorlib</a> (CC BY 3.0). Full-stack platform custom developed for Jabour Phone.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <span>·</span>
            <Link to="/terms" className="hover:text-gray-300 transition">
              Terms of Service
            </Link>
            <span>·</span>
            <Link to="/about" className="hover:text-gray-300 transition">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
