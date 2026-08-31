import type { MetadataRoute } from "next";
import { getProperties } from "@/lib/properties";

const BASE_URL = "https://www.inmoretail.example";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/propiedades", "/aviso-legal", "/privacidad", "/cookies"].map(
    (path) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
    })
  );

  const properties = await getProperties();
  const propertyRoutes = properties.map((p) => ({
    url: `${BASE_URL}/propiedades/${p.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...propertyRoutes];
}
