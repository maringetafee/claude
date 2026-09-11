"use client";

import { useActionState, useState } from "react";
import { NOTIFIABLE_STATUSES, ORDER_STATUSES } from "@/lib/order-status";
import type { OrderStatus } from "@/lib/types";
import { updateOrder, type UpdateOrderState } from "../actions";

export function OrderStatusForm({ id, status, adminNotes }: { id: string; status: OrderStatus; adminNotes: string }) {
  const [state, action, pending] = useActionState<UpdateOrderState, FormData>(updateOrder, null);
  const [next, setNext] = useState<OrderStatus>(status);
  const canNotify = next !== status && NOTIFIABLE_STATUSES.includes(next);

  return (
    <form action={action} className="adm-form">
      <input type="hidden" name="id" value={id} />
      <label className="adm-field">
        <span>Estado del pedido</span>
        <select className="adm-input" name="status" value={next} onChange={(e) => setNext(e.target.value as OrderStatus)}>
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      {canNotify && (
        <label className="adm-check">
          <input type="checkbox" name="notify" defaultChecked />
          <span>
            Avisar al cliente por email
            <small>Le enviamos que su pedido está «{ORDER_STATUSES.find((s) => s.value === next)?.customerLabel}».</small>
          </span>
        </label>
      )}
      <label className="adm-field">
        <span>Notas internas</span>
        <textarea className="adm-input" name="admin_notes" defaultValue={adminNotes} style={{ minHeight: 80 }} placeholder="Solo las ve la floristería" />
      </label>
      {state && <div className={`adm-alert${"ok" in state ? " adm-alert--ok" : ""}`}>{"ok" in state ? state.ok : state.error}</div>}
      <button className="adm-btn adm-btn--primary" type="submit" disabled={pending}>
        {pending ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
