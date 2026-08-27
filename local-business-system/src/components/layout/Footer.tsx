import { Container } from "@/components/ui/Container";
import { BusinessConfig } from "@/lib/types";

export function Footer({ config }: { config: BusinessConfig }) {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-surface)" }}>
      <Container className="pt-16 pb-8">
        <div className="grid md:grid-cols-12 gap-10 md:gap-8 items-start">
          <div className="md:col-span-5">
            <p className="font-display text-3xl md:text-4xl mb-3" style={{ color: "var(--color-primary)" }}>
              {config.businessName}
            </p>
            <p className="text-sm max-w-xs" style={{ color: "var(--color-muted)" }}>
              {config.tagline}
            </p>
          </div>

          <nav className="md:col-span-3 flex flex-col gap-2.5">
            {config.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm hover:opacity-70 transition-opacity"
                style={{ color: "var(--color-secondary)" }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="md:col-span-4 flex flex-col gap-2.5 md:items-end text-sm md:text-right" style={{ color: "var(--color-secondary)" }}>
            <a href={`tel:${config.contact.phone}`} className="hover:opacity-70">
              {config.contact.phone}
            </a>
            {config.contact.email && (
              <a href={`mailto:${config.contact.email}`} className="hover:opacity-70">
                {config.contact.email}
              </a>
            )}
            {config.contact.instagram && (
              <a href={config.contact.instagram} className="hover:opacity-70" target="_blank" rel="noreferrer">
                Instagram
              </a>
            )}
            <a href={config.contact.whatsapp} className="hover:opacity-70" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>

        <div
          className="mt-14 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          style={{ borderTop: "1px solid var(--color-border)" }}
        >
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            © {new Date().getFullYear()} {config.businessName}
          </p>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            Web de demostración del sistema
          </p>
        </div>
      </Container>
    </footer>
  );
}
