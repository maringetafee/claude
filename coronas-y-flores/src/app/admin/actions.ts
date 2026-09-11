"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type LoginState = { error: string } | null;

export async function signIn(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Escribe tu email y tu contraseña." };

  const sb = await createSupabaseServerClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email o contraseña incorrectos." };

  const { data: isAdmin } = await sb.rpc("is_admin");
  if (!isAdmin) {
    await sb.auth.signOut();
    return { error: "Este usuario no tiene acceso al panel." };
  }
  redirect("/admin");
}

export async function signOut() {
  const sb = await createSupabaseServerClient();
  await sb.auth.signOut();
  redirect("/admin/login");
}
