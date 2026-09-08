import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";
import { organizationLd, localBusinessLd, websiteLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";
import Providers from "@/components/layout/Providers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Sema-Dur · Fabricantes de herramientas de corte para madera y metal",
    template: "%s · Sema-Dur",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "es_ES",
    url: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${archivo.variable}`}>
      <body>
        <JsonLd data={[organizationLd(), localBusinessLd(), websiteLd()]} />
        <Providers>
          <a href="#contenido" className="skip-link visually-hidden">
            Saltar al contenido
          </a>
          <Header />
          <main id="contenido" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
