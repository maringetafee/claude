import type { Metadata } from "next";
import { siteConfig } from "./site-config";
import type { Product } from "@/data/products";
import { availabilityLabel } from "@/data/products";
import { categoriesBySlug } from "@/data/categories";
import { largestSrc } from "@/components/ui/Picture";
import type { ImageKey } from "@/components/ui/Picture";

export const SITE_URL = siteConfig.domain;

type PageMetaInput = {
  title: string;
  description: string;
  path: string; // e.g. "/productos/"
  image?: ImageKey;
  noindex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  image,
  noindex,
}: PageMetaInput): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const ogImage = image
    ? new URL(largestSrc(image), SITE_URL).toString()
    : new URL("/images/catalogo/herramientas-corte-1200.webp", SITE_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: siteConfig.name,
      locale: "es_ES",
      images: [{ url: ogImage, width: 1200, height: 800 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

// ── JSON-LD ────────────────────────────────────────────────────────────────

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    alternateName: [siteConfig.name, siteConfig.brand],
    url: SITE_URL,
    logo: new URL("/images/logo/diacort-sema-dur.png", SITE_URL).toString(),
    email: siteConfig.email,
    telephone: siteConfig.phone.href.replace("tel:", ""),
    foundingDate: String(siteConfig.founded),
    sameAs: [siteConfig.social.facebook, siteConfig.social.instagram],
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
  };
}

export function localBusinessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ManufacturingBusiness",
    "@id": `${SITE_URL}/#business`,
    name: siteConfig.legalName,
    image: new URL("/images/empresa/taller-1200.webp", SITE_URL).toString(),
    url: SITE_URL,
    telephone: siteConfig.phone.href.replace("tel:", ""),
    email: siteConfig.email,
    priceRange: "Presupuesto a medida",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.address.geo.lat,
      longitude: siteConfig.address.geo.lng,
    },
    areaServed: ["ES", "PT", "CO", "VE", "GQ"],
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: SITE_URL,
    inLanguage: "es-ES",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/buscar/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: new URL(item.path, SITE_URL).toString(),
    })),
  };
}

export function productLd(product: Product) {
  const category = categoriesBySlug[product.categorySlug];
  const availability =
    product.availability === "consultar"
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/PreOrder";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    sku: product.ref,
    category: category?.name,
    brand: { "@type": "Brand", name: siteConfig.brand },
    manufacturer: { "@type": "Organization", name: siteConfig.legalName },
    image: product.image
      ? new URL(largestSrc(product.image), SITE_URL).toString()
      : undefined,
    // No invented price: advertise as quote-only.
    offers: {
      "@type": "Offer",
      availability,
      priceCurrency: "EUR",
      price: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        valueAddedTaxIncluded: false,
        description: availabilityLabel[product.availability],
      },
      seller: { "@type": "Organization", name: siteConfig.legalName },
      url: `${SITE_URL}/producto/${product.slug}/`,
    },
  };
}

export function itemListLd(
  products: { name: string; slug: string }[],
  basePath = "/producto",
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: new URL(`${basePath}/${p.slug}/`, SITE_URL).toString(),
      name: p.name,
    })),
  };
}
