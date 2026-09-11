import type { ReactNode } from "react";
import { BrandMark } from "@/components/site/BrandMark";
import { requireAdmin } from "@/lib/admin/auth";
import { BRAND } from "@/lib/brand";
import { AdminNav } from "./AdminNav";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  const { sb, user } = await requireAdmin();
  const { count } = await sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid");

  return (
    <>
      <aside className="adm-side">
        <div className="adm-brand">
          <BrandMark className="" />
          <div>
            <strong>{BRAND.name}</strong>
            <small>Panel de gestión</small>
          </div>
        </div>
        <AdminNav newOrders={count ?? 0} />
        <div className="adm-side__user">{user.email}</div>
        <a className="adm-side__credit" href="https://makemyweb.es" target="_blank" rel="noopener">
          <span>Web y soporte</span>
          <strong>makemyweb.es ↗</strong>
        </a>
      </aside>
      <main className="adm-main">{children}</main>
    </>
  );
}
