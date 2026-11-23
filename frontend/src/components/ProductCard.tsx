import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Check, ShieldCheck } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { ImageWithFallback } from "./ImageWithFallback";

const SWATCH_COLORS: Record<string, string> = {
  Graphite: "#3a3d45",
  Silver: "#c8ccd2",
  Midnight: "#15161d",
  White: "#f4f5f7",
  Crimson: "#0077fe",
  Blue: "#0077fe",
  Bleu: "#0077fe",
  Sand: "#d8c6ac",
  Steel: "#8d99ae"
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useSettings();
  const { t, tCategory } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState(
    product.finishes && product.finishes.length > 0 ? product.finishes[0] : ""
  );
  const [added, setAdded] = useState(false);

  const displayImage =
    isHovered && product.images.length > 1
      ? product.images[1]
      : product.images[0] || "/phone-placeholder.svg";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1, selectedFinish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const getConditionLabel = (cond?: string) => {
    if (!cond) return "";
    const upper = cond.toUpperCase();
    if (upper === "NEW") return t("product.conditionNew");
    if (upper === "REFURBISHED") return t("product.conditionRefurbished");
    if (upper === "USED") return t("product.conditionUsed");
    return cond;
  };

  return (
    <div
      className="group relative bg-white border border-[#e4e7ed] rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 z-10 flex flex-col gap-1">
        {product.stock <= 0 ? (
          <span className="bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
            {t("shop.outOfStock")}
          </span>
        ) : product.compare && product.compare > product.price ? (
          <span className="bg-[#0077fe] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider rounded">
            {t("shop.sale")}
          </span>
        ) : null}
        {product.condition && product.condition !== "NEW" && (
          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider rounded">
            {getConditionLabel(product.condition)}
          </span>
        )}
      </div>

      {/* Image container */}
      <Link
        to={`/product/${product.handle}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        <ImageWithFallback
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Quick Add Overlay on hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {product.stock <= 0 ? (
            <div className="w-full py-2.5 px-4 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center bg-gray-300 text-gray-600 shadow cursor-not-allowed">
              {t("shop.outOfStock")}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              className={`w-full py-2.5 px-4 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors ${added
                ? "bg-green-600 text-white"
                : "bg-[#15161d] hover:bg-[#0077fe] text-white"
                }`}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" /> {t("common.added")}
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> {t("shop.addToCart")}
                </>
              )}
            </button>
          )}
        </div>
      </Link>

      {/* Body info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <span>{tCategory(typeof product.category === "object" && product.category ? product.category.name : product.category)}</span>
          </div>

          <h3 className="font-bold text-base text-[#15161d] group-hover:text-[#0077fe] transition-colors line-clamp-1">
            <Link to={`/product/${product.handle}`}>{product.title}</Link>
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.spec}</p>

          {/* Rating / Real Reviews */}
          <div className="flex items-center gap-1.5 mt-2">
            {product.reviews && product.reviews > 0 ? (
              <>
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < Math.floor(product.rating)
                        ? "fill-current"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-600">
                  ({product.reviews})
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-gray-400" /> Verified Stock
              </span>
            )}
          </div>
        </div>

        {/* Price & Swatches footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-[#0077fe]">
              {formatPrice(product.price)}
            </span>
            {product.compare && product.compare > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.compare)}
              </span>
            )}
          </div>

          {/* Color finishes */}
          {product.finishes && product.finishes.length > 0 && (
            <div className="flex items-center gap-1">
              {product.finishes.map((finish) => (
                <button
                  key={finish}
                  type="button"
                  title={finish}
                  onClick={() => setSelectedFinish(finish)}
                  className={`w-3.5 h-3.5 rounded-full border ${selectedFinish === finish
                    ? "ring-2 ring-[#0077fe] ring-offset-1"
                    : "border-gray-300"
                    }`}
                  style={{
                    backgroundColor: SWATCH_COLORS[finish] || "#888"
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
