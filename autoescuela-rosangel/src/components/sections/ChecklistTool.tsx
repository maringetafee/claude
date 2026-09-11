"use client";

import { useEffect, useState } from "react";
import { CheckIcon } from "@/components/icons";

const STEPS = [
  "Elegir permiso (B o A2)",
  "Matricularme en Rosangel",
  "Preparar la teórica",
  "Aprobar el examen teórico",
  "Empezar las prácticas",
  "Preparar el examen práctico",
  "Aprobar el examen práctico",
  "Carnet conseguido",
];

const STORAGE_KEY = "rosangel_checklist";

export default function ChecklistTool() {
  const [checked, setChecked] = useState<boolean[]>(() => STEPS.map(() => false));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Lectura única de localStorage (sistema externo) al montar: no hay
    // forma de leerlo durante el render sin arriesgar un mismatch de
    // hidratación frente al HTML estático generado en build.
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      // localStorage no disponible: la checklist simplemente no persiste
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      // ignorar si no se puede persistir
    }
  }, [checked, loaded]);

  const done = checked.filter(Boolean).length;
  const progress = Math.round((done / STEPS.length) * 100);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between text-sm">
        <span className="font-medium text-ink">Tu progreso</span>
        <span className="text-ink-soft">{done}/{STEPS.length}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-signal transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ul className="mt-6 divide-y divide-line">
        {STEPS.map((step, i) => (
          <li key={step}>
            <label className="flex cursor-pointer items-center gap-3 py-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                  checked[i] ? "border-signal bg-signal text-paper" : "border-ink/25"
                }`}
              >
                {checked[i] && <CheckIcon className="h-3.5 w-3.5" />}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={checked[i]}
                onChange={() =>
                  setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                }
              />
              <span className={checked[i] ? "text-ink-soft line-through" : "text-ink"}>
                {step}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-stone">
        Se guarda solo en este navegador, para que puedas volver más adelante.
      </p>
    </div>
  );
}
