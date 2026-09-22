import "server-only";
import type { User } from "@supabase/supabase-js";
import { hasSupabase } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Customer } from "@/lib/types";

export type CurrentCustomer = { user: User; customer: Customer | null };

/** Cliente con sesión iniciada en la tienda (o null). Lee cookies: solo en páginas dinámicas. */
export async function getCurrentCustomer(): Promise<CurrentCustomer | null> {
  if (!hasSupabase) return null;
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb.from("customers").select("*").eq("id", user.id).maybeSingle();
  return { user, customer: (data as Customer | null) ?? null };
}

/** Solo rutas internas, para que ?next= no pueda mandar a otra web. */
export function safeNext(next: unknown, fallback = "/cuenta"): string {
  const value = typeof next === "string" ? next : "";
  return value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\") ? value : fallback;
}
