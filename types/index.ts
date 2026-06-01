export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: "handbag" | "tote" | "jewellery" | "headbands" | "clutch" | "lipgloss";
  description: string;
  images: string[];
  colors: string[];
  badge?: "new" | "sale" | "bestseller";
  rating: number;
  reviews: number;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
}

export interface WishlistItem {
  product: Product;
}

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
}
