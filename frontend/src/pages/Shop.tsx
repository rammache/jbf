import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { useCategories } from "../context/CategoryContext";
import { useLanguage } from "../context/LanguageContext";
import { SEO } from "../components/SEO";

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const { t, tCategory, currencySymbol } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Active filters
  const currentCategory = searchParams.get("category") || "";
  const currentBrand = searchParams.get("brand") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentMin = searchParams.get("minPrice") || "";
  const currentMax = searchParams.get("maxPrice") || "";
  const currentQuery = searchParams.get("q") || "";

  useEffect(() => {
    // Fetch brands
    fetch("/api/brands")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setBrands(json.data);
      })
      .catch((err) => console.error("Error fetching brands", err));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams);
        params.set("page", page.toString());
        params.set("limit", "12");

        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
          if (json.totalPages) setTotalPages(json.totalPages);
          if (json.total !== undefined) setTotalCount(json.total);
          else setTotalCount(json.data.length);
        }
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, page]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setPage(1);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setPage(1);
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    Boolean(currentCategory) ||
    Boolean(currentBrand) ||
    Boolean(currentMin) ||
    Boolean(currentMax) ||
    Boolean(currentQuery);

  const activeCategoryObj = categories.find(
    (c) =>
      c.slug.toLowerCase() === currentCategory.toLowerCase() ||
      c.name.toLowerCase() === currentCategory.toLowerCase()
  );
  const displayCategoryTitle = activeCategoryObj
    ? tCategory(activeCategoryObj.name)
    : currentCategory
      ? tCategory(currentCategory)
      : t("shop.title");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SEO
        title={displayCategoryTitle}
        description={`Browse ${displayCategoryTitle} at Jabour Phone with verified specs and manufacturer warranty.`}
      />
      {/* Title & mobile filter toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#15161d] uppercase tracking-tight">
            {displayCategoryTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount} {t("shop.productsCount")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded text-xs font-bold uppercase tracking-wider text-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4" /> {t("shop.filters")}
          </button>

          {/* Sort selection */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span className="hidden sm:inline">{t("shop.sortBy")}:</span>
            <select
              value={currentSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="bg-white border border-gray-300 rounded px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#0077fe]"
            >
              <option value="featured">{t("shop.sortFeatured")}</option>
              <option value="price-asc">{t("shop.sortPriceAsc")}</option>
              <option value="price-desc">{t("shop.sortPriceDesc")}</option>
              <option value="rating-desc">{t("shop.sortRating")}</option>
              <option value="title-asc">{t("shop.sortAlpha")}</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className={`md:block space-y-8 ${mobileFilterOpen ? "block" : "hidden"}`}>
          {hasActiveFilters && (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded">
              <span className="text-xs font-bold text-[#0077fe] uppercase tracking-wider">
                {t("shop.filtersActive")}
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-[#0077fe] font-bold flex items-center gap-1 transition-colors"
              >
                {t("shop.clearFilters")} <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Department Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15161d] mb-3">
              {t("shop.categories")}
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cat"
                  checked={!currentCategory}
                  onChange={() => updateFilter("category", "")}
                  className="accent-[#0077fe]"
                />
                <span className="text-gray-700 font-medium">{t("shop.allDepartments")}</span>
              </label>
              {categories.map((cat) => {
                const isSelected =
                  currentCategory.toLowerCase() === (cat.slug || "").toLowerCase() ||
                  currentCategory.toLowerCase() === (cat.name || "").toLowerCase();

                return (
                  <label key={cat.id} className="flex items-center justify-between cursor-pointer group">
                    <span className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="cat"
                        checked={isSelected}
                        onChange={() => updateFilter("category", cat.slug || cat.name)}
                        className="accent-[#0077fe]"
                      />
                      <span className={`font-medium transition-colors ${isSelected ? "text-[#0077fe] font-bold" : "text-gray-700 group-hover:text-black"}`}>
                        {tCategory(cat.name)}
                      </span>
                    </span>
                    {cat._count?.products !== undefined && (
                      <span className="text-[10px] text-gray-400 font-mono">
                        {cat._count.products}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Brand Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15161d] mb-3">
              {t("shop.brands")}
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={!currentBrand}
                  onChange={() => updateFilter("brand", "")}
                  className="accent-[#0077fe]"
                />
                <span className="text-gray-700 font-medium">{t("shop.allBrands")}</span>
              </label>
              {brands.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={currentBrand.toLowerCase() === b.toLowerCase()}
                    onChange={() => updateFilter("brand", b)}
                    className="accent-[#0077fe]"
                  />
                  <span className="text-gray-700 font-medium">{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15161d] mb-3">
              {t("shop.priceRange")} ({currencySymbol})
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder={t("shop.minPrice")}
                value={currentMin}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border rounded bg-white"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder={t("shop.maxPrice")}
                value={currentMax}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border rounded bg-white"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-gray-200 rounded-lg" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 p-8 space-y-4">
              <Filter className="w-10 h-10 text-gray-400 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">{t("shop.noProducts")}</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {t("shop.subtitle")}
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2 bg-[#15161d] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#0077fe] transition"
              >
                {t("shop.clearFilters")}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.handle} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                  <div className="text-xs text-gray-500">
                    Showing page <span className="font-bold text-gray-900">{page}</span> of{" "}
                    <span className="font-bold text-gray-900">{totalPages}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => {
                        setPage((p) => Math.max(1, p - 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={page >= totalPages}
                      onClick={() => {
                        setPage((p) => Math.min(totalPages, p + 1));
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="rounded border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
