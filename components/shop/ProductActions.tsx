"use client";
import { useState } from "react";
import { Heart, ShoppingBag, Check, Plus, Minus } from "lucide-react";
import { Product } from "@/types";
import { useCartStore, useWishlistStore } from "@/store";
import { toast } from "sonner";

export default function ProductActions({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { toggle, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(product.id);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] ?? "");
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product, selectedColor);
    setAdded(true);
    toast.success(`${product.name} added to your bag`);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWishlist = () => {
    toggle(product);
    toast(wishlisted ? "Removed from wishlist" : "Saved to wishlist");
  };

  return (
    <div>
      {product.colors.length > 1 && (
        <div className="mb-7">
          <p className="text-xs tracking-widest text-taupe uppercase mb-3">Colour</p>
          <div className="flex gap-2">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                style={{ background: color }}
                aria-label="Select colour"
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? "border-plum scale-110"
                    : "border-transparent hover:border-taupe"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="mb-7">
        <p className="text-xs tracking-widest text-taupe uppercase mb-3">Quantity</p>
        <div className="flex items-center border border-blush/30 rounded-full w-32 overflow-hidden">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-10 h-10 flex items-center justify-center text-brown hover:text-plum"
          >
            <Minus size={13} />
          </button>
          <span className="flex-1 text-center text-sm text-plum font-medium">{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-10 h-10 flex items-center justify-center text-brown hover:text-plum"
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className={`flex-1 text-xs tracking-widest uppercase py-4 rounded-full flex items-center justify-center gap-2 transition-all ${
            added ? "bg-taupe text-white" : "bg-plum text-blush hover:bg-mauve"
          }`}
        >
          {added ? (
            <><Check size={14} /> Added!</>
          ) : (
            <><ShoppingBag size={14} /> Add to bag</>
          )}
        </button>
        <button
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`w-14 rounded-full border flex items-center justify-center transition-all ${
            wishlisted
              ? "bg-plum/10 border-plum text-plum"
              : "border-blush/30 text-taupe hover:border-taupe"
          }`}
        >
          <Heart size={18} className={wishlisted ? "fill-plum" : ""} />
        </button>
      </div>
    </div>
  );
}
