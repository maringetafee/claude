"use client";

import { useState, useTransition } from "react";
import { formatDateLong, type DeliveryRules, type DeliverySlot } from "@/lib/delivery";
import { saveDeliveryRules } from "./actions";

const WEEKDAYS = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

type SlotDraft = DeliverySlot & { key: string };

export function DeliveryRulesEditor({ initial }: { initial: DeliveryRules }) {
  const [minDays, setMinDays] = useState(String(initial.minDaysAhead));
  const [maxDays, setMaxDays] = useState(String(initial.maxDaysAhead));
  const [closedWeekdays, setClosedWeekdays] = useState<number[]>(initial.closedWeekdays);
  const [closedDates, setClosedDates] = useState<string[]>(initial.closedDates);
  const [newDate, setNewDate] = useState("");
  const [slots, setSlots] = useState<SlotDraft[]>(() => initial.slots.map((s) => ({ ...s, key: s.id })));
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const updateSlot = (key: string, patch: Partial<SlotDraft>) => setSlots((ss) => ss.map((s) => (s.key === key ? { ...s, ...patch } : s)));

  function save() {
    setMsg(null);
    startTransition(async () => {
      const res = await saveDeliveryRules({
        minDaysAhead: Number.parseInt(minDays, 10) || 0,
        maxDaysAhead: Number.parseInt(maxDays, 10) || 30,
        closedWeekdays,
        closedDates: [...closedDates].sort(),
        slots: slots.map(({ id, label, sameDayUntil }) => ({ id, label, sameDayUntil: sameDayUntil || null })),
      });
      setMsg(res.ok ? { ok: true, text: "Guardado. El checkout ya usa estas reglas." } : { ok: false, text: res.error });
    });
  }

  return (
    <form
      className="adm-card"
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <h2>
        Días y franjas de entrega <small>También se aplican a la recogida en tienda</small>
      </h2>
      <div className="adm-form">
        <div className="adm-grid-2">
          <label className="adm-field">
            <span>Antelación mínima (días)</span>
            <input className="adm-input" inputMode="numeric" value={minDays} onChange={(e) => setMinDays(e.target.value.replace(/\D/g, ""))} />
            <span className="adm-hint">0 = se puede pedir para hoy (según la hora límite de cada franja).</span>
          </label>
          <label className="adm-field">
            <span>Hasta cuántos días vista se puede pedir</span>
            <input className="adm-input" inputMode="numeric" value={maxDays} onChange={(e) => setMaxDays(e.target.value.replace(/\D/g, ""))} />
          </label>
        </div>

        <fieldset className="adm-field" style={{ border: 0, padding: 0, margin: 0 }}>
          <span>Días sin reparto</span>
          <div className="adm-row">
            {WEEKDAYS.map((w) => (
              <label key={w.value} className="adm-check">
                <input
                  type="checkbox"
                  checked={closedWeekdays.includes(w.value)}
                  onChange={(e) => setClosedWeekdays((ws) => (e.target.checked ? [...ws, w.value] : ws.filter((x) => x !== w.value)))}
                />
                <span>{w.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="adm-field">
          <span>Festivos y días cerrados</span>
          <div className="adm-row">
            {closedDates.sort().map((d) => (
              <span key={d} className="adm-badge" style={{ gap: 6 }}>
                {formatDateLong(d)}
                <button type="button" aria-label={`Quitar ${d}`} onClick={() => setClosedDates((ds) => ds.filter((x) => x !== d))} style={{ border: 0, background: "none", cursor: "pointer", padding: 0 }}>
                  ✕
                </button>
              </span>
            ))}
            {!closedDates.length && <span className="adm-hint">Ninguno.</span>}
          </div>
          <div className="adm-row">
            <input className="adm-input" type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ maxWidth: 200 }} />
            <button
              type="button"
              className="adm-btn adm-btn--sm"
              disabled={!newDate}
              onClick={() => {
                if (newDate && !closedDates.includes(newDate)) setClosedDates((ds) => [...ds, newDate]);
                setNewDate("");
              }}
            >
              Añadir día cerrado
            </button>
          </div>
        </div>

        <div className="adm-field">
          <span>Franjas horarias</span>
          <div className="adm-repeat">
            {slots.map((s) => (
              <div key={s.key} className="adm-repeat__row" style={{ gridTemplateColumns: "1fr 170px auto" }}>
                <label className="adm-field">
                  <span className="adm-hint">Texto que ve el cliente</span>
                  <input className="adm-input" required value={s.label} onChange={(e) => updateSlot(s.key, { label: e.target.value })} placeholder="Mañana · 10:00 – 14:00" />
                </label>
                <label className="adm-field">
                  <span className="adm-hint">Pedir hoy hasta las…</span>
                  <input className="adm-input" type="time" value={s.sameDayUntil ?? ""} onChange={(e) => updateSlot(s.key, { sameDayUntil: e.target.value || null })} />
                </label>
                <button type="button" className="adm-btn adm-btn--danger" aria-label="Quitar franja" disabled={slots.length <= 1} onClick={() => setSlots((ss) => ss.filter((x) => x.key !== s.key))}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <span className="adm-hint">Si dejas vacía la hora, esa franja no se puede pedir para el mismo día.</span>
          <button
            type="button"
            className="adm-btn adm-btn--sm"
            style={{ width: "fit-content" }}
            onClick={() => {
              const id = crypto.randomUUID().slice(0, 8);
              setSlots((ss) => [...ss, { key: id, id, label: "", sameDayUntil: null }]);
            }}
          >
            + Añadir franja
          </button>
        </div>

        <div className="adm-row adm-row--end">
          {msg && <span className={`adm-alert${msg.ok ? " adm-alert--ok" : ""}`}>{msg.text}</span>}
          <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
            {pending ? "Guardando…" : "Guardar días y franjas"}
          </button>
        </div>
      </div>
    </form>
  );
}
