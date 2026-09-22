"use client";

import { useState, useTransition } from "react";
import type { LegalData, StoreSettings } from "@/lib/settings-shared";
import { saveGeneralSettings } from "./actions";

const LEGAL_FIELDS: { key: keyof LegalData; label: string; hint?: string }[] = [
  { key: "razonSocial", label: "Razón social o nombre del titular" },
  { key: "nif", label: "NIF / CIF" },
  { key: "domicilio", label: "Domicilio fiscal" },
  { key: "email", label: "Email de contacto" },
  { key: "telefono", label: "Teléfono" },
  { key: "registro", label: "Datos registrales", hint: "Solo si es una sociedad (Registro Mercantil, tomo, folio…)." },
];

export type PaymentStatus = {
  mode: "public-test" | "test" | "live" | "missing";
  merchant: string | null;
  terminal: string | null;
};

const MODE_COPY: Record<PaymentStatus["mode"], { badge: string; tone: string; text: string }> = {
  "public-test": {
    badge: "Modo pruebas",
    tone: "adm-alert--info",
    text: "Todavía no están los datos del TPV del banco: la tienda usa el comercio de pruebas de Redsys. Se puede comprar de principio a fin, pero no se cobra nada.",
  },
  test: { badge: "Pruebas con vuestro TPV", tone: "adm-alert--info", text: "Vuestro comercio está conectado al entorno de pruebas de Redsys: todavía no se cobra de verdad." },
  live: { badge: "Cobrando de verdad", tone: "adm-alert--ok", text: "Pasarela en real: los pagos se cobran en vuestra cuenta." },
  missing: { badge: "Sin configurar", tone: "", text: "Está en modo real pero faltan las claves del TPV: los clientes no pueden pagar." },
};

export function SettingsForm({ initial, payment }: { initial: Pick<StoreSettings, "notifyEmail" | "legal" | "payments">; payment: PaymentStatus }) {
  const [notifyEmail, setNotifyEmail] = useState(initial.notifyEmail);
  const [legal, setLegal] = useState<LegalData>(initial.legal);
  const [bizum, setBizum] = useState(initial.payments.bizum);
  const mode = MODE_COPY[payment.mode];
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        startTransition(async () => {
          const res = await saveGeneralSettings({ notifyEmail, legal, payments: { bizum } });
          setMsg(res.ok ? { ok: true, text: "Ajustes guardados." } : { ok: false, text: res.error });
        });
      }}
    >
      <section className="adm-card">
        <h2>Avisos de pedidos</h2>
        <label className="adm-field">
          <span>Email donde recibís cada pedido nuevo</span>
          <input className="adm-input" type="email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} placeholder="pedidos@floristeria.es" style={{ maxWidth: 420 }} />
          <span className="adm-hint">Os llega un email con todos los datos del pedido en cuanto se paga.</span>
        </label>
      </section>
      <section className="adm-card">
        <h2>
          Pago con tarjeta (Redsys) <span className="adm-badge">{mode.badge}</span>
        </h2>
        <div className={`adm-alert ${mode.tone}`} style={{ marginBottom: 14 }}>
          {mode.text}
          {payment.merchant && (
            <>
              {" "}
              Comercio {payment.merchant} · terminal {payment.terminal}.
            </>
          )}
        </div>
        <label className="adm-check">
          <input type="checkbox" checked={bizum} onChange={(e) => setBizum(e.target.checked)} />
          <span>
            Ofrecer también Bizum
            <small>Márcalo solo cuando el banco os haya activado Bizum en el TPV; si no, el pago daría error.</small>
          </span>
        </label>
      </section>
      <section className="adm-card">
        <h2>Datos legales</h2>
        <div className="adm-grid-2">
          {LEGAL_FIELDS.map((f) => (
            <label key={f.key} className="adm-field">
              <span>{f.label}</span>
              <input className="adm-input" value={legal[f.key]} onChange={(e) => setLegal({ ...legal, [f.key]: e.target.value })} />
              {f.hint && <span className="adm-hint">{f.hint}</span>}
            </label>
          ))}
        </div>
      </section>
      <div className="adm-savebar">
        {msg && <span className={`adm-alert${msg.ok ? " adm-alert--ok" : ""}`}>{msg.text}</span>}
        <button type="submit" className="adm-btn adm-btn--primary" disabled={pending} style={{ minHeight: 46 }}>
          {pending ? "Guardando…" : "Guardar ajustes"}
        </button>
      </div>
    </form>
  );
}
