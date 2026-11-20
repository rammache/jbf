import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle,
  MessageCircle,
  Send,
  MessageSquareQuote,
  Loader2
} from "lucide-react";
import { Product } from "../types";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { useLanguage } from "../context/LanguageContext";
import { ProductCard } from "../components/ProductCard";
import { ImageWithFallback } from "../components/ImageWithFallback";
import { SEO } from "../components/SEO";

interface ReviewItem {
  id: number;
  rating: number;
  authorName: string;
  comment: string;
  createdAt: string;
}

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
  const { settings, formatPrice } = useSettings();
  const { t, language } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState<string>("");
  const [selectedFinish, setSelectedFinish] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const getConditionLabel = (cond?: string) => {
    if (!cond) return "";
    const upper = cond.toUpperCase();
    if (upper === "NEW") return t("product.conditionNew");
    if (upper === "REFURBISHED") return t("product.conditionRefurbished");
    if (upper === "USED") return t("product.conditionUsed");
    return cond;
  };

  // Reviews state
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");
  const [reviewErrorMessage, setReviewErrorMessage] = useState("");

  const loadReviews = async (productHandle: string) => {
    try {
      setReviewsLoading(true);
      const res = await fetch(`/api/products/${productHandle}/reviews`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setReviews(json.data);
      }
    } catch (err) {
      console.error("Error loading reviews", err);
    } finally {
      setReviewsLoading(false);
    }
  };

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
          loadReviews(handle);
        }
      })
      .catch((err) => console.error("Error loading product", err))
      .finally(() => setLoading(false));
  }, [handle]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      setReviewErrorMessage("Please enter both your name and review comment.");
      return;
    }

    setSubmittingReview(true);
    setReviewErrorMessage("");
    setReviewSuccessMessage("");

    try {
      const res = await fetch(`/api/products/${product.id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: reviewRating,
          authorName: reviewAuthor.trim(),
          comment: reviewComment.trim()
        })
      });

      const json = await res.json();
      if (json.success) {
        setReviewSuccessMessage("Thank you! Your verified review has been posted.");
        setReviewAuthor("");
        setReviewComment("");
        setReviewRating(5);
        if (handle) {
          loadReviews(handle);
        }
      } else {
        setReviewErrorMessage(json.error || "Failed to submit review.");
      }
    } catch {
      setReviewErrorMessage("Network error while submitting review.");
    } finally {
      setSubmittingReview(false);
    }
  };

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
        <p className="text-gray-500 text-sm">We couldn't locate this product in our catalog.</p>
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
      <SEO
        title={product.title}
        description={product.spec || product.description || `Buy ${product.title} at Jabour Phone with verified hardware specs.`}
      />

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
            <ImageWithFallback
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
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 bg-white transition ${activeImage === img ? "border-[#d10024] shadow-md" : "border-gray-200 opacity-70 hover:opacity-100"
                    }`}
                >
                  <ImageWithFallback src={img} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
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
              {product.reviews && product.reviews > 0 ? (
                <>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-gray-700">
                    {product.rating} ({product.reviews} {t("product.verifiedReviews")})
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> {t("product.genuinePromise")}
                </span>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-baseline gap-3">
            <span className="text-3xl font-black text-[#d10024]">
              {formatPrice(product.price)}
            </span>
            {product.compare && product.compare > product.price && (
              <>
                <span className="text-base text-gray-400 line-through">
                  {formatPrice(product.compare)}
                </span>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded">
                  {t("common.save")} {formatPrice(product.compare - product.price)}
                </span>
              </>
            )}
          </div>

          {/* Stock Status Indicator */}
          <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs">
            {product.stock <= 0 ? (
              <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 font-bold text-red-700">
                {t("shop.outOfStock")}
              </span>
            ) : product.stock <= (product.lowStockThreshold ?? 5) ? (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 font-bold text-amber-800">
                {t("product.onlyLeft", { count: product.stock })}
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 font-bold text-green-800">
                {t("product.inStockCount", { count: product.stock })}
              </span>
            )}
            {product.condition && (
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 font-semibold text-gray-700 uppercase text-[10px]">
                {t("product.condition")}: {getConditionLabel(product.condition)}
              </span>
            )}
          </div>

          {/* Color Finish Selection */}
          {product.finishes && product.finishes.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                {t("product.color")}: <span className="text-[#15161d]">{selectedFinish}</span>
              </label>
              <div className="flex items-center gap-3">
                {product.finishes.map((finish) => (
                  <button
                    key={finish}
                    type="button"
                    onClick={() => setSelectedFinish(finish)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-medium transition ${selectedFinish === finish
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
              <div className={`flex items-center border border-gray-300 rounded bg-white ${product.stock <= 0 ? "opacity-50 pointer-events-none" : ""}`}>
                <button
                  type="button"
                  disabled={product.stock <= 0}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-sm text-gray-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  disabled={product.stock <= 0 || quantity >= product.stock}
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  className="p-3 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {product.stock <= 0 ? (
                <button
                  type="button"
                  disabled
                  className="flex-1 py-3.5 px-6 rounded font-bold text-xs uppercase tracking-wider bg-gray-300 text-gray-600 cursor-not-allowed shadow-none"
                >
                  {t("shop.outOfStock")}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded font-bold text-xs uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2 ${addedSuccess
                    ? "bg-green-600 text-white"
                    : "bg-[#15161d] hover:bg-[#d10024] text-white"
                    }`}
                >
                  {addedSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> {t("product.addedToCart")}
                    </>
                  ) : (
                    `${t("shop.addToCart")} · ${formatPrice(product.price * quantity)}`
                  )}
                </button>
              )}
            </div>

            {/* Direct WhatsApp Order Option */}
            <a
              href={`https://wa.me/${(settings.whatsapp || "212661123456").replace(/[^\d]/g, "")}?text=${encodeURIComponent(
                language === "ar"
                  ? `مرحباً ${settings.storeName}! أود طلب "${product.title}" بسعر ${formatPrice(
                      product.price * quantity
                    )}. اللون: ${selectedFinish || "قياسي"}، الكمية: ${quantity}. رابط المتجر: ${typeof window !== "undefined" ? window.location.href : ""}`
                  : `Bonjour ${settings.storeName} ! Je souhaite commander "${product.title}" pour ${formatPrice(
                      product.price * quantity
                    )}. Finition: ${selectedFinish || "Standard"}, Quantité: ${quantity}. Lien boutique: ${typeof window !== "undefined" ? window.location.href : ""}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-6 rounded font-bold text-xs uppercase tracking-wider bg-[#25D366] hover:bg-[#128C7E] text-white transition shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" /> {t("product.orderOnWhatsapp")}
            </a>
          </div>

          {/* Value Props list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-gray-200 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#d10024]" />
              <span>{t("product.fastDelivery")}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#d10024]" />
              <span>{product.warranty || t("product.officialWarranty")}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-[#d10024]" />
              <span>{t("product.freeReturnSupport")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description */}
      {product.description && (
        <section className="bg-white border border-[#e4e7ed] rounded-xl p-8 space-y-4">
          <h2 className="text-xl font-bold text-[#15161d] uppercase tracking-tight">
            {t("product.description")}
          </h2>
          <div className="prose text-sm text-gray-700 leading-relaxed max-w-none whitespace-pre-line">
            {product.description}
          </div>
        </section>
      )}

      {/* Technical Specifications Table */}
      <section className="bg-white border border-[#e4e7ed] rounded-xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-[#15161d] uppercase tracking-tight">
          {t("product.specifications")}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-gray-50 rounded border flex justify-between">
            <span className="font-semibold text-gray-500">{t("shop.brands")}</span>
            <span className="font-bold text-gray-900">{product.brand}</span>
          </div>
          <div className="p-4 bg-gray-50 rounded border flex justify-between">
            <span className="font-semibold text-gray-500">{t("shop.categories")}</span>
            <span className="font-bold text-gray-900">{categoryName}</span>
          </div>
          {product.sku && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">SKU</span>
              <span className="font-mono font-bold text-gray-900">{product.sku}</span>
            </div>
          )}
          {product.condition && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.condition")}</span>
              <span className="font-bold text-gray-900">{getConditionLabel(product.condition)}</span>
            </div>
          )}
          {product.storage && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.storage")}</span>
              <span className="font-bold text-gray-900">{product.storage}</span>
            </div>
          )}
          {product.ram && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.ram")}</span>
              <span className="font-bold text-gray-900">{product.ram}</span>
            </div>
          )}
          {product.screen && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.screen")}</span>
              <span className="font-bold text-gray-900">{product.screen}</span>
            </div>
          )}
          {product.battery && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.battery")}</span>
              <span className="font-bold text-gray-900">{product.battery}</span>
            </div>
          )}
          {product.camera && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.camera")}</span>
              <span className="font-bold text-gray-900">{product.camera}</span>
            </div>
          )}
          {product.processor && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.processor")}</span>
              <span className="font-bold text-gray-900">{product.processor}</span>
            </div>
          )}
          {product.network && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.network")}</span>
              <span className="font-bold text-gray-900">{product.network}</span>
            </div>
          )}
          {product.warranty && (
            <div className="p-4 bg-gray-50 rounded border flex justify-between">
              <span className="font-semibold text-gray-500">{t("product.warranty")}</span>
              <span className="font-bold text-gray-900">{product.warranty}</span>
            </div>
          )}
        </div>
      </section>

      {/* Customer Reviews & Feedback */}
      <section className="bg-white border border-[#e4e7ed] rounded-xl p-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-4">
          <div>
            <h2 className="text-xl font-black text-[#15161d] uppercase tracking-tight flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-[#d10024]" /> {t("product.reviews")}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {t("product.verifiedReviews")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-[#15161d]">{product.rating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              ({reviews.length} {t("product.verifiedReviews")})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reviews list */}
          <div className="lg:col-span-2 space-y-4">
            {reviewsLoading ? (
              <div className="flex items-center justify-center p-8 text-gray-400">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> {t("common.loading")}
              </div>
            ) : reviews.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 space-y-2">
                <p className="text-sm font-bold text-gray-700">{t("product.noReviewsYet")}</p>
                <p className="text-xs text-gray-500">
                  {t("product.submitReview")}
                </p>
              </div>
            ) : (
              reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#15161d]">{rev.authorName}</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? "fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{rev.comment}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(rev.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Write a Review Form */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <h3 className="text-sm font-black uppercase text-[#15161d]">{t("product.submitReview")}</h3>
            {reviewSuccessMessage && (
              <div className="p-3 bg-green-50 text-green-700 border border-green-200 rounded text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" /> {reviewSuccessMessage}
              </div>
            )}
            {reviewErrorMessage && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-xs">
                {reviewErrorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t("product.yourRating")}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${star <= reviewRating
                          ? "text-amber-400 fill-current"
                          : "text-gray-300"
                          }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-1 rtl:ml-0 rtl:mr-1">{reviewRating} / 5</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t("product.yourName")}
                </label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Alex M."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#d10024]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1">
                  {t("product.yourComment")}
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about performance, build quality, screen, battery..."
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#d10024]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 bg-[#15161d] hover:bg-[#d10024] text-white font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2"
              >
                {submittingReview ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 rtl:rotate-180" /> {t("product.submitBtn")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <h2 className="text-xl font-black text-[#15161d] uppercase tracking-tight">
              {t("product.relatedDevices")}
            </h2>
            <Link to={`/shop?category=${encodeURIComponent(categoryName)}`} className="text-xs font-bold uppercase text-[#d10024]">
              {categoryName}
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
