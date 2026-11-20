import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, CheckCircle, Loader2, ArrowRight, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

const CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fès",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "El Jadida",
  "Nador",
  "Mohammédia",
  "Autre ville / Other City"
];

export const CheckoutModal: React.FC = () => {
  const { settings, formatPrice } = useSettings();
  const {
    items,
    cartTotal,
    shippingFee,
    appliedCoupon,
    discountAmount,
    grandTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart
  } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD">("COD");

  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isCheckoutOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill out all required fields marked with an asterisk (*).");
      return;
    }

    if (phone.trim().replace(/\D/g, "").length < 6) {
      setError("Please provide a valid contact phone number with at least 6 digits.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim(),
          customerAddress: address.trim(),
          city: city.trim(),
          notes: notes.trim() || undefined,
          paymentMethod,
          couponCode: appliedCoupon ? appliedCoupon.code : undefined,
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            selectedFinish: i.selectedFinish || null,
            quantity: i.quantity,
            price: i.price
          }))
        })
      });

      const data = await response.json();
      if (data.success && data.data) {
        setConfirmedOrder(data.data);
        clearCart();
      } else {
        setError(data.error || "Failed to place order. Please review your cart and details.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to communicate with checkout service.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setConfirmedOrder(null);
    setError(null);
  };

  // WhatsApp confirmation message link
  const orderRef = confirmedOrder?.orderNumber || confirmedOrder?.id || "";
  const whatsappText = encodeURIComponent(
    `Hello ${settings.storeName}, I just placed order #${orderRef} for ${formatPrice(confirmedOrder?.totalAmount || grandTotal)}. Please confirm receipt and dispatch schedule.`
  );
  const cleanWhatsapp = (settings.whatsapp || "96170123456").replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${whatsappText}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center"
    >
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden z-10 border border-gray-200">
        {/* Modal Header */}
        <div className="p-5 bg-[#15161d] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#d10024]" />
            <h2 id="checkout-modal-title" className="text-base sm:text-lg font-bold">
              {confirmedOrder ? "Order Confirmation" : "Cash on Delivery Checkout"}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition"
            aria-label="Close checkout modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[85vh] overflow-y-auto">
          {confirmedOrder ? (
            <div className="text-center py-4 space-y-5">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <div>
                <span className="text-[11px] font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Order Successfully Placed
                </span>
                <h3 className="text-2xl font-black text-gray-900 mt-2">Thank You, {name}!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Your order is received and queued for quality check and courier dispatch.
                </p>
              </div>

              {/* Order Reference Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-600">Order Number:</span>
                  <code className="font-mono text-sm font-black text-[#d10024] bg-white px-2 py-0.5 border rounded">
                    {confirmedOrder.orderNumber}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Recipient:</span>
                  <span className="font-bold text-gray-800">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact Phone:</span>
                  <span className="font-bold text-gray-800">{confirmedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Destination:</span>
                  <span className="font-bold text-gray-800">
                    {confirmedOrder.city}, {confirmedOrder.customerAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-bold text-gray-800">
                    {confirmedOrder.paymentMethod === "CARD" ? "Card on Delivery" : "Cash on Delivery (COD)"}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm">
                  <span className="font-bold text-gray-700">Total Due Upon Delivery:</span>
                  <span className="font-black text-[#d10024]">
                    {formatPrice(confirmedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to={`/track?id=${encodeURIComponent(confirmedOrder.orderNumber)}&email=${encodeURIComponent(confirmedOrder.customerEmail)}`}
                  onClick={handleClose}
                  className="w-full py-3 bg-[#d10024] hover:bg-[#a7001d] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                >
                  Track Order Status <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" /> Message Jabour on WhatsApp
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-lg transition"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {/* Delivery Guarantee Banner */}
              <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span>
                  <strong>Pay Upon Delivery:</strong> Inspect your phone package in front of courier before paying.
                </span>
              </div>

              {/* Customer Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Michel Aoun"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                />
              </div>

              {/* Email Address & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="michel@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Contact Phone *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 6 12 34 56 78"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Delivery City / Region *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d10024] focus:outline-none bg-white"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Street Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Detailed Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street name, building, floor, apartment number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Delivery Notes / Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Near pharmacy, ring bell 3"
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition text-xs ${paymentMethod === "COD"
                      ? "border-[#d10024] bg-red-50/40 text-gray-900 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="text-[#d10024] focus:ring-[#d10024]"
                    />
                    <div>
                      <p>Cash on Delivery</p>
                      <p className="text-[10px] text-gray-500 font-normal">Pay cash to courier</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition text-xs ${paymentMethod === "CARD"
                      ? "border-[#d10024] bg-red-50/40 text-gray-900 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                      className="text-[#d10024] focus:ring-[#d10024]"
                    />
                    <div>
                      <p>Card on Delivery</p>
                      <p className="text-[10px] text-gray-500 font-normal">POS terminal card</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Cart Items ({items.length})</span>
                  <span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>Coupon Discount ({appliedCoupon.code}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Courier Delivery:</span>
                  <span className="font-bold text-green-700">
                    {shippingFee === 0 ? `FREE (Orders over ${formatPrice(settings.freeShippingThreshold)})` : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t font-black text-gray-900">
                  <span>Total Due Upon Delivery:</span>
                  <span className="text-lg text-[#d10024]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#d10024] hover:bg-[#a7001d] disabled:bg-gray-400 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying Stock &amp; Ordering...
                  </>
                ) : (
                  <>Place Order Now (Cash on Delivery)</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
