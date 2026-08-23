import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = "https://www.sbstelec.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["/", "/aviso-legal", "/privacidad", "/cookies"];
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
