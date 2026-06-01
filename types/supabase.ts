export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: { id: string; name: string; slug: string; image: string | null; created_at: string };
        Insert: { id?: string; name: string; slug: string; image?: string | null; created_at?: string };
        Update: { id?: string; name?: string; slug?: string; image?: string | null };
        Relationships: [];
      };
      products: {
        Row: {
          id: string; name: string; slug: string; description: string | null;
          price: number; original_price: number | null; category: string;
          images: string[]; stock: number; colors: string[]; sizes: string[];
          badge: "new" | "sale" | "bestseller" | null; rating: number;
          review_count: number; is_featured: boolean; created_at: string;
        };
        Insert: {
          id?: string; name: string; slug: string; description?: string | null;
          price: number; original_price?: number | null; category: string;
          images?: string[]; stock?: number; colors?: string[]; sizes?: string[];
          badge?: "new" | "sale" | "bestseller" | null; rating?: number;
          review_count?: number; is_featured?: boolean; created_at?: string;
        };
        Update: {
          id?: string; name?: string; slug?: string; description?: string | null;
          price?: number; original_price?: number | null; category?: string;
          images?: string[]; stock?: number; colors?: string[]; sizes?: string[];
          badge?: "new" | "sale" | "bestseller" | null; rating?: number;
          review_count?: number; is_featured?: boolean;
        };
        Relationships: [];
      };
      profiles: {
        Row: { id: string; name: string | null; phone: string | null; created_at: string; updated_at: string };
        Insert: { id: string; name?: string | null; phone?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; name?: string | null; phone?: string | null; updated_at?: string };
        Relationships: [];
      };
      addresses: {
        Row: { id: string; user_id: string; full_name: string; phone: string; street: string; city: string; state: string; is_default: boolean; created_at: string };
        Insert: { id?: string; user_id: string; full_name: string; phone: string; street: string; city: string; state: string; is_default?: boolean; created_at?: string };
        Update: { id?: string; user_id?: string; full_name?: string; phone?: string; street?: string; city?: string; state?: string; is_default?: boolean };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string; user_id: string | null; items: Json; subtotal: number;
          shipping: number; discount: number; total: number;
          status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
          delivery_address: Json; paystack_ref: string | null; promo_code: string | null;
          created_at: string; updated_at: string;
        };
        Insert: {
          id?: string; user_id?: string | null; items: Json; subtotal: number;
          shipping?: number; discount?: number; total: number;
          status?: string; delivery_address: Json;
          paystack_ref?: string | null; promo_code?: string | null;
          created_at?: string; updated_at?: string;
        };
        Update: {
          id?: string; user_id?: string | null; items?: Json; subtotal?: number;
          shipping?: number; discount?: number; total?: number;
          status?: string; delivery_address?: Json;
          paystack_ref?: string | null; promo_code?: string | null; updated_at?: string;
        };
        Relationships: [];
      };
      wishlist: {
        Row: { id: string; user_id: string; product_id: string; created_at: string };
        Insert: { id?: string; user_id: string; product_id: string; created_at?: string };
        Update: { id?: string; user_id?: string; product_id?: string };
        Relationships: [];
      };
      reviews: {
        Row: { id: string; user_id: string; product_id: string; rating: number; comment: string | null; created_at: string };
        Insert: { id?: string; user_id: string; product_id: string; rating: number; comment?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; product_id?: string; rating?: number; comment?: string | null };
        Relationships: [];
      };
      discount_codes: {
        Row: { id: string; code: string; type: "percentage" | "fixed"; value: number; max_uses: number | null; used_count: number; expires_at: string | null; is_active: boolean; created_at: string };
        Insert: { id?: string; code: string; type: "percentage" | "fixed"; value: number; max_uses?: number | null; used_count?: number; expires_at?: string | null; is_active?: boolean; created_at?: string };
        Update: { id?: string; code?: string; type?: "percentage" | "fixed"; value?: number; max_uses?: number | null; used_count?: number; expires_at?: string | null; is_active?: boolean };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
