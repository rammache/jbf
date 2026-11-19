import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Search,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  AlertCircle,
  Eye,
  Loader2,
  Trash2,
  MessageCircle,
  Printer,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  X
} from "lucide-react";
import { api } from "../../api";
import { Order, OrderStatus, AdminOrdersResponse } from "../../types";
import { useSettings } from "../../context/SettingsContext";

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: any }
> = {
  PENDING: {
    label: "Pending",
    color: "text-amber-800",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: Clock
  },
  CONFIRMED: {
    label: "Confirmed",
    color: "text-blue-800",
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: CheckCircle
  },
  PROCESSING: {
    label: "Processing",
    color: "text-indigo-800",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    icon: Package
  },
  SHIPPED: {
    label: "Out For Delivery",
    color: "text-purple-800",
    bg: "bg-purple-50",
    border: "border-purple-200",
    icon: Truck
  },
  DELIVERED: {
    label: "Delivered",
    color: "text-green-800",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: CheckCircle
  },
  CANCELLED: {
    label: "Cancelled",
    color: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle
  },
  RETURNED: {
    label: "Returned",
    color: "text-gray-800",
    bg: "bg-gray-100",
    border: "border-gray-300",
    icon: RotateCcw
  }
};

const STATUS_LIST: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED"
];

export const AdminOrders: React.FC = () => {
  const { formatPrice } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("pageSize", pageSize.toString());
      if (selectedStatus !== "ALL") {
        params.set("status", selectedStatus);
      }
      if (debouncedSearch.trim()) {
        params.set("search", debouncedSearch.trim());
      }

      const res = await api.get<AdminOrdersResponse>(`/api/admin/orders?${params.toString()}`);
      if (res.success) {
        setOrders(res.data);
        setTotalPages(res.totalPages || 1);
        setTotalOrders(res.total || 0);
        setStatusCounts(res.statusCounts || {});
        setTotalRevenue(res.totalRevenue || 0);

        // Keep selected order in sync if modal is open
        if (selectedOrder) {
          const updated = res.data.find((o) => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, selectedStatus, debouncedSearch]);

  // Handle status update
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setActionLoading(true);
    setActionSuccess(null);
    try {
      const res = await api.put<{ success: boolean; message: string; data: Order }>(
        `/api/admin/orders/${orderId}/status`,
        { status: newStatus }
      );
      if (res.success) {
        setActionSuccess(res.message);
        setTimeout(() => setActionSuccess(null), 3000);
        await fetchOrders();
      }
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle order cancellation
  const handleConfirmCancel = async () => {
    if (!orderToCancel) return;
    setActionLoading(true);
    try {
      const res = await api.post<{ success: boolean; message: string }>(
        `/api/admin/orders/${orderToCancel.id}/cancel`,
        {}
      );
      if (res.success) {
        setOrderToCancel(null);
        await fetchOrders();
      }
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle order deletion
  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;
    setActionLoading(true);
    try {
      const res = await api.delete<{ success: boolean; message: string }>(
        `/api/admin/orders/${orderToDelete.id}`
      );
      if (res.success) {
        setOrderToDelete(null);
        if (selectedOrder?.id === orderToDelete.id) {
          setSelectedOrder(null);
        }
        await fetchOrders();
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete order");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#d10024]" /> Order Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage customer purchases, fulfillment stages, COD payments, and courier dispatch.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Total Orders
            </span>
            <ShoppingCart className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-2xl font-black text-gray-900 mt-1">{statusCounts.ALL || 0}</p>
          <span className="text-[10px] text-gray-500">All registered orders</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              Pending
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-amber-700 mt-1">{statusCounts.PENDING || 0}</p>
          <span className="text-[10px] text-gray-500">Awaiting confirmation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
              In Delivery
            </span>
            <Truck className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-black text-indigo-700 mt-1">
            {(statusCounts.PROCESSING || 0) + (statusCounts.SHIPPED || 0)}
          </p>
          <span className="text-[10px] text-gray-500">Processing &amp; In transit</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-green-600 uppercase tracking-wider">
              Delivered
            </span>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-2xl font-black text-green-700 mt-1">{statusCounts.DELIVERED || 0}</p>
          <span className="text-[10px] text-gray-500">Completed &amp; paid</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#d10024] uppercase tracking-wider">
              COD Volume
            </span>
            <DollarSign className="w-4 h-4 text-[#d10024]" />
          </div>
          <p className="text-2xl font-black text-[#d10024] mt-1">{formatPrice(totalRevenue)}</p>
          <span className="text-[10px] text-gray-500">Active order value</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 space-y-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => {
                setSelectedStatus("ALL");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex-shrink-0 ${
                selectedStatus === "ALL"
                  ? "bg-[#15161d] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Orders ({statusCounts.ALL || 0})
            </button>
            {STATUS_LIST.map((st) => (
              <button
                key={st}
                onClick={() => {
                  setSelectedStatus(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex-shrink-0 flex items-center gap-1 ${
                  selectedStatus === st
                    ? "bg-[#d10024] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{STATUS_CONFIG[st].label}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-black/10 rounded-full">
                  {statusCounts[st] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number (e.g. JP-2611-1001), customer name, email, or phone..."
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-[#d10024] bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Action Success Alert */}
        {actionSuccess && (
          <div className="mx-4 mt-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-xs font-semibold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" /> {actionSuccess}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" /> {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total (COD)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#d10024]" />
                    <p className="mt-2 text-xs">Loading orders...</p>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    <ShoppingCart className="w-10 h-10 mx-auto text-gray-300" />
                    <p className="mt-2 text-sm font-bold text-gray-600">No orders found</p>
                    <p className="text-xs text-gray-400">
                      {debouncedSearch || selectedStatus !== "ALL"
                        ? "Try adjusting your search query or status filter."
                        : "Customer purchases placed on the storefront will appear here."}
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/80 transition">
                      {/* Order Number */}
                      <td className="py-3.5 px-4 font-mono">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="font-bold text-[#15161d] hover:text-[#d10024] flex items-center gap-1 group"
                        >
                          <span>{order.orderNumber}</span>
                          <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition text-[#d10024]" />
                        </button>
                      </td>

                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900">{order.customerName}</p>
                        <p className="text-[11px] text-gray-500 font-mono">{order.customerPhone}</p>
                        <p className="text-[11px] text-gray-400">
                          {order.city || "Beirut"}
                        </p>
                      </td>

                      {/* Items Preview */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="space-y-0.5">
                          {order.items.slice(0, 2).map((item) => (
                            <p key={item.id} className="truncate text-gray-700">
                              <span className="font-semibold">{item.quantity}x</span>{" "}
                              {item.productTitle}
                              {item.selectedFinish ? ` (${item.selectedFinish})` : ""}
                            </p>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-[10px] text-gray-400 font-medium">
                              +{order.items.length - 2} more item(s)
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Financial Total */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-gray-900 text-sm">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <span className="text-[10px] text-gray-400">
                          {order.paymentMethod === "CARD" ? "Card on Delivery" : "Cash on Delivery"}
                        </span>
                      </td>

                      {/* Status Selector Badge */}
                      <td className="py-3.5 px-4">
                        <div className="relative inline-block">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateStatus(order.id, e.target.value as OrderStatus)
                            }
                            disabled={actionLoading}
                            className={`text-xs font-bold px-2.5 py-1 rounded-full border appearance-none pr-6 cursor-pointer focus:outline-none ${statusConf.bg} ${statusConf.color} ${statusConf.border}`}
                          >
                            {STATUS_LIST.map((st) => (
                              <option key={st} value={st}>
                                {STATUS_CONFIG[st].label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                        <p className="font-medium">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </p>
                      </td>

                      {/* Action Menu */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-gray-500 hover:text-[#d10024] hover:bg-gray-100 rounded transition"
                            title="View Full Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {order.status !== "CANCELLED" && (
                            <button
                              type="button"
                              onClick={() => setOrderToCancel(order)}
                              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                              title="Cancel Order & Restore Stock"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setOrderToDelete(order)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
            <span>
              Showing Page {page} of {totalPages} ({totalOrders} orders)
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-10 flex items-center justify-center"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedOrder(null)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden z-10 border border-gray-200">
            {/* Modal Header */}
            <div className="p-5 bg-[#15161d] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Order Details
                </span>
                <h2 className="text-lg font-black font-mono mt-0.5">
                  #{selectedOrder.orderNumber}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-1.5 text-gray-400 hover:text-white transition"
                  title="Print Packing Slip"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6">
              {/* Status Update Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                    Fulfillment Status
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Changing status to <strong>Cancelled</strong> will automatically restore item stock.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedOrder.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedOrder.id, e.target.value as OrderStatus)
                    }
                    disabled={actionLoading}
                    className="text-xs font-bold px-3 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:border-[#d10024]"
                  >
                    {STATUS_LIST.map((st) => (
                      <option key={st} value={st}>
                        {STATUS_CONFIG[st].label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Contact & Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Customer Information
                  </span>
                  <p className="font-bold text-gray-900 text-sm">{selectedOrder.customerName}</p>
                  <div className="space-y-1 text-gray-600">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`mailto:${selectedOrder.customerEmail}`} className="hover:underline">
                        {selectedOrder.customerEmail}
                      </a>
                    </p>
                    <p className="flex items-center gap-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <a href={`tel:${selectedOrder.customerPhone}`} className="hover:underline">
                        {selectedOrder.customerPhone}
                      </a>
                    </p>
                  </div>

                  {/* One-click WhatsApp link for Jabour */}
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/${selectedOrder.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Hello ${selectedOrder.customerName}, this is Jabour Phone regarding your order #${selectedOrder.orderNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] transition"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Customer
                    </a>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2 text-xs">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Shipping &amp; Delivery Destination
                  </span>
                  <div className="space-y-1 text-gray-700">
                    <p className="font-bold flex items-center gap-1.5 text-gray-900">
                      <MapPin className="w-3.5 h-3.5 text-[#d10024]" />
                      {selectedOrder.city || "Beirut"}, Lebanon
                    </p>
                    <p className="pl-5 text-gray-600">{selectedOrder.customerAddress}</p>
                  </div>
                  {selectedOrder.notes && (
                    <div className="mt-2 p-2 bg-amber-50 rounded border border-amber-200 text-amber-900 text-[11px]">
                      <strong>Notes:</strong> {selectedOrder.notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Purchased Items ({selectedOrder.items.length})
                </span>
                <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.productTitle}
                            className="w-12 h-12 object-cover rounded border bg-white"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded border bg-gray-50 flex items-center justify-center text-gray-400">
                            <Package className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-gray-900">{item.productTitle}</p>
                          <p className="text-[11px] text-gray-500">
                            Qty: <span className="font-semibold text-gray-800">{item.quantity}</span>
                            {item.selectedFinish && ` · Finish: ${item.selectedFinish}`}
                            {item.product?.sku && ` · SKU: ${item.product.sku}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-[10px] text-gray-400">{formatPrice(item.price)} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(selectedOrder.subtotal || selectedOrder.totalAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Courier Delivery Fee:</span>
                  <span className="font-bold text-green-700">
                    {selectedOrder.shippingFee === 0 ? "FREE" : formatPrice(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-2 border-t font-black text-gray-900">
                  <span>Total Due (Cash on Delivery):</span>
                  <span className="text-base text-[#d10024]">
                    {formatPrice(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs uppercase tracking-wider rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CANCEL CONFIRMATION DIALOG ================= */}
      {orderToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOrderToCancel(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 z-10 border border-gray-200">
            <div className="flex items-center gap-3 text-amber-600">
              <XCircle className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Cancel Order #{orderToCancel.orderNumber}?</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  This action marks the order as CANCELLED and automatically restores all items back into store inventory.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderToCancel(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Keep Order
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition flex items-center gap-1.5"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION DIALOG ================= */}
      {orderToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center"
        >
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setOrderToDelete(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 z-10 border border-gray-200">
            <div className="flex items-center gap-3 text-red-600">
              <Trash2 className="w-8 h-8 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 text-base">Delete Order #{orderToDelete.orderNumber}?</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Are you sure you want to permanently delete this order record? This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition flex items-center gap-1.5"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
