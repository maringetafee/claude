import type { Metadata } from "next";
import { Inter, Archivo } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import StructuredData from "@/components/StructuredData";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://autoescuelarosangel.es"),
  title: {
    default:
      "Autoescuela Rosangel — Autoescuela en Getafe | Carnet B y A2",
    template: "%s — Autoescuela Rosangel",
  },
  description:
    "Autoescuela en Getafe con cuatro centros: Centro, Juan de la Cierva, Norte y Los Molinos. Sácate el carnet B o el A2 con clases adaptadas a tu horario.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_ES",
    siteName: "Autoescuela Rosangel",
    title: "Autoescuela Rosangel — Autoescuela en Getafe",
    description:
      "Cuatro centros en Getafe. Carnet B y A2. Clases adaptadas a tu horario.",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Autoescuela Rosangel — Autoescuela en Getafe",
    description:
      "Cuatro centros en Getafe. Carnet B y A2. Clases adaptadas a tu horario.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <StructuredData />
        <Header />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
