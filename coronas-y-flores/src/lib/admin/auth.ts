import "server-only";
import { redirect } from "next/navigation";
import { hasSupabase } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminContext() {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { sb, user: null, isAdmin: false } as const;
  const { data: isAdmin } = await sb.rpc("is_admin");
  return { sb, user, isAdmin: Boolean(isAdmin) } as const;
}

/** Para páginas del panel: redirige al login si no hay sesión de administrador. */
export async function requireAdmin() {
  if (!hasSupabase) redirect("/admin/login?error=config");
  const ctx = await getAdminContext();
  if (!ctx.user) redirect("/admin/login");
  if (!ctx.isAdmin) redirect("/admin/login?error=noadmin");
  return ctx;
}

/**
 * Para Server Actions: cada acción lo comprueba por su cuenta (el proxy no es
 * una barrera suficiente para funciones de servidor).
 */
export async function requireAdminAction() {
  if (!hasSupabase) throw new Error("Supabase no está configurado.");
  const ctx = await getAdminContext();
  if (!ctx.user || !ctx.isAdmin) throw new Error("No autorizado.");
  return ctx;
}
