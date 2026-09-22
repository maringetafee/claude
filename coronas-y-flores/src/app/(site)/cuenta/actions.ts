"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { safeNext } from "@/lib/customer";
import { sendPasswordResetEmail, sendWelcomeEmail } from "@/lib/email";
import { hasSupabase, SITE_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";
import { getSiteContent } from "@/lib/site-data";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type FormState = { error?: string; ok?: string } | null;

const Password = z
  .string()
  .min(8, "La contraseña debe tener al menos 8 caracteres.")
  .max(72, "La contraseña es demasiado larga.");
const Email = z.email("El email no es válido.").max(160);
const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const firstIssue = (e: z.ZodError) => e.issues[0]?.message ?? "Revisa los datos.";

// ---------- Entrar / salir ----------

export async function signInCustomer(_prev: FormState, fd: FormData): Promise<FormState> {
  if (!hasSupabase) return { error: "La tienda no está configurada todavía." };
  const email = str(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");
  if (!email || !password) return { error: "Escribe tu email y tu contraseña." };

  const sb = await createSupabaseServerClient();
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) return { error: "Email o contraseña incorrectos." };
  redirect(safeNext(fd.get("next")));
}

export async function signOutCustomer() {
  const sb = await createSupabaseServerClient();
  await sb.auth.signOut();
  redirect("/");
}

// ---------- Registro ----------

const RegisterInput = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre.").max(120),
  email: Email,
  phone: z.string().trim().max(30),
  password: Password,
});

export async function registerCustomer(_prev: FormState, fd: FormData): Promise<FormState> {
  // Campo trampa: los humanos no lo ven, los bots lo rellenan.
  if (str(fd, "website")) return { error: "No se ha podido crear la cuenta." };
  if (fd.get("accept") !== "on") return { error: "Debes aceptar la política de privacidad." };
  const parsed = RegisterInput.safeParse({
    name: str(fd, "name"),
    email: str(fd, "email").toLowerCase(),
    phone: str(fd, "phone"),
    password: String(fd.get("password") ?? ""),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const input = parsed.data;

  const svc = getServiceSupabase();
  if (!svc) return { error: "El registro no está disponible ahora mismo." };

  // Se crea ya confirmada: sin esperar a un email de verificación.
  const { data, error } = await svc.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: { name: input.name },
  });
  if (error || !data.user) {
    const exists = /already|registered|exists/i.test(error?.message ?? "");
    return {
      error: exists
        ? "Ya hay una cuenta con ese email. Inicia sesión o recupera tu contraseña."
        : "No se ha podido crear la cuenta. Inténtalo de nuevo.",
    };
  }

  const { error: profileError } = await svc
    .from("customers")
    .upsert({ id: data.user.id, email: input.email, name: input.name, phone: input.phone });
  if (profileError) console.error("[cuenta] perfil:", profileError.message);

  const sb = await createSupabaseServerClient();
  await sb.auth.signInWithPassword({ email: input.email, password: input.password });

  const content = await getSiteContent();
  await sendWelcomeEmail(input.email, input.name, content.contact);
  redirect(safeNext(fd.get("next"), "/cuenta?bienvenida=1"));
}

// ---------- Datos y contraseña ----------

async function requireCustomer() {
  const sb = await createSupabaseServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/cuenta/entrar");
  return { sb, user };
}

const ProfileInput = z.object({
  name: z.string().trim().min(2, "Escribe tu nombre.").max(120),
  phone: z.string().trim().max(30),
  address: z.string().trim().max(240),
  postal_code: z.union([z.literal(""), z.string().trim().regex(/^\d{5}$/, "El código postal debe tener 5 cifras.")]),
  city: z.string().trim().max(80),
});

export async function updateProfile(_prev: FormState, fd: FormData): Promise<FormState> {
  const { user } = await requireCustomer();
  const parsed = ProfileInput.safeParse({
    name: str(fd, "name"),
    phone: str(fd, "phone"),
    address: str(fd, "address"),
    postal_code: str(fd, "postal_code"),
    city: str(fd, "city"),
  });
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  const svc = getServiceSupabase();
  if (!svc) return { error: "No se han podido guardar los datos." };
  const { error } = await svc.from("customers").upsert({ id: user.id, email: user.email ?? "", ...parsed.data });
  if (error) return { error: "No se han podido guardar los datos." };
  revalidatePath("/cuenta");
  return { ok: "Datos guardados. Los rellenaremos por ti al hacer un pedido." };
}

export async function changeCustomerPassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const { user } = await requireCustomer();
  const current = String(fd.get("current") ?? "");
  const next = String(fd.get("next") ?? "");
  const parsed = Password.safeParse(next);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (next !== String(fd.get("confirm") ?? "")) return { error: "Las dos contraseñas nuevas no coinciden." };
  if (!user.email) return { error: "Tu cuenta no tiene email." };

  // Se comprueba la actual con un cliente aparte para no tocar la sesión abierta
  const verifier = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error: wrong } = await verifier.auth.signInWithPassword({ email: user.email, password: current });
  if (wrong) return { error: "La contraseña actual no es correcta." };
  await verifier.auth.signOut({ scope: "local" });

  const svc = getServiceSupabase();
  if (!svc) return { error: "No se ha podido cambiar la contraseña." };
  const { error } = await svc.auth.admin.updateUserById(user.id, { password: next });
  if (error) return { error: "No se ha podido cambiar la contraseña." };
  return { ok: "Contraseña cambiada." };
}

// ---------- Recuperar contraseña ----------

export async function requestPasswordReset(_prev: FormState, fd: FormData): Promise<FormState> {
  const parsed = Email.safeParse(str(fd, "email").toLowerCase());
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (!process.env.RESEND_API_KEY) {
    return { error: "Ahora mismo no podemos enviar emails. Llámanos y te ayudamos a recuperar el acceso." };
  }
  const svc = getServiceSupabase();
  if (!svc) return { error: "No disponible ahora mismo." };

  const { data, error } = await svc.auth.admin.generateLink({ type: "recovery", email: parsed.data });
  // Misma respuesta exista o no la cuenta, para no revelar qué emails están registrados
  if (!error && data.properties?.hashed_token) {
    const link = `${SITE_URL}/cuenta/restablecer?token=${encodeURIComponent(data.properties.hashed_token)}`;
    const content = await getSiteContent();
    await sendPasswordResetEmail(parsed.data, link, content.contact);
  }
  return { ok: "Si hay una cuenta con ese email, te hemos enviado un enlace para elegir una contraseña nueva. Revisa también la carpeta de spam." };
}

export async function resetPassword(_prev: FormState, fd: FormData): Promise<FormState> {
  const token = str(fd, "token");
  const next = String(fd.get("next") ?? "");
  const parsed = Password.safeParse(next);
  if (!parsed.success) return { error: firstIssue(parsed.error) };
  if (next !== String(fd.get("confirm") ?? "")) return { error: "Las dos contraseñas no coinciden." };
  if (!token) return { error: "El enlace no es válido. Pide uno nuevo." };

  // El token se canjea al enviar el formulario (no al abrir el enlace), así los
  // antivirus que abren los enlaces del correo no lo gastan.
  const sb = await createSupabaseServerClient();
  const { error: otpError } = await sb.auth.verifyOtp({ type: "recovery", token_hash: token });
  if (otpError) return { error: "El enlace ha caducado o ya se usó. Pide uno nuevo." };
  const { error } = await sb.auth.updateUser({ password: next });
  if (error) return { error: "No se ha podido guardar la contraseña. Prueba con otra." };
  redirect("/cuenta?clave=1");
}
