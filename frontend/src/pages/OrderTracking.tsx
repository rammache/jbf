import React, { useState, useEffect } from "react";
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
  MapPin,
  XCircle,
  MessageCircle,
  ShieldCheck
} from "lucide-react";
import { SEO } from "../components/SEO";
import { useSettings } from "../context/SettingsContext";

interface TrackedOrderItem {
  id: string;
  productTitle: string;
  selectedFinish: string | null;
  quantity: number;
  price: number;
}

interface TrackedOrder {
  id: string;
  orderNumber?: string;
  status: string;
  createdAt: string;
  subtotal?: number;
  shippingFee?: number;
  totalAmount: number;
  customerName: string;
  customerAddress: string;
  city?: string;
  paymentMethod?: string;
  items: TrackedOrderItem[];
}

export const OrderTracking: React.FC = () => {
  const { settings, formatPrice } = useSettings();
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState(searchParams.get("id") || "");
  const [contact, setContact] = useState(searchParams.get("email") || searchParams.get("phone") || "");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-search if URL contains order ID and contact params
  useEffect(() => {
    const urlId = searchParams.get("id");
    const urlContact = searchParams.get("email") || searchParams.get("phone");
    if (urlId && urlContact && !order) {
      executeTrack(urlId, urlContact);
    }
  }, [searchParams]);

  const executeTrack = async (refId: string, contactVal: string) => {
    if (!refId.trim() || !contactVal.trim()) {
      setError("Please provide both your order reference and the contact email or phone used at checkout.");
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
          orderId: refId.trim(),
          contact: contactVal.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setOrder(data.data);
      } else {
        setError(data.error || "No order was found matching those details. Please check your order reference and email/phone.");
      }
    } catch {
      setError("Unable to connect to order tracking service. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    executeTrack(orderId, contact);
  };

  const getStatusStep = (status: string) => {
    const s = status.toUpperCase();
    if (s === "DELIVERED") return 4;
    if (s === "SHIPPED") return 3;
    if (s === "CONFIRMED" || s === "PROCESSING") return 2;
    if (s === "PENDING") return 1;
    return 1;
  };

  const isCancelled = order?.status.toUpperCase() === "CANCELLED";
  const isReturned = order?.status.toUpperCase() === "RETURNED";
  const currentStep = order ? getStatusStep(order.status) : 1;

  const orderDisplayRef = order?.orderNumber || order?.id || "";
  const cleanWhatsappNumber = (settings.whatsapp || "96170123456").replace(/[^\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Hello ${settings.storeName}, I am inquiring about my order #${orderDisplayRef}.`
  )}`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <SEO
        title="Track Your Order"
        description="Check live progress, quality inspection status, and delivery transit of your Jabour Phone order."
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
          Enter your Order Reference (e.g. <code>JP-2611-1001</code>) and your checkout email or phone number to view real-time fulfillment progress.
        </p>
      </div>

      {/* Inquiry Form */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleTrack} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Order Reference / Number *
              </label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. JP-2611-1001"
                className="w-full px-3.5 py-2.5 text-xs font-mono border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Checkout Email or Phone *
              </label>
              <input
                type="text"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="The email or phone number you entered at checkout"
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
              <h2 className="text-xl font-black text-[#15161d] font-mono">
                {order.orderNumber || order.id}
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
                  {formatPrice(order.totalAmount)} ({order.paymentMethod === "CARD" ? "Card on Delivery" : "Cash on Delivery"})
                </span>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border ${isCancelled
                ? "bg-red-50 border-red-300 text-red-700"
                : isReturned
                  ? "bg-gray-100 border-gray-300 text-gray-700"
                  : order.status === "DELIVERED"
                    ? "bg-green-50 border-green-300 text-green-700"
                    : "bg-red-50 border-red-200 text-[#d10024]"
                }`}
            >
              {isCancelled ? (
                <XCircle className="w-4 h-4 text-red-600" />
              ) : (
                <Package className="w-4 h-4" />
              )}
              Status: {order.status}
            </div>
          </div>

          {/* Cancellation Alert if applicable */}
          {isCancelled && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 space-y-1">
              <p className="font-bold">This order has been cancelled.</p>
              <p>All items have been restored to inventory. If you have questions, please contact our support team on WhatsApp.</p>
            </div>
          )}

          {/* Progress Timeline (if not cancelled) */}
          {!isCancelled && !isReturned && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Fulfillment Timeline
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                <div
                  className={`p-4 rounded-xl border text-center space-y-2 ${currentStep >= 1 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${currentStep >= 1 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-gray-900">Order Placed</p>
                  <p className="text-[10px] text-gray-500">Recorded in store</p>
                </div>

                <div
                  className={`p-4 rounded-xl border text-center space-y-2 ${currentStep >= 2 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${currentStep >= 2 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    <Clock className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-gray-900">Quality Inspected</p>
                  <p className="text-[10px] text-gray-500">Device &amp; accessories inspected</p>
                </div>

                <div
                  className={`p-4 rounded-xl border text-center space-y-2 ${currentStep >= 3 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${currentStep >= 3 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    <Truck className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-gray-900">Out For Delivery</p>
                  <p className="text-[10px] text-gray-500">With delivery courier</p>
                </div>

                <div
                  className={`p-4 rounded-xl border text-center space-y-2 ${currentStep >= 4 ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto text-xs font-bold ${currentStep >= 4 ? "bg-green-600 text-white" : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-gray-900">Delivered</p>
                  <p className="text-[10px] text-gray-500">Payment collected</p>
                </div>
              </div>
            </div>
          )}

          {/* Delivery & Destination Details */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Delivery Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">Destination:</span>
                  <p className="text-gray-700 font-medium">
                    {order.customerName}
                  </p>
                  <p className="text-gray-500">
                    {order.city ? `${order.city}, ` : ""}{order.customerAddress}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-800">Terms &amp; Warranty:</span>
                  <p className="text-gray-500">
                    Full inspection on delivery. 1-2 Year official warranty certificate included in box.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Order Items ({order.items.length})
            </h3>
            <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.productTitle}</p>
                    {item.selectedFinish && (
                      <p className="text-gray-500 mt-0.5">Finish: {item.selectedFinish}</p>
                    )}
                    <p className="text-gray-400 mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                    <p className="text-[11px] text-gray-500">{formatPrice(item.price)} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition flex items-center justify-center gap-2 shadow"
            >
              <MessageCircle className="w-4 h-4" /> Inquire on WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                setOrder(null);
                setOrderId("");
                setContact("");
              }}
              className="flex-1 py-3 bg-[#15161d] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition"
            >
              Track Another Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
