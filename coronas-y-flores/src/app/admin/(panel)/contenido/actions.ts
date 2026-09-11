"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/admin/auth";

const t = (max: number) => z.string().trim().max(max);
const img = z.string().trim().max(600);

const ContentInput = z.object({
  hero: z.object({ kicker: t(60), line1: t(40), line2: t(40), line3: t(40), copy: t(300), image: img, imageAlt: t(160) }),
  services: z.array(z.object({ title: t(60), text: t(200), metaLeft: t(40), metaRight: t(40), image: img, alt: t(160) })).min(1).max(8),
  stats: z.array(z.object({ value: z.number().int().min(0).max(1_000_000), label: t(60) })).min(1).max(4),
  reviews: z.object({ score: t(10), count: t(60), intro: t(300), items: z.array(z.object({ text: t(400), author: t(80) })).min(1).max(8) }),
  gallery: z.array(z.object({ image: img, alt: t(160), title: t(60), caption: t(160) })).min(1).max(16),
  contact: z.object({ address: t(240), hours: t(160), phone: t(40), email: t(160), instagram: t(240), whatsapp: t(40), area: t(80) }),
  footer: z.object({ tagline: t(240), ordersNote: t(240) }),
});

export async function saveContent(raw: z.input<typeof ContentInput>): Promise<{ ok: true } | { ok: false; error: string }> {
  let sb;
  try {
    ({ sb } = await requireAdminAction());
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
  const parsed = ContentInput.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `Revisa «${issue?.path.join(" › ")}»: ${issue?.message}` };
  }
  const { error } = await sb.from("site_content").upsert({ id: 1, data: parsed.data, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  return { ok: true };
}
