import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHero } from "@/components/shop/PageHero";
import { BRAND } from "@/lib/brand";
import { getCategories, getCategoryBySlug, getProducts } from "@/lib/catalog";

export const revalidate = 300;

type Params = { params: Promise<{ categoria: string }> };

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).categoria);
  if (!category) return {};
  return {
    title: `${category.name} · Tienda online`,
    description: category.description || `${category.name} de ${BRAND.name}, floristería en ${BRAND.city}. Entrega a domicilio.`,
    alternates: { canonical: `/tienda/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const slug = (await params).categoria;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const [categories, products] = await Promise.all([getCategories(), getProducts(category.id)]);

  return (
    <main id="main">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { href: "/tienda", label: "Tienda" }, { label: category.name }]}
        eyebrow="Tienda online"
        title={category.name}
        lead={category.description || undefined}
      />
      <CatalogView categories={categories} products={products} activeSlug={category.slug} />
    </main>
  );
}
