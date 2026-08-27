import { Bebas_Neue, DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { neonbun } from "@/data/sites/neonbun";

const display = Bebas_Neue({ variable: "--font-site-display", subsets: ["latin"], weight: "400" });
const body = DM_Sans({ variable: "--font-site-body", subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "NEONBUN — Hamburguesería urbana",
  description: neonbun.tagline,
  openGraph: {
    title: "NEONBUN — Hamburguesería urbana",
    description: neonbun.tagline,
    images: [neonbun.hero.image],
  },
};

export default function NeonbunPage() {
  return <SiteShell config={neonbun} fontVariables={`${display.variable} ${body.variable}`} />;
}
