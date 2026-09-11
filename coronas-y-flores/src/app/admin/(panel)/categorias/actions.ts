"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/admin/auth";
import { slugify } from "@/lib/product-utils";

const CategoryInput = z.object({
  id: z.uuid().nullable(),
  name: z.string().trim().min(2, "El nombre es obligatorio.").max(80),
  slug: z.string().trim().max(80),
  description: z.string().trim().max(500),
  sort_order: z.number().int(),
  active: z.boolean(),
});

export async function saveCategory(raw: z.input<typeof CategoryInput>): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  let sb;
  try {
    ({ sb } = await requireAdminAction());
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const parsed = CategoryInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  const { id, ...fields } = parsed.data;
  const row = { ...fields, slug: slugify(fields.slug || fields.name) };

  const { data, error } = id
    ? await sb.from("categories").update(row).eq("id", id).select("id").single()
    : await sb.from("categories").insert(row).select("id").single();
  if (error) {
    return { ok: false, error: error.code === "23505" ? "Ya existe una categoría con esa dirección web." : error.message };
  }
  revalidatePath("/", "layout");
  return { ok: true, id: data.id as string };
}

export async function deleteCategory(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  let sb;
  try {
    ({ sb } = await requireAdminAction());
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const { error } = await sb.from("categories").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
