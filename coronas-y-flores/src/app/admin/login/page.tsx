import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/site/BrandMark";
import { getAdminContext } from "@/lib/admin/auth";
import { BRAND } from "@/lib/brand";
import { hasSupabase } from "@/lib/env";
import { signOut } from "../actions";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Acceso" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;

  let signedInNonAdmin = false;
  if (hasSupabase) {
    const ctx = await getAdminContext();
    if (ctx.user && ctx.isAdmin) redirect("/admin");
    signedInNonAdmin = Boolean(ctx.user);
  }

  return (
    <main className="adm-login">
      <div className="adm-login__card">
        <div className="adm-brand">
          <BrandMark className="" />
          <div>
            <strong>{BRAND.name}</strong>
            <small>Panel de gestión</small>
          </div>
        </div>
        {!hasSupabase || error === "config" ? (
          <div className="adm-alert adm-alert--info">
            Falta conectar la base de datos: rellena las claves de Supabase en <code>.env.local</code> y reinicia el servidor.
          </div>
        ) : signedInNonAdmin ? (
          <div className="adm-form">
            <div className="adm-alert">Tu usuario no tiene permisos de administración.</div>
            <form action={signOut}>
              <button className="adm-btn" type="submit">
                Cerrar sesión
              </button>
            </form>
          </div>
        ) : (
          <LoginForm />
        )}
      </div>
    </main>
  );
}
