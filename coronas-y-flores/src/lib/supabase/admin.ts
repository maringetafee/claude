import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/env";

let client: SupabaseClient | null = null;

/**
 * Cliente con service role (salta RLS). Solo servidor: crear pedidos desde el
 * checkout y confirmarlos desde el webhook de Stripe, donde no hay sesión.
 */
export function getServiceSupabase(): SupabaseClient | null {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) return null;
  client ??= createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}
