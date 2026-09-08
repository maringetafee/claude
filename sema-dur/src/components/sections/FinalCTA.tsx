import { Container, Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site-config";

export default function FinalCTA({
  title = "¿Tienes claro qué herramienta necesitas?",
  lead = "Añade las referencias a tu solicitud o cuéntanos el trabajo. Te respondemos con precio, disponibilidad y plazo, sin compromiso.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <Section tone="ink" space="lg">
      <Container className="flex flex-col items-center gap-6 text-center">
        <h2 className="max-w-2xl text-3xl font-bold sm:text-[2.6rem]">{title}</h2>
        <p className="max-w-xl text-lg text-[var(--color-ink-invert-soft)]">{lead}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/checkout" size="lg">
            Solicitar presupuesto
            <Icon name="arrow-right" size={18} />
          </ButtonLink>
          <ButtonLink
            href={siteConfig.whatsapp.href}
            size="lg"
            variant="invert"
            external
          >
            <Icon name="whatsapp" size={18} />
            Escríbenos por WhatsApp
          </ButtonLink>
        </div>
        <p className="text-sm text-[var(--color-ink-invert-soft)]">
          O llámanos al{" "}
          <a
            href={siteConfig.phone.href}
            className="font-semibold text-white underline underline-offset-2"
          >
            {siteConfig.phone.display}
          </a>
        </p>
      </Container>
    </Section>
  );
}
