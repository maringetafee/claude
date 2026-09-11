"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/admin/auth";
import { patchSettings } from "@/lib/admin/settings-store";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

async function admin() {
  try {
    return (await requireAdminAction()).sb;
  } catch {
    return null;
  }
}

const MethodInput = z.object({
  id: z.uuid().nullable(),
  name: z.string().trim().min(2, "El nombre es obligatorio.").max(80),
  description: z.string().trim().max(200),
  kind: z.enum(["delivery", "pickup"]),
  price_cents: z.number().int().min(0),
  free_over_cents: z.number().int().min(0).nullable(),
  postal_codes: z.array(z.string().regex(/^\d{5}$/)).max(300),
  active: z.boolean(),
  sort_order: z.number().int(),
});

export async function saveShippingMethod(raw: z.input<typeof MethodInput>): Promise<Result<{ id: string }>> {
  const sb = await admin();
  if (!sb) return { ok: false, error: "No autorizado." };
  const parsed = MethodInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  const { id, ...row } = parsed.data;
  const { data, error } = id
    ? await sb.from("shipping_methods").update(row).eq("id", id).select("id").single()
    : await sb.from("shipping_methods").insert(row).select("id").single();
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true, id: data.id as string };
}

export async function deleteShippingMethod(id: string): Promise<Result> {
  const sb = await admin();
  if (!sb) return { ok: false, error: "No autorizado." };
  const { error } = await sb.from("shipping_methods").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}

const RulesInput = z.object({
  minDaysAhead: z.number().int().min(0).max(30),
  maxDaysAhead: z.number().int().min(1, "Permite pedir al menos con un día de margen.").max(365),
  closedWeekdays: z.array(z.number().int().min(0).max(6)).max(6, "Tiene que quedar al menos un día de reparto."),
  closedDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(200),
  slots: z
    .array(
      z.object({
        id: z.string().min(1).max(40),
        label: z.string().trim().min(2, "Cada franja necesita un texto.").max(60),
        sameDayUntil: z.string().regex(/^\d{2}:\d{2}$/).nullable(),
      }),
    )
    .min(1, "Necesitas al menos una franja.")
    .max(8),
});

export async function saveDeliveryRules(raw: z.input<typeof RulesInput>): Promise<Result> {
  const sb = await admin();
  if (!sb) return { ok: false, error: "No autorizado." };
  const parsed = RulesInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  if (parsed.data.minDaysAhead > parsed.data.maxDaysAhead) return { ok: false, error: "La antelación mínima no puede ser mayor que la máxima." };
  const error = await patchSettings(sb, { delivery: parsed.data });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
