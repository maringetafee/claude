import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { hasSupabase, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

let client: SupabaseClient | null = null;

/** Cliente anónimo sin cookies: lecturas públicas cacheables (catálogo, contenido). */
export function getPublicSupabase(): SupabaseClient | null {
  if (!hasSupabase) return null;
  client ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
