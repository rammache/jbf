import React, { useState, useEffect, useCallback } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  Edit2,
  FolderTree,
  ImageIcon,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  X
} from "lucide-react";
import { api, ApiError } from "../../api";
import { Category } from "../../types";
import { useCategories } from "../../context/CategoryContext";

export const AdminCategories: React.FC = () => {
  const { refreshCategories: refreshStorefrontCategories } = useCategories();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bannerMessage, setBannerMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Reorder state
  const [hasOrderChanges, setHasOrderChanges] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);

  // Create / Edit modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formImage, setFormImage] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [formIsActive, setFormIsActive] = useState(true);
  const [formRegenerateSlug, setFormRegenerateSlug] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [reassignTargetId, setReassignTargetId] = useState<number | "">("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Fetch admin categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ success: boolean; data: Category[] }>("/api/admin/categories");
      if (res.success && Array.isArray(res.data)) {
        setCategories(res.data);
      }
    } catch (err: any) {
      setBannerMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "Failed to load categories."
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Clear banner automatically
  useEffect(() => {
    if (bannerMessage) {
      const timer = setTimeout(() => setBannerMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [bannerMessage]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDescription("");
    setFormImage("");
    const nextOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.sortOrder ?? 0)) + 1 : 0;
    setFormSortOrder(nextOrder);
    setFormIsActive(true);
    setFormRegenerateSlug(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setFormName(category.name);
    setFormSlug(category.slug);
    setFormDescription(category.description || "");
    setFormImage(category.image || "");
    setFormSortOrder(category.sortOrder ?? 0);
    setFormIsActive(category.isActive ?? true);
    setFormRegenerateSlug(false);
    setFormError(null);
    setIsModalOpen(true);
  };

  // Submit Create or Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError("Category name is required.");
      return;
    }

    setSubmittingForm(true);
    setFormError(null);

    try {
      if (editingCategory) {
        // Edit mode
        await api.put(`/api/admin/categories/${editingCategory.id}`, {
          name: formName.trim(),
          slug: formSlug.trim() ? formSlug.trim() : undefined,
          description: formDescription.trim() || null,
          image: formImage.trim() || null,
          sortOrder: Number(formSortOrder),
          isActive: formIsActive,
          regenerateSlug: formRegenerateSlug
        });
        setBannerMessage({ type: "success", text: `Category "${formName.trim()}" updated successfully.` });
      } else {
        // Create mode
        await api.post("/api/admin/categories", {
          name: formName.trim(),
          slug: formSlug.trim() ? formSlug.trim() : undefined,
          description: formDescription.trim() || null,
          image: formImage.trim() || null,
          sortOrder: Number(formSortOrder),
          isActive: formIsActive
        });
        setBannerMessage({ type: "success", text: `Category "${formName.trim()}" created successfully.` });
      }

      setIsModalOpen(false);
      await fetchCategories();
      await refreshStorefrontCategories();
    } catch (err: any) {
      setFormError(err instanceof ApiError ? err.message : "Failed to save category.");
    } finally {
      setSubmittingForm(false);
    }
  };

  // Instant Active Toggle
  const handleToggleActive = async (category: Category) => {
    try {
      const nextActive = !category.isActive;
      await api.put(`/api/admin/categories/${category.id}`, {
        isActive: nextActive
      });

      setCategories((prev) =>
        prev.map((c) => (c.id === category.id ? { ...c, isActive: nextActive } : c))
      );
      await refreshStorefrontCategories();
      setBannerMessage({
        type: "success",
        text: `Category "${category.name}" is now ${nextActive ? "active" : "inactive"}.`
      });
    } catch (err: any) {
      setBannerMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "Failed to update status."
      });
    }
  };

  // Reordering categories
  const handleMoveCategory = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const updated = [...categories];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Update sortOrder values to match new positions
    const reordered = updated.map((cat, i) => ({
      ...cat,
      sortOrder: i
    }));

    setCategories(reordered);
    setHasOrderChanges(true);
  };

  const handleSaveOrder = async () => {
    setSavingOrder(true);
    try {
      const orders = categories.map((cat, i) => ({
        id: cat.id,
        sortOrder: i
      }));

      await api.put("/api/admin/categories/reorder", { orders });
      setHasOrderChanges(false);
      await refreshStorefrontCategories();
      setBannerMessage({ type: "success", text: "Category display order saved successfully." });
    } catch (err: any) {
      setBannerMessage({
        type: "error",
        text: err instanceof ApiError ? err.message : "Failed to save category order."
      });
    } finally {
      setSavingOrder(false);
    }
  };

  // Open Delete Modal
  const handleOpenDelete = (category: Category) => {
    setDeletingCategory(category);
    setReassignTargetId("");
    setDeleteError(null);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    setIsDeleting(true);
    setDeleteError(null);

    const productCount = deletingCategory._count?.products ?? 0;

    try {
      const payload =
        productCount > 0 && reassignTargetId !== ""
          ? { reassignToCategoryId: Number(reassignTargetId) }
          : undefined;

      await api.delete(`/api/admin/categories/${deletingCategory.id}`, {
        json: payload
      });

      setBannerMessage({
        type: "success",
        text: `Category "${deletingCategory.name}" removed successfully.`
      });
      setDeletingCategory(null);
      await fetchCategories();
      await refreshStorefrontCategories();
    } catch (err: any) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete category.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered categories
  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      (c.description || "").toLowerCase().includes(q)
    );
  });

  const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products ?? 0), 0);
  const activeCount = categories.filter((c) => c.isActive).length;
  const otherCategories = deletingCategory
    ? categories.filter((c) => c.id !== deletingCategory.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner Alert */}
      {bannerMessage && (
        <div
          role="alert"
          className={`flex items-center justify-between rounded-lg p-4 text-xs font-semibold shadow-sm ${
            bannerMessage.type === "success"
              ? "border border-green-200 bg-green-50 text-green-900"
              : "border border-red-200 bg-red-50 text-red-900"
          }`}
        >
          <div className="flex items-center gap-2">
            {bannerMessage.type === "success" ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <p>{bannerMessage.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setBannerMessage(null)}
            className="rounded p-1 hover:bg-black/5"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header and Action Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight text-[#15161d]">
            Categories
          </h2>
          <p className="text-xs text-gray-500">
            Create, organize, and prioritize store departments and catalog hierarchy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {hasOrderChanges && (
            <button
              type="button"
              onClick={handleSaveOrder}
              disabled={savingOrder}
              className="inline-flex items-center gap-2 rounded bg-amber-600 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-amber-700 disabled:opacity-70"
            >
              {savingOrder ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Save New Order
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 rounded bg-[#d10024] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#a7001d]"
          >
            <Plus className="h-4 w-4" />
            New Category
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Categories</span>
            <FolderTree className="h-4 w-4" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#15161d]">{categories.length}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Active Departments</span>
            <Tag className="h-4 w-4 text-green-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-green-700">{activeCount}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Inactive</span>
            <Tag className="h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-gray-500">{categories.length - activeCount}</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Categorized Products</span>
            <Package className="h-4 w-4 text-[#d10024]" />
          </div>
          <p className="mt-2 text-2xl font-black text-[#15161d]">{totalProducts}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories by name, slug..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded border border-gray-300 py-1.5 pl-9 pr-3 text-xs focus:border-[#d10024] focus:outline-none"
          />
        </div>
        <p className="text-xs font-semibold text-gray-500">
          Showing {filteredCategories.length} of {categories.length}
        </p>
      </div>

      {/* Categories Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#d10024]" />
            <p className="text-xs font-semibold text-gray-500">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center gap-2 p-6 text-center">
            <FolderTree className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-bold text-gray-700">No categories found</p>
            <p className="text-xs text-gray-400">
              {searchQuery ? "Try clearing your search query." : "Click 'New Category' to create the first one."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="py-3 px-4 text-center w-20">Order</th>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-center">Products</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((cat, index) => {
                  const productCount = cat._count?.products ?? 0;

                  return (
                    <tr key={cat.id} className="transition hover:bg-gray-50/70">
                      {/* Reorder arrows */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveCategory(index, "up")}
                            disabled={index === 0}
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <span className="font-mono text-[11px] font-bold text-gray-600">
                            {cat.sortOrder ?? index}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleMoveCategory(index, "down")}
                            disabled={index === categories.length - 1}
                            className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        {cat.image ? (
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-10 w-10 rounded border border-gray-200 object-cover shadow-xs"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded border border-dashed border-gray-200 bg-gray-50 text-gray-400">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        )}
                      </td>

                      {/* Category Name & Slug */}
                      <td className="py-3 px-4">
                        <p className="font-bold text-[#15161d]">{cat.name}</p>
                        <p className="font-mono text-[10px] text-gray-400">/{cat.slug}</p>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-4 text-gray-600 max-w-xs truncate">
                        {cat.description || <span className="italic text-gray-400">No description</span>}
                      </td>

                      {/* Product Count */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                            productCount > 0
                              ? "bg-blue-50 text-blue-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Package className="h-3 w-3" />
                          {productCount}
                        </span>
                      </td>

                      {/* Active Status Toggle */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(cat)}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition ${
                            cat.isActive
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                          title={`Click to ${cat.isActive ? "deactivate" : "activate"}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              cat.isActive ? "bg-green-600" : "bg-gray-400"
                            }`}
                          />
                          {cat.isActive ? "Active" : "Inactive"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(cat)}
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#15161d]"
                            title="Edit Category"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(cat)}
                            className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete Category"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-gray-50">
              <h3 className="text-sm font-black uppercase tracking-wider text-[#15161d]">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Create New Category"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-red-800 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <p>{formError}</p>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Smartphones, Audio, Laptops..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs focus:border-[#d10024] focus:outline-none"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                  Custom Slug (optional)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty to auto-generate from name"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 font-mono text-xs focus:border-[#d10024] focus:outline-none"
                />
                <p className="mt-1 text-[10px] text-gray-400">
                  URL slug format: lowercase letters, numbers, and single hyphens.
                </p>
              </div>

              {/* Slug stability checkbox on Edit */}
              {editingCategory && (
                <div className="rounded border border-amber-200 bg-amber-50/60 p-3">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formRegenerateSlug}
                      onChange={(e) => setFormRegenerateSlug(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-[#d10024] focus:ring-[#d10024]"
                    />
                    <div>
                      <span className="font-bold text-amber-900">
                        Regenerate URL slug from category name
                      </span>
                      <p className="text-[10px] text-amber-700 leading-tight mt-0.5">
                        By default, existing slugs stay stable on rename to protect search rankings and bookmarks.
                        Check this only if you explicitly want to update the public URL.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary displayed on department banners..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded border border-gray-300 p-2 text-xs focus:border-[#d10024] focus:outline-none"
                />
              </div>

              {/* Image URL & Preview */}
              <div>
                <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                  Image URL / Cover Photo
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or /uploads/..."
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    className="flex-1 rounded border border-gray-300 p-2 text-xs focus:border-[#d10024] focus:outline-none"
                  />
                  {formImage && (
                    <button
                      type="button"
                      onClick={() => setFormImage("")}
                      className="rounded border border-gray-300 px-2 text-gray-500 hover:bg-gray-100"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {formImage && (
                  <div className="mt-2 flex items-center gap-3 rounded border border-gray-200 bg-gray-50 p-2">
                    <img
                      src={formImage}
                      alt="Preview"
                      className="h-12 w-12 rounded object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-gray-700 truncate">{formName || "Category cover"}</p>
                      <p className="text-[10px] text-gray-400">Live preview</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sort Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                    className="w-full rounded border border-gray-300 p-2 text-xs focus:border-[#d10024] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[#d10024] focus:ring-[#d10024]"
                    />
                    <span className="font-bold text-gray-700">Category is Active</span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingForm}
                  className="inline-flex items-center gap-2 rounded bg-[#d10024] px-5 py-2 font-bold uppercase tracking-wider text-white hover:bg-[#a7001d] disabled:opacity-70"
                >
                  {submittingForm && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION & REASSIGN MODAL */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 bg-red-50/50 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-[#15161d]">
                Delete Category: {deletingCategory.name}
              </h3>
            </div>

            <div className="p-6 space-y-4 text-xs">
              {deleteError && (
                <div className="rounded border border-red-200 bg-red-50 p-3 text-red-800 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <p>{deleteError}</p>
                </div>
              )}

              {(deletingCategory._count?.products ?? 0) > 0 ? (
                <>
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 space-y-2">
                    <p className="font-bold">
                      Cannot delete directly: {deletingCategory._count?.products} product(s) belong to this category!
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-800">
                      To prevent orphaned products in your store, choose a destination category below.
                      All products will be safely reassigned before this category is removed.
                    </p>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1 uppercase tracking-wider text-[10px]">
                      Reassign products to: *
                    </label>
                    <select
                      value={reassignTargetId}
                      onChange={(e) => setReassignTargetId(e.target.value ? Number(e.target.value) : "")}
                      className="w-full rounded border border-gray-300 p-2 text-xs focus:border-[#d10024] focus:outline-none"
                    >
                      <option value="">-- Choose destination category --</option>
                      {otherCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c._count?.products ?? 0} products currently)
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 leading-relaxed">
                  Are you sure you want to permanently delete category{" "}
                  <strong className="text-[#15161d]">{deletingCategory.name}</strong>?
                  This action cannot be undone.
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setDeletingCategory(null)}
                  className="rounded border border-gray-300 px-4 py-2 font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={
                    isDeleting ||
                    ((deletingCategory._count?.products ?? 0) > 0 && reassignTargetId === "")
                  }
                  className="inline-flex items-center gap-2 rounded bg-red-600 px-4 py-2 font-bold uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {(deletingCategory._count?.products ?? 0) > 0 ? "Reassign & Delete" : "Delete Category"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
