"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zones } from "@/lib/config";

const categories = ["Piso", "Ático", "Villa", "Chalet", "Dúplex", "Loft"];
const roomOptions = [1, 2, 3, 4, 5];

const selectClass =
  "border-b border-line bg-transparent py-2 pr-6 font-sans text-[0.88rem] text-ink outline-none focus:border-ink";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const operacion = searchParams.get("operacion") ?? "";
  const zona = searchParams.get("zona") ?? "";
  const tipo = searchParams.get("tipo") ?? "";
  const habitaciones = searchParams.get("habitaciones") ?? "";
  const vista = searchParams.get("vista") ?? "";

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/propiedades?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-y border-line py-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
        <div className="flex gap-2">
          {[
            { label: "Todo", value: "" },
            { label: "Comprar", value: "venta" },
            { label: "Alquilar", value: "alquiler" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => update("operacion", opt.value)}
              className={`px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
                operacion === opt.value
                  ? "bg-ink text-paper"
                  : "text-stone hover:text-ink"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

      <select
        value={tipo}
        onChange={(e) => update("tipo", e.target.value)}
        className={selectClass}
      >
        <option value="">Tipo</option>
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={zona}
        onChange={(e) => update("zona", e.target.value)}
        className={selectClass}
      >
        <option value="">Ubicación</option>
        {zones.map((z) => (
          <option key={z.slug} value={z.name}>
            {z.name}
          </option>
        ))}
      </select>

      <select
        value={habitaciones}
        onChange={(e) => update("habitaciones", e.target.value)}
        className={selectClass}
      >
        <option value="">Habitaciones</option>
        {roomOptions.map((r) => (
          <option key={r} value={r}>
            {r}+
          </option>
        ))}
      </select>
      </div>

      <div className="flex gap-2">
        {[
          { label: "Lista", value: "" },
          { label: "Mapa", value: "mapa" },
        ].map((opt) => (
          <button
            key={opt.value}
            onClick={() => update("vista", opt.value)}
            className={`px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 ${
              vista === opt.value
                ? "bg-ink text-paper"
                : "text-stone hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
