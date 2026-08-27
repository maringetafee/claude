import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ContactConfig } from "@/lib/types";

export function Contact({ contact }: { contact: ContactConfig }) {
  return (
    <section id="contact" className="py-[var(--space-xl)]">
      <Container>
        <SectionHeading eyebrow="Contacto" title="Hablemos" align="center" />
        <div className="flex flex-col items-center gap-10 mt-16">
          <a
            href={`tel:${contact.phone}`}
            className="font-display text-[clamp(1.75rem,5vw,3rem)] transition-opacity hover:opacity-70"
            style={{ color: "var(--color-primary)" }}
          >
            {contact.phone}
          </a>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm uppercase tracking-[0.2em]" style={{ color: "var(--color-secondary)" }}>
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="hover:opacity-70">
                {contact.email}
              </a>
            )}
            {contact.instagram && (
              <a href={contact.instagram} target="_blank" rel="noreferrer" className="hover:opacity-70">
                Instagram
              </a>
            )}
          </div>
          <Button href={contact.whatsapp} className="mt-4">
            Escríbenos por WhatsApp
          </Button>
        </div>
      </Container>
    </section>
  );
}
