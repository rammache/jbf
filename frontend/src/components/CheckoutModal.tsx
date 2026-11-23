import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { X, CheckCircle, Loader2, ArrowRight, MessageCircle, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";

const CITIES = [
  { fr: "Casablanca", ar: "الدار البيضاء" },
  { fr: "Rabat", ar: "الرباط" },
  { fr: "Marrakech", ar: "مراكش" },
  { fr: "Tanger", ar: "طنجة" },
  { fr: "Fès", ar: "فاس" },
  { fr: "Agadir", ar: "أكادير" },
  { fr: "Meknès", ar: "مكناس" },
  { fr: "Oujda", ar: "وجدة" },
  { fr: "Kénitra", ar: "القنيطرة" },
  { fr: "Tétouan", ar: "تطوان" },
  { fr: "Safi", ar: "آسفي" },
  { fr: "El Jadida", ar: "الجديدة" },
  { fr: "Nador", ar: "الناظور" },
  { fr: "Mohammédia", ar: "المحمدية" },
  { fr: "Autre ville", ar: "مدينة أخرى / منطقة أخرى" }
];

export const CheckoutModal: React.FC = () => {
  const { settings, formatPrice } = useSettings();
  const { t, language } = useLanguage();
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
      setError(t("checkout.errorRequired"));
      return;
    }

    if (phone.trim().replace(/\D/g, "").length < 6) {
      setError(t("checkout.errorPhone"));
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
        setError(data.error || t("checkout.errorFailed"));
      }
    } catch (err: any) {
      setError(err.message || t("checkout.errorFailed"));
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
  const totalStr = formatPrice(confirmedOrder?.totalAmount || grandTotal);
  const whatsappMsg =
    language === "ar"
      ? `مرحباً ${settings.storeName}، لقد قمت للتو بتأكيد الطلب رقم #${orderRef} بقيمة ${totalStr}. يرجى تأكيد موعد التوصيل.`
      : `Bonjour ${settings.storeName}, je viens de passer la commande #${orderRef} d'un montant de ${totalStr}. Merci de me confirmer la réception.`;
  const whatsappText = encodeURIComponent(whatsappMsg);
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
            <Truck className="w-5 h-5 text-[#0077fe]" />
            <h2 id="checkout-modal-title" className="text-base sm:text-lg font-bold">
              {confirmedOrder ? t("checkout.orderSuccess") : t("checkout.title")}
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
                  {t("checkout.orderSuccess")}
                </span>
                <h3 className="text-2xl font-black text-gray-900 mt-2">{name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {t("checkout.orderPlacedDesc", { orderNumber: confirmedOrder.orderNumber })}
                </p>
              </div>

              {/* Order Reference Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left rtl:text-right text-xs space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <span className="font-semibold text-gray-600">{t("tracking.orderNumber")}:</span>
                  <code className="font-mono text-sm font-black text-[#0077fe] bg-white px-2 py-0.5 border rounded">
                    {confirmedOrder.orderNumber}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.fullName")}:</span>
                  <span className="font-bold text-gray-800">{confirmedOrder.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.phone")}:</span>
                  <span className="font-bold text-gray-800">{confirmedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.city")}:</span>
                  <span className="font-bold text-gray-800">
                    {confirmedOrder.city}, {confirmedOrder.customerAddress}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("checkout.paymentMethod")}:</span>
                  <span className="font-bold text-gray-800">
                    {confirmedOrder.paymentMethod === "CARD" ? "Card on Delivery" : t("checkout.codTitle")}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 text-sm">
                  <span className="font-bold text-gray-700">{t("cart.total")}:</span>
                  <span className="font-black text-[#0077fe]">
                    {formatPrice(confirmedOrder.totalAmount)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to={`/track?id=${encodeURIComponent(confirmedOrder.orderNumber)}&email=${encodeURIComponent(confirmedOrder.customerEmail)}`}
                  onClick={handleClose}
                  className="w-full py-3 bg-[#0077fe] hover:bg-[#005fc9] text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5 shadow"
                >
                  {t("tracking.title")} <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-4 h-4" /> {t("checkout.whatsappConfirm")}
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-lg transition"
                >
                  {t("cart.continueShopping")}
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
                  <strong>{t("features.paymentTitle")}:</strong> {t("checkout.codDesc")}
                </span>
              </div>

              {/* Customer Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  {t("checkout.fullName")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex M."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0077fe] focus:outline-none"
                />
              </div>

              {/* Email Address & Contact Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {t("checkout.email")}
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0077fe] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    {t("checkout.phone")}
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+212 6 12 34 56 78"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0077fe] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  {t("checkout.city")}
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0077fe] focus:outline-none bg-white"
                >
                  {CITIES.map((c) => (
                      <option key={c.fr} value={c.fr}>
                        {language === "ar" ? c.ar : c.fr}
                      </option>
                  ))}
                    </select>
              </div>

              {/* Detailed Street Address */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  {t("checkout.address")}
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Quartier, Rue, N° d'immeuble, étage, appartement..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#0077fe] focus:outline-none"
                />
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  {t("checkout.notes")}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Near pharmacy, ring bell 3"
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#0077fe] focus:outline-none"
                />
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  {t("checkout.paymentMethod")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition text-xs ${paymentMethod === "COD"
                      ? "border-[#0077fe] bg-blue-50/40 text-gray-900 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="text-[#0077fe] focus:ring-[#0077fe]"
                    />
                    <div>
                      <p>{t("checkout.codTitle")}</p>
                      <p className="text-[10px] text-gray-500 font-normal">{t("features.paymentDesc")}</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-3 border rounded-xl cursor-pointer transition text-xs ${paymentMethod === "CARD"
                      ? "border-[#0077fe] bg-blue-50/40 text-gray-900 font-bold"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="CARD"
                      checked={paymentMethod === "CARD"}
                      onChange={() => setPaymentMethod("CARD")}
                      className="text-[#0077fe] focus:ring-[#0077fe]"
                    />
                    <div>
                      <p>{t("checkout.cardTitle")}</p>
                      <p className="text-[10px] text-gray-500 font-normal">{t("checkout.cardDesc")}</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")} ({items.length})</span>
                  <span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>{t("cart.discount")} ({appliedCoupon.code}):</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t("cart.shipping")}:</span>
                  <span className="font-bold text-green-700">
                    {shippingFee === 0 ? t("common.free") : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t font-black text-gray-900">
                  <span>{t("cart.total")}:</span>
                  <span className="text-lg text-[#0077fe]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0077fe] hover:bg-[#005fc9] disabled:bg-gray-400 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> {t("common.loading")}
                  </>
                ) : (
                  <>{t("checkout.confirmOrder")}</>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
