import React, { useState } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";

export const CheckoutModal: React.FC = () => {
  const { items, cartTotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !address) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          customerEmail: email,
          customerAddress: address,
          items: items.map((i) => ({
            productId: i.productId,
            title: i.title,
            selectedFinish: i.selectedFinish,
            quantity: i.quantity,
            price: i.price
          }))
        })
      });

      const data = await response.json();
      if (data.success) {
        setOrderId(data.data.id);
        clearCart();
      } else {
        setError(data.error || "Failed to place order.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to communicate with server.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setOrderId(null);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden z-10 border border-gray-200">
        <div className="p-5 bg-[#15161d] text-white flex items-center justify-between">
          <h2 className="text-lg font-bold">Express Checkout</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {orderId ? (
            <div className="text-center py-6 space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-black text-gray-900">Order Confirmed!</h3>
              <p className="text-xs text-gray-500">
                Thank you for your order. We are preparing your hardware bench verification.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border text-left text-xs space-y-1">
                <p><span className="font-semibold text-gray-700">Order ID:</span> {orderId}</p>
                <p><span className="font-semibold text-gray-700">Recipient:</span> {name}</p>
                <p><span className="font-semibold text-gray-700">Email:</span> {email}</p>
                <p><span className="font-semibold text-gray-700">Status:</span> Bench Testing &amp; Packing</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-full py-3 bg-[#15161d] hover:bg-[#d10024] text-white font-bold text-xs uppercase tracking-wider rounded transition"
              >
                Back to Store
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Shipping Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="7 Chandler Way, Manchester M1 2AB, UK"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-[#d10024] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                <span className="font-semibold text-gray-600">Total Due (with 2yr warranty):</span>
                <span className="font-black text-lg text-[#d10024]">
                  ${cartTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#d10024] hover:bg-[#a7001d] disabled:bg-gray-400 text-white font-bold text-xs uppercase tracking-wider rounded shadow-md flex items-center justify-center gap-2 transition"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Place Order Now"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
