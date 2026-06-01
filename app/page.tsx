import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, RefreshCw, Shield, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroBackground from "@/components/layout/HeroBackground";
import ProductCard from "@/components/shop/ProductCard";
import { products } from "@/lib/data";

const heroCards = [
  {
    image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Handbags/4.JPG",
    label: "Handbags",
    emoji: "👛",
    bg: "bg-mauve",
    w: "w-32",
    h: "h-44",
    href: "/shop?category=handbag",
  },
  {
    image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Jewellery/1.jpeg",
    label: "Jewellery",
    emoji: "💍",
    bg: "bg-[#3a1e2b]",
    w: "w-36",
    h: "h-52",
    href: "/shop?category=jewellery",
  },
  {
    image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Headbands/2.webp",
    label: "Headbands",
    emoji: "🎀",
    bg: "bg-mauve",
    w: "w-32",
    h: "h-40",
    href: "/shop?category=headbands",
  },
];

export default function Home() {
  const featured = products.filter((p) => p.featured);
  const newIn = products.filter((p) => p.badge === "new");

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-plum overflow-hidden relative">
          <HeroBackground />
          <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <p className="text-xs tracking-[0.3em] text-taupe uppercase mb-4">
                2026 Collection
              </p>
              <h1 className="font-serif text-5xl md:text-7xl text-blush leading-[1.1] mb-6">
                Where style<br />
                meets <em className="italic text-taupe">sophistication</em>
              </h1>
              <p className="text-sm text-blush/60 leading-relaxed mb-8 max-w-sm">
                Handbags, tote bags, jewellery and luxury pieces designed to elevate every moment.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="bg-blush text-plum text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-mauve transition-colors font-medium inline-flex items-center gap-2"
                >
                  Shop Now <ArrowRight size={14} />
                </Link>
                <Link
                  href="/about"
                  className="border border-taupe/40 text-blush text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:border-taupe transition-colors"
                >
                  Our Story
                </Link>
              </div>
            </div>
              {/*
            <div className="flex gap-4 items-end flex-shrink-0">
              {heroCards.map((card) => (
                <Link
                  key={card.label}
                  href={card.href}
                  className={`${card.bg} rounded-2xl ${card.w} ${card.h} relative overflow-hidden border border-taupe/20 block flex-shrink-0`}
                >
                  {card.image ? (
                    <Image src={card.image} alt={card.label} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">
                      {card.emoji}
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                    <span className="text-[10px] tracking-widest text-white/90 uppercase">{card.label}</span>
                  </div>
                </Link>
              ))}
            </div> */}
          </div>
        </section>

        {/* Trust bar */}
        <section className="bg-white border-b border-blush/20">
          <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { Icon: Truck, title: "Free Shipping", sub: "On orders over ₦30,000" },
              { Icon: RefreshCw, title: "Easy Returns", sub: "30-day return policy" },
              { Icon: Shield, title: "Secure Payment", sub: "100% secure checkout" },
              { Icon: Star, title: "Premium Quality", sub: "Handpicked materials" },
            ].map(({ Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-3">
                <Icon size={18} className="text-taupe flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-plum tracking-wide">{title}</p>
                  <p className="text-[11px] text-taupe">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-6xl mx-auto px-4 py-14">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-plum">Shop by category</h2>
            <Link
              href="/shop"
              className="text-xs tracking-widest text-taupe hover:text-plum uppercase flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Tote%20Bags/2.JPG", label: "Tote Bags", href: "/shop?category=tote", bg: "bg-[#F5EDE8]" },
              { image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Handbags/2.JPG", label: "Handbags", href: "/shop?category=handbag", bg: "bg-[#EDE5EC]" },
              { image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Clutch/1.JPG", label: "Clutches", href: "/shop?category=clutch", bg: "bg-[#F0E8EC]" },
              { image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Jewellery/3.jpeg", label: "Jewellery", href: "/shop?category=jewellery", bg: "bg-[#EDE8F0]" },
              { image: "https://kegcvnzprvscmhmorprh.supabase.co/storage/v1/object/public/products/Headbands/2.webp", label: "Headbands", href: "/shop?category=headbands", bg: "bg-[#E8F0EC]" },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`${cat.bg} rounded-2xl relative overflow-hidden h-40 md:h-48 group hover:shadow-md transition-all`}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-3">
                  <span className="text-xs tracking-widest text-white uppercase font-medium">
                    {cat.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Best sellers */}
        <section className="bg-cream py-14">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif text-3xl md:text-4xl text-plum">Best sellers</h2>
              <Link
                href="/shop"
                className="text-xs tracking-widest text-taupe hover:text-plum uppercase flex items-center gap-1"
              >
                See all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Promo banner */}
        <section className="max-w-6xl mx-auto px-4 py-6">
          <div className="bg-mauve rounded-2xl px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-blush mb-2">
                New customer exclusive
              </h3>
              <p className="text-sm text-taupe">
                Get 10% off your first order. No minimum spend.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span className="bg-blush text-plum text-sm tracking-widest px-6 py-3 rounded-full font-medium">
                EMBELLISH10
              </span>
              <Link
                href="/shop"
                className="text-xs tracking-widest text-blush/70 uppercase hover:text-blush flex items-center gap-1"
              >
                Shop now <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </section>

        {/* New in */}
        <section className="max-w-6xl mx-auto px-4 py-10 pb-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-serif text-3xl md:text-4xl text-plum">New in</h2>
            <Link
              href="/shop"
              className="text-xs tracking-widest text-taupe hover:text-plum uppercase flex items-center gap-1"
            >
              See all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newIn.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Brand story */}
        <section className="bg-plum py-20 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs tracking-[0.3em] text-taupe uppercase mb-4">Our story</p>
            <h2 className="font-serif text-4xl md:text-5xl text-blush italic mb-6 leading-tight">
              A new destination for timeless elegance
            </h2>
            <p className="text-sm text-blush/60 leading-relaxed mb-8">
              EMBELLISH was born from a love of beautiful things. We curate bags, jewellery, and accessories that are thoughtfully designed to become part of your story.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 border border-taupe/40 text-blush text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:border-taupe transition-colors"
            >
              Read our story <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
