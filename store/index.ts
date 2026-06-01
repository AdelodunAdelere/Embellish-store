"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, WishlistItem } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggle: (product: Product) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, color) => {
        const existing = get().items.find(
          (i) => i.product.id === product.id && i.color === color
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.product.id === product.id && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity: 1, color }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity } : i
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      total: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.price * i.quantity,
          0
        ),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "embellish-cart" }
  )
);

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (!get().isWishlisted(product.id)) {
          set({ items: [...get().items, { product }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.product.id !== productId) }),
      isWishlisted: (productId) =>
        get().items.some((i) => i.product.id === productId),
      toggle: (product) => {
        if (get().isWishlisted(product.id)) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },
    }),
    { name: "embellish-wishlist" }
  )
);
