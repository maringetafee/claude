"use client";

import { useState } from "react";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";
import ChecklistTool from "./ChecklistTool";
import ReadinessQuiz from "./ReadinessQuiz";

const TABS = [
  { id: "checklist", label: "Checklist del carnet" },
  { id: "quiz", label: "¿Estás preparado/a?" },
] as const;

export default function ToolsSection() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("checklist");

  return (
    <section className="border-b border-line bg-paper-soft py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-xl">
          <Eyebrow tone="amber">Herramientas</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
            Para que sepas por dónde vas
          </h2>
        </Reveal>

        <Reveal delay={100} className="mt-10 rounded-sm border border-line bg-paper p-6 sm:p-10">
          <div role="tablist" className="mb-8 flex gap-1 border-b border-line">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`border-b-2 px-1 pb-3 pr-5 text-sm font-medium transition-colors ${
                  tab === t.id
                    ? "border-signal text-ink"
                    : "border-transparent text-stone hover:text-ink-soft"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "checklist" ? <ChecklistTool /> : <ReadinessQuiz />}
        </Reveal>
      </Container>
    </section>
  );
}
