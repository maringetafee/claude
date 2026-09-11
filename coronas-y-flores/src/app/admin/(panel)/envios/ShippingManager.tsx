"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { centsToInput, toCents } from "@/lib/money";
import type { ShippingKind, ShippingMethod } from "@/lib/types";
import { deleteShippingMethod, saveShippingMethod } from "./actions";

type Row = {
  key: string;
  id: string | null;
  name: string;
  description: string;
  kind: ShippingKind;
  price: string;
  free_over: string;
  postal_codes: string;
  active: boolean;
  sort_order: string;
};

const toRow = (m: ShippingMethod): Row => ({
  key: m.id,
  id: m.id,
  name: m.name,
  description: m.description,
  kind: m.kind,
  price: centsToInput(m.price_cents),
  free_over: centsToInput(m.free_over_cents),
  postal_codes: m.postal_codes.join(", "),
  active: m.active,
  sort_order: String(m.sort_order),
});

export function ShippingManager({ initial }: { initial: ShippingMethod[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(() => initial.map(toRow));
  const [msg, setMsg] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [pending, startTransition] = useTransition();
  const update = (key: string, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const say = (key: string, ok: boolean, text: string) => setMsg((m) => ({ ...m, [key]: { ok, text } }));

  function save(row: Row) {
    const price = row.price.trim() ? toCents(row.price) : 0;
    const freeOver = row.free_over.trim() ? toCents(row.free_over) : null;
    if (Number.isNaN(price) || (freeOver !== null && Number.isNaN(freeOver))) return say(row.key, false, "Revisa los importes.");
    const codes = row.postal_codes.split(/[\s,;]+/).map((c) => c.trim()).filter(Boolean);
    if (codes.some((c) => !/^\d{5}$/.test(c))) return say(row.key, false, "Los códigos postales deben tener 5 cifras.");
    startTransition(async () => {
      const res = await saveShippingMethod({
        id: row.id,
        name: row.name,
        description: row.description,
        kind: row.kind,
        price_cents: price,
        free_over_cents: freeOver,
        postal_codes: row.kind === "delivery" ? codes : [],
        active: row.active,
        sort_order: Number.parseInt(row.sort_order, 10) || 0,
      });
      if (!res.ok) return say(row.key, false, res.error);
      update(row.key, { id: res.id });
      say(row.key, true, "Guardado.");
      router.refresh();
    });
  }

  function remove(row: Row) {
    if (!row.id) return setRows((rs) => rs.filter((r) => r.key !== row.key));
    if (!window.confirm(`¿Eliminar «${row.name}»?`)) return;
    startTransition(async () => {
      const res = await deleteShippingMethod(row.id!);
      if (!res.ok) return say(row.key, false, res.error);
      setRows((rs) => rs.filter((r) => r.key !== row.key));
      router.refresh();
    });
  }

  return (
    <section className="adm-card">
      <h2>
        Métodos de entrega <small>El cliente elige uno al pagar</small>
      </h2>
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
              <input className="adm-input" required value={row.name} onChange={(e) => update(row.key, { name: e.target.value })} placeholder="Entrega en Alcorcón" />
            </label>
            <label className="adm-field">
              <span>Tipo</span>
              <select className="adm-input" value={row.kind} onChange={(e) => update(row.key, { kind: e.target.value as ShippingKind })}>
                <option value="delivery">Entrega a domicilio</option>
                <option value="pickup">Recogida en tienda</option>
              </select>
            </label>
            <label className="adm-field">
              <span>Orden</span>
              <input className="adm-input" inputMode="numeric" value={row.sort_order} onChange={(e) => update(row.key, { sort_order: e.target.value.replace(/[^\d-]/g, "") })} />
            </label>
          </div>
          <label className="adm-field" style={{ marginTop: 12 }}>
            <span>Descripción</span>
            <input className="adm-input" value={row.description} onChange={(e) => update(row.key, { description: e.target.value })} placeholder="Reparto propio. Gratis a partir de 60 €." />
          </label>
          <div className="adm-grid-2" style={{ marginTop: 12 }}>
            <label className="adm-field">
              <span>Precio (€)</span>
              <input className="adm-input" inputMode="decimal" value={row.price} onChange={(e) => update(row.key, { price: e.target.value })} placeholder="0 = gratis" />
            </label>
            <label className="adm-field">
              <span>Gratis a partir de (€)</span>
              <input className="adm-input" inputMode="decimal" value={row.free_over} onChange={(e) => update(row.key, { free_over: e.target.value })} placeholder="Vacío = nunca gratis" />
            </label>
          </div>
          {row.kind === "delivery" && (
            <label className="adm-field" style={{ marginTop: 12 }}>
              <span>Códigos postales donde se reparte</span>
              <textarea className="adm-input" value={row.postal_codes} onChange={(e) => update(row.key, { postal_codes: e.target.value })} style={{ minHeight: 64 }} placeholder="28920, 28921, 28922…" />
              <span className="adm-hint">Separados por comas. Si lo dejas vacío se acepta cualquier código postal.</span>
            </label>
          )}
          <div className="adm-row" style={{ marginTop: 12 }}>
            <label className="adm-check">
              <input type="checkbox" checked={row.active} onChange={(e) => update(row.key, { active: e.target.checked })} />
              <span>Disponible</span>
            </label>
            <div className="adm-row" style={{ marginLeft: "auto" }}>
              {msg[row.key] && <span className={`adm-alert${msg[row.key].ok ? " adm-alert--ok" : ""}`} style={{ padding: "6px 12px" }}>{msg[row.key].text}</span>}
              <button type="button" className="adm-btn adm-btn--sm adm-btn--danger" disabled={pending} onClick={() => remove(row)}>
                Eliminar
              </button>
              <button type="submit" className="adm-btn adm-btn--sm adm-btn--primary" disabled={pending}>
                {row.id ? "Guardar" : "Crear"}
              </button>
            </div>
          </div>
        </form>
      ))}
      {!rows.length && <p className="adm-empty">No hay métodos de entrega: la tienda no podrá cobrar pedidos hasta que crees uno.</p>}
      <button
        type="button"
        className="adm-btn"
        style={{ marginTop: 14 }}
        onClick={() =>
          setRows((rs) => [
            ...rs,
            { key: crypto.randomUUID(), id: null, name: "", description: "", kind: "delivery", price: "", free_over: "", postal_codes: "", active: true, sort_order: String(rs.length + 1) },
          ])
        }
      >
        + Añadir método de entrega
      </button>
    </section>
  );
}
