import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckIcon } from "@/components/Icons";
import { ClearCart } from "@/components/shop/ClearCart";
import { PageHero } from "@/components/shop/PageHero";
import { formatDateLong } from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import { getOrderWithItems, processRedsysResponse } from "@/lib/orders";

export const metadata: Metadata = {
  title: "Tu pedido",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ Ds_MerchantParameters?: string; Ds_Signature?: string }>;
};

export default async function OrderResultPage({ params, searchParams }: Props) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();

  // Redsys devuelve al cliente con la respuesta firmada: sirve de respaldo por si
  // la notificación del servidor todavía no ha llegado (es idempotente).
  if (sp.Ds_MerchantParameters && sp.Ds_Signature) {
    await processRedsysResponse(sp.Ds_MerchantParameters, sp.Ds_Signature, { revalidate: false });
  }
  const order = await getOrderWithItems(id);
  if (!order) notFound();

  const paid = order.status !== "pending_payment" && order.status !== "cancelled";
  const failed = order.status === "cancelled" && !order.paid_at;

  return (
    <main id="main">
      {!failed && <ClearCart />}
      <PageHero compact title={paid ? "¡Pedido confirmado!" : failed ? "El pago no se completó" : "Gracias por tu pedido"} />
      <section className="shop confirm">
        <div className="container">
          <div className="confirm__card">
            {failed ? (
              <>
                <h2 className="section-title" style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}>
                  No se ha cobrado nada
                </h2>
                <p className="lead" style={{ marginTop: 14 }}>
                  El pago se canceló o el banco no lo autorizó. Tu carrito sigue guardado: puedes intentarlo de nuevo o llamarnos y te lo preparamos.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
                  <Link className="btn btn--solid" href="/checkout">
                    Volver a intentarlo
                  </Link>
                  <Link className="btn btn--ghost" href="/#visitanos">
                    Contactar
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="confirm__icon">
                  <CheckIcon />
                </div>
                <h2 className="section-title" style={{ fontSize: "clamp(2.2rem,4vw,3.2rem)" }}>
                  Pedido #{order.number}
                </h2>
                <p className="lead" style={{ marginTop: 14 }}>
                  {paid
                    ? `Te hemos enviado la confirmación a ${order.customer_email}. Nos ponemos con él en el taller.`
                    : "Estamos esperando la confirmación del pago. Recibirás un email en cuanto se complete."}
                </p>
                <div className="confirm__grid">
                  <div className="confirm__block">
                    <h3>{order.shipping_kind === "pickup" ? "Recogida" : "Entrega"}</h3>
                    <p>
                      {formatDateLong(order.delivery_date)}
                      <br />
                      {order.delivery_slot}
                    </p>
                    {order.shipping_kind === "delivery" && (
                      <p style={{ marginTop: 8 }}>
                        {order.recipient_name}
                        <br />
                        {order.address}, {order.postal_code} {order.city}
                      </p>
                    )}
                  </div>
                  <div className="confirm__block">
                    <h3>Resumen</h3>
                    {order.items.map((i) => (
                      <p key={i.id}>
                        {i.quantity} × {i.product_name}
                        {i.variant_name ? ` · ${i.variant_name}` : ""}
                      </p>
                    ))}
                    <p style={{ marginTop: 8 }}>
                      <strong>Total: {formatEUR(order.total_cents)}</strong>
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 34 }}>
                  <Link className="btn btn--ink" href="/tienda">
                    Seguir comprando
                  </Link>
                  {order.user_id ? (
                    <Link className="btn btn--ghost" href="/cuenta">
                      Ver mis pedidos
                    </Link>
                  ) : (
                    <Link className="btn btn--ghost" href="/">
                      Volver al inicio
                    </Link>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
