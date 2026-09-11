import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin/auth";
import type { Category } from "@/lib/types";
import { CategoriesManager } from "./CategoriesManager";

export const metadata: Metadata = { title: "Categorías" };

export default async function CategoriesPage() {
  const { sb } = await requireAdmin();
  const { data } = await sb.from("categories").select("*").order("sort_order");
  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Categorías</h1>
          <p className="adm-sub">Agrupan los productos en la tienda (Ramos, Coronas, Plantas…). El orden decide cómo aparecen.</p>
        </div>
      </div>
      <CategoriesManager initial={(data ?? []) as Category[]} />
    </>
  );
}
