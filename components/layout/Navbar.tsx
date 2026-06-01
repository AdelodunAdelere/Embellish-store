"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store";
import { products } from "@/lib/data";
import type { Product } from "@/types";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?view=collections", label: "Collections" },
  { href: "/shop?sort=discount", label: "Deals" },
  { href: "/shop?sort=newest", label: "New Arrivals" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  const cartCount = useCartStore((s) => s.count());
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    const q = debouncedQuery.toLowerCase();
    setResults(
      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
        .slice(0, 5)
    );
  }, [debouncedQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearchSelect = (slug: string) => {
    setQuery("");
    setResults([]);
    setSearchOpen(false);
    router.push(`/product/${slug}`);
  };

  const handleSearchSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setResults([]);
    setSearchOpen(false);
    router.push(`/shop?search=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href.split("?")[0]);
  };

  return (
    <>
      <div className="bg-plum text-blush text-center text-xs tracking-widest py-2 px-4">
        FREE DELIVERY ON ORDERS OVER ₦30,000 &nbsp;·&nbsp; USE CODE{" "}
        <span className="font-medium">EMBELLISH10</span> FOR 10% OFF
      </div>

      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center relative">

          {/* Left slot: hamburger on mobile, logo on desktop */}
          <div className="flex items-center shrink-0">
            <button
              className="md:hidden text-plum"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link href="/" className="hidden md:flex items-center gap-2">
              <ShoppingBag size={22} className="text-plum" strokeWidth={1.8} />
              <span className="font-serif text-xl tracking-[0.18em] text-plum font-medium select-none">
                EMBELLISH
              </span>
            </Link>
          </div>

          {/* Mobile logo — absolutely centered */}
          <Link href="/" className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5">
            <span className="font-serif text-lg tracking-[0.18em] text-plum font-medium select-none">
              EMBELLISH
            </span>
          </Link>

          {/* Nav links — absolutely centered (desktop only) */}
          <ul className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`relative text-sm font-normal transition-colors pb-0.5 ${
                    isActive(l.href)
                      ? "text-plum after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-plum after:rounded-full"
                      : "text-gray-600 hover:text-plum"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right icons — search + account (desktop) + cart */}
          <div className="flex items-center gap-5 ml-auto">
            <button
              aria-label="Search"
              onClick={() => { setSearchOpen(!searchOpen); setQuery(""); setResults([]); }}
              className="text-gray-600 hover:text-plum transition-colors"
            >
              <Search size={20} strokeWidth={1.8} />
            </button>

            <Link href="/account" aria-label="Account" className="hidden md:block text-gray-600 hover:text-plum transition-colors">
              <User size={20} strokeWidth={1.8} />
            </Link>

            <Link href="/cart" aria-label="Cart" className="relative text-gray-600 hover:text-plum transition-colors">
              <ShoppingBag size={20} strokeWidth={1.8} />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-plum text-blush text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search bags, jewellery, beanies…"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-plum placeholder:text-gray-400 focus:outline-none focus:border-plum/40"
              />
              {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
                  {results.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSearchSelect(r.slug)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                    >
                      <span className="text-xl">
                        {{ tote: "👜", handbag: "👛", clutch: "💼", jewellery: "💍", headbands: "🎀", lipgloss: "💄" }[r.category]}
                      </span>
                      <div>
                        <p className="text-sm text-plum font-medium">{r.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{r.category}</p>
                      </div>
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="w-full px-4 py-2.5 text-xs text-gray-400 hover:text-plum border-t border-gray-100 text-left tracking-widest uppercase"
                  >
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className={`block text-sm py-1 transition-colors ${
                  isActive(l.href) ? "text-plum font-medium" : "text-gray-600 hover:text-plum"
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-gray-600 hover:text-plum py-1"
            >
              Account
            </Link>
          </div>
        )}
      </nav>
    </>
  );
}
