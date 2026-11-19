import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Cpu, Award } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";

export const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Laptops");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        if (json.success) {
          setProducts(json.data);
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ["Laptops", "Audio", "Keyboards & mice", "Desktops & displays"];

  const filteredProducts = products.filter(
    (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const highestRated = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-[#15161d] text-white overflow-hidden py-16 md:py-24 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/60 border border-[#d10024]/50 rounded-full text-xs font-bold uppercase text-[#d10024] tracking-wider">
              <Cpu className="w-3.5 h-3.5" /> Bench Tested Hardware
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Kestrel 14 Ultrabook
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl font-normal leading-relaxed">
              14in 2.8K OLED · 16GB · 1TB. Tested on our own bench and listed with the real numbers we measured,
              not the ones on the manufacturer box.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/shop"
                className="px-6 py-3.5 bg-[#d10024] hover:bg-[#a7001d] text-white font-bold text-xs uppercase tracking-wider rounded shadow-lg transition flex items-center gap-2"
              >
                Shop All Products <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/product/kestrel-14-ultrabook"
                className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-white border border-gray-600 font-bold text-xs uppercase tracking-wider rounded transition"
              >
                Inspect Bench Spec
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80"
                alt="Kestrel 14 Ultrabook on workbench"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                <div>
                  <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">Sale Deal</span>
                  <p className="text-xl font-bold text-white">$1,199.00 <span className="text-xs text-gray-400 line-through">$1,399.00</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#15161d] tracking-tight uppercase">
              Shop by Department
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Four verified categories with the genuine bench specification on every listing.
            </p>
          </div>

          {/* Category Pills/Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition ${
                  selectedCategory === cat
                    ? "bg-[#15161d] text-white shadow"
                    : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid for Active Tab */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to={`/shop?category=${encodeURIComponent(selectedCategory)}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-800 rounded transition"
          >
            View all in {selectedCategory} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Bench Philosophy Callout */}
      <section className="bg-[#1e1f29] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
              alt="Electro testing bench"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <span className="text-xs font-bold text-[#d10024] uppercase tracking-wider">
              Transparency Guarantee
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              We open everything first
            </h2>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
              <p>
                Every model we list has been out of its box and on our workbench. We measure the things
                manufacturers round up — real battery life under load, sustained sustained clock speeds,
                fan decibels, and thermal throttle thresholds.
              </p>
              <p>
                When a manufacturer spec sheet and our bench disagree, the listing clearly says so.
                That is the cornerstone of why Electro exists.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#d10024] hover:bg-[#a7001d] text-white text-xs font-bold uppercase tracking-wider rounded transition"
            >
              Learn How We Bench Test
            </Link>
          </div>
        </div>
      </section>

      {/* Highest Rated Right Now */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-black text-[#15161d] tracking-tight uppercase flex items-center gap-2">
              <Award className="w-6 h-6 text-[#d10024]" /> Highest Rated Right Now
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Ranked purely by verified customer scores, not by brand promotional sponsorship.
            </p>
          </div>
          <Link
            to="/shop"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase text-[#d10024] hover:underline"
          >
            View Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highestRated.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </section>

      {/* Why Buy From Us Features */}
      <section className="bg-white border-y border-[#e4e7ed] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-3 p-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#d10024] flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#15161d]">Free next-day over $50</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ordered before 6pm, dispatched and on your test bench tomorrow morning.
            </p>
          </div>

          <div className="space-y-3 p-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#d10024] flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#15161d]">Two year warranty</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              On everything we sell, handled directly by our bench team rather than outsourced.
            </p>
          </div>

          <div className="space-y-3 p-4">
            <div className="w-12 h-12 rounded-full bg-red-50 text-[#d10024] flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[#15161d]">30 day returns</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Unopened or tested, if it doesn't fit your workflow or bench standards, return it.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
