import type { Metadata } from "next";
import { Suspense } from "react";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import BuscarResults from "./BuscarResults";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Buscar",
  description: "Busca herramientas de corte por nombre, referencia o familia.",
  path: "/buscar/",
  noindex: true,
});

export default function BuscarPage() {
  return (
    <>
      <PageHero
        eyebrow="Búsqueda"
        title="Resultados de búsqueda"
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Buscar" }]}
      />
      <Section space="md">
        <Container>
          <Suspense fallback={null}>
            <BuscarResults />
          </Suspense>
        </Container>
      </Section>
    </>
  );
}
