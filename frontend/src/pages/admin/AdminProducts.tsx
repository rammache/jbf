import React, { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  CheckSquare,
  Copy,
  Edit2,
  Eye,
  Filter,
  Image as ImageIcon,
  Loader2,
  Package,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  UploadCloud,
  X
} from "lucide-react";
import { api, ApiError } from "../../api";
import { Product } from "../../types";
import { useCategories } from "../../context/CategoryContext";
import { useSettings } from "../../context/SettingsContext";

interface ProductFormData {
  id?: number;
  title: string;
  handle: string;
  regenerateHandle?: boolean;
  price: string;
  compare: string;
  costPrice: string;
  supplier: string;
  categoryId: string;
  brand: string;
  sku: string;
  stock: string;
  lowStockThreshold: string;
  condition: "NEW" | "USED" | "REFURBISHED";
  storage: string;
  ram: string;
  color: string;
  spec: string;
  screen: string;
  battery: string;
  camera: string;
  network: string;
  warranty: string;
  processor: string;
  description: string;
  finishes: string[];
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
}

const INITIAL_FORM: ProductFormData = {
  title: "",
  handle: "",
  regenerateHandle: false,
  price: "",
  compare: "",
  costPrice: "",
  supplier: "",
  categoryId: "",
  brand: "Apple",
  sku: "",
  stock: "10",
  lowStockThreshold: "5",
  condition: "NEW",
  storage: "128GB",
  ram: "8GB",
  color: "",
  spec: "",
  screen: "",
  battery: "",
  camera: "",
  network: "5G",
  warranty: "1 Year Official Warranty",
  processor: "",
  description: "",
  finishes: [],
  images: [],
  isActive: true,
  isFeatured: false
};

export const AdminProducts: React.FC = () => {
  const { categories, refreshCategories } = useCategories();
  const { formatPrice } = useSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination & Filters
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // KPI counts
  const [kpis, setKpis] = useState({
    total: 0,
    active: 0,
    lowStock: 0,
    outOfStock: 0
  });

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "pricing" | "media" | "specs" | "description">("basic");

  // Image upload state
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [newFinishInput, setNewFinishInput] = useState("");

  // Delete modal state
  const [deleteModalProduct, setDeleteModalProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load products from API
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        sortBy,
        sortOrder
      });

      if (search.trim()) params.append("search", search.trim());
      if (categoryFilter) params.append("categoryId", categoryFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await api.get<{
        products: Product[];
        pagination: { page: number; limit: number; total: number; totalPages: number };
        kpis: { total: number; active: number; lowStock: number; outOfStock: number };
      }>(`/api/admin/products?${params.toString()}`);

      setProducts(res.products);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
      if (res.kpis) {
        setKpis(res.kpis);
      }
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search, categoryFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Open Create Modal
  const openCreateModal = () => {
    setFormMode("create");
    setFormData({
      ...INITIAL_FORM,
      categoryId: categories[0]?.id ? String(categories[0].id) : ""
    });
    setFormError("");
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setFormMode("edit");
    const catId = typeof product.category === "object" ? product.category.id : product.categoryId || "";
    setFormData({
      id: product.id,
      title: product.title,
      handle: product.handle,
      regenerateHandle: false,
      price: product.price.toString(),
      compare: product.compare !== null && product.compare !== undefined ? product.compare.toString() : "",
      costPrice: product.costPrice !== null && product.costPrice !== undefined ? product.costPrice.toString() : "",
      supplier: product.supplier || "",
      categoryId: String(catId),
      brand: product.brand || "",
      sku: product.sku || "",
      stock: (product.stock ?? 0).toString(),
      lowStockThreshold: (product.lowStockThreshold ?? 5).toString(),
      condition: (product.condition as any) || "NEW",
      storage: product.storage || "",
      ram: product.ram || "",
      color: product.color || "",
      spec: product.spec || "",
      screen: product.screen || "",
      battery: product.battery || "",
      camera: product.camera || "",
      network: product.network || "",
      warranty: product.warranty || "",
      processor: product.processor || "",
      description: product.description || "",
      finishes: product.finishes ? [...product.finishes] : [],
      images: product.images ? [...product.images] : [],
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured ?? product.featured ?? false
    });
    setFormError("");
    setActiveTab("basic");
    setIsModalOpen(true);
  };

  // One-click quick toggle active
  const handleToggleActive = async (product: Product) => {
    try {
      const nextActive = !product.isActive;
      await api.put(`/api/admin/products/${product.id}`, { isActive: nextActive });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isActive: nextActive } : p))
      );
      setSuccessMessage(`Product "${product.title}" is now ${nextActive ? "Active" : "Draft"}.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to toggle active status");
    }
  };

  // One-click quick toggle featured
  const handleToggleFeatured = async (product: Product) => {
    try {
      const nextFeatured = !(product.isFeatured ?? product.featured);
      await api.put(`/api/admin/products/${product.id}`, { isFeatured: nextFeatured });
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, isFeatured: nextFeatured, featured: nextFeatured } : p))
      );
      setSuccessMessage(`Product "${product.title}" ${nextFeatured ? "marked as Featured" : "removed from Featured"}.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to toggle featured status");
    }
  };

  // Duplicate product
  const handleDuplicate = async (product: Product) => {
    try {
      const res = await api.post<{ success: boolean; product: Product; message: string }>(
        `/api/admin/products/${product.id}/duplicate`
      );
      setSuccessMessage(`Product duplicated: "${res.product.title}" saved as Draft.`);
      fetchProducts();
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to duplicate product");
    }
  };

  // Multi-image upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    setFormError("");

    try {
      const uploadFormData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadFormData.append("images", files[i]);
      }

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: uploadFormData,
        credentials: "include"
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Image upload failed");
      }

      if (data.urls && Array.isArray(data.urls)) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...data.urls]
        }));
      }
    } catch (err: any) {
      setFormError(err.message || "Failed to upload images");
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = "";
    }
  };

  // Add image URL manually
  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput("");
  };

  // Remove image
  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Set primary image (move to index 0)
  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return;
    setFormData((prev) => {
      const next = [...prev.images];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return { ...prev, images: next };
    });
  };

  // Move image left/right
  const handleMoveImage = (index: number, direction: "left" | "right") => {
    setFormData((prev) => {
      const next = [...prev.images];
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return { ...prev, images: next };
    });
  };

  // Add finish / color tag
  const handleAddFinish = () => {
    if (!newFinishInput.trim()) return;
    if (!formData.finishes.includes(newFinishInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        finishes: [...prev.finishes, newFinishInput.trim()]
      }));
    }
    setNewFinishInput("");
  };

  // Remove finish
  const handleRemoveFinish = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      finishes: prev.finishes.filter((f) => f !== tag)
    }));
  };

  // Submit product create/edit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!formData.title.trim()) {
      setFormError("Product title is required.");
      setActiveTab("basic");
      return;
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setFormError("Selling price must be greater than 0.");
      setActiveTab("pricing");
      return;
    }

    const compareNum = formData.compare.trim() ? parseFloat(formData.compare) : null;
    if (compareNum !== null) {
      if (isNaN(compareNum) || compareNum <= priceNum) {
        setFormError("Compare at price (original price) must be strictly greater than the selling price.");
        setActiveTab("pricing");
        return;
      }
    }

    const catIdNum = parseInt(formData.categoryId, 10);
    if (isNaN(catIdNum) || catIdNum <= 0) {
      setFormError("Please select a valid category.");
      setActiveTab("basic");
      return;
    }

    const stockNum = parseInt(formData.stock, 10);
    if (isNaN(stockNum) || stockNum < 0) {
      setFormError("Stock quantity cannot be negative.");
      setActiveTab("pricing");
      return;
    }

    const lowStockNum = parseInt(formData.lowStockThreshold, 10);

    setFormSubmitting(true);

    try {
      const payload: any = {
        title: formData.title.trim(),
        price: priceNum,
        compare: compareNum,
        costPrice: formData.costPrice.trim() ? parseFloat(formData.costPrice) : null,
        supplier: formData.supplier.trim() || null,
        categoryId: catIdNum,
        brand: formData.brand.trim() || "Jabour",
        sku: formData.sku.trim() || null,
        stock: stockNum,
        lowStockThreshold: isNaN(lowStockNum) ? 5 : lowStockNum,
        condition: formData.condition,
        storage: formData.storage.trim() || null,
        ram: formData.ram.trim() || null,
        color: formData.color.trim() || null,
        spec: formData.spec.trim(),
        screen: formData.screen.trim() || null,
        battery: formData.battery.trim() || null,
        camera: formData.camera.trim() || null,
        network: formData.network.trim() || null,
        warranty: formData.warranty.trim() || null,
        processor: formData.processor.trim() || null,
        description: formData.description.trim() || null,
        finishes: formData.finishes,
        images: formData.images,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured
      };

      if (formMode === "create") {
        if (formData.handle.trim()) payload.handle = formData.handle.trim();
        await api.post("/api/admin/products", payload);
        setSuccessMessage(`Product "${formData.title}" created successfully!`);
      } else {
        if (formData.regenerateHandle) payload.regenerateHandle = true;
        else if (formData.handle.trim()) payload.handle = formData.handle.trim();
        await api.put(`/api/admin/products/${formData.id}`, payload);
        setSuccessMessage(`Product "${formData.title}" updated successfully!`);
      }

      setIsModalOpen(false);
      fetchProducts();
      refreshCategories();
    } catch (err: any) {
      setFormError(err instanceof ApiError ? err.message : "Failed to save product");
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete product (checks archive rule)
  const confirmDelete = async () => {
    if (!deleteModalProduct) return;
    setDeleteLoading(true);

    try {
      const res = await api.delete<{
        success: boolean;
        archived: boolean;
        deleted: boolean;
        message: string;
      }>(`/api/admin/products/${deleteModalProduct.id}`);

      setSuccessMessage(res.message);
      setDeleteModalProduct(null);
      fetchProducts();
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to delete product");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action: "activate" | "deactivate" | "archive" | "delete") => {
    if (selectedIds.length === 0) return;

    if (action === "delete") {
      if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected product(s)? Products with existing customer orders will be safely archived instead.`)) {
        return;
      }
    }

    setBulkActionLoading(true);
    try {
      const res = await api.post<{ success: boolean; message: string }>("/api/admin/products/bulk", {
        ids: selectedIds,
        action
      });
      setSuccessMessage(res.message);
      setSelectedIds([]);
      fetchProducts();
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : "Failed to perform bulk action");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Toggle select all
  const handleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((p) => p.id));
    }
  };

  // Toggle single item
  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Notifications */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-md bg-green-50 p-4 text-sm font-medium text-green-800 border border-green-200">
          <div className="flex items-center space-x-2">
            <Check className="h-5 w-5 text-green-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="text-green-600 hover:text-green-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-md bg-red-50 p-4 text-sm font-medium text-red-800 border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-[#15161d]">
            Product Catalog
          </h1>
          <p className="text-sm text-gray-500">
            Manage your store inventory, phone specifications, stock alerts, and pricing.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => fetchProducts()}
            disabled={loading}
            className="inline-flex items-center space-x-2 rounded border border-gray-300 bg-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center space-x-2 rounded bg-[#0077fe] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#b0001e] transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Products</span>
            <Package className="h-4 w-4 text-gray-400" />
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">{kpis.total}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-green-600">Active / Live</span>
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-gray-900">{kpis.active}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Low Stock (≤5)</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-black text-amber-600">{kpis.lowStock}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600">Out of Stock (0)</span>
            <span className="flex h-2 w-2 rounded-full bg-red-600" />
          </div>
          <p className="mt-2 text-2xl font-black text-red-600">{kpis.outOfStock}</p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm border border-gray-200 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search title, brand, SKU, or slug..."
              className="w-full rounded border border-gray-300 pl-9 pr-4 py-2 text-xs focus:border-[#0077fe] focus:outline-none"
            />
          </div>
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center space-x-1">
            <Filter className="h-3.5 w-3.5 text-gray-400" />
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:border-[#0077fe] focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:border-[#0077fe] focus:outline-none"
          >
            <option value="all">Status: All (Active & Draft)</option>
            <option value="active">Active Only</option>
            <option value="draft">Draft Only</option>
            <option value="low_stock">Low Stock (≤5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
            <option value="archived">Archived Products</option>
          </select>

          {/* Sort By */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split("-");
              setSortBy(sb);
              setSortOrder(so as "asc" | "desc");
              setPage(1);
            }}
            className="rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-700 focus:border-[#0077fe] focus:outline-none"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="stock-asc">Stock: Low to High</option>
            <option value="stock-desc">Stock: High to Low</option>
            <option value="title-asc">Title: A-Z</option>
          </select>
        </div>
      </div>

      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3 border border-blue-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-blue-900">
            <CheckSquare className="h-4 w-4 text-blue-600" />
            <span>{selectedIds.length} product(s) selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkAction("activate")}
              className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-green-700 border border-green-300 hover:bg-green-50 shadow-sm"
            >
              Activate
            </button>
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkAction("deactivate")}
              className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 border border-gray-300 hover:bg-gray-50 shadow-sm"
            >
              Deactivate
            </button>
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkAction("delete")}
              className="rounded bg-white px-2.5 py-1 text-xs font-semibold text-red-600 border border-red-300 hover:bg-red-50 shadow-sm"
            >
              Delete / Archive
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="ml-2 text-xs text-gray-500 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-left text-xs">
            <thead className="bg-[#15161d] text-white uppercase tracking-wider font-bold">
              <tr>
                <th scope="col" className="w-10 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={products.length > 0 && selectedIds.length === products.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-400 text-[#0077fe] focus:ring-[#0077fe]"
                  />
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Product Info
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Category
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Price / Compare
                </th>
                <th scope="col" className="px-4 py-3.5">
                  Stock Level
                </th>
                <th scope="col" className="px-4 py-3.5 text-center">
                  Active
                </th>
                <th scope="col" className="px-4 py-3.5 text-center">
                  Featured
                </th>
                <th scope="col" className="px-4 py-3.5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#0077fe]" />
                    <span className="mt-2 block font-medium">Loading products...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Package className="mx-auto h-8 w-8 text-gray-300" />
                    <p className="mt-2 font-semibold text-gray-700">No products found</p>
                    <p className="text-xs text-gray-400">
                      Try clearing your search query or add a new product.
                    </p>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const isSelected = selectedIds.includes(product.id);
                  const isFeatured = product.isFeatured ?? product.featured ?? false;
                  const primaryImage = product.images?.[0] || "";
                  const categoryName = typeof product.category === "object" ? product.category.name : product.category;

                  const isOutOfStock = product.stock <= 0;
                  const isLowStock = !isOutOfStock && product.stock <= (product.lowStockThreshold ?? 5);

                  return (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50/80 transition-colors ${isSelected ? "bg-red-50/30" : ""
                        }`}
                    >
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(product.id)}
                          className="rounded border-gray-300 text-[#0077fe] focus:ring-[#0077fe]"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100">
                            {primaryImage ? (
                              <img
                                src={primaryImage}
                                alt={product.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <ImageIcon className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <div className="font-bold text-gray-900 truncate" title={product.title}>
                              {product.title}
                            </div>
                            <div className="flex items-center space-x-2 text-[11px] text-gray-500">
                              <span className="font-medium text-gray-700">{product.brand}</span>
                              {product.sku && (
                                <>
                                  <span>•</span>
                                  <span className="font-mono text-gray-500">SKU: {product.sku}</span>
                                </>
                              )}
                              {product.condition && (
                                <>
                                  <span>•</span>
                                  <span className="rounded bg-gray-100 px-1 py-0.2 text-[10px] uppercase font-semibold text-gray-600">
                                    {product.condition}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-semibold text-gray-700">
                          {categoryName || "Uncategorized"}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="font-bold text-gray-900">{formatPrice(product.price)}</div>
                        {product.compare && product.compare > product.price && (
                          <div className="flex items-center space-x-1.5 text-[11px]">
                            <span className="text-gray-400 line-through">
                              {formatPrice(product.compare)}
                            </span>
                            <span className="font-semibold text-red-600">
                              -{Math.round(((product.compare - product.price) / product.compare) * 100)}%
                            </span>
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center rounded bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">
                            Out of Stock (0)
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center rounded bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-800">
                            In Stock ({product.stock})
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(product)}
                          title={product.isActive ? "Click to deactivate" : "Click to activate"}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${product.isActive ? "bg-[#0077fe]" : "bg-gray-300"
                            }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${product.isActive ? "translate-x-4" : "translate-x-0"
                              }`}
                          />
                        </button>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(product)}
                          title={isFeatured ? "Remove from Featured" : "Mark as Featured"}
                          className={`p-1 transition-colors ${isFeatured
                              ? "text-amber-500 hover:text-amber-600"
                              : "text-gray-300 hover:text-gray-500"
                            }`}
                        >
                          <Star className={`h-5 w-5 ${isFeatured ? "fill-amber-400" : ""}`} />
                        </button>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(product)}
                            title="Edit Product"
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-[#15161d]"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDuplicate(product)}
                            title="Duplicate Product"
                            className="rounded p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteModalProduct(product)}
                            title="Delete / Archive Product"
                            className="rounded p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
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

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="text-xs text-gray-500">
              Showing page <span className="font-bold text-gray-900">{page}</span> of{" "}
              <span className="font-bold text-gray-900">{totalPages}</span> ({totalCount} total)
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl bg-white shadow-2xl border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-black uppercase tracking-tight text-[#15161d]">
                  {formMode === "create" ? "Add New Product" : `Edit Product: ${formData.title}`}
                </h3>
                <p className="text-xs text-gray-500">
                  Fill in product details, pricing, phone specifications, and photos.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Tab Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50/80 px-6">
              {[
                { id: "basic", label: "Basic Info" },
                { id: "pricing", label: "Pricing & Stock" },
                { id: "media", label: `Media (${formData.images.length})` },
                { id: "specs", label: "Phone Specs" },
                { id: "description", label: "Description" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`border-b-2 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === tab.id
                      ? "border-[#0077fe] text-[#0077fe]"
                      : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {formError && (
                <div className="rounded-md bg-red-50 p-3 text-xs font-medium text-red-700 border border-red-200 flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* TAB 1: BASIC INFO */}
              {activeTab === "basic" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Product Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g. Apple iPhone 15 Pro Max 256GB"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Brand <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.brand}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                        placeholder="e.g. Apple, Samsung, Xiaomi"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={formData.categoryId}
                        onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      >
                        <option value="">Select Category</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        SKU (Stock Keeping Unit)
                      </label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        placeholder="e.g. JBF-IP15PM-256"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Device Condition
                      </label>
                      <select
                        value={formData.condition}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      >
                        <option value="NEW">Brand New / Sealed</option>
                        <option value="REFURBISHED">Refurbished / Certified</option>
                        <option value="USED">Used / Excellent Condition</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        URL Handle (Slug)
                      </label>
                      <input
                        type="text"
                        value={formData.handle}
                        onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                        placeholder="Leave blank to auto-generate from title"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-mono text-gray-600 focus:border-[#0077fe] focus:outline-none"
                      />
                      {formMode === "edit" && (
                        <label className="mt-1.5 flex items-center space-x-2 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            checked={formData.regenerateHandle}
                            onChange={(e) => setFormData({ ...formData, regenerateHandle: e.target.checked })}
                            className="rounded text-[#0077fe] focus:ring-[#0077fe]"
                          />
                          <span>Regenerate handle from updated title (may change product URL)</span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Active & Featured Flags */}
                  <div className="flex flex-wrap items-center gap-6 rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="rounded h-4 w-4 text-[#0077fe] focus:ring-[#0077fe]"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                        Active on Storefront
                      </span>
                    </label>

                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                        className="rounded h-4 w-4 text-[#0077fe] focus:ring-[#0077fe]"
                      />
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
                        Featured on Home Page
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & INVENTORY */}
              {activeTab === "pricing" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Selling Price ($) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="e.g. 999.00"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-bold focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Compare at Price ($) <span className="text-gray-400 font-normal">(Optional Sale Price)</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.compare}
                        onChange={(e) => setFormData({ ...formData, compare: e.target.value })}
                        placeholder="Must be greater than selling price, e.g. 1099.00"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                      {formData.compare && parseFloat(formData.compare) <= parseFloat(formData.price || "0") && (
                        <p className="mt-1 text-xs text-red-600 font-medium">
                          Warning: Compare at price must be greater than selling price.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Supplier / Purchase Cost ($) <span className="text-gray-400 font-normal">(For Profit Reports)</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.costPrice}
                        onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                        placeholder="Cost to buy from supplier, e.g. 750.00"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Supplier Name / Source
                      </label>
                      <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        placeholder="e.g. Official Distributor, Dubai Tech Wholesaler"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Stock Quantity <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm font-bold focus:border-[#0077fe] focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-gray-500">
                        Orders will be blocked when stock reaches 0.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Low Stock Alert Threshold
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                        placeholder="Default: 5"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA / IMAGES */}
              {activeTab === "media" && (
                <div className="space-y-4">
                  {/* Upload Controls */}
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center hover:border-[#0077fe] transition-colors">
                    <UploadCloud className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-700">
                      Upload Photos from Computer
                    </p>
                    <p className="text-[11px] text-gray-400">JPG, PNG, WEBP, or GIF up to 10MB per image</p>
                    <label className="mt-3 inline-flex cursor-pointer items-center space-x-1.5 rounded bg-[#15161d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-black">
                      <Plus className="h-4 w-4" />
                      <span>{uploadingImage ? "Uploading..." : "Select Files"}</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Manual URL input */}
                  <div className="flex items-center space-x-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Or paste an image URL (https://...)"
                      className="flex-1 rounded border border-gray-300 px-3 py-1.5 text-xs focus:border-[#0077fe] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="rounded bg-gray-800 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-black"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Image Gallery & Reordering */}
                  {formData.images.length === 0 ? (
                    <div className="py-8 text-center text-xs text-gray-400">
                      No images added yet. The first image will be used as the primary cover photo.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                      {formData.images.map((imgUrl, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg border border-gray-200 bg-white p-2 shadow-sm"
                        >
                          <div className="relative aspect-square w-full overflow-hidden rounded bg-gray-100">
                            <img
                              src={imgUrl}
                              alt={`Product upload ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                            {index === 0 && (
                              <span className="absolute top-1.5 left-1.5 rounded bg-[#0077fe] px-1.5 py-0.5 text-[9px] font-black uppercase text-white shadow">
                                Cover Photo
                              </span>
                            )}
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-1">
                              {index > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, "left")}
                                  title="Move Left"
                                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                                >
                                  <ArrowDown className="h-3 w-3 -rotate-90" />
                                </button>
                              )}
                              {index < formData.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleMoveImage(index, "right")}
                                  title="Move Right"
                                  className="rounded p-1 text-gray-500 hover:bg-gray-100"
                                >
                                  <ArrowUp className="h-3 w-3 rotate-90" />
                                </button>
                              )}
                            </div>

                            <div className="flex items-center space-x-1">
                              {index !== 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleSetPrimaryImage(index)}
                                  className="text-[10px] text-blue-600 hover:underline"
                                >
                                  Make Cover
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="p-1 text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PHONE SPECIFICATIONS */}
              {activeTab === "specs" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Storage Capacity
                      </label>
                      <input
                        type="text"
                        value={formData.storage}
                        onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                        placeholder="e.g. 128GB, 256GB, 512GB, 1TB"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        RAM Memory
                      </label>
                      <input
                        type="text"
                        value={formData.ram}
                        onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                        placeholder="e.g. 8GB, 12GB, 16GB"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Screen / Display
                      </label>
                      <input
                        type="text"
                        value={formData.screen}
                        onChange={(e) => setFormData({ ...formData, screen: e.target.value })}
                        placeholder="e.g. 6.7in Super Retina XDR OLED 120Hz"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Battery & Charging
                      </label>
                      <input
                        type="text"
                        value={formData.battery}
                        onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
                        placeholder="e.g. 4422 mAh, 29W Fast Charging"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Camera System
                      </label>
                      <input
                        type="text"
                        value={formData.camera}
                        onChange={(e) => setFormData({ ...formData, camera: e.target.value })}
                        placeholder="e.g. 48MP Main + 12MP Ultra-Wide + 5x Telephoto"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Processor / Chipset
                      </label>
                      <input
                        type="text"
                        value={formData.processor}
                        onChange={(e) => setFormData({ ...formData, processor: e.target.value })}
                        placeholder="e.g. Apple A17 Pro (3nm)"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Network / Connectivity
                      </label>
                      <input
                        type="text"
                        value={formData.network}
                        onChange={(e) => setFormData({ ...formData, network: e.target.value })}
                        placeholder="e.g. 5G, Dual SIM (Nano-SIM + eSIM), Wi-Fi 6E"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        Warranty Terms
                      </label>
                      <input
                        type="text"
                        value={formData.warranty}
                        onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                        placeholder="e.g. 1 Year Official Jabour Warranty"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                        One-Line Spec Summary (Shown on product card)
                      </label>
                      <input
                        type="text"
                        value={formData.spec}
                        onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                        placeholder="e.g. 6.7in OLED · A17 Pro · 256GB · 5G"
                        className="mt-1 w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-[#0077fe] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Colors / Finishes Picker */}
                  <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Color Finishes (Customer can pick in storefront)
                    </label>
                    <div className="mt-2 flex items-center space-x-2">
                      <input
                        type="text"
                        value={newFinishInput}
                        onChange={(e) => setNewFinishInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFinish();
                          }
                        }}
                        placeholder="e.g. Natural Titanium, Black, Blue"
                        className="w-full max-w-xs rounded border border-gray-300 px-3 py-1.5 text-xs focus:border-[#0077fe] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddFinish}
                        className="rounded bg-gray-800 px-3 py-1.5 text-xs font-bold uppercase text-white hover:bg-black"
                      >
                        Add Finish
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.finishes.map((finish) => (
                        <span
                          key={finish}
                          className="inline-flex items-center space-x-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-800 border border-gray-300 shadow-sm"
                        >
                          <span>{finish}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveFinish(finish)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: DESCRIPTION */}
              {activeTab === "description" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                      Detailed Description
                    </label>
                    <textarea
                      rows={8}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Write comprehensive product description, highlights, box contents, and warranty details..."
                      className="mt-1 w-full rounded border border-gray-300 p-3 text-sm focus:border-[#0077fe] focus:outline-none"
                    />
                  </div>

                  {/* LIVE PREVIEW OF PRODUCT CARD */}
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                      <Eye className="h-4 w-4 text-[#0077fe]" />
                      <span>Live Storefront Card Preview</span>
                    </div>

                    <div className="max-w-xs rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                        {formData.images[0] ? (
                          <img
                            src={formData.images[0]}
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <ImageIcon className="h-8 w-8" />
                          </div>
                        )}
                        {formData.compare && parseFloat(formData.compare) > parseFloat(formData.price || "0") && (
                          <span className="absolute top-2 left-2 rounded bg-[#0077fe] px-2 py-0.5 text-[10px] font-black uppercase text-white shadow">
                            Sale
                          </span>
                        )}
                      </div>

                      <div className="mt-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {categories.find((c) => String(c.id) === formData.categoryId)?.name || "Category"}
                        </span>
                        <h4 className="font-bold text-gray-900 truncate">
                          {formData.title || "Product Title Preview"}
                        </h4>
                        <p className="text-xs text-gray-500 truncate">
                          {formData.spec || `${formData.storage || ""} · ${formData.ram || ""}`.trim()}
                        </p>
                        <div className="mt-2 flex items-baseline space-x-2">
                          <span className="text-lg font-black text-gray-900">
                            {formatPrice(formData.price || 0)}
                          </span>
                          {formData.compare && parseFloat(formData.compare) > parseFloat(formData.price || "0") && (
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(formData.compare)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="inline-flex items-center space-x-1.5 rounded bg-[#0077fe] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow hover:bg-[#b0001e] disabled:opacity-50"
                  >
                    {formSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    <span>{formMode === "create" ? "Create Product" : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-gray-200 space-y-4">
            <div className="flex items-center space-x-3 text-red-600">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete{" "}
              <strong className="text-gray-900">"{deleteModalProduct.title}"</strong>?
            </p>

            <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
              <p className="font-semibold">Order Protection Rule:</p>
              <p className="mt-1">
                If this product has been ordered by customers in the past, it will be{" "}
                <strong>archived</strong> instead of permanently deleted, ensuring customer order histories and invoices remain intact.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="rounded border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={confirmDelete}
                className="inline-flex items-center space-x-1.5 rounded bg-red-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>Delete / Archive</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
