import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User
} from "lucide-react";
import { ApiError, api } from "../../api";
import { useAuth } from "../../context/AuthContext";

export const AdminSettings: React.FC = () => {
  const { admin } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const isTooShort = newPassword.length > 0 && newPassword.length < 12;
  const isMismatch =
    confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isSameAsCurrent =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    currentPassword === newPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMessage("");
    setSuccessMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 12) {
      setErrorMessage("New password must be at least 12 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setErrorMessage("New password must be different from your current password.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post<{
        success?: boolean;
        error?: string;
        data?: { message?: string };
      }>("/api/admin/change-password", {
        currentPassword,
        newPassword,
        confirmPassword
      });

      if (response?.success) {
        setSuccessMessage(
          response.data?.message || "Password updated successfully."
        );
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setErrorMessage(
          response?.error || "Unable to update password. Please try again."
        );
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setErrorMessage(err.message || "Failed to update password.");
      } else {
        setErrorMessage(
          "Could not reach the server. Please check your network connection."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#d10024]">
          Account &amp; Security
        </p>
        <h2 className="mt-1 text-2xl font-black tracking-tight text-[#15161d]">
          Admin Settings
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Manage your administrator profile details and account security credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#15161d] text-white">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#15161d]">
              Admin Profile
            </h3>
            <p className="text-xs text-gray-500">
              Active administrator session information
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-[#f4f5f7]/60 p-4">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <User className="h-3.5 w-3.5" /> Full name
            </span>
            <p className="mt-2 text-sm font-bold text-[#15161d]">
              {admin?.name || "Administrator"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-[#f4f5f7]/60 p-4">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <Mail className="h-3.5 w-3.5" /> Email address
            </span>
            <p className="mt-2 truncate text-sm font-bold text-[#15161d]">
              {admin?.email || "—"}
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-[#f4f5f7]/60 p-4">
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5" /> Assigned Role
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center rounded bg-[#15161d] px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
                {admin?.role || "ADMIN"}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Change Password Card */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#d10024]/10 text-[#d10024]">
            <KeyRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-wide text-[#15161d]">
              Change Password
            </h3>
            <p className="text-xs text-gray-500">
              Update your password to keep your administrator account protected
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {successMessage && (
            <div
              role="status"
              className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-semibold text-emerald-900"
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald-600" />
              <div>
                <p className="font-bold">Password Updated</p>
                <p className="mt-0.5 text-emerald-700">{successMessage}</p>
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-900"
            >
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" />
              <div>
                <p className="font-bold">Error</p>
                <p className="mt-0.5 text-red-700">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Current Password */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-xs font-bold uppercase tracking-wider text-[#15161d]"
            >
              Current Password
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                required
                autoComplete="current-password"
                placeholder="Enter your current password"
                className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-11 pl-10 text-sm text-[#15161d] transition placeholder:text-gray-400 focus:border-[#d10024] focus:outline-none focus:ring-1 focus:ring-[#d10024]"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="new-password"
                className="block text-xs font-bold uppercase tracking-wider text-[#15161d]"
              >
                New Password
              </label>
              <span className="text-[11px] text-gray-400">Minimum 12 characters</span>
            </div>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                required
                autoComplete="new-password"
                placeholder="Enter at least 12 characters"
                className={`w-full rounded-lg border bg-white py-2.5 pr-11 pl-10 text-sm text-[#15161d] transition placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  isTooShort || isSameAsCurrent
                    ? "border-amber-400 focus:border-amber-500 focus:ring-amber-500"
                    : "border-gray-300 focus:border-[#d10024] focus:ring-[#d10024]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {isTooShort && (
              <p className="mt-1.5 text-[11px] font-medium text-amber-600">
                Password must be at least 12 characters (currently {newPassword.length}).
              </p>
            )}
            {isSameAsCurrent && (
              <p className="mt-1.5 text-[11px] font-medium text-amber-600">
                New password must be different from your current password.
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-xs font-bold uppercase tracking-wider text-[#15161d]"
            >
              Confirm New Password
            </label>
            <div className="relative mt-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <KeyRound className="h-4 w-4" />
              </div>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                required
                autoComplete="new-password"
                placeholder="Confirm your new password"
                className={`w-full rounded-lg border bg-white py-2.5 pr-11 pl-10 text-sm text-[#15161d] transition placeholder:text-gray-400 focus:outline-none focus:ring-1 ${
                  isMismatch
                    ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-[#d10024] focus:ring-[#d10024]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {isMismatch && (
              <p className="mt-1.5 text-[11px] font-medium text-red-600">
                Passwords do not match.
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={
                submitting ||
                !currentPassword ||
                !newPassword ||
                !confirmPassword ||
                isTooShort ||
                isMismatch ||
                isSameAsCurrent
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#d10024] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#b0001f] focus:outline-none focus:ring-2 focus:ring-[#d10024] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating Password...
                </>
              ) : (
                "Update Password"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
