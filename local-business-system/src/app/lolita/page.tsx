import { Bebas_Neue, Inter } from "next/font/google";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { lolita } from "@/data/sites/lolita";

const display = Bebas_Neue({ variable: "--font-site-display", subsets: ["latin"], weight: "400" });
const body = Inter({ variable: "--font-site-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lolita — Cocktail bar en Madrid",
  description: lolita.tagline,
};

export default function LolitaPage() {
  return <SiteShell config={lolita} fontVariables={`${display.variable} ${body.variable}`} />;
}
