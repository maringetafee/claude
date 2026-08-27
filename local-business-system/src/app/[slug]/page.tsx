import { DM_Serif_Display, Fraunces, Unbounded, Inter, Nunito_Sans } from "next/font/google";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/SiteShell";
import { buildLeadConfig } from "@/data/leadConfig";
import leadsData from "@/data/leads/leads.json";
import { Lead } from "@/data/leads/types";

const leads = leadsData as Lead[];

// Un lead solo usa UNA de estas fuentes de display (segun su tipo) — se
// cargan las tres aqui porque next/font/google exige llamarse a nivel de
// modulo, y luego se elige la .variable correcta por lead en tiempo de build.
const tavernDisplay = DM_Serif_Display({ variable: "--font-site-display", subsets: ["latin"], weight: "400" });
const tavernBody = Nunito_Sans({ variable: "--font-site-body", subsets: ["latin"] });
const editorialDisplay = Fraunces({ variable: "--font-site-display", subsets: ["latin"], weight: ["500", "600"] });
const fashionDisplay = Unbounded({ variable: "--font-site-display", subsets: ["latin"], weight: ["500", "600"] });
const body = Inter({ variable: "--font-site-body", subsets: ["latin"] });

const DISPLAY_FONT_BY_TIPO: Record<string, { variable: string }> = {
  Bar: tavernDisplay,
  Restaurante: editorialDisplay,
  Peluqueria: fashionDisplay,
};
const BODY_FONT_BY_TIPO: Record<string, { variable: string }> = {
  Bar: tavernBody,
};

export function generateStaticParams() {
  return leads.map((lead) => ({ slug: lead.slug }));
}
export const dynamicParams = false;

function findLead(slug: string): Lead | undefined {
  return leads.find((lead) => lead.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lead = findLead(slug);
  if (!lead) return {};
  return {
    title: `${lead.businessName} — ${lead.city}`,
    robots: { index: false, follow: false },
  };
}

export default async function LeadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lead = findLead(slug);
  if (!lead) notFound();

  const config = buildLeadConfig(lead);
  const display = DISPLAY_FONT_BY_TIPO[lead.tipo] ?? body;
  const bodyFont = BODY_FONT_BY_TIPO[lead.tipo] ?? body;

  return <SiteShell config={config} fontVariables={`${display.variable} ${bodyFont.variable}`} />;
}
