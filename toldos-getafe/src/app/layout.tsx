import type { Metadata } from "next";
import { Manrope, Fraunces } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FixedCinematicBackground from "@/components/layout/FixedCinematicBackground";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://toldosgetafe.es"),
  title: {
    default: "Toldos Getafe — Toldos y pérgolas a medida en Madrid",
    template: "%s — Toldos Getafe",
  },
  description:
    "Fabricación e instalación de toldos y pérgolas a medida en Madrid. Toldos extensibles, cofre, verticales y motorizados, pérgolas bioclimáticas y cerramientos de lona, para particulares y profesionales.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${manrope.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <FixedCinematicBackground />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
