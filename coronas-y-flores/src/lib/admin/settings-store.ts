import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { StoreSettings } from "@/lib/settings-shared";

/** Fusiona un cambio parcial en la fila única de ajustes. */
export async function patchSettings(sb: SupabaseClient, patch: Partial<StoreSettings>) {
  const { data } = await sb.from("store_settings").select("data").eq("id", 1).maybeSingle();
  const next = { ...((data?.data as object) ?? {}), ...patch };
  const { error } = await sb.from("store_settings").upsert({ id: 1, data: next, updated_at: new Date().toISOString() });
  return error;
}
