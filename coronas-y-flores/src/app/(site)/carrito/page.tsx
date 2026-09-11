import type { Metadata } from "next";
import { CartView } from "@/components/shop/CartView";
import { PageHero } from "@/components/shop/PageHero";

export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/", label: "Inicio" }, { href: "/tienda", label: "Tienda" }, { label: "Carrito" }]} title="Tu carrito" />
      <section className="shop cart">
        <div className="container">
          <CartView />
        </div>
      </section>
    </main>
  );
}
