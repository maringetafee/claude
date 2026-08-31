"use client";

import { useRouter, useSearchParams } from "next/navigation";

const selectClass =
  "border-b border-line bg-transparent py-2 pr-6 font-sans text-[0.88rem] text-ink outline-none focus:border-ink";

export function AdminPropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const operacion = searchParams.get("operacion") ?? "";
  const publicada = searchParams.get("publicada") ?? "";
  const destacada = searchParams.get("destacada") ?? "";
  const q = searchParams.get("q") ?? "";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/admin/propiedades?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-y border-line py-5">
      <div className="flex gap-2">
        {[
          { label: "Todo", value: "" },
          { label: "Venta", value: "venta" },
          { label: "Alquiler", value: "alquiler" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => update("operacion", opt.value)}
            className={`px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
              operacion === opt.value ? "bg-ink text-paper" : "text-stone hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <select value={publicada} onChange={(e) => update("publicada", e.target.value)} className={selectClass}>
        <option value="">Publicación</option>
        <option value="true">Publicadas</option>
        <option value="false">No publicadas</option>
      </select>

      <select value={destacada} onChange={(e) => update("destacada", e.target.value)} className={selectClass}>
        <option value="">Destacadas</option>
        <option value="true">Solo destacadas</option>
      </select>

      <input
        type="search"
        defaultValue={q}
        placeholder="Buscar por nombre o referencia…"
        onKeyDown={(e) => {
          if (e.key === "Enter") update("q", (e.target as HTMLInputElement).value);
        }}
        className="border-b border-line bg-transparent py-2 font-sans text-[0.88rem] text-ink outline-none placeholder:text-stone/70 focus:border-ink"
      />
    </div>
  );
}
