import type { Metadata } from "next";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import FinalCTA from "@/components/sections/FinalCTA";
import {
  milestones,
  values,
  figures,
  philosophyQuote,
  companyIntro,
} from "@/data/company";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "La empresa",
  description:
    "Talleres Sema-Dur, fabricante de herramientas de corte para madera y metal desde 1976 en Humanes de Madrid. Pioneros en diamante policristalino (PCD) y reafilado desde 1994.",
  path: "/empresa/",
  image: "empresa/taller",
});

export default function EmpresaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "La empresa", path: "/empresa/" },
        ])}
      />
      <PageHero
        eyebrow="La empresa"
        title="Desde 1976 diseñando y fabricando herramienta de corte"
        lead={companyIntro}
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "La empresa" }]}
      />

      <Section space="md">
        <Container className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)]">
            <Picture
              image="empresa/taller"
              alt="Nave de producción de Talleres Sema-Dur"
              sizes="(max-width: 1024px) 92vw, 560px"
              aspectRatio="5 / 4"
            />
          </div>
          <figure className="flex flex-col gap-4">
            <Icon name="quote" size={28} className="text-[var(--color-accent-strong)]" />
            <blockquote className="font-display text-2xl font-semibold leading-snug text-[var(--color-ink)]">
              “{philosophyQuote}”
            </blockquote>
            <figcaption className="text-sm font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
              Nuestra filosofía
            </figcaption>
          </figure>
        </Container>
      </Section>

      <Section space="md" tone="soft">
        <Container>
          <SectionHeading eyebrow="Trayectoria" title="Los hitos que nos definen" />
          <ol className="mt-10 grid gap-6 sm:grid-cols-3">
            {milestones.map((m) => (
              <li
                key={m.year}
                className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-6"
              >
                <span className="font-display text-2xl font-bold text-[var(--color-brand)]">
                  {m.year}
                </span>
                <h3 className="text-base font-semibold">{m.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {m.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section space="md">
        <Container>
          <SectionHeading eyebrow="Cómo trabajamos" title="Lo que puedes esperar" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="leading-relaxed text-[var(--color-ink-soft)]">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section space="md" tone="steel">
        <Container className="grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <Picture
              image="empresa/equipo-freud"
              alt="Equipo de Sema-Dur en una feria del sector junto a Freud"
              sizes="(max-width: 1024px) 92vw, 520px"
              aspectRatio="4 / 3"
            />
          </div>
          <div className="flex flex-col gap-5">
            <SectionHeading
              eyebrow="Presencia"
              title="De Humanes de Madrid a cuatro países"
              lead="Además de toda España, nuestras herramientas se distribuyen habitualmente en Portugal, Colombia, Venezuela y Guinea."
            />
            <dl className="grid grid-cols-2 gap-5">
              {figures.map((f) => (
                <div key={f.label} className="flex flex-col">
                  <dd className="font-display text-3xl font-bold text-[var(--color-brand)]">
                    {f.value}
                  </dd>
                  <dt className="text-sm text-[var(--color-ink-soft)]">{f.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </Section>

      <FinalCTA
        title="Trabajemos juntos"
        lead="Cuéntanos qué necesitas cortar y en qué máquina. Te proponemos la herramienta y el plazo."
      />
    </>
  );
}
