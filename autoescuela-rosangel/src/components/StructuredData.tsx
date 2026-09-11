import { centers, siteConfig } from "@/lib/site-config";

/**
 * JSON-LD para cada sede (DrivingSchool + LocalBusiness). No se incluye
 * aggregateRating: Google no muestra estrellas para reseñas "autoservidas"
 * de un LocalBusiness en su propia web, y la fuente de verdad de la
 * valoración ya es la ficha de Google Maps de cada centro.
 */
const locationsLd = centers.map((center) => ({
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "DrivingSchool"],
  "@id": `https://autoescuelarosangel.es/centros/${center.slug}/#business`,
  name: `${siteConfig.name} — ${center.fullName}`,
  parentOrganization: { "@id": "https://autoescuelarosangel.es/#organization" },
  telephone: center.phone.href.replace("tel:", ""),
  url: `https://autoescuelarosangel.es/centros/${center.slug}/`,
  address: {
    "@type": "PostalAddress",
    streetAddress: center.street,
    postalCode: center.postalCode,
    addressLocality: center.city,
    addressRegion: "Madrid",
    addressCountry: "ES",
  },
  areaServed: { "@type": "City", name: "Getafe" },
}));

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://autoescuelarosangel.es/#organization",
  name: siteConfig.name,
  url: "https://autoescuelarosangel.es",
  sameAs: [siteConfig.instagram, siteConfig.facebook].filter(Boolean),
  department: locationsLd.map((l) => ({ "@id": l["@id"] })),
};

export default function StructuredData() {
  const payload = [organizationLd, ...locationsLd];
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(payload).replace(/</g, "\\u003c"),
      }}
    />
  );
}
