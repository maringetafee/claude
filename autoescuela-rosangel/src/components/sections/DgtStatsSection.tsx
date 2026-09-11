import { dgtStats } from "@/data/dgt-stats";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

function Gauge({ value, label, tone }: { value: number; label: string; tone: "signal" | "amber" }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (value / 100) * circumference;
  const color = tone === "signal" ? "var(--color-signal)" : "var(--color-amber)";

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32 sm:h-36 sm:w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="54" fill="none" stroke="var(--color-line)" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-bold">{value}%</span>
        </div>
      </div>
      <p className="mt-3 text-center text-sm font-medium text-ink-soft">{label}</p>
    </div>
  );
}

export default function DgtStatsSection() {
  return (
    <section className="border-b border-line bg-paper-soft py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <Eyebrow>Datos oficiales</Eyebrow>
          <h2 className="mt-4 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
            Transparencia total: nuestros datos de la DGT
          </h2>
          <p className="mt-4 text-ink-soft">
            No presumimos de porcentajes inventados. Estos son los datos
            oficiales publicados por la DGT para nuestro código de centro (
            {dgtStats.schoolCode}), correspondientes al periodo{" "}
            {dgtStats.period}, con examen en el centro de {dgtStats.examCenter}.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 grid gap-10 rounded-sm border border-line bg-paper p-8 sm:grid-cols-3 sm:p-10">
            <Gauge value={dgtStats.practical.passRate} label="Aptos examen práctico" tone="signal" />
            <Gauge value={dgtStats.theory.passRate} label="Aptos examen teórico" tone="amber" />
            <Gauge
              value={dgtStats.practical.centerAveragePassRate}
              label={`Media del centro de ${dgtStats.examCenter}`}
              tone="signal"
            />
          </div>
        </Reveal>

        <Reveal delay={150}>
          <p className="mt-6 max-w-2xl text-xs leading-relaxed text-stone">
            Fuente: {dgtStats.source}. Última actualización de los datos: {dgtStats.sourceUpdatedAt}.{" "}
            {dgtStats.note} Sobre {dgtStats.practical.total} exámenes prácticos y{" "}
            {dgtStats.theory.total} exámenes teóricos realizados en el periodo.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
