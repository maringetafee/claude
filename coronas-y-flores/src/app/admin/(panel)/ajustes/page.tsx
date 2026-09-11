import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { mergeSettings } from "@/lib/settings-shared";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Ajustes" };

export default async function SettingsPage() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("store_settings").select("data").eq("id", 1).maybeSingle();
  const settings = mergeSettings(data?.data);
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Ajustes</h1>
          <p className="adm-sub">Avisos de pedidos y datos legales del negocio (aparecen en el aviso legal y las condiciones de venta).</p>
        </div>
      </div>
      <SettingsForm initial={{ notifyEmail: settings.notifyEmail, legal: settings.legal }} />
    </>
  );
}
