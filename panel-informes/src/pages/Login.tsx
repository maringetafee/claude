import { useState, type FormEvent, type ReactNode } from "react";
import { api } from "../api.ts";
import { useApp } from "../store.tsx";
import { Alert } from "../components/ui.tsx";

function Shell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-700 text-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>
          </div>
          <span className="text-lg font-semibold">Panel de informes</span>
        </div>
        <div className="card p-6">
          <h1 className="text-lg font-semibold">{title}</h1>
          <p className="mb-5 mt-1 text-sm text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Login() {
  const { refresh } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("login", { body: { email, password } });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Shell title="Iniciar sesión" subtitle="Accede con el correo y la contraseña que te ha dado administración.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">Correo</label>
          <input id="email" type="email" autoComplete="username" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label className="label" htmlFor="pw">Contraseña</label>
          <input id="pw" type="password" autoComplete="current-password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <Alert kind="error">{error}</Alert>}
        <button className="btn btn-primary w-full" disabled={busy}>
          {busy ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </Shell>
  );
}

export function Setup() {
  const { refresh } = useApp();
  const [f, setF] = useState({ token: "", name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await api("setup", { body: f });
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <Shell title="Primera configuración" subtitle="Crea la cuenta de administración. Necesitas el código de instalación.">
      <form onSubmit={submit} className="space-y-4">
        <div><label className="label">Código de instalación</label><input className="input" value={f.token} onChange={set("token")} required /></div>
        <div><label className="label">Nombre</label><input className="input" value={f.name} onChange={set("name")} required /></div>
        <div><label className="label">Correo</label><input type="email" className="input" value={f.email} onChange={set("email")} required /></div>
        <div><label className="label">Contraseña (mín. 8)</label><input type="password" className="input" value={f.password} onChange={set("password")} required minLength={8} /></div>
        {error && <Alert kind="error">{error}</Alert>}
        <button className="btn btn-primary w-full">Crear y entrar</button>
      </form>
    </Shell>
  );
}
