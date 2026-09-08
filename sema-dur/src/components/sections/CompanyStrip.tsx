import { Container, Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import Picture from "@/components/ui/Picture";
import { companyIntro } from "@/data/company";

export default function CompanyStrip() {
  return (
    <Section space="lg">
      <Container className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="order-2 overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-line)] lg:order-1">
          <Picture
            image="empresa/taller"
            alt="Instalaciones de Talleres Sema-Dur en Humanes de Madrid"
            sizes="(max-width: 1024px) 92vw, 520px"
            aspectRatio="5 / 4"
          />
        </div>
        <div className="order-1 flex flex-col gap-5 lg:order-2">
          <span className="eyebrow">La empresa</span>
          <h2 className="text-3xl font-bold sm:text-[2.4rem]">
            Desde 1976 a pie de máquina
          </h2>
          <p className="text-lg leading-relaxed text-[var(--color-ink-soft)]">
            {companyIntro}
          </p>
          <p className="leading-relaxed text-[var(--color-ink-soft)]">
            Hoy nuestras herramientas se distribuyen por España, Portugal, Colombia,
            Venezuela y Guinea, de la mano de nuestros proveedores Freud y Ceratizit.
          </p>
          <div>
            <ButtonLink href="/empresa" variant="outline">
              Conócenos
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
