import { Container } from "@/components/ui/Container";
import { BusinessConfig } from "@/lib/types";

export function Footer({ config }: { config: BusinessConfig }) {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)" }}>
      <Container className="py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>
          © {new Date().getFullYear()} {config.businessName} · Web de demostración del sistema
        </p>
        <div className="flex items-center gap-6 text-xs" style={{ color: "var(--color-muted)" }}>
          <a href={`tel:${config.contact.phone}`} className="hover:opacity-70">
            {config.contact.phone}
          </a>
          {config.contact.instagram && (
            <a
              href={config.contact.instagram}
              className="hover:opacity-70"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
          )}
        </div>
      </Container>
    </footer>
  );
}
