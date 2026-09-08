"use client";

import { useEffect, useState } from "react";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const KEY = "semadur.profile.v1";
const FIELDS = [
  { name: "nombre", label: "Nombre y apellidos", autoComplete: "name" },
  { name: "empresa", label: "Empresa", autoComplete: "organization" },
  { name: "nif", label: "NIF / CIF", autoComplete: "off" },
  { name: "email", label: "Email", autoComplete: "email", type: "email" },
  { name: "telefono", label: "Teléfono", autoComplete: "tel", type: "tel" },
] as const;

export default function LocalProfileForm() {
  const [data, setData] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setData(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  if (!ready) return <p className="text-[var(--color-ink-muted)]">Cargando…</p>;

  return (
    <form
      className="flex max-w-xl flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          localStorage.setItem(KEY, JSON.stringify(data));
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch {
          /* ignore */
        }
      }}
    >
      <p className="text-sm text-[var(--color-ink-soft)]">
        Estos datos se guardan en tu navegador y se usan para rellenar más rápido
        el formulario de solicitud de presupuesto.
      </p>
      {FIELDS.map((f) => (
        <Input
          key={f.name}
          label={f.label}
          name={f.name}
          type={"type" in f ? f.type : "text"}
          autoComplete={f.autoComplete}
          value={data[f.name] ?? ""}
          onChange={(e) => setData((d) => ({ ...d, [f.name]: e.target.value }))}
        />
      ))}
      <Textarea
        label="Notas para tus pedidos"
        name="notas"
        value={data.notas ?? ""}
        onChange={(e) => setData((d) => ({ ...d, notas: e.target.value }))}
      />
      <div className="flex items-center gap-3">
        <Button type="submit" size="lg">
          Guardar datos
        </Button>
        {saved ? (
          <span className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-success)]">
            <Icon name="check" size={16} /> Guardado
          </span>
        ) : null}
      </div>
    </form>
  );
}
