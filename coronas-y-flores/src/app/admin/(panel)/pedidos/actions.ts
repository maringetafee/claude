"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";
import { sendStatusEmail } from "@/lib/email";
import { NOTIFIABLE_STATUSES, ORDER_STATUSES } from "@/lib/order-status";
import { getSiteContent, getSettings } from "@/lib/site-data";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

export type UpdateOrderState = { ok: string } | { error: string } | null;

export async function updateOrder(_prev: UpdateOrderState, formData: FormData): Promise<UpdateOrderState> {
  let sb;
  try {
    ({ sb } = await requireAdminAction());
  } catch (e) {
    return { error: (e as Error).message };
  }

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as OrderStatus;
  const adminNotes = String(formData.get("admin_notes") ?? "").slice(0, 2000);
  const notify = formData.get("notify") === "on";
  if (!ORDER_STATUSES.some((s) => s.value === status)) return { error: "Estado no válido." };

  const { data: before } = await sb.from("orders").select("status").eq("id", id).maybeSingle();
  if (!before) return { error: "Pedido no encontrado." };

  const { data, error } = await sb
    .from("orders")
    .update({ status, admin_notes: adminNotes })
    .eq("id", id)
    .select("*, items:order_items(*)")
    .single();
  if (error) return { error: `No se ha podido guardar: ${error.message}` };

  let emailed = false;
  if (notify && before.status !== status && NOTIFIABLE_STATUSES.includes(status)) {
    const [content, settings] = await Promise.all([getSiteContent(), getSettings()]);
    emailed = await sendStatusEmail(data as Order & { items: OrderItem[] }, content.contact, settings.notifyEmail || undefined);
  }

  revalidatePath("/admin", "layout");
  return { ok: emailed ? "Guardado y cliente avisado por email." : "Guardado." };
}
