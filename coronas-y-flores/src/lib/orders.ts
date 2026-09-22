import "server-only";
import { revalidatePath } from "next/cache";
import { sendOrderPaidEmails } from "@/lib/email";
import { describePayment, getRedsysConfig, verifyResponse } from "@/lib/redsys";
import { getSiteContent, getSettings } from "@/lib/site-data";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { Order, OrderItem } from "@/lib/types";

type OrderWithItems = Order & { items: OrderItem[] };

/**
 * Marca un pedido como pagado de forma idempotente: solo actúa si seguía
 * "pendiente de pago", así que la notificación de Redsys y la página de
 * confirmación pueden llamarlo las dos sin duplicar stock ni emails.
 */
export async function markOrderPaid(
  orderId: string,
  payment: { authCode: string | null; details: string; method: "card" | "bizum" },
  opts: { revalidate: boolean },
): Promise<OrderWithItems | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from("orders")
    .update({
      status: "paid",
      paid_at: new Date().toISOString(),
      payment_auth_code: payment.authCode,
      payment_details: payment.details,
      payment_method: payment.method,
    })
    .eq("id", orderId)
    .eq("status", "pending_payment")
    .select("*, items:order_items(*)")
    .maybeSingle();

  if (error) {
    console.error("[orders] marcar pagado:", error.message);
    return null;
  }
  if (!data) return null; // ya estaba pagado (o cancelado): nada que hacer

  const order = data as OrderWithItems;
  const { error: stockError } = await sb.rpc("apply_order_stock", { p_order_id: orderId });
  if (stockError) console.error("[orders] stock:", stockError.message);

  const [settings, content] = await Promise.all([getSettings(), getSiteContent()]);
  await sendOrderPaidEmails(order, settings.notifyEmail, content.contact);

  if (opts.revalidate) revalidatePath("/", "layout"); // refresca stock visible en la tienda
  return order;
}

export type PaymentOutcome =
  | { kind: "paid"; orderId: string }
  | { kind: "failed"; orderId: string }
  | { kind: "invalid" };

/**
 * Procesa una respuesta firmada de Redsys (notificación servidor a servidor o
 * vuelta del cliente a la web). Comprueba firma, número de operación e importe.
 */
export async function processRedsysResponse(
  merchantParameters: string | null | undefined,
  signature: string | null | undefined,
  opts: { revalidate: boolean },
): Promise<PaymentOutcome> {
  const cfg = getRedsysConfig();
  const sb = getServiceSupabase();
  if (!cfg || !sb) return { kind: "invalid" };
  const result = verifyResponse(cfg, merchantParameters, signature);
  if (!result) {
    console.error("[redsys] firma no válida");
    return { kind: "invalid" };
  }

  const { data: order } = await sb
    .from("orders")
    .select("id, status, total_cents, payment_method")
    .eq("redsys_order", result.order)
    .maybeSingle();
  if (!order) {
    console.error("[redsys] operación desconocida:", result.order);
    return { kind: "invalid" };
  }

  if (!result.authorised) {
    // El carrito sigue guardado en el navegador: el cliente puede reintentar (nuevo pedido).
    await sb
      .from("orders")
      .update({ status: "cancelled", payment_details: describePayment(result), admin_notes: "Pago no completado (denegado o cancelado en la pasarela)." })
      .eq("id", order.id)
      .eq("status", "pending_payment");
    return { kind: "failed", orderId: order.id };
  }

  if (result.amountCents !== order.total_cents) {
    console.error(`[redsys] importe distinto en ${result.order}: ${result.amountCents} ≠ ${order.total_cents}`);
    await sb
      .from("orders")
      .update({ admin_notes: `⚠ Redsys autorizó ${result.amountCents / 100} € pero el pedido era de ${order.total_cents / 100} €. Revisar.` })
      .eq("id", order.id);
    return { kind: "invalid" };
  }

  await markOrderPaid(
    order.id,
    {
      authCode: result.authCode,
      details: describePayment(result),
      method: result.payMethod === "68" ? "bizum" : ((order.payment_method as "card" | "bizum" | null) ?? "card"),
    },
    opts,
  );
  return { kind: "paid", orderId: order.id };
}

export async function getOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data } = await sb.from("orders").select("*, items:order_items(*)").eq("id", orderId).maybeSingle();
  return (data as OrderWithItems) ?? null;
}
