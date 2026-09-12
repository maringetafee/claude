import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { getPanelUsers, type PanelUser } from "@/lib/admin/panel-users";
import { mergeSettings } from "@/lib/settings-shared";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { AccessManager } from "./AccessManager";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Ajustes" };

export default async function SettingsPage() {
  const { sb, user } = await requireAdmin();
  const { data } = await sb.from("store_settings").select("data").eq("id", 1).maybeSingle();
  const settings = mergeSettings(data?.data);

  let users: PanelUser[] = [];
  let usersError: string | null = null;
  const svc = getServiceSupabase();
  if (!svc) {
    usersError = "falta la clave de servicio de Supabase en el servidor.";
  } else {
    try {
      users = await getPanelUsers(svc);
    } catch (e) {
      usersError = (e as Error).message;
    }
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Ajustes</h1>
          <p className="adm-sub">Avisos de pedidos y datos legales del negocio (aparecen en el aviso legal y las condiciones de venta).</p>
        </div>
      </div>
      <SettingsForm initial={{ notifyEmail: settings.notifyEmail, legal: settings.legal }} />

      <div className="adm-head" style={{ marginTop: 44 }}>
        <div>
          <h2 className="adm-title" style={{ fontSize: "clamp(1.6rem, 2.4vw, 2rem)" }}>
            Acceso al panel
          </h2>
          <p className="adm-sub">Cambia tu contraseña y decide quién más puede entrar a gestionar la tienda.</p>
        </div>
      </div>
      <AccessManager users={users} usersError={usersError} meId={user.id} meEmail={user.email ?? ""} />
    </>
  );
}
