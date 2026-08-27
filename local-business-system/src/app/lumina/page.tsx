import { Fraunces, Inter } from "next/font/google";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { lumina } from "@/data/sites/lumina";

const display = Fraunces({ variable: "--font-site-display", subsets: ["latin"], weight: ["500", "600"] });
const body = Inter({ variable: "--font-site-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LÚMINA — Restaurante de temporada en Madrid",
  description: lumina.tagline,
};

export default function LuminaPage() {
  return <SiteShell config={lumina} fontVariables={`${display.variable} ${body.variable}`} />;
}
