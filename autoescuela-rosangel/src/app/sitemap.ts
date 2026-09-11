import type { MetadataRoute } from "next";
import { centers } from "@/lib/site-config";
import { permits } from "@/data/permits";

export const dynamic = "force-static";

const base = "https://autoescuelarosangel.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["/", "/centros/", "/contacto/", "/preguntas-frecuentes/"];
  const permitRoutes = permits.map((p) => `/permisos/${p.slug}/`);
  const centerRoutes = centers.map((c) => `/centros/${c.slug}/`);

  return [...staticRoutes, ...permitRoutes, ...centerRoutes].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));
}
