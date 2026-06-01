import { createClient } from "./server";
import type { Database } from "@/types/supabase";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  orderBy?: "price_asc" | "price_desc" | "rating" | "created_at";
}): Promise<ProductRow[]> {
  const supabase = await createClient();
  let query = supabase.from("products").select("*");

  if (options?.category && options.category !== "all") {
    query = query.eq("category", options.category);
  }
  if (options?.featured) {
    query = query.eq("is_featured", true);
  }
  if (options?.search) {
    query = query.or(
      `name.ilike.%${options.search}%,description.ilike.%${options.search}%`
    );
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  switch (options?.orderBy) {
    case "price_asc":   query = query.order("price", { ascending: true }); break;
    case "price_desc":  query = query.order("price", { ascending: false }); break;
    case "rating":      query = query.order("rating", { ascending: false }); break;
    default:            query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductBySlug(slug: string): Promise<ProductRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getOrdersByUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getWishlistByUser(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("wishlist")
    .select("*, products(*)")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getReviewsByProduct(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*, profiles(name)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
