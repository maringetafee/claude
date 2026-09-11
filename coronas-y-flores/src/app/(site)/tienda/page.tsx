import type { Metadata } from "next";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHero } from "@/components/shop/PageHero";
import { BRAND } from "@/lib/brand";
import { getCategories, getProducts } from "@/lib/catalog";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Tienda online de flores",
  description: `Compra ramos, coronas funerarias, centros y plantas online en ${BRAND.name}. Entrega a domicilio en ${BRAND.city} y alrededores o recogida en tienda.`,
  alternates: { canonical: "/tienda" },
  openGraph: { title: `Tienda online · ${BRAND.name}`, url: "/tienda" },
};

export default async function ShopPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);
  return (
    <main id="main">
      <PageHero
        eyebrow="Tienda online"
        title={
          <>
            Flor fresca,
            <br />
            <span className="accent">a domicilio.</span>
          </>
        }
        lead={`Ramos, coronas y centros compuestos a mano en nuestro taller de ${BRAND.city}. Elige el día y la franja de entrega al finalizar el pedido.`}
      />
      <CatalogView categories={categories} products={products} activeSlug={null} />
    </main>
  );
}
