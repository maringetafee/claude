import type { Metadata } from "next";
import { CheckoutForm, type CheckoutProfile } from "@/components/shop/CheckoutForm";
import { PageHero } from "@/components/shop/PageHero";
import { getShippingMethods } from "@/lib/catalog";
import { getCurrentCustomer } from "@/lib/customer";
import { getRedsysConfig } from "@/lib/redsys";
import { getSettings, getSiteContent } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Finalizar pedido",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ cancelado?: string }> };

export default async function CheckoutPage({ searchParams }: Props) {
  const [{ cancelado }, methods, settings, content, account] = await Promise.all([
    searchParams,
    getShippingMethods(),
    getSettings(),
    getSiteContent(),
    getCurrentCustomer(),
  ]);
  const redsys = getRedsysConfig();
  const profile: CheckoutProfile | null = account
    ? {
        name: account.customer?.name ?? "",
        email: account.user.email ?? "",
        phone: account.customer?.phone ?? "",
        address: account.customer?.address ?? "",
        postalCode: account.customer?.postal_code ?? "",
        city: account.customer?.city ?? "",
      }
    : null;

  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/tienda", label: "Tienda" }, { href: "/carrito", label: "Carrito" }, { label: "Finalizar pedido" }]} title="Finalizar pedido" />
      <section className="shop checkout">
        <div className="container">
          <CheckoutForm
            methods={methods}
            rules={settings.delivery}
            cancelled={cancelado !== undefined}
            profile={profile}
            bizum={settings.payments.bizum}
            testMode={Boolean(redsys && !redsys.live)}
            secureNote={content.shop.secureNote}
          />
        </div>
      </section>
    </main>
  );
}
