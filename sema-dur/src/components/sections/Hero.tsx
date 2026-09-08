import { ButtonLink } from "@/components/ui/Button";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site-config";
import { philosophyQuote } from "@/data/company";

const trust = [
  { label: `Desde ${siteConfig.founded}`, icon: "shield" as const },
  { label: "Tecnología PCD desde 1994", icon: "sparkle" as const },
  { label: "Distribuidor oficial Freud y Ceratizit", icon: "check" as const },
  { label: "Fabricación y reafilado propios", icon: "wrench" as const },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-bg-invert)] text-[var(--color-ink-invert)]">
      <div className="container-page grid gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div className="flex flex-col gap-6">
          <span className="eyebrow text-[var(--color-accent)]">
            Tecnología de corte · Humanes de Madrid
          </span>
          <h1 className="font-display text-[2.5rem] font-bold leading-[1.03] sm:text-[3.4rem]">
            Herramientas de corte para{" "}
            <span className="text-[var(--color-accent)]">madera y metal</span>,
            diseñadas para tu trabajo
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-[var(--color-ink-invert-soft)]">
            Diseñamos, fabricamos y reafilamos herramienta a medida: portacuchillas,
            fresas, sierras PCD, portaherramientas de CNC y brocas de metal duro.
            Más de 45 años resolviendo cortes que el catálogo estándar no cubre.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/productos" size="lg">
              Ver catálogo
              <Icon name="arrow-right" size={18} />
            </ButtonLink>
            <ButtonLink href="/checkout" size="lg" variant="invert">
              Solicitar presupuesto
            </ButtonLink>
          </div>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2.5 text-sm text-[var(--color-ink-invert-soft)]">
            {trust.map((t) => (
              <li key={t.label} className="flex items-center gap-2">
                <Icon name={t.icon} size={15} className="text-[var(--color-accent)]" />
                {t.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-white/10 shadow-[var(--shadow-lg)]">
            <Picture
              image="catalogo/herramientas-corte"
              alt="Conjunto de portaherramientas, fresas y pinzas de corte fabricados por Sema-Dur"
              sizes="(max-width: 1024px) 92vw, 560px"
              priority
              aspectRatio="4 / 3"
            />
          </div>
          <figure className="absolute -bottom-6 -left-4 hidden max-w-xs rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-4 text-[var(--color-ink)] shadow-[var(--shadow-lg)] sm:block">
            <Icon name="quote" size={18} className="text-[var(--color-accent-strong)]" />
            <blockquote className="mt-2 text-sm italic leading-snug">
              “{philosophyQuote}”
            </blockquote>
            <figcaption className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Filosofía Sema-Dur
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
