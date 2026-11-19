import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Check } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

const SWATCH_COLORS: Record<string, string> = {
  Graphite: "#3a3d45",
  Silver: "#c8ccd2",
  Midnight: "#15161d",
  White: "#f4f5f7",
  Crimson: "#d10024",
  Sand: "#d8c6ac",
  Steel: "#8d99ae"
};

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedFinish, setSelectedFinish] = useState(
    product.finishes && product.finishes.length > 0 ? product.finishes[0] : ""
  );
  const [added, setAdded] = useState(false);

  const displayImage =
    isHovered && product.images.length > 1
      ? product.images[1]
      : product.images[0] || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8";

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1, selectedFinish);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group relative bg-white border border-[#e4e7ed] rounded-lg overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {product.compare && product.compare > product.price && (
          <span className="bg-[#d10024] text-white text-[11px] font-bold px-2.5 py-1 uppercase tracking-wider rounded">
            Sale
          </span>
        )}
      </div>

      {/* Image container */}
      <Link
        to={`/product/${product.handle}`}
        className="block relative aspect-square overflow-hidden bg-gray-50"
      >
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Quick Add Overlay on hover */}
        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors ${
              added
                ? "bg-green-600 text-white"
                : "bg-[#15161d] hover:bg-[#d10024] text-white"
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" /> Added
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Quick Add
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Body info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">
            <span>{product.brand}</span>
            <span>{typeof product.category === "object" && product.category ? product.category.name : product.category}</span>
          </div>

          <h3 className="font-bold text-base text-[#15161d] group-hover:text-[#d10024] transition-colors line-clamp-1">
            <Link to={`/product/${product.handle}`}>{product.title}</Link>
          </h3>

          <p className="text-xs text-gray-500 mt-1 line-clamp-1">{product.spec}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? "fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-600">
              ({product.reviews})
            </span>
          </div>
        </div>

        {/* Price & Swatches footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-[#d10024]">
              ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            {product.compare && product.compare > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ${product.compare.toLocaleString("en-US", { minimumFractionDigits: 2 })}
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
                  className={`w-3.5 h-3.5 rounded-full border ${
                    selectedFinish === finish
                      ? "ring-2 ring-[#d10024] ring-offset-1"
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
