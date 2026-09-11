"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { slugify } from "@/lib/product-utils";
import type { Category } from "@/lib/types";
import { deleteCategory, saveCategory } from "./actions";

type Row = { key: string; id: string | null; name: string; slug: string; description: string; sort_order: string; active: boolean };

const toRow = (c: Category): Row => ({
  key: c.id,
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description,
  sort_order: String(c.sort_order),
  active: c.active,
});

export function CategoriesManager({ initial }: { initial: Category[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(() => initial.map(toRow));
  const [msg, setMsg] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [pending, startTransition] = useTransition();

  const update = (key: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  function save(row: Row) {
    startTransition(async () => {
      const res = await saveCategory({
        id: row.id,
        name: row.name,
        slug: row.slug || slugify(row.name),
        description: row.description,
        sort_order: Number.parseInt(row.sort_order, 10) || 0,
        active: row.active,
      });
      if (!res.ok) return setMsg((m) => ({ ...m, [row.key]: { ok: false, text: res.error } }));
      update(row.key, { id: res.id, slug: row.slug || slugify(row.name) });
      setMsg((m) => ({ ...m, [row.key]: { ok: true, text: "Guardada." } }));
      router.refresh();
    });
  }

  function remove(row: Row) {
    if (!row.id) return setRows((rs) => rs.filter((r) => r.key !== row.key));
    if (!window.confirm(`¿Eliminar la categoría «${row.name}»? Sus productos se quedarán sin categoría.`)) return;
    startTransition(async () => {
      const res = await deleteCategory(row.id!);
      if (!res.ok) return setMsg((m) => ({ ...m, [row.key]: { ok: false, text: res.error } }));
      setRows((rs) => rs.filter((r) => r.key !== row.key));
      router.refresh();
    });
  }

  return (
    <section className="adm-card">
      {rows.map((row) => (
        <form
          key={row.key}
          className="adm-sub-card"
          onSubmit={(e) => {
            e.preventDefault();
            save(row);
          }}
        >
          <div className="adm-grid-3">
            <label className="adm-field">
              <span>Nombre</span>
              <input className="adm-input" required value={row.name} onChange={(e) => update(row.key, { name: e.target.value, ...(row.id ? {} : { slug: slugify(e.target.value) }) })} />
            </label>
            <label className="adm-field">
              <span>Dirección web</span>
              <input className="adm-input" value={row.slug} onChange={(e) => update(row.key, { slug: slugify(e.target.value) })} />
              <span className="adm-hint">/tienda/{row.slug || "…"}</span>
            </label>
            <label className="adm-field">
              <span>Orden</span>
              <input className="adm-input" inputMode="numeric" value={row.sort_order} onChange={(e) => update(row.key, { sort_order: e.target.value.replace(/[^\d-]/g, "") })} />
            </label>
          </div>
          <label className="adm-field" style={{ marginTop: 12 }}>
            <span>Descripción (aparece en la cabecera de la categoría y en Google)</span>
            <textarea className="adm-input" value={row.description} onChange={(e) => update(row.key, { description: e.target.value })} style={{ minHeight: 70 }} />
          </label>
          <div className="adm-row" style={{ marginTop: 12 }}>
            <label className="adm-check">
              <input type="checkbox" checked={row.active} onChange={(e) => update(row.key, { active: e.target.checked })} />
              <span>Visible en la tienda</span>
            </label>
            <div className="adm-row" style={{ marginLeft: "auto" }}>
              {msg[row.key] && <span className={`adm-alert${msg[row.key].ok ? " adm-alert--ok" : ""}`} style={{ padding: "6px 12px" }}>{msg[row.key].text}</span>}
              <button type="button" className="adm-btn adm-btn--sm adm-btn--danger" onClick={() => remove(row)} disabled={pending}>
                Eliminar
              </button>
              <button type="submit" className="adm-btn adm-btn--sm adm-btn--primary" disabled={pending}>
                {row.id ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </form>
      ))}
      {!rows.length && <p className="adm-empty">Todavía no hay categorías.</p>}
      <button
        type="button"
        className="adm-btn"
        style={{ marginTop: 14 }}
        onClick={() =>
          setRows((rs) => [
            ...rs,
            { key: crypto.randomUUID(), id: null, name: "", slug: "", description: "", sort_order: String(rs.length + 1), active: true },
          ])
        }
      >
        + Añadir categoría
      </button>
    </section>
  );
}
