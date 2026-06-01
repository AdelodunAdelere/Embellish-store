"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart, Star, Plus } from "lucide-react";
import { Product } from "@/types";
import { useCartStore, useWishlistStore } from "@/store";
import { formatPrice } from "@/lib/data";
import { toast } from "sonner";

const categoryBg: Record<string, string> = {
  tote: "bg-[#F5EDE8]", handbag: "bg-[#EDE5EC]",
  clutch: "bg-[#F0E8EC]", jewellery: "bg-[#EDE8F0]", headbands: "bg-[#E8F0EC]",
  lipgloss: "bg-[#F5E8EC]",
};

const categoryEmoji: Record<string, string> = {
  tote: "👜", handbag: "👛", clutch: "💼", jewellery: "💍", headbands: "🎀", "lipgloss": "💄"
};

const badgeStyles: Record<string, string> = {
  new: "bg-plum text-blush",
  sale: "bg-taupe text-white",
  bestseller: "bg-mauve text-blush",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    addItem(product);
    toast.success(`${product.name} added to bag`);
  };

  const handleWishlist = () => {
    toggle(product);
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-blush/20 hover:border-taupe/40 transition-all duration-300 relative">
      <Link href={`/product/${product.slug}`} className="block">
        {product.images[0] ? (
          <div className={`h-48 md:h-56 relative overflow-hidden ${categoryBg[product.category] || "bg-cream"}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105 p-3"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        ) : (
          <div className={`h-48 md:h-56 flex items-center justify-center text-6xl ${categoryBg[product.category] || "bg-cream"}`}>
            <span className="transition-transform duration-300 group-hover:scale-110">
              {categoryEmoji[product.category]}
            </span>
          </div>
        )}
      </Link>

      {product.badge && (
        <span className={`absolute top-3 left-3 text-[10px] tracking-widest uppercase px-3 py-1 rounded-full font-medium ${badgeStyles[product.badge]}`}>
          {product.badge === "sale" && discount ? `−${discount}%` : product.badge}
        </span>
      )}

      <button
        onClick={handleWishlist}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all border ${
          wishlisted ? "bg-plum/10 border-plum text-plum" : "bg-white border-blush/30 text-taupe hover:text-plum"
        }`}
      >
        <Heart size={14} className={wishlisted ? "fill-plum" : ""} />
      </button>

      <div className="p-4">
        <div className="flex items-center gap-0.5 mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < Math.floor(product.rating) ? "fill-taupe text-taupe" : "text-blush fill-blush"}
            />
          ))}
          <span className="text-[10px] text-taupe ml-1">({product.reviews})</span>
        </div>

        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-base text-plum leading-tight mb-0.5 hover:text-brown transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] tracking-widest text-taupe uppercase mb-3">{product.category}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-medium text-plum text-sm">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-taupe line-through">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <button
            onClick={handleAdd}
            aria-label="Add to cart"
            className="w-8 h-8 rounded-full bg-plum text-blush flex items-center justify-center hover:bg-mauve transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
