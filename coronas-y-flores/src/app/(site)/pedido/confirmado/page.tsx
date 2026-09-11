import type { Metadata } from "next";
import Link from "next/link";
import { CheckIcon } from "@/components/Icons";
import { ClearCart } from "@/components/shop/ClearCart";
import { PageHero } from "@/components/shop/PageHero";
import { formatDateLong } from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import { getOrderWithItems, markOrderPaid } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Pedido confirmado",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

async function loadOrder(sessionId: string | undefined) {
  const stripe = getStripe();
  if (!stripe || !sessionId || !sessionId.startsWith("cs_")) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.order_id ?? session.client_reference_id;
    if (!orderId) return null;
    if (session.payment_status === "paid") {
      // Por si el webhook todavía no ha llegado: es idempotente.
      const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
      await markOrderPaid(orderId, pi, { revalidate: false });
    }
    const order = await getOrderWithItems(orderId);
    return order ? { order, paid: session.payment_status === "paid" } : null;
  } catch (err) {
    console.error("[confirmado]", err);
    return null;
  }
}

export default async function ConfirmedPage({ searchParams }: Props) {
  const { session_id } = await searchParams;
  const result = await loadOrder(session_id);

  return (
    <main id="main">
      <ClearCart />
      <PageHero compact title={result?.paid ? "¡Pedido confirmado!" : "Gracias por tu pedido"} />
      <section className="shop confirm">
        <div className="container">
          <div className="confirm__card">
            <div className="confirm__icon">
              <CheckIcon />
            </div>
            {result ? (
              <>
                <h2 className="section-title" style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}>
                  Pedido #{result.order.number}
                </h2>
                <p className="lead" style={{ marginTop: 14 }}>
                  {result.paid
                    ? `Te hemos enviado la confirmación a ${result.order.customer_email}. Nos ponemos con él en el taller.`
                    : "Estamos esperando la confirmación del pago. Recibirás un email en cuanto se complete."}
                </p>
                <div className="confirm__grid">
                  <div className="confirm__block">
                    <h3>{result.order.shipping_kind === "pickup" ? "Recogida" : "Entrega"}</h3>
                    <p>
                      {formatDateLong(result.order.delivery_date)}
                      <br />
                      {result.order.delivery_slot}
                    </p>
                    {result.order.shipping_kind === "delivery" && (
                      <p style={{ marginTop: 8 }}>
                        {result.order.recipient_name}
                        <br />
                        {result.order.address}, {result.order.postal_code} {result.order.city}
                      </p>
                    )}
                  </div>
                  <div className="confirm__block">
                    <h3>Resumen</h3>
                    {result.order.items?.map((i) => (
                      <p key={i.id}>
                        {i.quantity} × {i.product_name}
                        {i.variant_name ? ` · ${i.variant_name}` : ""}
                      </p>
                    ))}
                    <p style={{ marginTop: 8 }}>
                      <strong>Total: {formatEUR(result.order.total_cents)}</strong>
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2 className="section-title" style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}>
                  Hemos recibido tu pedido
                </h2>
                <p className="lead" style={{ marginTop: 14 }}>
                  Si el pago se ha completado recibirás un email de confirmación en unos minutos. Si tienes cualquier duda, llámanos.
                </p>
              </>
            )}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
              <Link className="btn btn--ink" href="/tienda">
                Seguir comprando
              </Link>
              <Link className="btn btn--ghost" href="/">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
