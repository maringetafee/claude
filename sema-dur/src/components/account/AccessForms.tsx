"use client";

import { useState } from "react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function AccessForms() {
  const [tab, setTab] = useState<"login" | "registro">("login");

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-6">
      <div
        role="tablist"
        aria-label="Acceso"
        className="mb-6 grid grid-cols-2 gap-1 rounded-[var(--radius-sm)] bg-[var(--color-bg-soft)] p-1"
      >
        {(["login", "registro"] as const).map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`rounded-[var(--radius-xs)] py-2 text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-white text-[var(--color-ink)] shadow-[var(--shadow-sm)]" : "text-[var(--color-ink-muted)]"
            }`}
          >
            {t === "login" ? "Iniciar sesión" : "Crear cuenta"}
          </button>
        ))}
      </div>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => e.preventDefault()}
        aria-describedby="access-note"
      >
        {tab === "registro" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre" name="nombre" autoComplete="given-name" />
            <Input label="Empresa" name="empresa" autoComplete="organization" />
          </div>
        ) : null}
        <Input
          label="Email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete={tab === "login" ? "username" : "email"}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          autoComplete={tab === "login" ? "current-password" : "new-password"}
        />
        <Button type="submit" size="lg" disabled aria-disabled>
          {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </Button>
        <p
          id="access-note"
          className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--color-brand-tint)] px-3 py-2.5 text-[0.8rem] text-[var(--color-brand-strong)]"
        >
          <Icon name="clock" size={15} className="mt-0.5 shrink-0" />
          El acceso con cuenta se activará en una fase posterior. Mientras tanto,
          puedes solicitar presupuestos como invitado y consultarlos en{" "}
          <strong>Mis solicitudes</strong>.
        </p>
      </form>
    </div>
  );
}
