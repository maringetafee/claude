import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ContactConfig } from "@/lib/types";

export function Contact({ contact }: { contact: ContactConfig }) {
  return (
    <section id="contact" className="py-[var(--space-xl)]">
      <Container>
        <SectionHeading eyebrow="Contacto" title="Hablemos" align="center" />
        <div className="flex flex-col items-center gap-6 mt-12">
          <div className="flex flex-wrap justify-center gap-8 text-sm" style={{ color: "var(--color-secondary)" }}>
            <a href={`tel:${contact.phone}`} className="hover:opacity-70">
              {contact.phone}
            </a>
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
          <Button href={contact.whatsapp}>Escríbenos por WhatsApp</Button>
        </div>
      </Container>
    </section>
  );
}
