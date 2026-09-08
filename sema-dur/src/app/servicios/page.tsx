import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import FinalCTA from "@/components/sections/FinalCTA";
import { services } from "@/data/services";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Servicios",
  description:
    "Reafilado y fabricación a medida de herramienta de corte para madera y metal. Dos servicios para mantener tu producción cortando.",
  path: "/servicios/",
});

export default function ServiciosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Servicios", path: "/servicios/" },
        ])}
      />
      <PageHero
        eyebrow="Servicios"
        title="Reafilado y fabricación a medida"
        lead="Más allá del catálogo, mantenemos y creamos la herramienta que tu trabajo necesita."
        breadcrumbs={[{ name: "Inicio", href: "/" }, { name: "Servicios" }]}
      />
      <Section space="md">
        <Container className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <Link
              key={s.slug}
              href={`/servicios/${s.slug}/`}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white transition-[border-color,box-shadow] hover:border-[var(--color-line-strong)] hover:shadow-[var(--shadow-md)]"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <Picture
                  image={s.image}
                  alt=""
                  sizes="(max-width: 768px) 92vw, 560px"
                  aspectRatio="16 / 10"
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 className="text-xl font-bold">{s.name}</h2>
                <p className="leading-relaxed text-[var(--color-ink-soft)]">
                  {s.claim}
                </p>
                <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)]">
                  Ver el servicio
                  <Icon name="arrow-right" size={16} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </Container>
      </Section>
      <FinalCTA />
    </>
  );
}
