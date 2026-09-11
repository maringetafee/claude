"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/admin/auth";
import { patchSettings } from "@/lib/admin/settings-store";

const Input = z.object({
  notifyEmail: z.union([z.literal(""), z.email("El email de avisos no es válido.")]),
  legal: z.object({
    razonSocial: z.string().trim().max(160),
    nif: z.string().trim().max(20),
    domicilio: z.string().trim().max(240),
    email: z.string().trim().max(160),
    telefono: z.string().trim().max(40),
    registro: z.string().trim().max(240),
  }),
});

export async function saveGeneralSettings(raw: z.input<typeof Input>): Promise<{ ok: true } | { ok: false; error: string }> {
  let sb;
  try {
    ({ sb } = await requireAdminAction());
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const parsed = Input.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  const error = await patchSettings(sb, parsed.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
