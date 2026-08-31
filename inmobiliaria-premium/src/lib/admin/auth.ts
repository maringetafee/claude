import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * For Server Components / pages under /admin. proxy.ts already redirects
 * unauthenticated requests before the page renders, but this is checked
 * again independently — the proxy matcher is not a reliable-enough
 * boundary on its own (see Next.js Server Actions security guidance).
 */
export async function requireAdminSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return { supabase, user };
}

/** For Server Actions, which are untrusted POST entry points on their own. */
export async function requireAdminAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  return { supabase, user };
}
