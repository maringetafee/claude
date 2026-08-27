import { Bodoni_Moda, Inter } from "next/font/google";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { studioX } from "@/data/sites/studio-x";

const display = Bodoni_Moda({ variable: "--font-site-display", subsets: ["latin"], weight: ["500", "600", "700"] });
const body = Inter({ variable: "--font-site-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Studio X — Peluquería editorial en Barcelona",
  description: studioX.tagline,
  openGraph: {
    title: "Studio X — Peluquería editorial en Barcelona",
    description: studioX.tagline,
    images: [studioX.hero.image],
  },
};

export default function StudioXPage() {
  return <SiteShell config={studioX} fontVariables={`${display.variable} ${body.variable}`} />;
}
