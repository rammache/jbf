import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Tag,
  Search,
  CheckCircle,
  AlertCircle,
  Edit2,
  Trash2,
  RefreshCw,
  DollarSign,
  Calendar,
  X,
  Loader2
} from "lucide-react";
import { api, ApiError } from "../../api";
import { Coupon } from "../../types";
import { useSettings } from "../../context/SettingsContext";

export const AdminCoupons: React.FC = () => {
  const { formatPrice } = useSettings();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ totalCoupons: 0, activeCoupons: 0, totalUsed: 0 });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState("");

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number | string>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number | string>("");
  const [maxDiscount, setMaxDiscount] = useState<number | string>("");
  const [usageLimit, setUsageLimit] = useState<number | string>("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchCoupons = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      if (filterStatus !== "all") params.append("status", filterStatus);

      const response = await api.get<{
        success: boolean;
        data: Coupon[];
        stats: { totalCoupons: number; activeCoupons: number; totalUsed: number };
      }>(`/api/admin/coupons?${params.toString()}`);

      if (response && response.success) {
        setCoupons(response.data);
        if (response.stats) {
          setStats(response.stats);
        }
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err instanceof ApiError ? err.message : "Failed to load coupons"
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode("");
    setDiscountType("PERCENTAGE");
    setDiscountValue(10);
    setMinOrderAmount("");
    setMaxDiscount("");
    setUsageLimit("");
    setExpiresAt("");
    setIsActive(true);
    setModalError("");
    setModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCode(coupon.code);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setMinOrderAmount(coupon.minOrderAmount ?? "");
    setMaxDiscount(coupon.maxDiscount ?? "");
    setUsageLimit(coupon.usageLimit ?? "");
    setExpiresAt(coupon.expiresAt ? coupon.expiresAt.slice(0, 16) : "");
    setIsActive(coupon.isActive);
    setModalError("");
    setModalOpen(true);
  };

  const handleSaveCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setModalError("Coupon code is required");
      return;
    }

    const numValue = Number(discountValue);
    if (isNaN(numValue) || numValue <= 0) {
      setModalError("Discount value must be a positive number");
      return;
    }

    if (discountType === "PERCENTAGE" && numValue > 100) {
      setModalError("Percentage discount cannot exceed 100%");
      return;
    }

    setSubmitting(true);

    try {
      const payload: any = {
        code: cleanCode,
        discountType,
        discountValue: numValue,
        minOrderAmount: minOrderAmount !== "" ? Number(minOrderAmount) : null,
        maxDiscount: maxDiscount !== "" ? Number(maxDiscount) : null,
        usageLimit: usageLimit !== "" ? parseInt(String(usageLimit), 10) : null,
        isActive,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null
      };

      if (editingCoupon) {
        await api.put(`/api/admin/coupons/${editingCoupon.id}`, payload);
        setNotification({
          type: "success",
          message: `Coupon "${cleanCode}" updated successfully.`
        });
      } else {
        await api.post("/api/admin/coupons", payload);
        setNotification({
          type: "success",
          message: `Coupon "${cleanCode}" created successfully.`
        });
      }

      setModalOpen(false);
      fetchCoupons();
    } catch (err: any) {
      setModalError(err instanceof ApiError ? err.message : "Failed to save coupon.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      await api.put(`/api/admin/coupons/${coupon.id}`, {
        isActive: !coupon.isActive
      });
      fetchCoupons();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err instanceof ApiError ? err.message : "Failed to toggle status."
      });
    }
  };

  const handleDeleteCoupon = async (id: number, couponCode: string) => {
    if (!window.confirm(`Are you sure you want to delete coupon code "${couponCode}"?`)) {
      return;
    }

    try {
      await api.delete(`/api/admin/coupons/${id}`);
      setNotification({
        type: "success",
        message: `Coupon "${couponCode}" deleted successfully.`
      });
      fetchCoupons();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err instanceof ApiError ? err.message : "Failed to delete coupon."
      });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#d10024]">
            Promotions & Discounts
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#15161d]">
            Discount Coupons
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create percentage or fixed-amount promotional codes for checkout discounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-[#d10024] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b0001e] transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-lg p-4 text-xs font-semibold ${notification.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
            }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-700 text-sm font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Coupons
            </span>
            <div className="h-9 w-9 rounded-lg bg-red-50 text-[#d10024] flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#15161d]">
            {stats.totalCoupons}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Total promotional voucher codes configured
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Active Campaigns
            </span>
            <div className="h-9 w-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-green-700">
            {stats.activeCoupons}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Live codes ready to redeem at checkout
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Total Redemptions
            </span>
            <div className="h-9 w-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-purple-700">
            {stats.totalUsed}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Customer order checkouts with applied discount
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["all", "active", "inactive"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold capitalize transition ${filterStatus === tab
                  ? "bg-[#15161d] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#d10024]"
          />
        </div>
      </div>

      {/* Coupons Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#fbfbfb] text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-5">Coupon Code</th>
                <th className="py-3 px-5">Discount</th>
                <th className="py-3 px-5">Min Order</th>
                <th className="py-3 px-5">Usage</th>
                <th className="py-3 px-5">Expiry</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading && coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#d10024] mb-2" />
                    Loading coupons...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <Tag className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-[#15161d]">No coupons created yet</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Click "Add Coupon" above to launch a new promotion.
                    </p>
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  const isExhausted = coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usedCount >= coupon.usageLimit;

                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3.5 px-5 font-mono">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-[#15161d] font-black text-xs">
                          <Tag className="w-3 h-3 text-[#d10024]" />
                          {coupon.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-[#15161d]">
                          {coupon.discountType === "PERCENTAGE"
                            ? `${coupon.discountValue}% OFF`
                            : `${formatPrice(coupon.discountValue)} OFF`}
                        </div>
                        {coupon.maxDiscount && (
                          <span className="text-[10px] text-gray-400">
                            (Capped at {formatPrice(coupon.maxDiscount)})
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-gray-600">
                        {coupon.minOrderAmount
                          ? formatPrice(coupon.minOrderAmount)
                          : "No minimum"}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className="font-bold text-gray-900">{coupon.usedCount}</span>
                        <span className="text-gray-400">
                          {" "}
                          / {coupon.usageLimit ? coupon.usageLimit : "∞"}
                        </span>
                        {isExhausted && (
                          <span className="ml-2 text-[10px] font-bold text-red-600">
                            Exhausted
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        {coupon.expiresAt ? (
                          <div>
                            <div className="flex items-center gap-1 text-[11px] text-gray-600">
                              <Calendar className="w-3 h-3 text-gray-400" />
                              <span>{new Date(coupon.expiresAt).toLocaleDateString()}</span>
                            </div>
                            {isExpired && (
                              <span className="inline-block rounded bg-red-100 text-red-700 text-[9px] font-bold uppercase px-1.5 py-0.2 mt-0.5">
                                Expired
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Never</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(coupon)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${coupon.isActive && !isExpired ? "bg-green-600" : "bg-gray-300"
                            }`}
                          title={coupon.isActive ? "Deactivate" : "Activate"}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${coupon.isActive && !isExpired ? "translate-x-4" : "translate-x-0"
                              }`}
                          />
                        </button>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-1.5 text-gray-500 hover:text-[#15161d] hover:bg-gray-100 rounded-lg transition"
                            title="Edit coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Delete coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-red-50 text-[#d10024] flex items-center justify-center font-bold">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-[#15161d]">
                  {editingCoupon ? `Edit Coupon "${editingCoupon.code}"` : "Create New Coupon"}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                {modalError}
              </div>
            )}

            <form onSubmit={handleSaveCoupon} className="mt-4 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. JABOUR10, SUMMER50, WELCOME"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 font-mono text-xs uppercase tracking-wider font-bold focus:border-[#d10024] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Discount Type *
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) =>
                      setDiscountType(e.target.value as "PERCENTAGE" | "FIXED")
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-semibold focus:border-[#d10024] focus:outline-none"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount ($)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Discount Value *
                  </label>
                  <div className="relative mt-1">
                    <input
                      type="number"
                      step="0.01"
                      required
                      min="0.01"
                      max={discountType === "PERCENTAGE" ? "100" : undefined}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      placeholder={discountType === "PERCENTAGE" ? "15" : "20.00"}
                      className="w-full rounded-lg border border-gray-200 p-2.5 pr-8 text-xs font-bold focus:border-[#d10024] focus:outline-none"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs pointer-events-none">
                      {discountType === "PERCENTAGE" ? "%" : "$"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Min Order Subtotal ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    placeholder="Optional (e.g. 50)"
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#d10024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Max Discount Cap ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    disabled={discountType === "FIXED"}
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    placeholder={discountType === "FIXED" ? "N/A" : "Optional (e.g. 30)"}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#d10024] focus:outline-none disabled:bg-gray-100 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Total Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(e.target.value)}
                    placeholder="Unlimited if empty"
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#d10024] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Expiry Date
                  </label>
                  <input
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-2 text-xs focus:border-[#d10024] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded text-[#d10024] focus:ring-[#d10024]"
                />
                <label htmlFor="isActive" className="text-xs font-bold text-gray-700 cursor-pointer">
                  Activate coupon immediately upon saving
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#d10024] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b0001e] transition disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
