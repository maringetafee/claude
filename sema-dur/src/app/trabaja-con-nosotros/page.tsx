import type { Metadata } from "next";
import { Container, Section } from "@/components/ui/Section";
import PageHero from "@/components/ui/PageHero";
import { Input } from "@/components/ui/Field";
import ContactSection from "@/components/sections/ContactSection";
import { pageMetadata, breadcrumbLd } from "@/lib/seo";
import JsonLd from "@/components/ui/JsonLd";

export const metadata: Metadata = pageMetadata({
  title: "Trabaja con nosotros",
  description:
    "¿Te interesa formar parte de Talleres Sema-Dur? Envíanos tu candidatura y la tendremos en cuenta para futuras incorporaciones.",
  path: "/trabaja-con-nosotros/",
});

export default function TrabajaConNosotrosPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Inicio", path: "/" },
          { name: "Trabaja con nosotros", path: "/trabaja-con-nosotros/" },
        ])}
      />
      <PageHero
        eyebrow="Empleo"
        title="Trabaja con nosotros"
        lead="Somos un taller con maquinaria de última generación y un equipo técnico cualificado. Si te dedicas a la herramienta de corte —o quieres aprender—, cuéntanos algo sobre ti."
        breadcrumbs={[
          { name: "Inicio", href: "/" },
          { name: "Trabaja con nosotros" },
        ]}
      />
      <Section space="md">
        <Container className="max-w-2xl">
          <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-6 sm:p-8">
            <h2 className="mb-6 font-display text-xl font-bold">Tu candidatura</h2>
            <ContactSection
              formName="empleo"
              submitLabel="Enviar candidatura"
              messageLabel="Cuéntanos sobre ti"
              messageHint="Formación, experiencia con rectificadoras / CNC / afilado, disponibilidad y un enlace a tu CV si lo tienes online."
              extraFields={
                <Input
                  label="Puesto de interés"
                  name="puesto"
                  hint="Ej.: afilador, operario CNC, técnico de herramienta…"
                />
              }
            />
            <p className="mt-4 text-xs text-[var(--color-ink-muted)]">
              Para adjuntar el CV, envíalo por email a{" "}
              <a href="mailto:administracion@sema-dur.com" className="underline">
                administracion@sema-dur.com
              </a>{" "}
              indicando tu nombre.
            </p>
          </div>
        </Container>
      </Section>
    </>
  );
}
