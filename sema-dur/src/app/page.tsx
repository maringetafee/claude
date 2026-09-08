import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import TrustBand from "@/components/sections/TrustBand";
import FamiliesGrid from "@/components/sections/FamiliesGrid";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import ValueProps from "@/components/sections/ValueProps";
import ServicesSplit from "@/components/sections/ServicesSplit";
import CompanyStrip from "@/components/sections/CompanyStrip";
import FinalCTA from "@/components/sections/FinalCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fabricantes de herramientas de corte para madera y metal",
  description:
    "Talleres Sema-Dur (Diacort): fabricación, adaptación y reafilado de herramientas de corte a medida para madera y metal desde 1976. Herramientas PCD, portacuchillas, fresas, portaherramientas de CNC y brocas de metal duro.",
  path: "/",
  image: "catalogo/herramientas-corte",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBand />
      <FamiliesGrid />
      <FeaturedProducts />
      <ValueProps />
      <ServicesSplit />
      <CompanyStrip />
      <FinalCTA />
    </>
  );
}
