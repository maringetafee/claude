import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import FinalCTA from "@/components/sections/FinalCTA";
import { services, servicesBySlug } from "@/data/services";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export function generateStaticParams() {
  return services.map((s) => ({ servicio: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ servicio: string }>;
}): Promise<Metadata> {
  const { servicio } = await params;
  const service = servicesBySlug[servicio];
  if (!service) return {};
  return pageMetadata({
    title: service.name,
    description: service.intro.slice(0, 155),
    path: `/servicios/${service.slug}/`,
    image: service.image,
  });
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ servicio: string }>;
}) {
  const { servicio } = await params;
  const service = servicesBySlug[servicio];
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios/" },
          { name: service.name, path: `/servicios/${service.slug}/` },
        ])}
      />
      <PageHero
        eyebrow="Servicio"
        title={service.name}
        lead={service.claim}
        breadcrumbs={[
          { name: "Inicio", href: "/" },
          { name: "Servicios", href: "/servicios" },
          { name: service.name },
        ]}
      />

      <Section space="md">
        <Container className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <p className="text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {service.intro}
          </p>
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)]">
            <Picture
              image={service.image}
              alt=""
              sizes="(max-width: 1024px) 92vw, 440px"
              aspectRatio="4 / 3"
            />
          </div>
        </Container>
      </Section>

      <Section space="md" tone="soft">
        <Container>
          <SectionHeading eyebrow="Cómo funciona" title="El proceso, paso a paso" />
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {service.steps.map((step, i) => (
              <li
                key={step.title}
                className="flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-5"
              >
                <span className="font-display text-sm font-bold text-[var(--color-accent-strong)]">
                  Paso {i + 1}
                </span>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-ink-soft)]">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section space="md">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-xl font-bold">Qué cubre</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {service.covers.map((c) => (
                <li key={c} className="flex gap-2.5 text-[var(--color-ink-soft)]">
                  <Icon
                    name="check"
                    size={17}
                    className="mt-0.5 shrink-0 text-[var(--color-accent-strong)]"
                  />
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-start gap-4 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] p-6">
            <h2 className="text-lg font-semibold">¿Preparado para empezar?</h2>
            <p className="text-sm text-[var(--color-ink-soft)]">
              Escríbenos con los datos de tu herramienta o tu pieza y te
              respondemos con presupuesto y plazo.
            </p>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contacto">Enviar consulta</ButtonLink>
              <ButtonLink href="/realiza-tu-pedido" variant="outline">
                Realizar pedido
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>

      <FinalCTA />
    </>
  );
}
