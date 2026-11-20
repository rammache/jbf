import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { Product } from "../types";

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useCart();
  const { formatPrice } = useSettings();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isSearchOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen, setIsSearchOpen]);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery("");
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(trimmed)}`);
        const json = await res.json();
        if (json.success) {
          setResults(json.data.slice(0, 6));
        }
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
      className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative max-w-2xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden z-10 border border-gray-200">
        {/* Search Input bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400 mr-3 rtl:mr-0 rtl:ml-3" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("header.searchPlaceholder")}
            className="flex-1 bg-transparent text-sm sm:text-base text-gray-800 placeholder-gray-400 focus:outline-none"
            autoFocus
            aria-label={t("header.searchPlaceholder")}
          />
          {loading ? (
            <Loader2 className="w-5 h-5 text-gray-400 animate-spin mr-2 rtl:mr-0 rtl:ml-2" aria-hidden="true" />
          ) : query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-gray-400 hover:text-gray-600 mr-2 rtl:mr-0 rtl:ml-2"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-bold uppercase text-gray-500 hover:text-gray-800 ml-2 rtl:ml-0 rtl:mr-2"
            aria-label="Close search"
          >
            {t("header.searchEsc")}
          </button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim().length >= 2 && results.length === 0 && !loading && (
            <div className="text-center py-10 text-gray-500 text-sm">
              {t("header.noResults")} "<span className="font-semibold text-gray-800">{query}</span>"
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase text-gray-400 px-2 tracking-wider">
                {t("header.matchingProducts")} ({results.length})
              </p>
              {results.map((product) => (
                <Link
                  key={product.handle}
                  to={`/product/${product.handle}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition group"
                >
                  <img
                    src={product.images[0] || "/phone-placeholder.svg"}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded bg-gray-100 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-[#d10024] truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{product.spec}</p>
                  </div>
                  <div className="text-right rtl:text-left">
                    <span className="text-sm font-extrabold text-[#d10024]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {query.trim().length < 2 && (
            <div className="py-6 px-2 text-center text-xs text-gray-400">
              {t("header.typeMinChars")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
