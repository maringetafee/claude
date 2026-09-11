import "server-only";
import { revalidatePath } from "next/cache";
import { sendOrderPaidEmails } from "@/lib/email";
import { getSiteContent, getSettings } from "@/lib/site-data";
import { getServiceSupabase } from "@/lib/supabase/admin";
import type { Order, OrderItem } from "@/lib/types";

type OrderWithItems = Order & { items: OrderItem[] };

/**
 * Marca un pedido como pagado de forma idempotente: solo actúa si seguía
 * "pendiente de pago", así que el webhook y la página de confirmación pueden
 * llamarlo los dos sin duplicar stock ni emails.
 */
export async function markOrderPaid(
  orderId: string,
  paymentIntentId: string | null,
  opts: { revalidate: boolean },
): Promise<OrderWithItems | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;

  const { data, error } = await sb
    .from("orders")
    .update({ status: "paid", paid_at: new Date().toISOString(), stripe_payment_intent: paymentIntentId })
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

export async function cancelPendingOrder(orderId: string) {
  const sb = getServiceSupabase();
  if (!sb) return;
  const { error } = await sb
    .from("orders")
    .update({ status: "cancelled", admin_notes: "Pago no completado (sesión de Stripe caducada)." })
    .eq("id", orderId)
    .eq("status", "pending_payment");
  if (error) console.error("[orders] cancelar:", error.message);
}

export async function getOrderWithItems(orderId: string): Promise<OrderWithItems | null> {
  const sb = getServiceSupabase();
  if (!sb) return null;
  const { data } = await sb.from("orders").select("*, items:order_items(*)").eq("id", orderId).maybeSingle();
  return (data as OrderWithItems) ?? null;
}
