"use client";

import { useState, useTransition } from "react";
import type { LegalData } from "@/lib/settings-shared";
import { saveGeneralSettings } from "./actions";

const LEGAL_FIELDS: { key: keyof LegalData; label: string; hint?: string }[] = [
  { key: "razonSocial", label: "Razón social o nombre del titular" },
  { key: "nif", label: "NIF / CIF" },
  { key: "domicilio", label: "Domicilio fiscal" },
  { key: "email", label: "Email de contacto" },
  { key: "telefono", label: "Teléfono" },
  { key: "registro", label: "Datos registrales", hint: "Solo si es una sociedad (Registro Mercantil, tomo, folio…)." },
];

export function SettingsForm({ initial }: { initial: { notifyEmail: string; legal: LegalData } }) {
  const [notifyEmail, setNotifyEmail] = useState(initial.notifyEmail);
  const [legal, setLegal] = useState<LegalData>(initial.legal);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        startTransition(async () => {
          const res = await saveGeneralSettings({ notifyEmail, legal });
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
