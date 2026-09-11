import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import { mergeSettings } from "@/lib/settings-shared";
import type { ShippingMethod } from "@/lib/types";
import { DeliveryRulesEditor } from "./DeliveryRulesEditor";
import { ShippingManager } from "./ShippingManager";

export const metadata: Metadata = { title: "Envíos y entregas" };

export default async function ShippingPage() {
  const { sb } = await requireAdmin();
  const [{ data: methods }, { data: settingsRow }] = await Promise.all([
    sb.from("shipping_methods").select("*").order("sort_order"),
    sb.from("store_settings").select("data").eq("id", 1).maybeSingle(),
  ]);
  const settings = mergeSettings(settingsRow?.data);

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Envíos y entregas</h1>
          <p className="adm-sub">Zonas de reparto con su precio, recogida en tienda, días de reparto y franjas horarias.</p>
        </div>
      </div>
      <ShippingManager initial={(methods ?? []) as ShippingMethod[]} />
      <DeliveryRulesEditor initial={settings.delivery} />
    </>
  );
}
