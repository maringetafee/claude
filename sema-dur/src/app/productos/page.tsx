import type { Metadata } from "next";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import CatalogueBrowser from "@/components/commerce/CatalogueBrowser";
import CategoryCard from "@/components/commerce/CategoryCard";
import JsonLd from "@/components/ui/JsonLd";
import FinalCTA from "@/components/sections/FinalCTA";
import { pageMetadata, breadcrumbLd, itemListLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Catálogo de herramientas de corte",
  description:
    "Catálogo de herramientas de corte de Sema-Dur: herramientas de diamante (PCD), portacuchillas y cuchillas MD-HSS, fresas, portaherramientas de CNC y brocas de metal duro. Todas a presupuesto.",
  path: "/productos/",
});

export default function CataloguePage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos/" },
          ]),
          itemListLd(products.map((p) => ({ name: p.name, slug: p.slug }))),
        ]}
      />
      <PageHero
        eyebrow="Catálogo"
        title="Herramientas de corte para madera y metal"
        lead="Filtra por familia, sector o disponibilidad. Añade lo que necesites a tu solicitud y te enviamos precio y plazo."
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Productos" }]}
      />

      <Section space="md">
        <Container>
          <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Familias
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <CategoryCard key={c.slug} category={c} />
            ))}
          </div>
        </Container>
      </Section>

      <Section space="md" tone="soft">
        <Container>
          <CatalogueBrowser allProducts={products} />
        </Container>
      </Section>

      <FinalCTA />
    </>
  );
}
