import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";

export const CartDrawer: React.FC = () => {
  const { formatPrice } = useSettings();
  const { t } = useLanguage();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    shippingFee,
    freeShippingThreshold,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
    grandTotal,
    setIsCheckoutOpen
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isCartOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCartOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#15161d] text-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#0077fe]" />
              <h2 className="text-lg font-bold">{t("cart.title")} ({items.length})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">{t("cart.empty")}</h3>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {t("cart.emptyDesc")}
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-block mt-2 px-6 py-2.5 bg-[#15161d] hover:bg-[#0077fe] text-white text-xs font-bold uppercase tracking-wider rounded transition"
                >
                  {t("cart.startShopping")}
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.key}
                  className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded bg-white flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/product/${item.handle}`}
                          onClick={() => setIsCartOpen(false)}
                          className="font-bold text-sm text-[#15161d] hover:text-[#0077fe] line-clamp-1"
                        >
                          {item.title}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-gray-400 hover:text-red-600 transition ml-2 rtl:ml-0 rtl:mr-2"
                          aria-label={t("cart.removeItem")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.selectedFinish && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {t("cart.finish")}: <span className="font-semibold text-gray-700">{item.selectedFinish}</span>
                        </p>
                      )}

                      <p className="text-sm font-bold text-[#0077fe] mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-300 rounded bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded-l rtl:rounded-l-none rtl:rounded-r"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded-r rtl:rounded-r-none rtl:rounded-l"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>{t("cart.subtotal")}</span>
                  <span className="font-bold text-gray-900">{formatPrice(cartTotal)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-green-700 font-bold">
                    <span>{t("cart.discount")} ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{t("cart.shipping")}</span>
                  <span className="font-bold text-green-700">
                    {shippingFee === 0 ? t("common.free") : formatPrice(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#15161d] pt-2 border-t">
                  <span>{t("cart.total")}</span>
                  <span className="text-[#0077fe]">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Promo Coupon Box */}
              <div className="pt-1">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-xs">
                    <span className="font-bold text-green-800">
                      {t("cart.couponApplied")} (<span className="font-mono">{appliedCoupon.code}</span>)
                    </span>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-red-600 hover:underline"
                    >
                      {t("cart.removeCoupon")}
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setCouponError("");
                      setApplyingCoupon(true);
                      const res = await applyCoupon(couponInput);
                      if (!res.success) {
                        setCouponError(res.error || t("cart.invalidCoupon"));
                      } else {
                        setCouponInput("");
                      }
                      setApplyingCoupon(false);
                    }}
                    className="space-y-1"
                  >
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder={t("cart.couponCode")}
                        className="flex-1 rounded border border-gray-300 px-2.5 py-1.5 text-xs font-mono uppercase font-bold focus:border-[#0077fe] focus:outline-none"
                      />
                      <button
                        type="submit"
                        disabled={applyingCoupon || !couponInput.trim()}
                        className="rounded bg-[#15161d] px-3 py-1.5 text-xs font-bold text-white hover:bg-black transition disabled:opacity-50"
                      >
                        {t("cart.apply")}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[11px] font-semibold text-red-600">{couponError}</p>
                    )}
                  </form>
                )}
              </div>

              {cartTotal < freeShippingThreshold && (
                <div className="p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 text-center font-medium">
                  {t("cart.freeShippingProgress", { amount: formatPrice(freeShippingThreshold - cartTotal) })}{" "}
                  <span className="font-bold text-green-700">{t("cart.freeShippingBadge")}</span>
                </div>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full py-3 bg-[#0077fe] hover:bg-[#005fc9] text-white text-sm font-bold uppercase tracking-wider rounded shadow-md flex items-center justify-center gap-2 transition"
                >
                  {t("cart.checkout")} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 text-xs font-bold uppercase tracking-wider rounded transition"
                >
                  {t("cart.continueShopping")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
