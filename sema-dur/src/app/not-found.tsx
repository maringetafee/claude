import Link from "next/link";
import { Container, Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section space="lg">
      <Container className="mx-auto flex max-w-lg flex-col items-center gap-5 text-center">
        <span className="font-display text-6xl font-bold text-[var(--color-line-strong)]">
          404
        </span>
        <h1 className="font-display text-3xl font-bold">Página no encontrada</h1>
        <p className="text-[var(--color-ink-soft)]">
          El enlace que has seguido no existe o se ha movido. Puedes volver al
          inicio o buscar la herramienta que necesitas.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/" size="lg">
            Volver al inicio
          </ButtonLink>
          <ButtonLink href="/productos" size="lg" variant="outline">
            Ver catálogo
          </ButtonLink>
        </div>
        <Link href="/contacto" className="text-sm font-medium text-[var(--color-brand)] underline">
          ¿Necesitas ayuda? Contáctanos
        </Link>
      </Container>
    </Section>
  );
}
