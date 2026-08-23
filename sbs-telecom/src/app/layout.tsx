import type { Metadata } from "next";
import { Archivo, Inter, IBM_Plex_Mono } from "next/font/google";
import { company } from "@/lib/content";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const siteUrl = "https://www.sbstelec.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "S.B.S Telecomunicaciones — Antenas, porteros y telecomunicaciones en Madrid",
    template: "%s — S.B.S Telecomunicaciones",
  },
  description:
    "Instalación, reparación y mantenimiento de antenas colectivas, antenas parabólicas, porteros automáticos, videoporteros, videovigilancia y electricidad en Madrid. 26 años de experiencia, flota propia y urgencias los domingos.",
  keywords: [
    "telecomunicaciones Madrid",
    "antenas Madrid",
    "antenas colectivas Madrid",
    "antenas parabólicas Madrid",
    "videoporteros Madrid",
    "porteros automáticos Madrid",
    "videovigilancia Madrid",
    "electricidad Madrid",
    "mantenimiento de antenas Madrid",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "S.B.S Telecomunicaciones S.L.",
    title: "S.B.S Telecomunicaciones — Antenas, porteros y telecomunicaciones en Madrid",
    description:
      "26 años instalando y manteniendo antenas, porteros automáticos, videoporteros, videovigilancia y electricidad en la Comunidad de Madrid.",
    images: [{ url: "/images/hero-rooftop.jpg", width: 1200, height: 630, alt: "Técnicos de S.B.S Telecomunicaciones trabajando en una azotea de Madrid" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "S.B.S Telecomunicaciones — Telecomunicaciones en Madrid",
    description: "Antenas, porteros automáticos, videoporteros y electricidad. 26 años en la Comunidad de Madrid.",
    images: ["/images/hero-rooftop.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.png" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: company.legalName,
  image: `${siteUrl}/images/hero-rooftop.jpg`,
  telephone: company.phone,
  email: company.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    postalCode: company.address.postalCode,
    addressRegion: company.address.province,
    addressCountry: "ES",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: "Comunidad de Madrid",
  },
  priceRange: "€€",
  url: siteUrl,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${inter.variable} ${plexMono.variable} h-full`}
    >
      <body className="min-h-full bg-carbon-950 text-bone-100 antialiased selection:bg-signal-500">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded focus:bg-signal-500 focus:px-4 focus:py-2 focus:text-carbon-950 focus:font-semibold"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  );
}
