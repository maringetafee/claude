import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";
import { PageHero } from "@/components/shop/PageHero";
import { getSiteContent } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false, follow: true },
};

export default async function CartPage() {
  const content = await getSiteContent();
  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/", label: "Inicio" }, { href: "/tienda", label: "Tienda" }, { label: "Carrito" }]} title="Tu carrito" />
      <section className="shop cart">
        <div className="container">
          <CartView secureNote={content.shop.secureNote} />
        </div>
      </section>
    </main>
  );
}
