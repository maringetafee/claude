import { DM_Serif_Display, Inter } from "next/font/google";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { casaManolo } from "@/data/sites/casa-manolo";

const display = DM_Serif_Display({ variable: "--font-site-display", subsets: ["latin"], weight: "400" });
const body = Inter({ variable: "--font-site-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casa Manolo — Bar, taberna y gastrobar en Madrid",
  description: casaManolo.tagline,
  openGraph: {
    title: "Casa Manolo — Bar, taberna y gastrobar en Madrid",
    description: casaManolo.tagline,
    images: [casaManolo.hero.image],
  },
};

export default function CasaManoloPage() {
  return <SiteShell config={casaManolo} fontVariables={`${display.variable} ${body.variable}`} />;
}
