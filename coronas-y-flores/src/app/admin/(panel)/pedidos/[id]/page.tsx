import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateLong } from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import { statusLabel } from "@/lib/order-status";
import type { Order, OrderItem } from "@/lib/types";
import { OrderStatusForm } from "./OrderStatusForm";
import { PrintButton } from "./PrintButton";

export const metadata: Metadata = { title: "Pedido" };

type Props = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { data } = await sb.from("orders").select("*, items:order_items(*)").eq("id", id).maybeSingle();
  if (!data) notFound();
  const order = data as Order & { items: OrderItem[] };
  const stripeMode = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test") ? "test/" : "";

  return (
    <>
      <Link className="adm-back no-print" href="/admin/pedidos">
        ← Pedidos
      </Link>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Pedido #{order.number}</h1>
          <p className="adm-sub">
            Recibido el {new Date(order.created_at).toLocaleString("es-ES", { timeZone: "Europe/Madrid", dateStyle: "long", timeStyle: "short" })} ·{" "}
            <span className={`adm-badge adm-badge--${order.status}`}>{statusLabel(order.status)}</span>
          </p>
        </div>
        <div className="adm-row no-print">
          <PrintButton />
        </div>
      </div>

      <div className="adm-split">
        <div>
          <section className="adm-card">
            <h2>{order.shipping_kind === "pickup" ? "Recogida en tienda" : "Entrega a domicilio"}</h2>
            <dl className="adm-dl">
              <dt>Fecha</dt>
              <dd>
                <strong>{formatDateLong(order.delivery_date)}</strong> · {order.delivery_slot}
              </dd>
              <dt>Método</dt>
              <dd>{order.shipping_name}</dd>
              {order.shipping_kind === "delivery" && (
                <>
                  <dt>Destinatario</dt>
                  <dd>
                    {order.recipient_name} · <a className="adm-link" href={`tel:${order.recipient_phone}`}>{order.recipient_phone}</a>
                  </dd>
                  <dt>Dirección</dt>
                  <dd>
                    {order.address}
                    <br />
                    {order.postal_code} {order.city}{" "}
                    <a
                      className="adm-link no-print"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.address}, ${order.postal_code} ${order.city}`)}`}
                    >
                      Ver en el mapa
                    </a>
                  </dd>
                </>
              )}
            </dl>
          </section>

          <section className="adm-card">
            <h2>Productos</h2>
            <div className="adm-table-wrap">
              <table className="adm-table">
                <tbody>
                  {order.items.map((i) => (
                    <tr key={i.id}>
                      <td style={{ width: 58 }}>{i.image_url && <img className="adm-thumb" src={i.image_url} alt="" />}</td>
                      <td>
                        <strong>
                          {i.quantity} × {i.product_name}
                        </strong>
                        {i.variant_name && <span> · {i.variant_name}</span>}
                        {i.ribbon_text && (
                          <div style={{ marginTop: 4 }}>
                            Cinta: <strong>«{i.ribbon_text}»</strong>
                          </div>
                        )}
                      </td>
                      <td className="num">{formatEUR(i.unit_price_cents * i.quantity)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td />
                    <td className="adm-muted">Subtotal</td>
                    <td className="num">{formatEUR(order.subtotal_cents)}</td>
                  </tr>
                  <tr>
                    <td />
                    <td className="adm-muted">{order.shipping_name}</td>
                    <td className="num">{order.shipping_cents ? formatEUR(order.shipping_cents) : "Gratis"}</td>
                  </tr>
                  <tr>
                    <td />
                    <td>
                      <strong>Total</strong>
                    </td>
                    <td className="num">
                      <strong>{formatEUR(order.total_cents)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {(order.card_message || order.notes) && (
            <section className="adm-card">
              {order.card_message && (
                <>
                  <h2>Mensaje de la tarjeta</h2>
                  <p className="adm-quote">{order.card_message}</p>
                </>
              )}
              {order.notes && (
                <>
                  <h2 style={{ marginTop: order.card_message ? 20 : 0 }}>Notas del cliente</h2>
                  <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{order.notes}</p>
                </>
              )}
            </section>
          )}
        </div>

        <aside>
          <section className="adm-card no-print">
            <h2>Estado</h2>
            <OrderStatusForm id={order.id} status={order.status} adminNotes={order.admin_notes} />
          </section>
          <section className="adm-card">
            <h2>Cliente</h2>
            <dl className="adm-dl" style={{ gridTemplateColumns: "1fr" }}>
              <dd>
                <strong>{order.customer_name}</strong>
              </dd>
              <dd>
                <a className="adm-link" href={`mailto:${order.customer_email}`}>
                  {order.customer_email}
                </a>
              </dd>
              <dd>
                <a className="adm-link" href={`tel:${order.customer_phone}`}>
                  {order.customer_phone}
                </a>
              </dd>
            </dl>
          </section>
          <section className="adm-card no-print">
            <h2>Pago</h2>
            {order.paid_at ? (
              <p style={{ margin: 0 }}>
                Pagado el {new Date(order.paid_at).toLocaleString("es-ES", { timeZone: "Europe/Madrid", dateStyle: "short", timeStyle: "short" })}
                {order.stripe_payment_intent && (
                  <>
                    <br />
                    <a
                      className="adm-link"
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://dashboard.stripe.com/${stripeMode}payments/${order.stripe_payment_intent}`}
                    >
                      Ver en Stripe (reembolsos) ↗
                    </a>
                  </>
                )}
              </p>
            ) : (
              <p className="adm-muted" style={{ margin: 0 }}>
                Sin pago registrado.
              </p>
            )}
          </section>
        </aside>
      </div>
    </>
  );
}
