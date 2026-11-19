import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Loader2 } from "lucide-react";

export const Footer: React.FC = () => {
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
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">
              Jabour Phone<span className="text-[#d10024]">.</span>
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Technology, without the markup. We stock what we would buy ourselves,
              publish the real specification measured on our bench, and price it without the theatre.
            </p>
          </div>

          {/* Quick shop */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Shop</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=Laptops" className="hover:text-[#d10024] transition">
                  Laptops
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Audio" className="hover:text-[#d10024] transition">
                  Audio &amp; ANC
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Keyboards%20%26%20mice" className="hover:text-[#d10024] transition">
                  Keyboards &amp; mice
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Desktops%20%26%20displays" className="hover:text-[#d10024] transition">
                  Desktops &amp; displays
                </Link>
              </li>
            </ul>
          </div>

          {/* Help & Policies */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Why Us</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#d10024] transition">
                  Bench Testing Protocol
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d10024] transition">
                  Two Year Warranty
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d10024] transition">
                  30 Day Returns
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#d10024] transition">
                  Free Next-Day Delivery
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

        <div className="mt-12 pt-8 border-t border-[#2b2d42] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 Jabour Phone. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Bench-tested hardware without markups.</p>
        </div>
      </div>
    </footer>
  );
};
