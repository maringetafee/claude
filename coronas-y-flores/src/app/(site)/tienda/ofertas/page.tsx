import type { Metadata } from "next";
import Link from "next/link";
import { CatalogView } from "@/components/shop/CatalogView";
import { PageHero } from "@/components/shop/PageHero";
import { BRAND } from "@/lib/brand";
import { getCategories, getSaleProducts } from "@/lib/catalog";
import { getSiteContent } from "@/lib/site-data";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Ofertas en flores y ramos",
  description: `Ramos, plantas y detalles con descuento en ${BRAND.name}, floristería en ${BRAND.city}. Entrega a domicilio o recogida en tienda.`,
  alternates: { canonical: "/tienda/ofertas" },
  openGraph: { title: `Ofertas · ${BRAND.name}`, url: "/tienda/ofertas" },
};

export default async function OffersPage() {
  const [categories, products, content] = await Promise.all([getCategories(), getSaleProducts(), getSiteContent()]);
  return (
    <main id="main">
      <PageHero
        crumbs={[{ href: "/", label: "Inicio" }, { href: "/tienda", label: "Tienda" }, { label: "Ofertas" }]}
        eyebrow={content.shop.offersEyebrow}
        title={content.shop.offersTitle}
        lead={content.shop.offersLead || undefined}
      />
      <CatalogView
        categories={categories}
        products={products}
        activeSlug="ofertas"
        hasOffers
        emptyState={
          <div className="empty">
            <h2>Ahora mismo no hay ofertas</h2>
            <p>Vuelve pronto: cada temporada preparamos precios especiales. Mientras tanto, echa un vistazo a toda la tienda.</p>
            <Link className="btn btn--solid" href="/tienda">
              Ver la tienda
            </Link>
          </div>
        }
      />
    </main>
  );
}
