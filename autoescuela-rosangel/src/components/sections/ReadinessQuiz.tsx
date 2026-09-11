"use client";

import { useState } from "react";

type Age = "menos16" | "16a17" | "18mas";
type TheoryState = "nada" | "algo" | "mucho";

const radioClasses =
  "peer sr-only";
const optionClasses =
  "cursor-pointer rounded-sm border border-ink/15 px-4 py-2.5 text-sm text-ink-soft transition-colors peer-checked:border-signal peer-checked:bg-signal-soft peer-checked:text-signal-dark peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-signal";

function RadioGroup<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: { value: T; label: string }[];
  value: T | null;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5" role="radiogroup">
      {options.map((opt) => (
        <label key={opt.value}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className={radioClasses}
          />
          <span className={optionClasses}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function buildResult(age: Age | null, theory: TheoryState | null) {
  if (!age || !theory) return null;

  if (age === "menos16") {
    return "Todavía eres un poco joven para matricularte (se necesitan 18 años para examinarte). Pero nunca es pronto para informarte: escríbenos y te contamos cómo funciona todo.";
  }

  if (age === "16a17") {
    if (theory === "nada") {
      return "Puedes matricularte ya y empezar a preparar la teórica, aunque no podrás examinarte hasta cumplir los 18. Así llegas con la teórica hecha.";
    }
    return "Con lo que ya sabes de teoría, puedes matricularte ahora e ir avanzando hasta que cumplas los 18 y puedas examinarte.";
  }

  if (theory === "nada") {
    return "Puedes empezar cuando quieras: te matriculamos y preparamos la teórica desde cero contigo.";
  }
  if (theory === "algo") {
    return "Buen punto de partida. Con lo que ya sabes, en pocas clases puedes estar listo/a para el examen teórico.";
  }
  return "Parece que ya dominas bastante la teoría — podrías estar cerca de presentarte al examen. Consúltanos y valoramos tu nivel.";
}

export default function ReadinessQuiz() {
  const [age, setAge] = useState<Age | null>(null);
  const [theory, setTheory] = useState<TheoryState | null>(null);

  const result = buildResult(age, theory);

  return (
    <div>
      <div className="space-y-6">
        <div>
          <p className="mb-2.5 text-sm font-medium text-ink">¿Cuántos años tienes?</p>
          <RadioGroup
            name="edad"
            value={age}
            onChange={setAge}
            options={[
              { value: "menos16", label: "Menos de 16" },
              { value: "16a17", label: "16–17" },
              { value: "18mas", label: "18 o más" },
            ]}
          />
        </div>

        <div>
          <p className="mb-2.5 text-sm font-medium text-ink">¿Cuánta teoría llevas preparada?</p>
          <RadioGroup
            name="teoria"
            value={theory}
            onChange={setTheory}
            options={[
              { value: "nada", label: "Nada todavía" },
              { value: "algo", label: "Algo, por mi cuenta" },
              { value: "mucho", label: "Bastante" },
            ]}
          />
        </div>
      </div>

      <div
        className={`mt-6 rounded-sm border p-5 text-sm transition-colors ${
          result ? "border-signal/30 bg-signal-soft text-signal-dark" : "border-line bg-paper-soft text-stone"
        }`}
      >
        {result ?? "Responde a las dos preguntas para ver una orientación."}
      </div>
      <p className="mt-3 text-xs text-stone">
        Orientación general, no un diagnóstico oficial ni una promesa de plazos.
      </p>
    </div>
  );
}
