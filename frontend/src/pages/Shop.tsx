import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { useCategories } from "../context/CategoryContext";

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

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
        const query = searchParams.toString();
        const res = await fetch(`/api/products?${query}`);
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Error fetching products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
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
  const displayCategoryTitle = activeCategoryObj ? activeCategoryObj.name : currentCategory || "All Hardware";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & mobile filter toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#15161d] uppercase tracking-tight">
            {displayCategoryTitle}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {products.length} products verified against bench tolerances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded text-xs font-bold uppercase tracking-wider text-gray-700"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* Sort selection */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span className="hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="bg-white border border-gray-300 rounded px-3 py-2 text-xs font-medium focus:outline-none focus:border-[#d10024]"
            >
              <option value="featured">Featured Bench</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="title-asc">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className={`md:block space-y-8 ${mobileFilterOpen ? "block" : "hidden"}`}>
          {hasActiveFilters && (
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded">
              <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
                Filters Active
              </span>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-600 hover:text-red-700 font-bold flex items-center gap-1"
              >
                Clear all <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Department Filter */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15161d] mb-3">
              Department
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="cat"
                  checked={!currentCategory}
                  onChange={() => updateFilter("category", "")}
                  className="accent-[#d10024]"
                />
                <span className="text-gray-700 font-medium">All Departments</span>
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
                        className="accent-[#d10024]"
                      />
                      <span className={`font-medium transition-colors ${isSelected ? "text-[#d10024] font-bold" : "text-gray-700 group-hover:text-black"}`}>
                        {cat.name}
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
              Brand
            </h3>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="brand"
                  checked={!currentBrand}
                  onChange={() => updateFilter("brand", "")}
                  className="accent-[#d10024]"
                />
                <span className="text-gray-700 font-medium">All Brands</span>
              </label>
              {brands.map((b) => (
                <label key={b} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="brand"
                    checked={currentBrand.toLowerCase() === b.toLowerCase()}
                    onChange={() => updateFilter("brand", b)}
                    className="accent-[#d10024]"
                  />
                  <span className="text-gray-700 font-medium">{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#15161d] mb-3">
              Price Range ($)
            </h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={currentMin}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className="w-full px-2 py-1.5 text-xs border rounded bg-white"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
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
              <h3 className="text-lg font-bold text-gray-800">No matching hardware found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range or clearing selected brand/category filters.
              </p>
              <button
                onClick={clearFilters}
                className="px-5 py-2 bg-[#15161d] text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-[#d10024] transition"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.handle} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
