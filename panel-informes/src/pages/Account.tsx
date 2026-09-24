import { useState, type FormEvent } from "react";
import { api } from "../api.ts";
import { useBoot } from "../store.tsx";
import { Alert, PageHeader, Section } from "../components/ui.tsx";

export function Account() {
  const boot = useBoot();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api("password", { body: { current, next } });
      setMsg({ kind: "ok", text: "Contraseña cambiada." });
      setCurrent("");
      setNext("");
    } catch (err) {
      setMsg({ kind: "error", text: (err as Error).message });
    }
  };
  return (
    <div className="max-w-lg space-y-6">
      <PageHeader title="Mi cuenta" subtitle={boot.user!.email} />
      <Section title="Cambiar contraseña">
        <form onSubmit={submit} className="space-y-3">
          <div><label className="label">Contraseña actual</label><input type="password" autoComplete="current-password" className="input" value={current} onChange={(e) => setCurrent(e.target.value)} required /></div>
          <div><label className="label">Nueva contraseña (mín. 8)</label><input type="password" autoComplete="new-password" className="input" value={next} onChange={(e) => setNext(e.target.value)} required minLength={8} /></div>
          {msg && <Alert kind={msg.kind}>{msg.text}</Alert>}
          <button className="btn btn-primary">Guardar</button>
        </form>
      </Section>
    </div>
  );
}
