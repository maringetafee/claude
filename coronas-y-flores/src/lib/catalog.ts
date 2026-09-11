import "server-only";
import { cache } from "react";
import { getPublicSupabase } from "@/lib/supabase/public";
import type { Category, Product, ProductImage, ProductVariant, ShippingMethod } from "@/lib/types";

export const PRODUCT_SELECT =
  "*, category:categories(id,slug,name), images:product_images(*), variants:product_variants(*)";

type ProductRow = Omit<Product, "images" | "variants"> & {
  images: ProductImage[] | null;
  variants: ProductVariant[] | null;
};

export function normalizeProduct(row: ProductRow): Product {
  return {
    ...row,
    images: [...(row.images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    variants: [...(row.variants ?? [])].sort((a, b) => a.sort_order - b.sort_order),
  };
}

export const getCategories = cache(async (): Promise<Category[]> => {
  const sb = getPublicSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("categories").select("*").eq("active", true).order("sort_order");
  if (error) {
    console.error("[catalog] categorías:", error.message);
    return [];
  }
  return data as Category[];
});

export const getCategoryBySlug = cache(async (slug: string) => {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
});

export const getProducts = cache(
  async (categoryId?: string, featuredOnly = false, limit?: number): Promise<Product[]> => {
    const sb = getPublicSupabase();
    if (!sb) return [];
    let q = sb
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("active", true)
      .order("sort_order")
      .order("created_at", { ascending: false });
    if (categoryId) q = q.eq("category_id", categoryId);
    if (featuredOnly) q = q.eq("featured", true);
    if (limit) q = q.limit(limit);
    const { data, error } = await q;
    if (error) {
      console.error("[catalog] productos:", error.message);
      return [];
    }
    return (data as ProductRow[]).map(normalizeProduct);
  },
);

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const sb = getPublicSupabase();
  if (!sb) return null;
  const { data, error } = await sb
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) {
    console.error("[catalog] producto:", error.message);
    return null;
  }
  return data ? normalizeProduct(data as ProductRow) : null;
});

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const pool = product.category_id ? await getProducts(product.category_id) : await getProducts();
  const related = pool.filter((p) => p.id !== product.id);
  if (related.length >= limit) return related.slice(0, limit);
  const extra = (await getProducts()).filter((p) => p.id !== product.id && !related.some((r) => r.id === p.id));
  return [...related, ...extra].slice(0, limit);
}

export const getShippingMethods = cache(async (): Promise<ShippingMethod[]> => {
  const sb = getPublicSupabase();
  if (!sb) return [];
  const { data, error } = await sb.from("shipping_methods").select("*").eq("active", true).order("sort_order");
  if (error) {
    console.error("[catalog] envíos:", error.message);
    return [];
  }
  return data as ShippingMethod[];
});
