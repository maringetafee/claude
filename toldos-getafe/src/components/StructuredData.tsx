import { siteConfig, serviceAreas } from "@/lib/site-config";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "HomeAndConstructionBusiness"],
  "@id": "https://toldosgetafe.es/#business",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  description:
    "Fábrica de toldos y pérgolas a medida en Madrid. Fabricación e instalación de toldos cofre, extensibles, verticales y motorizados, pérgolas bioclimáticas y cerramientos de lona para particulares y profesionales.",
  url: "https://toldosgetafe.es",
  telephone: siteConfig.phone.href.replace("tel:", ""),
  email: siteConfig.email,
  image: "https://toldosgetafe.es/images/toldos/hero-toldos-getafe.webp",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.street,
    postalCode: siteConfig.address.postalCode,
    addressLocality: siteConfig.address.city,
    addressRegion: siteConfig.address.region,
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: siteConfig.geo.lat,
    longitude: siteConfig.geo.lng,
  },
  areaServed: serviceAreas.map((name) => ({
    "@type": "City",
    name,
  })),
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: siteConfig.google.rating,
    reviewCount: siteConfig.google.reviewCount,
    bestRating: 5,
    worstRating: 1,
  },
  sameAs: [
    siteConfig.social.facebook,
    siteConfig.social.instagram,
    siteConfig.google.profileUrl,
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
