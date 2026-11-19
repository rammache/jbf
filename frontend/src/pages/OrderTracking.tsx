import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Package,
  CheckCircle,
  Truck,
  Clock,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin
} from "lucide-react";
import { SEO } from "../components/SEO";

interface TrackedOrderItem {
  id: string;
  productTitle: string;
  selectedFinish: string | null;
  quantity: number;
  price: number;
}

interface TrackedOrder {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  customerName: string;
  customerAddress: string;
  items: TrackedOrderItem[];
}

export const OrderTracking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [contact, setContact] = useState(searchParams.get("email") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !contact.trim()) {
      setError("Please provide both your order reference and the email address used during checkout.");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: orderId.trim(),
          contact: contact.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setError(data.error || "No order was found matching those details.");
      }
    } catch {
      setError("Unable to connect to order tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: string) => {
    const s = status.toUpperCase();
    if (s === "DELIVERED") return 4;
    if (s === "SHIPPED") return 3;
    if (s === "COMPLETED" || s === "CONFIRMED" || s === "PROCESSING") return 2;
    return 1;
  };

  const currentStep = order ? getStatusStep(order.status) : 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEO
        title="Track Your Order"
        description="Check live progress, bench verification status, and delivery transit of your Jabour Phone order."
      />

      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
          Live Order Status
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight uppercase">
          Track Your Order
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-lg mx-auto">
          Enter your Order ID (from checkout or confirmation) and your email address to view real-time fulfillment progress.
        </p>
      </div>

      {/* Inquiry Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Order ID / Reference *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Checkout Email Address *
              </label>
              <input
                type="email"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="The email you entered at checkout"
                className="w-full px-3.5 py-2.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#15161d] hover:bg-[#d10024] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" /> Track Order Status
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 text-xs">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div>
            <p className="font-bold">Lookup Error</p>
            <p className="mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Order Results */}
      {order && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-8 shadow-sm">
          {/* Header summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Order Found
              </span>
              <h2 className="text-lg font-black text-[#15161d] font-mono break-all">
                {order.id}
              </h2>
              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
                <span>·</span>
                <span className="font-bold text-[#d10024]">
                  ${order.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2 })} (Cash on Delivery)
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200 text-xs font-bold text-[#d10024] uppercase tracking-wider">
              <Package className="w-4 h-4" /> Status: {order.status}
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Fulfillment Timeline
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div
                className={`p-4 rounded-xl border text-center space-y-2 ${
                  currentStep >= 1 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                    currentStep >= 1 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-gray-900">Order Placed</p>
                <p className="text-[10px] text-gray-500">Recorded in store</p>
              </div>

              <div
                className={`p-4 rounded-xl border text-center space-y-2 ${
                  currentStep >= 2 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                    currentStep >= 2 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-gray-900">Bench Verified</p>
                <p className="text-[10px] text-gray-500">Hardware &amp; specs inspected</p>
              </div>

              <div
                className={`p-4 rounded-xl border text-center space-y-2 ${
                  currentStep >= 3 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                    currentStep >= 3 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-gray-900">Out For Delivery</p>
                <p className="text-[10px] text-gray-500">With delivery courier</p>
              </div>

              <div
                className={`p-4 rounded-xl border text-center space-y-2 ${
                  currentStep >= 4 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${
                    currentStep >= 4 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                  }`}
                >
                  <Package className="w-4 h-4" />
                </div>
                <p className="text-xs font-bold text-gray-900">Delivered</p>
                <p className="text-[10px] text-gray-500">Completed at doorstep</p>
              </div>
            </div>
          </div>

          {/* Delivery & Items details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Delivery Details
              </h3>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs space-y-1">
                <p><span className="font-semibold text-gray-700">Recipient:</span> {order.customerName}</p>
                <p className="flex items-start gap-1 text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{order.customerAddress}</span>
                </p>
                <p><span className="font-semibold text-gray-700">Payment:</span> Cash On Delivery</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Ordered Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{item.productTitle}</p>
                      {item.selectedFinish && (
                        <p className="text-[10px] text-gray-500">Finish: {item.selectedFinish}</p>
                      )}
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-[#15161d]">
                      ${(item.price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
