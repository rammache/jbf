import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, ShieldCheck, Truck, RotateCcw, Plus, Minus, CheckCircle } from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { ProductCard } from "../components/ProductCard";

const SWATCH_COLORS: Record<string, string> = {
  Graphite: "#3a3d45",
  Silver: "#c8ccd2",
  Midnight: "#15161d",
  White: "#f4f5f7",
  Crimson: "#d10024",
  Sand: "#d8c6ac",
  Steel: "#8d99ae"
};

export const ProductDetail: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedFinish, setSelectedFinish] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);

  useEffect(() => {
    if (!handle) return;
    setLoading(true);
    fetch(`/api/products/${handle}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProduct(json.data);
          setRelated(json.related || []);
          setActiveImage(json.data.images[0] || "");
          if (json.data.finishes && json.data.finishes.length > 0) {
            setSelectedFinish(json.data.finishes[0]);
          }
        }
      })
      .catch((err) => console.error("Error loading product", err))
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-96 bg-gray-200 rounded-xl max-w-4xl mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Product Not Found</h2>
        <p className="text-gray-500 text-sm">We couldn't locate this hardware model on our bench records.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 bg-[#15161d] text-white text-xs font-bold uppercase rounded">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedFinish);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2000);
  };

  const categoryName =
    typeof product.category === "object" && product.category
      ? product.category.name
      : product.category || "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span>/</span>
        <Link to={`/shop?category=${encodeURIComponent(categoryName)}`} className="hover:text-gray-900">
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.title}</span>
      </div>

      {/* Main Grid: Gallery + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Media Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-white border border-[#e4e7ed] rounded-xl overflow-hidden shadow-sm">
            <img
              src={activeImage}
              alt={product.title}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-white transition ${
                    activeImage === img ? "border-[#d10024] shadow-md" : "border-gray-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d10024] mb-2">
              <span>{product.brand}</span>
              <span>·</span>
              <span>{categoryName}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#15161d] tracking-tight">
              {product.title}
            </h1>

            <p className="text-sm text-gray-500 mt-2 font-medium">{product.spec}</p>

            {/* Ratings & reviews */}
            <div className="flex items-center gap-2 mt-3">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-700">
                {product.rating} ({product.reviews} verified reviews)
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#d10024]">
              ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            {product.compare && product.compare > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  ${product.compare.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  Save ${(product.compare - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          {/* Color Finish Selection */}
          {product.finishes && product.finishes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Finish: <span className="text-[#15161d]">{selectedFinish}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.finishes.map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-medium transition ${
                      selectedFinish === finish
                        ? "border-[#d10024] bg-red-50 text-[#d10024] font-bold"
                        : "border-gray-300 hover:border-gray-400 text-gray-700"
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-gray-300"
                      style={{ backgroundColor: SWATCH_COLORS[finish] || "#888" }}
                    />
                    {finish}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity & Add to Cart button */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-gray-600 hover:bg-gray-100"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-gray-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 text-gray-600 hover:bg-gray-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 py-3.5 px-6 rounded font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 ${
                  addedSuccess
                    ? "bg-green-600 text-white"
                    : "bg-[#15161d] hover:bg-[#d10024] text-white"
                }`}
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Added to Cart
                  </>
                ) : (
                  `Add to Cart · $${(product.price * quantity).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                )}
              </button>
            </div>
          </div>

          {/* Value Props list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#d10024]" />
              <span>Next-day over $50</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d10024]" />
              <span>Two year warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#d10024]" />
              <span>30 day bench returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bench Verification Specification Table */}
      <section className="bg-white border border-[#e4e7ed] rounded-xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-[#15161d] uppercase tracking-tight">
          Bench-Tested Verification Report
        </h2>
        <p className="text-xs text-gray-500">
          Measured on our bench in Manchester. We record thermals, panel color gamut, battery drainage under sustained load, and real-world port bandwidth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded border flex justify-between">
            <span className="font-semibold text-gray-500">Department</span>
            <span className="font-bold text-gray-900">{categoryName}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded border flex justify-between">
            <span className="font-semibold text-gray-500">Hardware Brand</span>
            <span className="font-bold text-gray-900">{product.brand}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded border flex justify-between">
            <span className="font-semibold text-gray-500">Configuration</span>
            <span className="font-bold text-gray-900">{product.spec}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded border flex justify-between">
            <span className="font-semibold text-gray-500">Bench Score</span>
            <span className="font-bold text-green-700">{product.rating} / 5.0 (Passed)</span>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h2 className="text-xl font-black text-[#15161d] uppercase tracking-tight">
              Related Hardware
            </h2>
            <Link to={`/shop?category=${encodeURIComponent(categoryName)}`} className="text-xs font-bold uppercase text-[#d10024]">
              See all in {categoryName}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
