import React, { useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  LayoutDashboard,
  Loader2,
  LogOut,
  Mail,
  Menu,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Store,
  Tag,
  Tags,
  X
} from "lucide-react";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

interface AdminNavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
}

const navigation: AdminNavItem[] = [
  { label: "Overview", icon: LayoutDashboard, to: "/admin" },
  { label: "Categories", icon: Tags, to: "/admin/categories" },
  { label: "Products", icon: Package, to: "/admin/products" },
  { label: "Orders", icon: ShoppingCart, to: "/admin/orders" },
  { label: "Coupons", icon: Tag, to: "/admin/coupons" },
  { label: "Newsletter", icon: Mail, to: "/admin/newsletter" },
  { label: "Settings", icon: Settings, to: "/admin/settings" }
];

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { admin, forbiddenError, clearForbiddenError, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const pageTitle = location.pathname.startsWith("/admin/settings")
    ? "Settings"
    : location.pathname.startsWith("/admin/categories")
      ? "Categories"
      : location.pathname.startsWith("/admin/products")
        ? "Products"
        : location.pathname.startsWith("/admin/orders")
          ? "Orders"
          : location.pathname.startsWith("/admin/coupons")
            ? "Coupons & Discounts"
            : location.pathname.startsWith("/admin/newsletter")
              ? "Newsletter Subscribers"
              : "Overview";

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await api.post("/api/auth/logout", undefined, { skipAuthHandlers: true });
      signOut();
      navigate("/admin/login", { replace: true });
    } catch {
      setLogoutError("Could not sign out. Please try again.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] lg:flex">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close admin menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-[#15161d] text-white transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
          <Link
            to="/admin"
            className="text-xl font-black uppercase tracking-tight"
            onClick={() => setSidebarOpen(false)}
          >
            Jabour Phone<span className="text-[#d10024]">.</span>
          </Link>
          <button
            type="button"
            className="rounded p-1.5 text-gray-400 hover:bg-white/10 hover:text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pt-6 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Store management
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {navigation.map((item) => {
            const Icon = item.icon;

            if (!item.to) {
              return (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded px-3 py-2.5 text-xs font-semibold text-gray-500"
                  title="Available in a later phase"
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" /> {item.label}
                  </span>
                  <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.label}
                to={item.to}
                end
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition ${isActive
                    ? "bg-[#d10024] text-white"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="h-4 w-4" /> {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <Link
            to="/admin/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded bg-white/5 px-3 py-3 transition hover:bg-white/10"
            title="Admin settings & security"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d10024]/15 text-[#ff5c75]">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">
                {admin?.name ?? "Administrator"}
              </p>
              <p className="truncate text-[10px] text-gray-500">
                {admin?.email ?? "Admin access"}
              </p>
            </div>
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            type="button"
            className="rounded p-2 text-gray-500 hover:bg-gray-100 hover:text-[#15161d] lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open admin menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Admin panel
            </p>
            <h1 className="truncate text-sm font-black uppercase tracking-wide text-[#15161d]">
              {pageTitle}
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {logoutError && (
              <span className="hidden text-[11px] font-semibold text-red-600 md:inline">
                {logoutError}
              </span>
            )}

            <Link
              to="/"
              className="hidden items-center gap-2 rounded border border-gray-200 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-gray-600 transition hover:border-[#d10024] hover:text-[#d10024] sm:inline-flex"
            >
              <Store className="h-4 w-4" /> View store
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded bg-[#15161d] px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-[#2a2c38] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loggingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {forbiddenError && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                <p>{forbiddenError}</p>
              </div>
              <button
                type="button"
                onClick={clearForbiddenError}
                className="rounded p-1 text-amber-700 hover:bg-amber-100"
                aria-label="Dismiss alert"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};
