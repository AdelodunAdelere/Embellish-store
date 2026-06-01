"use client";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/data";
import { useState } from "react";

const categoryBg: Record<string, string> = {
  tote: "bg-[#F5EDE8]", handbag: "bg-[#EDE5EC]", clutch: "bg-[#F0E8EC]",
  jewellery: "bg-[#EDE8F0]", headbands: "bg-[#E8F0EC]", lipgloss: "bg-[#F5E8EC]",
};

const categoryEmoji: Record<string, string> = {
  tote: "👜", handbag: "👛", clutch: "💼", jewellery: "💍", headbands: "🎀", lipgloss: "💄",
};

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoMsg, setPromoMsg] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = total();
  const shipping = subtotal >= 30000 ? 0 : 2500;
  const finalTotal = subtotal - discount + shipping;

  const applyPromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMsg("");
    try {
      const res = await fetch("/api/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDiscount(0);
        setPromoMsg(data.error ?? "Invalid promo code");
      } else {
        setDiscount(data.discount);
        setPromoMsg(`Code applied! You saved ${formatPrice(data.discount)}`);
      }
    } catch {
      setPromoMsg("Something went wrong. Please try again.");
    } finally {
      setPromoLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
          <ShoppingBag size={64} className="text-blush mb-6" />
          <h2 className="font-serif text-3xl text-plum mb-3">Your bag is empty</h2>
          <p className="text-sm text-taupe mb-8">Add something beautiful to get started</p>
          <Link
            href="/shop"
            className="bg-plum text-blush text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-mauve transition-colors inline-flex items-center gap-2"
          >
            Shop Now <ArrowRight size={14} />
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="bg-plum py-10 px-4 text-center">
          <h1 className="font-serif text-4xl text-blush">Your Bag</h1>
          <p className="text-xs text-taupe mt-2 tracking-widest">
            {items.length} item{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-2xl border border-blush/20 p-4 flex gap-4 items-center"
                >
                  <div className={`w-20 h-20 rounded-xl flex-shrink-0 relative overflow-hidden ${categoryBg[item.product.category] || "bg-cream"}`}>
                    {item.product.images[0] ? (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1.5"
                        sizes="80px"
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-3xl">
                        {categoryEmoji[item.product.category]}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-plum leading-tight mb-0.5 truncate">
                      {item.product.name}
                    </h3>
                    <p className="text-[11px] text-taupe tracking-widest uppercase mb-3">
                      {item.product.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-blush/30 rounded-full overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-brown hover:text-plum"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="text-sm text-plum font-medium px-3">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-brown hover:text-plum"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <span className="font-medium text-plum text-sm">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    aria-label="Remove"
                    className="text-taupe hover:text-plum transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={clearCart}
                className="text-xs text-taupe hover:text-plum tracking-widest uppercase transition-colors"
              >
                Clear bag
              </button>
            </div>

            <div>
              <div className="bg-white rounded-2xl border border-blush/20 p-6 sticky top-24">
                <h3 className="font-serif text-xl text-plum mb-6">Order summary</h3>

                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between text-brown">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-taupe">
                      <span>Discount</span>
                      <span>−{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-brown">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                  </div>
                  <div className="border-t border-blush/20 pt-3 flex justify-between font-medium text-plum">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Promo code"
                      className="flex-1 text-xs border border-blush/30 rounded-full px-4 py-2.5 text-plum placeholder:text-taupe/60 focus:outline-none focus:border-taupe"
                    />
                    <button
                      onClick={applyPromo}
                      disabled={promoLoading}
                      className="text-xs tracking-widest uppercase bg-plum text-blush px-4 py-2.5 rounded-full hover:bg-mauve transition-colors disabled:opacity-60"
                    >
                      {promoLoading ? "…" : "Apply"}
                    </button>
                  </div>
                  {promoMsg && (
                    <p
                      className={`text-xs mt-2 ${
                        discount > 0 ? "text-green-600" : "text-red-400"
                      }`}
                    >
                      {promoMsg}
                    </p>
                  )}
                </div>

                <Link
                  href="/checkout"
                  className="w-full bg-plum text-blush text-xs tracking-widest uppercase py-4 rounded-full hover:bg-mauve transition-colors flex items-center justify-center gap-2"
                >
                  Proceed to checkout <ArrowRight size={14} />
                </Link>

                {shipping > 0 && (
                  <p className="text-[11px] text-taupe text-center mt-3">
                    Add {formatPrice(30000 - subtotal)} more for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
