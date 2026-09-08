"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

const KEY = "semadur.addresses.v1";

type Address = {
  id: string;
  alias: string;
  direccion: string;
  cp: string;
  ciudad: string;
  provincia: string;
};

const empty = (): Address => ({
  id: crypto.randomUUID(),
  alias: "",
  direccion: "",
  cp: "",
  ciudad: "",
  provincia: "",
});

export default function LocalAddressBook() {
  const [list, setList] = useState<Address[] | null>(null);
  const [draft, setDraft] = useState<Address>(empty);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setList(raw ? JSON.parse(raw) : []);
    } catch {
      setList([]);
    }
  }, []);

  const persist = (next: Address[]) => {
    setList(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  if (list === null) return <p className="text-[var(--color-ink-muted)]">Cargando…</p>;

  return (
    <div className="flex flex-col gap-8">
      {list.length ? (
        <ul className="grid gap-4 sm:grid-cols-2">
          {list.map((a) => (
            <li
              key={a.id}
              className="flex flex-col gap-1 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-4"
            >
              <span className="font-semibold">{a.alias || "Dirección"}</span>
              <span className="text-sm text-[var(--color-ink-soft)]">
                {a.direccion}
                <br />
                {a.cp} {a.ciudad} {a.provincia ? `(${a.provincia})` : ""}
              </span>
              <button
                type="button"
                onClick={() => persist(list.filter((x) => x.id !== a.id))}
                className="mt-2 self-start text-xs font-medium text-[var(--color-ink-muted)] underline hover:text-[var(--color-danger)]"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-[var(--color-ink-soft)]">
          Aún no has guardado ninguna dirección.
        </p>
      )}

      <form
        className="flex max-w-xl flex-col gap-4 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.direccion.trim()) return;
          persist([...list, draft]);
          setDraft(empty());
        }}
      >
        <h2 className="font-semibold">Añadir dirección</h2>
        <Input
          label="Alias"
          name="alias"
          hint="Ej.: Taller, Almacén…"
          value={draft.alias}
          onChange={(e) => setDraft((d) => ({ ...d, alias: e.target.value }))}
        />
        <Input
          label="Dirección"
          name="direccion"
          required
          autoComplete="street-address"
          value={draft.direccion}
          onChange={(e) => setDraft((d) => ({ ...d, direccion: e.target.value }))}
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="C. P."
            name="cp"
            inputMode="numeric"
            value={draft.cp}
            onChange={(e) => setDraft((d) => ({ ...d, cp: e.target.value }))}
          />
          <Input
            label="Ciudad"
            name="ciudad"
            value={draft.ciudad}
            onChange={(e) => setDraft((d) => ({ ...d, ciudad: e.target.value }))}
          />
          <Input
            label="Provincia"
            name="provincia"
            value={draft.provincia}
            onChange={(e) => setDraft((d) => ({ ...d, provincia: e.target.value }))}
          />
        </div>
        <Button type="submit" className="self-start">
          <Icon name="plus" size={16} /> Guardar dirección
        </Button>
      </form>
    </div>
  );
}
