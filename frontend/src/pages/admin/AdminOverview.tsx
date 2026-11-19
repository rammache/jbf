import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Clock,
  ShieldCheck,
  CheckCircle,
  FileText,
  X
} from "lucide-react";
import { api, ApiError } from "../../api";
import { DashboardMetrics, ProfitReport } from "../../types";

export const AdminOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [profitReport, setProfitReport] = useState<ProfitReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfitModal, setShowProfitModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [metricsRes, profitRes] = await Promise.all([
        api.get<{ success: boolean; data: DashboardMetrics }>("/api/admin/dashboard"),
        api.get<{ success: boolean; data: ProfitReport }>("/api/admin/reports/profit")
      ]);

      if (metricsRes?.success) {
        setMetrics(metricsRes.data);
      }
      if (profitRes?.success) {
        setProfitReport(profitRes.data);
      }
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "PROCESSING":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "SHIPPED":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "DELIVERED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "CANCELLED":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "RETURNED":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#d10024]">
              Executive Overview
            </p>
          </div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#15161d]">
            Welcome to Jabour Phone Dashboard
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Real-time business performance, sales volume, stock alerts, and customer orders.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowProfitModal(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#15161d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Profit Report
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-xs font-semibold text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue Today */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Revenue Today
            </span>
            <div className="h-8 w-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-[#15161d]">
            ${(metrics?.revenueToday ?? 0).toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            {metrics?.ordersToday ?? 0} order(s) placed today
          </p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              All-Time Revenue
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-black text-blue-700">
            ${(metrics?.totalRevenue ?? 0).toFixed(2)}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Across {metrics?.totalOrders ?? 0} completed orders
          </p>
        </div>

        {/* Pending Orders */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Pending Orders
            </span>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                (metrics?.pendingOrders ?? 0) > 0
                  ? "bg-amber-100 text-amber-700 font-bold"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`mt-2 text-2xl font-black ${
              (metrics?.pendingOrders ?? 0) > 0 ? "text-amber-600" : "text-[#15161d]"
            }`}
          >
            {metrics?.pendingOrders ?? 0}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Awaiting phone confirmation & dispatch
          </p>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Inventory Alert
            </span>
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                (metrics?.lowStockCount ?? 0) > 0
                  ? "bg-red-50 text-[#d10024]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p
            className={`mt-2 text-2xl font-black ${
              (metrics?.lowStockCount ?? 0) > 0 ? "text-[#d10024]" : "text-[#15161d]"
            }`}
          >
            {metrics?.lowStockCount ?? 0}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Products at or below stock threshold
          </p>
        </div>
      </div>

      {/* Financial Profit Snapshot */}
      {profitReport && (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-900 to-[#15161d] p-6 text-white shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-300">
                <ShieldCheck className="w-3 h-3 text-green-400" /> Financial Profit & COGS
              </span>
              <h2 className="mt-2 text-xl font-black tracking-tight">
                Store Profitability Overview
              </h2>
              <p className="mt-1 text-xs text-gray-400 max-w-xl">
                Calculated by subtracting supplier cost prices (COGS) from verified customer sales revenue.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 bg-white/5 rounded-xl p-4 border border-white/10">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Total Sales</p>
                <p className="text-base font-black text-white mt-0.5">
                  ${profitReport.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Gross Profit</p>
                <p className="text-base font-black text-green-400 mt-0.5">
                  +${profitReport.grossProfit.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Margin</p>
                <p className="text-base font-black text-amber-300 mt-0.5">
                  {profitReport.grossMarginPercent.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Status Breakdown */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
          Order Pipeline By Lifecycle Stage
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {Object.entries(metrics?.statusCounts ?? {}).map(([st, count]) => (
            <Link
              key={st}
              to={`/admin/orders?status=${st.toLowerCase()}`}
              className={`rounded-lg border p-3 transition hover:shadow-sm ${getStatusBadge(st)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase">{st}</span>
                <span className="rounded-full bg-white/70 px-1.5 py-0.2 text-[10px] font-black">
                  {count}
                </span>
              </div>
              <p className="mt-2 text-lg font-black">{count}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* 7-Day Revenue Trend */}
      {metrics?.revenueTrend && metrics.revenueTrend.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-black text-[#15161d]">Last 7 Days Sales Trend</h3>
              <p className="text-xs text-gray-400">Daily gross revenue across confirmed orders</p>
            </div>
            <span className="text-xs font-bold text-gray-500">7-Day Total</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {metrics.revenueTrend.map((day) => {
              const maxVal = Math.max(...metrics.revenueTrend.map((d) => d.revenue), 100);
              const heightPct = Math.max(12, Math.round((day.revenue / maxVal) * 100));

              return (
                <div key={day.date} className="flex flex-col items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-700">
                    ${day.revenue}
                  </span>
                  <div className="w-full bg-gray-100 h-28 rounded-lg flex items-end p-1">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-[#15161d] hover:bg-[#d10024] transition rounded-md"
                      title={`${day.date}: $${day.revenue} (${day.orders} orders)`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">
                    {day.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Two Column Grid: Top Selling Products & Low Stock Warnings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-[#15161d]">Top Selling Phones</h3>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-[#d10024] hover:underline flex items-center gap-1"
            >
              All products <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {metrics?.topProducts && metrics.topProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {metrics.topProducts.map((p, idx) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-black text-gray-400 w-4">
                      #{idx + 1}
                    </span>
                    <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                      ) : (
                        <Package className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/product/${p.handle}`}
                        className="text-xs font-bold text-[#15161d] hover:text-[#d10024] transition line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <p className="text-[11px] text-gray-400">${p.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-black text-[#15161d]">{p.unitsSold} sold</p>
                    <p className="text-[11px] text-green-600 font-bold">
                      ${p.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-400 py-6 text-center">
              No sales data recorded yet.
            </p>
          )}
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-[#15161d]">Low Stock Alerts</h3>
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#d10024]">
                {metrics?.lowStockCount ?? 0}
              </span>
            </div>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-[#d10024] hover:underline flex items-center gap-1"
            >
              Restock <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {metrics?.lowStockProducts && metrics.lowStockProducts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {metrics.lowStockProducts.map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#15161d] line-clamp-1">{p.title}</p>
                    <p className="text-[11px] text-gray-400">
                      Threshold: {p.lowStockThreshold} units
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        p.stock === 0
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {p.stock === 0 ? "Out of Stock" : `${p.stock} units left`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center">
              <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
              <p className="text-xs font-bold text-[#15161d]">All inventory healthy</p>
              <p className="text-[11px] text-gray-400">No products below warning thresholds.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="text-sm font-black text-[#15161d]">Recent Orders</h3>
            <p className="text-xs text-gray-400">Latest customer transactions placed through the store</p>
          </div>
          <Link
            to="/admin/orders"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
          >
            View All Orders
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-gray-200 bg-[#fbfbfb] text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-5">Order #</th>
                <th className="py-3 px-5">Customer</th>
                <th className="py-3 px-5">Total</th>
                <th className="py-3 px-5">Method</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
                metrics.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#d10024]">
                      {order.orderNumber}
                    </td>
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-[#15161d]">{order.customerName}</p>
                      <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-5 font-black text-[#15161d]">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-semibold text-gray-700">{order.paymentMethod}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right text-gray-400 text-[11px]">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No orders placed yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Profit Report Modal */}
      {showProfitModal && profitReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 bg-[#15161d] text-white">
              <div>
                <h3 className="text-lg font-black">Detailed Profit & Margin Report</h3>
                <p className="text-xs text-gray-400">
                  Revenue, cost of goods sold (COGS), and unit margins per catalog product.
                </p>
              </div>
              <button
                onClick={() => setShowProfitModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Report Summary Cards */}
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Gross Sales</p>
                  <p className="text-xl font-black text-[#15161d] mt-1">
                    ${profitReport.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
                  <p className="text-[10px] uppercase font-bold text-gray-500">Total COGS (Cost)</p>
                  <p className="text-xl font-black text-rose-600 mt-1">
                    ${profitReport.totalCost.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-green-50 border-green-200">
                  <p className="text-[10px] uppercase font-bold text-green-700">Gross Profit</p>
                  <p className="text-xl font-black text-green-700 mt-1">
                    +${profitReport.grossProfit.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 p-4 bg-blue-50 border-blue-200">
                  <p className="text-[10px] uppercase font-bold text-blue-700">Profit Margin</p>
                  <p className="text-xl font-black text-blue-700 mt-1">
                    {profitReport.grossMarginPercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Product Profit Table */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      <th className="py-3 px-4">Product</th>
                      <th className="py-3 px-4">Supplier Cost</th>
                      <th className="py-3 px-4">Retail Price</th>
                      <th className="py-3 px-4">Unit Margin</th>
                      <th className="py-3 px-4">Sold</th>
                      <th className="py-3 px-4 text-right">Total Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {profitReport.items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/80">
                        <td className="py-3 px-4 font-bold text-[#15161d]">
                          {item.title}
                          {item.supplier && (
                            <span className="block text-[10px] text-gray-400 font-normal">
                              Supplier: {item.supplier}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-gray-600">${item.costPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 font-semibold">${item.sellingPrice.toFixed(2)}</td>
                        <td className="py-3 px-4">
                          <span className="text-green-600 font-bold">
                            +${item.unitProfit.toFixed(2)} ({item.marginPercent}%)
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold">{item.unitsSold}</td>
                        <td className="py-3 px-4 text-right font-black text-[#15161d]">
                          ${item.totalProfit.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowProfitModal(false)}
                className="rounded-lg bg-[#15161d] px-5 py-2 text-xs font-bold uppercase text-white hover:bg-black transition"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
