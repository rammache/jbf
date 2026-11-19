import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, Cpu, Award, FolderTree, Tag } from "lucide-react";
import { Product } from "../types";
import { ProductCard } from "../components/ProductCard";
import { useCategories } from "../context/CategoryContext";

export const Home: React.FC = () => {
  const { categories, loading: categoriesLoading } = useCategories();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Sync selectedCategory when categories load
  useEffect(() => {
    if (categories.length > 0 && (!selectedCategory || !categories.some((c) => c.slug === selectedCategory || c.name === selectedCategory))) {
      setSelectedCategory(categories[0].slug || categories[0].name);
    }
  }, [categories, selectedCategory]);

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

  const activeCategoryObj = categories.find(
    (c) => c.slug.toLowerCase() === selectedCategory.toLowerCase() || c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

  const filteredProducts = products.filter((p) => {
    if (!selectedCategory) return true;
    const catName = typeof p.category === "object" && p.category ? p.category.name : p.category;
    const catSlug = typeof p.category === "object" && p.category ? p.category.slug : "";
    const pCatId = typeof p.category === "object" && p.category ? p.category.id : p.categoryId;

    const targetLower = selectedCategory.toLowerCase();
    return (
      (catSlug && catSlug.toLowerCase() === targetLower) ||
      (catName && catName.toLowerCase() === targetLower) ||
      (activeCategoryObj && pCatId === activeCategoryObj.id)
    );
  });

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

      {/* Featured Department Showcase (Category Image Usage) */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-black text-[#15161d] tracking-tight uppercase flex items-center gap-2">
                <FolderTree className="w-6 h-6 text-[#d10024]" /> Featured Departments
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Browse our verified catalog organized by department.
              </p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase text-[#d10024] hover:underline"
            >
              Browse All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const fallbackImage =
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80";
              const catImage = cat.image || fallbackImage;
              const productCount = cat._count?.products ?? 0;

              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${encodeURIComponent(cat.slug || cat.name)}`}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <img
                      src={catImage}
                      alt={cat.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="inline-flex items-center gap-1 rounded bg-[#15161d]/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                        <Tag className="h-3 w-3 text-[#d10024]" />
                        {productCount} {productCount === 1 ? "Product" : "Products"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-tight text-[#15161d] group-hover:text-[#d10024] transition-colors">
                        {cat.name}
                      </h3>
                      {cat.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500 leading-relaxed">
                          {cat.description}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider text-[#d10024] group-hover:translate-x-1 transition-transform">
                      <span>Explore</span>
                      <ArrowRight className="ml-1 h-3.5 w-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Shop by Department Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-gray-200 gap-4">
          <div>
            <h2 className="text-2xl font-black text-[#15161d] tracking-tight uppercase">
              Shop by Department
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Verified categories with genuine bench specification on every listing.
            </p>
          </div>

          {/* Category Pills/Tabs */}
          <div className="flex flex-wrap gap-2">
            {categoriesLoading ? (
              <div className="flex gap-2 animate-pulse">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 w-24 bg-gray-200 rounded" />
                ))}
              </div>
            ) : (
              categories.map((cat) => {
                const isSelected =
                  selectedCategory.toLowerCase() === (cat.slug || "").toLowerCase() ||
                  selectedCategory.toLowerCase() === (cat.name || "").toLowerCase();

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.slug || cat.name)}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition ${isSelected
                        ? "bg-[#15161d] text-white shadow"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                  >
                    {cat.name}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Product Grid for Active Tab */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <FolderTree className="h-10 w-10 text-gray-300 mb-2" />
            <p className="text-sm font-bold text-gray-700">No products found in this department</p>
            <p className="text-xs text-gray-400 mt-1">
              Check back soon or explore our full catalog.
            </p>
            <Link
              to="/shop"
              className="mt-4 inline-flex items-center gap-2 rounded bg-[#15161d] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#a7001d]"
            >
              View All Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        )}

        {filteredProducts.length > 0 && selectedCategory && (
          <div className="mt-8 text-center">
            <Link
              to={`/shop?category=${encodeURIComponent(selectedCategory)}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-white hover:bg-gray-100 border border-gray-300 text-xs font-bold uppercase tracking-wider text-gray-800 rounded transition"
            >
              View all in {activeCategoryObj?.name || selectedCategory} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </section>

      {/* Bench Philosophy Callout */}
      <section className="bg-[#1e1f29] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl border border-gray-800">
            <img
              src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
              alt="Jabour Phone testing bench"
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
                That is the cornerstone of why Jabour Phone exists.
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
