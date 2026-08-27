import { DM_Serif_Display, Nunito_Sans } from "next/font/google";
import type { Metadata } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { casaManolo } from "@/data/sites/casa-manolo";

const display = DM_Serif_Display({ variable: "--font-site-display", subsets: ["latin"], weight: "400" });
const body = Nunito_Sans({ variable: "--font-site-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Casa Manolo — Bar de siempre en Madrid",
  description: casaManolo.tagline,
};

export default function CasaManoloPage() {
  return <SiteShell config={casaManolo} fontVariables={`${display.variable} ${body.variable}`} />;
}
