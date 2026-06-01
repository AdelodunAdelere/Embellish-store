"use client";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { products, categories } from "@/lib/data";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const urlCategory = searchParams.get("category") ?? "all";
  const urlSearch = searchParams.get("search") ?? "";
  const urlSort = searchParams.get("sort") ?? "";

  const [activeCategory, setActiveCategory] = useState(urlCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Simulate async loading (replace with real fetch when Supabase is connected)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [activeCategory, sortBy, maxPrice]);

  // Sync category from URL
  useEffect(() => {
    setActiveCategory(urlCategory);
  }, [urlCategory]);

  const filtered = useMemo(() => {
    let list = [...products].filter((p) => p.price <= maxPrice);

    if (urlSearch) {
      const q = urlSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (urlSort === "discount") list = list.filter((p) => !!p.originalPrice);
    if (urlSort === "newest") list = list.filter((p) => p.badge === "new");

    if (sortBy === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sortBy === "rating") list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [activeCategory, sortBy, maxPrice, urlSearch, urlSort]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="bg-plum py-12 px-4 text-center">
          <p className="text-xs tracking-[0.3em] text-taupe uppercase mb-3">Discover</p>
          <h1 className="font-serif text-4xl md:text-5xl text-blush">
            {urlSearch
              ? `Results for "${urlSearch}"`
              : urlSort === "discount"
              ? "Deals"
              : urlSort === "newest"
              ? "New Arrivals"
              : activeCategory === "all"
              ? "All Collections"
              : categories.find((c) => c.id === activeCategory)?.label ?? "Shop"}
          </h1>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setLoading(true); }}
                  className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase whitespace-nowrap transition-all border ${
                    activeCategory === cat.id
                      ? "bg-plum text-blush border-plum"
                      : "bg-white text-brown border-blush/30 hover:border-taupe"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-xs tracking-widest text-brown uppercase border border-blush/30 rounded-full px-4 py-2 hover:border-taupe transition-colors"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setLoading(true); }}
                  className="appearance-none text-xs text-brown border border-blush/30 rounded-full pl-4 pr-10 py-2 bg-white focus:outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Best Rated</option>
                </select>
                <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-taupe pointer-events-none" />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white rounded-2xl border border-blush/20 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg text-plum">Filter by price</h3>
                <button onClick={() => setShowFilters(false)} className="text-taupe hover:text-plum">
                  <X size={18} />
                </button>
              </div>
              <label className="text-xs text-taupe tracking-widest uppercase block mb-2">
                Max price: ₦{maxPrice.toLocaleString()}
              </label>
              <input
                type="range" min={0} max={50000} step={1000} value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setLoading(true); }}
                className="w-full accent-plum"
              />
            </div>
          )}

          <p className="text-xs text-taupe tracking-widest mb-6 uppercase">
            {loading ? "Loading…" : `${filtered.length} product${filtered.length !== 1 ? "s" : ""}`}
          </p>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-serif text-2xl text-plum mb-2">No products found</p>
              <p className="text-sm text-taupe">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
