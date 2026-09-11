import type { Metadata } from "next";
import { CheckoutForm } from "@/components/shop/CheckoutForm";
import { PageHero } from "@/components/shop/PageHero";
import { getShippingMethods } from "@/lib/catalog";
import { getSettings } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ cancelado?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const [{ cancelado }, methods, settings] = await Promise.all([searchParams, getShippingMethods(), getSettings()]);
  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/tienda", label: "Tienda" }, { href: "/carrito", label: "Carrito" }, { label: "Finalizar pedido" }]} title="Finalizar pedido" />
      <section className="shop checkout">
        <div className="container">
          <CheckoutForm methods={methods} rules={settings.delivery} cancelled={cancelado === "1"} />
        </div>
      </section>
    </main>
  );
}
