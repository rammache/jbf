import React from "react";
import { Link, Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SessionLoadingScreen: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
      <Loader2 className="h-5 w-5 animate-spin text-[#0077fe]" />
      <p className="text-sm font-semibold text-[#15161d]">
        Verifying your session...
      </p>
    </div>
  </div>
);

const SessionErrorScreen: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4">
    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#0077fe]">
        <ShieldAlert className="h-6 w-6" />
      </div>
      <h1 className="mt-4 text-xl font-black tracking-tight text-[#15161d]">
        We could not verify your session.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">
        Check your connection and try again. If the problem continues, sign in
        again.
      </p>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center justify-center gap-2 rounded bg-[#0077fe] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#005fc9]"
        >
          <RefreshCw className="h-4 w-4" /> Try again
        </button>
        <Link
          to="/admin/login"
          className="inline-flex items-center justify-center rounded border border-gray-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gray-600 transition hover:border-[#0077fe] hover:text-[#0077fe]"
        >
          Go to sign in
        </Link>
      </div>
      <Link
        to="/"
        className="mt-5 inline-block text-xs font-semibold text-gray-400 hover:text-[#15161d]"
      >
        Back to store
      </Link>
    </div>
  </div>
);

export const ProtectedRoute: React.FC = () => {
  const { status, refresh } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <SessionLoadingScreen />;
  }

  if (status === "error") {
    return <SessionErrorScreen onRetry={() => void refresh()} />;
  }

  if (status === "unauthenticated") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <Outlet />;
};

export const GuestOnlyRoute: React.FC = () => {
  const { status } = useAuth();

  if (status === "loading") {
    return <SessionLoadingScreen />;
  }

  if (status === "authenticated") {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};
