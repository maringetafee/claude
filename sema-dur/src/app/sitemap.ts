import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { services } from "@/data/services";
import { posts } from "@/data/posts";
import { legalDocs } from "@/data/legal";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, SITE_URL).toString();

  const staticPaths: [string, number][] = [
    ["/", 1],
    ["/productos/", 0.9],
    ["/servicios/", 0.7],
    ["/empresa/", 0.6],
    ["/distribuidores/", 0.5],
    ["/blog/", 0.6],
    ["/contacto/", 0.6],
    ["/realiza-tu-pedido/", 0.5],
    ["/trabaja-con-nosotros/", 0.3],
  ];

  return [
    ...staticPaths.map(([path, priority]) => ({
      url: url(path),
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...categories.map((c) => ({
      url: url(`/productos/${c.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: url(`/producto/${p.slug}/`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...services.map((s) => ({
      url: url(`/servicios/${s.slug}/`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: url(`/blog/${p.slug}/`),
      lastModified: p.date,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...legalDocs.map((d) => ({
      url: url(`/${d.slug}/`),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
}
