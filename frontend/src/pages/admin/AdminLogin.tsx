import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  ShieldCheck
} from "lucide-react";
import { ApiError, api } from "../../api";
import { isAdminUser, useAuth } from "../../context/AuthContext";

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  const from = (location.state as { from?: unknown } | null)?.from;
  const returnTo =
    typeof from === "string" &&
    from.startsWith("/admin") &&
    !from.startsWith("/admin/login")
      ? from
      : "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setError("");

    try {
      const body = await api.post<{
        success?: boolean;
        error?: string;
        data?: unknown;
      }>(
        "/api/auth/login",
        { email: email.trim(), password },
        { skipAuthHandlers: true }
      );

      if (body?.success && isAdminUser(body.data)) {
        setPassword("");
        signIn(body.data);
        navigate(returnTo, { replace: true });
        return;
      }

      setStatus("error");
      setError(body?.error || "Unable to sign in. Please try again.");
    } catch (err) {
      setStatus("error");
      if (err instanceof ApiError) {
        setError(err.message || "Invalid email or password.");
      } else {
        setError(
          "Could not reach the server. Check your connection and try again."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden grid lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden lg:flex flex-col justify-between bg-[#15161d] text-white p-10 overflow-hidden">
          <div
            className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#d10024]/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[#d10024]/10 blur-3xl"
            aria-hidden="true"
          />

          <Link
            to="/"
            className="relative text-2xl font-black uppercase tracking-tight"
          >
            Jabour Phone<span className="text-[#d10024]">.</span>
          </Link>

          <div className="relative space-y-4 py-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[11px] font-bold uppercase tracking-wider text-gray-200">
              <ShieldCheck className="h-4 w-4 text-[#d10024]" /> Store management
            </span>
            <h1 className="text-4xl font-black leading-tight tracking-tight">
              Sign in to run your store.
            </h1>
            <p className="text-sm leading-relaxed text-gray-400">
              Manage products, photos, stock, orders, and store content from one
              place.
            </p>
          </div>

          <p className="relative text-[11px] text-gray-500">
            © 2026 Jabour Phone. All rights reserved.
          </p>
        </div>

        {/* Form panel */}
        <div className="p-6 sm:p-10">
          <div className="lg:hidden mb-8">
            <Link
              to="/"
              className="text-xl font-black uppercase tracking-tight text-[#15161d]"
            >
              Jabour Phone<span className="text-[#d10024]">.</span>
            </Link>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#d10024]">
              Admin area
            </p>
            <h2 className="text-2xl font-black text-[#15161d] tracking-tight">
              Sign in
            </h2>
            <p className="text-sm text-gray-500">
              Use the admin account created for Jabour Phone.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label
                htmlFor="admin-email"
                className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="you@example.com"
                  className="w-full rounded border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-[#15161d] placeholder-gray-400 focus:border-[#d10024] focus:outline-none focus:ring-1 focus:ring-[#d10024] disabled:bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={status === "loading"}
                  placeholder="Enter your password"
                  className="w-full rounded border border-gray-300 bg-white py-3 pl-10 pr-11 text-sm text-[#15161d] placeholder-gray-400 focus:border-[#d10024] focus:outline-none focus:ring-1 focus:ring-[#d10024] disabled:bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-2 text-gray-400 hover:text-[#15161d]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {status === "error" && (
              <div
                role="alert"
                className="rounded border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="flex w-full items-center justify-center gap-2 rounded bg-[#d10024] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#a7001d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" /> Sign in
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-xs">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-semibold text-gray-500 hover:text-[#d10024]"
            >
              <ArrowLeft className="h-4 w-4" /> Back to store
            </Link>
            <span className="text-gray-400">Secure admin access</span>
          </div>
        </div>
      </div>
    </div>
  );
};
