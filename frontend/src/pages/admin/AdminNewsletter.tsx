import React, { useState, useEffect, useCallback } from "react";
import {
  Download,
  Mail,
  Search,
  Trash2,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Calendar,
  Sparkles
} from "lucide-react";
import { api, ApiError } from "../../api";
import { NewsletterSubscriber } from "../../types";

export const AdminNewsletter: React.FC = () => {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSubscribers, setTotalSubscribers] = useState(0);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
      params.append("page", page.toString());
      params.append("pageSize", "15");

      const response = await api.get<{
        success: boolean;
        data: NewsletterSubscriber[];
        page: number;
        total: number;
        totalPages: number;
      }>(`/api/admin/newsletter?${params.toString()}`);

      if (response && response.success) {
        setSubscribers(response.data);
        setTotalPages(response.totalPages);
        setTotalSubscribers(response.total);
      }
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err instanceof ApiError ? err.message : "Failed to load newsletter subscribers"
      });
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const res = await fetch("/api/admin/newsletter/export", {
        headers: {
          Accept: "text/csv"
        }
      });
      if (!res.ok) throw new Error("Export request failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `jabour_phone_newsletter_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setNotification({
        type: "success",
        message: "Subscribers exported successfully as CSV file."
      });
    } catch (err: any) {
      setNotification({
        type: "error",
        message: "Failed to download CSV export. Please try again."
      });
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteSubscriber = async (id: number, email: string) => {
    if (!window.confirm(`Are you sure you want to remove "${email}" from the subscriber list?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await api.delete(`/api/admin/newsletter/${id}`);
      setNotification({
        type: "success",
        message: `Subscriber ${email} removed successfully.`
      });
      fetchSubscribers();
    } catch (err: any) {
      setNotification({
        type: "error",
        message: err instanceof ApiError ? err.message : "Failed to delete subscriber."
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#0077fe]">
            Audience & Marketing
          </p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#15161d]">
            Newsletter Subscribers
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your store's customer email list, subscriber growth, and campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchSubscribers}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
            title="Refresh list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleExportCsv}
            disabled={exporting || totalSubscribers === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-[#15161d] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition disabled:opacity-50 shadow-sm"
          >
            <Download className="w-4 h-4" />
            {exporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`flex items-center justify-between rounded-lg p-4 text-xs font-semibold ${
            notification.type === "success"
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
              Total Subscribers
            </span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-[#0077fe] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-[#15161d]">
            {totalSubscribers}
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Registered customer emails receiving store promotions
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Subscriber Status
            </span>
            <div className="h-9 w-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-green-700">
            100%
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Direct opt-in via footer signup form
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
              CSV Export Ready
            </span>
            <div className="h-9 w-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-black text-blue-700">
            Ready
          </p>
          <p className="mt-1 text-[11px] text-gray-400">
            Compatible with Mailchimp, Brevo, and Excel
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchSubscribers();
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subscribers by email address..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-lg border border-gray-200 focus:outline-none focus:border-[#0077fe] focus:ring-1 focus:ring-[#0077fe]"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#15161d] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition"
          >
            Search
          </button>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setPage(1);
              }}
              className="rounded-lg border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-[#fbfbfb] text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="py-3 px-5">#</th>
                <th className="py-3 px-5">Subscriber Email</th>
                <th className="py-3 px-5">Subscribed Date</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {loading && subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#0077fe] mb-2" />
                    Loading subscriber directory...
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    <Mail className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="font-bold text-[#15161d]">No subscribers found</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {searchQuery
                        ? `No subscribers matched your search for "${searchQuery}"`
                        : "Subscribers will appear here when visitors join your newsletter."}
                    </p>
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber, index) => {
                  const itemNumber = (page - 1) * 15 + index + 1;
                  const dateStr = new Date(subscriber.subscribedAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    }
                  );

                  return (
                    <tr
                      key={subscriber.id}
                      className="hover:bg-gray-50/80 transition"
                    >
                      <td className="py-3.5 px-5 font-mono text-gray-400 text-[11px]">
                        {itemNumber}
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-blue-50 text-[#0077fe] flex items-center justify-center font-bold text-[11px]">
                            {subscriber.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-[#15161d]">
                            {subscriber.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-gray-500">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{dateStr}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() =>
                            handleDeleteSubscriber(subscriber.id, subscriber.email)
                          }
                          disabled={deletingId === subscriber.id}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                          title="Remove subscriber"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3 text-xs bg-white">
            <span className="text-gray-500">
              Page <span className="font-bold text-[#15161d]">{page}</span> of{" "}
              <span className="font-bold text-[#15161d]">{totalPages}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
