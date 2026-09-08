"use client";

import { useSearchParams } from "next/navigation";
import { Container, Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { siteConfig } from "@/lib/site-config";

export default function GraciasContent() {
  const ref = useSearchParams().get("ref");

  return (
    <Section space="lg">
      <Container className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-success)]/12 text-[var(--color-success)]">
          <Icon name="check" size={30} />
        </span>
        <h1 className="font-display text-3xl font-bold sm:text-4xl">
          Solicitud recibida
        </h1>
        {ref ? (
          <p className="text-[var(--color-ink-soft)]">
            Tu referencia de solicitud es{" "}
            <strong className="font-semibold text-[var(--color-ink)]">{ref}</strong>
            . Guárdala para el seguimiento.
          </p>
        ) : null}
        <p className="text-[var(--color-ink-soft)]">
          Hemos recibido tu solicitud de presupuesto. Nuestro equipo la revisará y
          te enviará precio, disponibilidad y plazo lo antes posible. Si necesitas
          algo urgente, llámanos al{" "}
          <a
            href={siteConfig.phone.href}
            className="font-medium text-[var(--color-brand)] underline"
          >
            {siteConfig.phone.display}
          </a>
          .
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/productos" size="lg">
            Seguir viendo el catálogo
          </ButtonLink>
          <ButtonLink href="/cuenta/solicitudes" size="lg" variant="outline">
            Ver mis solicitudes
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
