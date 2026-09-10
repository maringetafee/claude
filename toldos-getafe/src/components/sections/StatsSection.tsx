import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import Reveal from "@/components/ui/Reveal";

const stats = [
  {
    value: `+${siteConfig.stats.yearsExperience} años`,
    label: "Fabricando toldos y pérgolas en Madrid",
  },
  {
    value: `+${siteConfig.stats.factoryAreaM2.toLocaleString("es-ES")} m²`,
    label: "De fábrica y taller propios en Fuenlabrada",
  },
  {
    value: "100% a medida",
    label: "Cada proyecto se fabrica bajo pedido, sin stock",
  },
  {
    value: `${siteConfig.google.rating.toLocaleString("es-ES")} ★`,
    label: `Valoración media de ${siteConfig.google.reviewCount} reseñas en Google`,
  },
];

export default function StatsSection() {
  return (
    <section className="relative z-10 px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
      <div className="mx-auto max-w-[1400px] rounded-3xl border border-white/10 bg-ink/45 p-8 backdrop-blur-md sm:p-10 lg:p-14">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/60">
            Fábrica propia · Getafe y Madrid Sur
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl leading-[1.12] text-paper sm:text-3xl lg:text-4xl">
            Del diseño a la instalación, sin intermediarios.
          </h2>
        </Reveal>
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} as="div">
              <dt className="font-display text-3xl text-paper sm:text-4xl">
                {s.value}
              </dt>
              <dd className="mt-2 text-sm text-paper/70">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
        <Reveal delay={120}>
          <Link
            href="/zona-de-actuacion"
            className="mt-10 inline-flex w-fit items-center gap-3 border border-paper/40 px-6 py-3 text-sm font-medium text-paper transition-colors hover:border-accent-soft hover:text-accent-soft"
          >
            Ver zona de actuación
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
