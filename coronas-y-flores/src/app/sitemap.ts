import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/catalog";
import { SITE_URL } from "@/lib/env";

export const revalidate = 3600;

const LEGAL = ["aviso-legal", "privacidad", "cookies", "condiciones-de-venta"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/tienda`, changeFrequency: "daily", priority: 0.9 },
    ...categories.map((c) => ({ url: `${SITE_URL}/tienda/${c.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...products.map((p) => ({
      url: `${SITE_URL}/producto/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.slice(0, 1).map((i) => i.url),
    })),
    ...LEGAL.map((slug) => ({ url: `${SITE_URL}/legal/${slug}`, changeFrequency: "yearly" as const, priority: 0.2 })),
  ];
}
