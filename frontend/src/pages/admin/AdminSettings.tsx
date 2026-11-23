import React, { useState, useEffect } from "react";
import {
  Store,
  CreditCard,
  Share2,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  KeyRound,
  Mail,
  User,
  X
} from "lucide-react";
import { api, ApiError } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import { AdminUser, StoreSettings } from "../../types";

type SettingsTab = "profile" | "commerce" | "social" | "admins" | "security";

export const AdminSettings: React.FC = () => {
  const { admin } = useAuth();
  const { settings, refreshSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsError, setSettingsError] = useState("");

  // Store Settings Form State
  const [formData, setFormData] = useState<StoreSettings>(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Admin Users List State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("");
  const [newAdminRole, setNewAdminRole] = useState<"SUPER_ADMIN" | "ADMIN" | "STAFF">("ADMIN");
  const [userActionError, setUserActionError] = useState("");
  const [userActionSuccess, setUserActionSuccess] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submittingPassword, setSubmittingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const fetchAdminUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await api.get<{ success: boolean; data: AdminUser[] }>("/api/admin/users");
      if (res?.success) {
        setAdminUsers(res.data);
      }
    } catch (err: any) {
      console.error("Failed to load admin users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "admins") {
      fetchAdminUsers();
    }
  }, [activeTab]);

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccess("");
    setSettingsError("");
    setSavingSettings(true);

    try {
      const payload = {
        storeName: formData.storeName,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        currency: formData.currency,
        currencySymbol: formData.currencySymbol,
        shippingFee: Number(formData.shippingFee),
        freeShippingThreshold: Number(formData.freeShippingThreshold),
        announcement: formData.announcement || "",
        facebook: formData.facebook || null,
        instagram: formData.instagram || null,
        tiktok: formData.tiktok || null,
        twitter: formData.twitter || null,
        workingHours: formData.workingHours || "Mon - Sat: 9:00 AM - 8:00 PM",
        aboutText: formData.aboutText || null
      };

      const res = await api.put<{ success: boolean; message: string; data: StoreSettings }>(
        "/api/admin/settings",
        payload
      );

      if (res?.success) {
        setSettingsSuccess("Store settings updated successfully.");
        refreshSettings();
      }
    } catch (err: any) {
      setSettingsError(err instanceof ApiError ? err.message : "Failed to update store settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreateAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserActionError("");
    setUserActionSuccess("");

    if (newAdminPassword.length < 12) {
      setUserActionError("Password must be at least 12 characters long.");
      return;
    }

    setCreatingUser(true);
    try {
      const res = await api.post<{ success: boolean; data: AdminUser; message: string }>(
        "/api/admin/users",
        {
          name: newAdminName.trim(),
          email: newAdminEmail.trim().toLowerCase(),
          password: newAdminPassword,
          role: newAdminRole
        }
      );

      if (res?.success) {
        setUserActionSuccess(`Admin account "${newAdminName}" created successfully.`);
        setUserModalOpen(false);
        setNewAdminName("");
        setNewAdminEmail("");
        setNewAdminPassword("");
        setNewAdminRole("ADMIN");
        fetchAdminUsers();
      }
    } catch (err: any) {
      setUserActionError(err instanceof ApiError ? err.message : "Failed to create admin user.");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleDeleteAdminUser = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to remove administrator "${name}"?`)) {
      return;
    }

    setUserActionError("");
    setUserActionSuccess("");

    try {
      await api.delete(`/api/admin/users/${id}`);
      setUserActionSuccess(`Administrator "${name}" removed successfully.`);
      fetchAdminUsers();
    } catch (err: any) {
      setUserActionError(err instanceof ApiError ? err.message : "Failed to delete admin user.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submittingPassword) return;

    setPasswordError("");
    setPasswordSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Please fill in all password fields.");
      return;
    }

    if (newPassword.length < 12) {
      setPasswordError("New password must be at least 12 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError("New password must be different from current password.");
      return;
    }

    setSubmittingPassword(true);

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
        setPasswordSuccess(response.data?.message || "Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(response?.error || "Unable to update password.");
      }
    } catch (err: any) {
      setPasswordError(err instanceof ApiError ? err.message : "Failed to update password.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#0077fe]">
          Preferences & Configuration
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-[#15161d]">
          Store Settings & Security
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Configure store identity, delivery fees, customer contact information, and admin roles.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        <button
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "profile"
              ? "border-[#0077fe] text-[#0077fe]"
              : "border-transparent text-gray-500 hover:text-[#15161d]"
          }`}
        >
          <Store className="w-4 h-4" />
          Store Profile
        </button>

        <button
          onClick={() => setActiveTab("commerce")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "commerce"
              ? "border-[#0077fe] text-[#0077fe]"
              : "border-transparent text-gray-500 hover:text-[#15161d]"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Commerce & Shipping
        </button>

        <button
          onClick={() => setActiveTab("social")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "social"
              ? "border-[#0077fe] text-[#0077fe]"
              : "border-transparent text-gray-500 hover:text-[#15161d]"
          }`}
        >
          <Share2 className="w-4 h-4" />
          Social Media
        </button>

        <button
          onClick={() => setActiveTab("admins")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "admins"
              ? "border-[#0077fe] text-[#0077fe]"
              : "border-transparent text-gray-500 hover:text-[#15161d]"
          }`}
        >
          <Users className="w-4 h-4" />
          Admin Accounts
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition whitespace-nowrap ${
            activeTab === "security"
              ? "border-[#0077fe] text-[#0077fe]"
              : "border-transparent text-gray-500 hover:text-[#15161d]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Password & Security
        </button>
      </div>

      {/* Tab 1: Store Profile */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveStoreSettings} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-[#15161d]">Store Identity & Branding</h2>

            {settingsSuccess && (
              <div className="rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-800 border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                {settingsSuccess}
              </div>
            )}
            {settingsError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                {settingsError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Store Name *</label>
                <input
                  type="text"
                  required
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-bold focus:border-[#0077fe] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Support Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-semibold focus:border-[#0077fe] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Phone Number *</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-semibold focus:border-[#0077fe] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+961 70 123 456"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-semibold focus:border-[#0077fe] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase text-gray-700">Physical Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Working Hours *</label>
                <input
                  type="text"
                  required
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-700">
                Top Announcement Bar Text
              </label>
              <input
                type="text"
                value={formData.announcement}
                onChange={(e) => setFormData({ ...formData, announcement: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-gray-700">
                About The Store (Footer / About Page)
              </label>
              <textarea
                rows={3}
                value={formData.aboutText || ""}
                onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0077fe] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b0001e] transition disabled:opacity-50"
              >
                {savingSettings && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 2: Commerce & Shipping */}
      {activeTab === "commerce" && (
        <form onSubmit={handleSaveStoreSettings} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-[#15161d]">Currency & Delivery Charges</h2>

            {settingsSuccess && (
              <div className="rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-800 border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                {settingsSuccess}
              </div>
            )}
            {settingsError && (
              <div className="rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                {settingsError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Currency Code</label>
                <input
                  type="text"
                  required
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  placeholder="USD, LBP, EUR"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-bold focus:border-[#0077fe] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Currency Symbol</label>
                <input
                  type="text"
                  required
                  value={formData.currencySymbol}
                  onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                  placeholder="$, L.L, €"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-bold focus:border-[#0077fe] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">
                  Standard Courier Delivery Fee ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.shippingFee}
                  onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-bold focus:border-[#0077fe] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Charged on customer orders below the free delivery threshold.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">
                  Free Shipping Subtotal Threshold ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.freeShippingThreshold}
                  onChange={(e) =>
                    setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })
                  }
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-bold focus:border-[#0077fe] focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-gray-400">
                  Orders equal to or exceeding this subtotal automatically receive free delivery.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0077fe] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b0001e] transition disabled:opacity-50"
              >
                {savingSettings && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Shipping Rules
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 3: Social Media */}
      {activeTab === "social" && (
        <form onSubmit={handleSaveStoreSettings} className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-black uppercase text-[#15161d]">Social Media Links</h2>
            <p className="text-xs text-gray-500">
              Displayed in the store footer and contact page. Leave blank to hide a platform.
            </p>

            {settingsSuccess && (
              <div className="rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-800 border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                {settingsSuccess}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Facebook URL</label>
                <input
                  type="url"
                  value={formData.facebook || ""}
                  onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  placeholder="https://facebook.com/jabourphone"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Instagram URL</label>
                <input
                  type="url"
                  value={formData.instagram || ""}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="https://instagram.com/jabourphone"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">TikTok URL</label>
                <input
                  type="url"
                  value={formData.tiktok || ""}
                  onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
                  placeholder="https://tiktok.com/@jabourphone"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-700">Twitter / X URL</label>
                <input
                  type="url"
                  value={formData.twitter || ""}
                  onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  placeholder="https://x.com/jabourphone"
                  className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0077fe] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b0001e] transition disabled:opacity-50"
              >
                {savingSettings && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Social Profiles
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tab 4: Admin Accounts & Roles */}
      {activeTab === "admins" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-sm font-black uppercase text-[#15161d]">
                  Administrator Accounts & Roles
                </h2>
                <p className="text-xs text-gray-500">
                  Manage store managers, secondary administrators, and staff privileges.
                </p>
              </div>

              <button
                onClick={() => {
                  setUserActionError("");
                  setUserActionSuccess("");
                  setUserModalOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#15161d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Admin Account
              </button>
            </div>

            {userActionSuccess && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-xs font-semibold text-green-800 border border-green-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                {userActionSuccess}
              </div>
            )}
            {userActionError && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-800 border border-red-200 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                {userActionError}
              </div>
            )}

            <div className="divide-y divide-gray-100 rounded-lg border border-gray-100 overflow-hidden">
              {loadingUsers ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#0077fe] mb-2" />
                  Loading accounts...
                </div>
              ) : (
                adminUsers.map((user) => {
                  const isCurrent = user.id === admin?.id;
                  const roleBadgeClass =
                    user.role === "SUPER_ADMIN"
                      ? "bg-purple-100 text-purple-800 border-purple-200"
                      : user.role === "ADMIN"
                      ? "bg-blue-100 text-blue-800 border-blue-200"
                      : "bg-gray-100 text-gray-800 border-gray-200";

                  return (
                    <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-blue-50 text-[#0077fe] font-black text-xs flex items-center justify-center">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#15161d]">{user.name}</span>
                            {isCurrent && (
                              <span className="rounded bg-red-100 px-1.5 py-0.2 text-[9px] font-bold text-[#0077fe] uppercase">
                                You
                              </span>
                            )}
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9px] font-black border uppercase tracking-wider ${roleBadgeClass}`}
                            >
                              {user.role.replace("_", " ")}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteAdminUser(user.id, user.name)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                            title="Delete administrator"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Add Admin Modal */}
          {userModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-[#15161d]">Add New Administrator</h3>
                  <button
                    onClick={() => setUserModalOpen(false)}
                    className="p-1 text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {userActionError && (
                  <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs font-semibold text-red-700 border border-red-200">
                    {userActionError}
                  </div>
                )}

                <form onSubmit={handleCreateAdminUser} className="mt-4 space-y-3.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newAdminName}
                      onChange={(e) => setNewAdminName(e.target.value)}
                      placeholder="e.g. Fadi Jabour"
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-semibold focus:border-[#0077fe] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      placeholder="admin@jabourphone.com"
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-semibold focus:border-[#0077fe] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700">Role Privilege *</label>
                    <select
                      value={newAdminRole}
                      onChange={(e) =>
                        setNewAdminRole(e.target.value as "SUPER_ADMIN" | "ADMIN" | "STAFF")
                      }
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs font-semibold focus:border-[#0077fe] focus:outline-none"
                    >
                      <option value="ADMIN">Administrator (Full catalog & orders access)</option>
                      <option value="SUPER_ADMIN">Super Administrator (Full store + settings + users)</option>
                      <option value="STAFF">Staff (Orders & inventory view only)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-gray-700">
                      Temporary Password (min 12 chars) *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={12}
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      placeholder="At least 12 characters"
                      className="mt-1 w-full rounded-lg border border-gray-200 p-2.5 text-xs focus:border-[#0077fe] focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
                    <button
                      type="button"
                      onClick={() => setUserModalOpen(false)}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creatingUser}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#15161d] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black transition disabled:opacity-50"
                    >
                      {creatingUser && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Create Account
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Security & Password */}
      {activeTab === "security" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0077fe]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#0077fe]">
                  Administrator Profile
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-[#15161d]">
                  {admin?.name ?? "Administrator"}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-gray-400" />
                    {admin?.email ?? "—"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-gray-400" />
                    Role: <span className="font-semibold text-gray-700">{admin?.role ?? "ADMIN"}</span>
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#0077fe]" />
                <h2 className="text-base font-black uppercase tracking-wide text-[#15161d]">
                  Change Password
                </h2>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Update your administrator credentials. Minimum 12 characters required.
              </p>

              {passwordSuccess && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-3.5 text-xs font-semibold text-green-800 border border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {passwordError && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3.5 text-xs font-semibold text-red-800 border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Current Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-xs focus:border-[#0077fe] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    New Password (min 12 chars)
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={12}
                      className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-xs focus:border-[#0077fe] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-gray-700">
                    Confirm New Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-200 p-2.5 pr-10 text-xs focus:border-[#0077fe] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingPassword}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#0077fe] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#b0001e] transition disabled:opacity-50"
                  >
                    {submittingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
