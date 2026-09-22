import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { PageHero } from "@/components/shop/PageHero";
import { getCurrentCustomer } from "@/lib/customer";
import { formatDateLong } from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import { customerStatusLabel } from "@/lib/order-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order, OrderItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Pedido",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

const orderedOn = new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeZone: "Europe/Madrid" });

export default async function CustomerOrderPage({ params }: Props) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const account = await getCurrentCustomer();
  if (!account) redirect(`/cuenta/entrar?next=/cuenta/pedidos/${id}`);

  const sb = await createSupabaseServerClient();
  const { data } = await sb.from("orders").select("*, items:order_items(*)").eq("id", id).eq("user_id", account.user.id).maybeSingle();
  if (!data) notFound();
  const order = data as Order & { items: OrderItem[] };

  return (
    <main id="main">
      <PageHero
        compact
        crumbs={[{ href: "/", label: "Inicio" }, { href: "/cuenta", label: "Mi cuenta" }, { label: `Pedido #${order.number}` }]}
        title={`Pedido #${order.number}`}
      />
      <section className="shop account">
        <div className="container account__grid">
          <div>
            <p className="account__meta">
              <span className={`status-pill status-pill--${order.status}`}>{customerStatusLabel(order.status)}</span>
              <span>Pedido el {orderedOn.format(new Date(order.created_at))}</span>
            </p>
            <div className="confirm__grid" style={{ marginTop: 0 }}>
              <div className="confirm__block">
                <h3>{order.shipping_kind === "pickup" ? "Recogida en tienda" : "Entrega"}</h3>
                <p>
                  {formatDateLong(order.delivery_date)}
                  <br />
                  {order.delivery_slot}
                </p>
                {order.shipping_kind === "delivery" && (
                  <p style={{ marginTop: 8 }}>
                    {order.recipient_name} · {order.recipient_phone}
                    <br />
                    {order.address}, {order.postal_code} {order.city}
                  </p>
                )}
              </div>
              {order.card_message && (
                <div className="confirm__block">
                  <h3>Mensaje de la tarjeta</h3>
                  <p style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "1.2rem" }}>{order.card_message}</p>
                </div>
              )}
            </div>
          </div>
          <aside className="summary">
            <h2 className="summary__title">Resumen</h2>
            <div className="summary__lines">
              {order.items.map((i) => (
                <div className="summary__line" key={i.id}>
                  <div className="summary__thumb">
                    {i.image_url && <Image src={i.image_url} alt="" fill sizes="60px" />}
                    <b>{i.quantity}</b>
                  </div>
                  <div>
                    {i.product_name}
                    {i.variant_name && <small>{i.variant_name}</small>}
                    {i.ribbon_text && <small>Cinta: «{i.ribbon_text}»</small>}
                  </div>
                  <span>{formatEUR(i.unit_price_cents * i.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="summary__row">
              <span>Subtotal</span>
              <span>{formatEUR(order.subtotal_cents)}</span>
            </div>
            <div className="summary__row">
              <span>{order.shipping_name}</span>
              <span>{order.shipping_cents ? formatEUR(order.shipping_cents) : "Gratis"}</span>
            </div>
            <div className="summary__total">
              <span>Total</span>
              <span>{formatEUR(order.total_cents)}</span>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
