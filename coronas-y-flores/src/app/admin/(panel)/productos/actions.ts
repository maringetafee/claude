"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/admin/auth";
import { slugify } from "@/lib/product-utils";

const ProductInput = z.object({
  id: z.uuid().nullable(),
  name: z.string().trim().min(2, "El nombre es obligatorio.").max(120),
  slug: z.string().trim().max(80),
  category_id: z.uuid().nullable(),
  short_description: z.string().trim().max(240, "La descripción corta es demasiado larga (máx. 240)."),
  description: z.string().trim().max(5000),
  price_cents: z.number().int().min(0).nullable(),
  compare_at_cents: z.number().int().min(0).nullable(),
  stock: z.number().int().min(0).nullable(),
  active: z.boolean(),
  featured: z.boolean(),
  allow_ribbon: z.boolean(),
  sort_order: z.number().int(),
  seo_title: z.string().trim().max(70, "El título SEO debe tener 70 caracteres como máximo."),
  seo_description: z.string().trim().max(170, "La descripción SEO debe tener 170 caracteres como máximo."),
  variants: z
    .array(
      z.object({
        id: z.uuid().optional(),
        name: z.string().trim().min(1, "Cada tamaño necesita un nombre.").max(60),
        price_cents: z.number().int().min(0, "Precio de tamaño no válido."),
      }),
    )
    .max(12),
  images: z.array(z.object({ url: z.url(), storage_path: z.string().nullable(), alt: z.string().trim().max(160) })).max(12, "Máximo 12 fotos por producto."),
});

export type ProductInput = z.input<typeof ProductInput>;
export type ActionResult = { ok: true; id: string } | { ok: false; error: string };

function dbError(error: { code?: string; message: string }): ActionResult {
  if (error.code === "23505") return { ok: false, error: "Ya existe otro producto con esa dirección web (slug). Cambia el nombre o el slug." };
  console.error("[admin/productos]", error);
  return { ok: false, error: `No se ha podido guardar: ${error.message}` };
}

export async function saveProduct(raw: ProductInput): Promise<ActionResult> {
  let sb;
  try {
    ({ sb } = await requireAdminAction());
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const parsed = ProductInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  const p = parsed.data;

  if (!p.variants.length && p.price_cents == null) return { ok: false, error: "Indica el precio del producto." };
  const slug = slugify(p.slug || p.name);
  if (!slug) return { ok: false, error: "El slug no es válido." };
  const hasVariants = p.variants.length > 0;

  const row = {
    name: p.name,
    slug,
    category_id: p.category_id,
    short_description: p.short_description,
    description: p.description,
    price_cents: hasVariants ? Math.min(...p.variants.map((v) => v.price_cents)) : p.price_cents!,
    compare_at_cents: hasVariants ? null : p.compare_at_cents,
    stock: p.stock,
    active: p.active,
    featured: p.featured,
    allow_ribbon: p.allow_ribbon,
    sort_order: p.sort_order,
    seo_title: p.seo_title || null,
    seo_description: p.seo_description || null,
  };

  let id = p.id;
  if (id) {
    const { error } = await sb.from("products").update(row).eq("id", id);
    if (error) return dbError(error);
  } else {
    const { data, error } = await sb.from("products").insert(row).select("id").single();
    if (error) return dbError(error);
    id = data.id as string;
  }

  // Tamaños: se actualizan conservando su id (así los carritos abiertos siguen siendo válidos)
  const { data: existing } = await sb.from("product_variants").select("id").eq("product_id", id);
  const existingIds = new Set((existing ?? []).map((v) => v.id as string));
  const keep = new Set(p.variants.map((v) => v.id).filter((x): x is string => Boolean(x)));
  const toDelete = [...existingIds].filter((x) => !keep.has(x));
  if (toDelete.length) await sb.from("product_variants").delete().in("id", toDelete);
  for (const [i, v] of p.variants.entries()) {
    const { error } =
      v.id && existingIds.has(v.id)
        ? await sb.from("product_variants").update({ name: v.name, price_cents: v.price_cents, sort_order: i }).eq("id", v.id)
        : await sb.from("product_variants").insert({ product_id: id, name: v.name, price_cents: v.price_cents, sort_order: i });
    if (error) return dbError(error);
  }

  // Fotos: se reescriben en el orden elegido y se borran del almacenamiento las que ya no se usan
  const { data: oldImages } = await sb.from("product_images").select("storage_path").eq("product_id", id);
  await sb.from("product_images").delete().eq("product_id", id);
  if (p.images.length) {
    const { error } = await sb
      .from("product_images")
      .insert(p.images.map((img, i) => ({ product_id: id, url: img.url, storage_path: img.storage_path, alt: img.alt, sort_order: i })));
    if (error) return dbError(error);
  }
  const kept = new Set(p.images.map((i) => i.storage_path).filter(Boolean));
  const orphans = (oldImages ?? []).map((i) => i.storage_path as string | null).filter((x): x is string => Boolean(x) && !kept.has(x));
  if (orphans.length) await sb.storage.from("media").remove(orphans);

  revalidatePath("/", "layout");
  return { ok: true, id: id! };
}

export async function deleteProduct(id: string): Promise<{ ok: true } | { ok: false; error: string }> {
  let sb;
  try {
    ({ sb } = await requireAdminAction());
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const { data: images } = await sb.from("product_images").select("storage_path").eq("product_id", id);
  const { error } = await sb.from("products").delete().eq("id", id);
  if (error) return { ok: false, error: `No se ha podido eliminar: ${error.message}` };
  const paths = (images ?? []).map((i) => i.storage_path as string | null).filter((x): x is string => Boolean(x));
  if (paths.length) await sb.storage.from("media").remove(paths);
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function toggleProductFlag(id: string, field: "active" | "featured", value: boolean): Promise<void> {
  const { sb } = await requireAdminAction();
  await sb.from("products").update({ [field]: value }).eq("id", id);
  revalidatePath("/", "layout");
}
