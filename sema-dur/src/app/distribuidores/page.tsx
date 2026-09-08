import type { Metadata } from "next";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Icon from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import FinalCTA from "@/components/sections/FinalCTA";
import { suppliers } from "@/data/company";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Distribuidores oficiales",
  description:
    "Sema-Dur es distribuidor oficial de Freud y Ceratizit, referentes en herramienta de corte y metal duro. Descubre qué aporta cada marca.",
  path: "/distribuidores/",
});

export default function DistribuidoresPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Distribuidores", path: "/distribuidores/" },
        ])}
      />
      <PageHero
        eyebrow="Distribuidores oficiales"
        title="Freud y Ceratizit, detrás de nuestra tecnología"
        lead="Siempre hemos sido pioneros en nuestro sector, y en buena parte gracias a una inversión tecnológica constante de la mano de nuestros dos proveedores de referencia."
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Distribuidores" }]}
      />

      <Section space="md">
        <Container className="flex flex-col gap-8">
          {suppliers.map((s) => (
            <article
              key={s.name}
              className="grid gap-6 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-6 sm:grid-cols-[200px_1fr] sm:items-center sm:p-8"
            >
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center"
                aria-label={s.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- supplier logo, tiny, no optimisation needed */}
                <img
                  src={`/images/${s.logo}-600.webp`}
                  alt={s.name}
                  width={1063}
                  height={354}
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-auto"
                />
              </a>
              <div className="flex flex-col gap-3">
                <p className="leading-relaxed text-[var(--color-ink-soft)]">
                  {s.body}
                </p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)]"
                >
                  Visitar la web de {s.name}
                  <Icon name="arrow-up-right" size={15} />
                </a>
              </div>
            </article>
          ))}
        </Container>
      </Section>

      <Section space="md" tone="soft">
        <Container className="flex flex-col items-start gap-5">
          <SectionHeading
            eyebrow="Nuestro papel"
            title="Distribución con criterio técnico"
            lead="No solo distribuimos: seleccionamos, adaptamos y reafilamos. Cuando el producto de catálogo no encaja, fabricamos la herramienta que sí lo hace."
          />
          <ButtonLink href="/productos">Ver el catálogo</ButtonLink>
        </Container>
      </Section>

      <FinalCTA />
    </>
  );
}
