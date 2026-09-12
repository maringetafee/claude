"use server";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/admin/auth";
import { findUserByEmail } from "@/lib/admin/panel-users";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";
import { getServiceSupabase } from "@/lib/supabase/admin";

type Result = { ok: true; message: string; created?: boolean } | { ok: false; error: string };
type Authorized = Awaited<ReturnType<typeof requireAdminAction>> & { svc: SupabaseClient };

const MIN_PASSWORD = 8;
const Password = z
  .string()
  .min(MIN_PASSWORD, `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres.`)
  .max(72, "La contraseña es demasiado larga.");

async function authorize(): Promise<{ ok: true; auth: Authorized } | { ok: false; error: string }> {
  try {
    const ctx = await requireAdminAction();
    const svc = getServiceSupabase();
    if (!svc) return { ok: false, error: "Falta la clave de servicio de Supabase en el servidor." };
    return { ok: true, auth: { ...ctx, svc } };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

const ChangeInput = z
  .object({
    current: z.string().min(1, "Escribe tu contraseña actual."),
    next: Password,
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { message: "Las dos contraseñas nuevas no coinciden." })
  .refine((d) => d.next !== d.current, { message: "La contraseña nueva tiene que ser distinta de la actual." });

export async function changeMyPassword(raw: z.input<typeof ChangeInput>): Promise<Result> {
  const authz = await authorize();
  if (!authz.ok) return authz;
  const { auth } = authz;
  const parsed = ChangeInput.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  const email = auth.user.email;
  if (!email) return { ok: false, error: "Tu usuario no tiene email." };

  // La contraseña actual se comprueba con un cliente aparte para no tocar las
  // cookies de la sesión abierta.
  const verifier = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: signInError } = await verifier.auth.signInWithPassword({ email, password: parsed.data.current });
  if (signInError) return { ok: false, error: "La contraseña actual no es correcta." };
  await verifier.auth.signOut({ scope: "local" });

  const { error } = await auth.svc.auth.admin.updateUserById(auth.user.id, { password: parsed.data.next });
  if (error) return { ok: false, error: `No se pudo cambiar la contraseña: ${error.message}` };
  return { ok: true, message: "Contraseña cambiada. La próxima vez entra con la nueva." };
}

const AddInput = z.object({
  email: z.email("El email no es válido."),
  password: Password,
});

export async function addPanelUser(raw: { email: string; password: string }): Promise<Result> {
  const authz = await authorize();
  if (!authz.ok) return authz;
  const { auth } = authz;
  const parsed = AddInput.safeParse({ email: raw.email.trim().toLowerCase(), password: raw.password });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos no válidos." };
  const { email, password } = parsed.data;

  let userId: string;
  let created = true;
  const res = await auth.svc.auth.admin.createUser({ email, password, email_confirm: true });
  if (res.error) {
    // Si ya existe una cuenta con ese email, se le da acceso con su contraseña de siempre.
    const existing = await findUserByEmail(auth.svc, email).catch(() => null);
    if (!existing) return { ok: false, error: `No se pudo crear el usuario: ${res.error.message}` };
    userId = existing.id;
    created = false;
  } else {
    userId = res.data.user.id;
  }

  const { error } = await auth.svc.from("admin_users").upsert({ user_id: userId });
  if (error) return { ok: false, error: `No se pudo dar el acceso: ${error.message}` };
  revalidatePath("/admin/ajustes");
  return created
    ? { ok: true, created, message: `Acceso creado para ${email}.` }
    : { ok: true, created, message: `${email} ya tenía cuenta: ahora puede entrar al panel con su contraseña de siempre.` };
}

export async function removePanelUser(userId: string): Promise<Result> {
  const authz = await authorize();
  if (!authz.ok) return authz;
  const { auth } = authz;
  if (!z.uuid().safeParse(userId).success) return { ok: false, error: "Usuario no válido." };
  if (userId === auth.user.id) return { ok: false, error: "No puedes quitarte el acceso a ti mismo." };

  // Solo se borran cuentas que tienen acceso al panel, y siempre queda al menos una.
  const { data: row } = await auth.svc.from("admin_users").select("user_id").eq("user_id", userId).maybeSingle();
  if (!row) return { ok: false, error: "Ese usuario no tiene acceso al panel." };
  const { count } = await auth.svc.from("admin_users").select("user_id", { count: "exact", head: true });
  if ((count ?? 0) <= 1) return { ok: false, error: "Tiene que quedar al menos un usuario con acceso." };

  const { error } = await auth.svc.auth.admin.deleteUser(userId);
  if (error) return { ok: false, error: `No se pudo quitar el acceso: ${error.message}` };
  revalidatePath("/admin/ajustes");
  return { ok: true, message: "Acceso eliminado." };
}
