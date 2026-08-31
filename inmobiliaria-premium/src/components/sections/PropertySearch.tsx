"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useInView } from "framer-motion";
import { zones } from "@/lib/config";

const categories = ["Piso", "Ático", "Villa / Chalet", "Dúplex", "Loft"];
const priceOptions = [
  200000, 400000, 600000, 800000, 1000000, 1500000, 2000000, 3000000,
];
const roomOptions = [1, 2, 3, 4, 5];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-2 px-6 py-5 lg:py-0">
      <span className="text-[0.66rem] font-medium uppercase tracking-[0.18em] text-stone">
        {label}
      </span>
      {children}
    </label>
  );
}

const selectClass =
  "w-full min-w-0 appearance-none overflow-hidden truncate bg-transparent font-serif text-[1.05rem] text-ink outline-none";

export function PropertySearch() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const inView = useInView(formRef, { once: true, margin: "-15% 0px -15% 0px" });
  const [operacion, setOperacion] = useState<"venta" | "alquiler">("venta");
  const [tipo, setTipo] = useState("");
  const [zona, setZona] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMax, setPrecioMax] = useState("");
  const [habitaciones, setHabitaciones] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("operacion", operacion);
    if (tipo) params.set("tipo", tipo);
    if (zona) params.set("zona", zona);
    if (precioMin) params.set("min", precioMin);
    if (precioMax) params.set("max", precioMax);
    if (habitaciones) params.set("habitaciones", habitaciones);
    router.push(`/propiedades?${params.toString()}`);
  }

  return (
    <div className="relative z-20 px-4 md:px-[var(--section-x)]">
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(32px)",
          transitionProperty: "opacity, transform",
          transitionDuration: "0.9s",
          transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="mx-auto -mt-14 max-w-6xl border border-line bg-surface shadow-[0_30px_60px_-24px_rgba(23,20,15,0.18)] md:-mt-16"
      >
        <div className="flex border-b border-line">
          {(["venta", "alquiler"] as const).map((op) => (
            <button
              key={op}
              type="button"
              onClick={() => setOperacion(op)}
              className={`px-7 py-4 text-[0.72rem] font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                operacion === op
                  ? "bg-ink text-paper"
                  : "text-stone hover:text-ink"
              }`}
            >
              {op === "venta" ? "Comprar" : "Alquilar"}
            </button>
          ))}
        </div>

        <div className="flex flex-col divide-y divide-line lg:flex-row lg:divide-x lg:divide-y-0">
          <Field label="Tipo">
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={selectClass}
            >
              <option value="">Cualquiera</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Ubicación">
            <select
              value={zona}
              onChange={(e) => setZona(e.target.value)}
              className={selectClass}
            >
              <option value="">Todo Madrid Sur</option>
              {zones.map((z) => (
                <option key={z.slug} value={z.name}>
                  {z.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Precio mín.">
            <select
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
              className={selectClass}
            >
              <option value="">Sin mínimo</option>
              {priceOptions.map((p) => (
                <option key={p} value={p}>
                  {new Intl.NumberFormat("es-ES").format(p)} €
                </option>
              ))}
            </select>
          </Field>

          <Field label="Precio máx.">
            <select
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              className={selectClass}
            >
              <option value="">Sin máximo</option>
              {priceOptions.map((p) => (
                <option key={p} value={p}>
                  {new Intl.NumberFormat("es-ES").format(p)} €
                </option>
              ))}
            </select>
          </Field>

          <Field label="Habitaciones">
            <select
              value={habitaciones}
              onChange={(e) => setHabitaciones(e.target.value)}
              className={selectClass}
            >
              <option value="">Cualquiera</option>
              {roomOptions.map((r) => (
                <option key={r} value={r}>
                  {r}+
                </option>
              ))}
            </select>
          </Field>

          <div className="flex items-stretch">
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-3 bg-accent px-8 py-5 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-accent-ink transition-colors duration-300 hover:bg-ink lg:w-auto lg:whitespace-nowrap"
            >
              Buscar propiedades
              <svg
                width="16"
                height="10"
                viewBox="0 0 16 10"
                fill="none"
                className="shrink-0 transition-transform duration-400 ease-out group-hover:translate-x-1"
              >
                <path
                  d="M0.5 5H15.5M15.5 5L11 0.5M15.5 5L11 9.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
