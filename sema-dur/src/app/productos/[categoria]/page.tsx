import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  categories,
  getCategory,
} from "@/data/categories";
import { products, productsInCategory } from "@/data/products";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Picture from "@/components/ui/Picture";
import CatalogueBrowser from "@/components/commerce/CatalogueBrowser";
import JsonLd from "@/components/ui/JsonLd";
import FinalCTA from "@/components/sections/FinalCTA";
import { pageMetadata, breadcrumbLd, itemListLd } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categoria: string }>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) return {};
  return pageMetadata({
    title: category.name,
    description: category.intro,
    path: `/productos/${category.slug}/`,
    image: category.image,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categoria: string }>;
}) {
  const { categoria } = await params;
  const category = getCategory(categoria);
  if (!category) notFound();

  const items = productsInCategory(category.slug);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd([
            { name: "Inicio", path: "/" },
            { name: "Productos", path: "/productos/" },
            { name: category.shortName, path: `/productos/${category.slug}/` },
          ]),
          itemListLd(items.map((p) => ({ name: p.name, slug: p.slug }))),
        ]}
      />
      <PageHero
        eyebrow="Familia de producto"
        title={category.name}
        lead={category.claim}
        breadcrumbs={[
          { name: "Inicio", href: "/" },
          { name: "Productos", href: "/productos" },
          { name: category.shortName },
        ]}
      />

      <Section space="md">
        <Container className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <p className="text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {category.intro}
          </p>
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <Picture
              image={category.image}
              alt={`Herramientas de la familia ${category.shortName}`}
              sizes="(max-width: 1024px) 92vw, 440px"
              aspectRatio="16 / 10"
              position={category.imagePosition}
            />
          </div>
        </Container>
      </Section>

      <Section space="md" tone="soft">
        <Container>
          <CatalogueBrowser allProducts={products} lockedCategory={category.slug} />
        </Container>
      </Section>

      <FinalCTA />
    </>
  );
}
