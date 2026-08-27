import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocationConfig } from "@/lib/types";

export function Location({ location }: { location: LocationConfig }) {
  return (
    <section id="location" className="py-[var(--space-xl)]" style={{ background: "var(--color-surface)" }}>
      <Container>
        <SectionHeading eyebrow="Ubicación" title={"Dónde\nencontrarnos"} />
        <div className="grid md:grid-cols-2 gap-12 mt-14 items-start">
          <div>
            <p className="font-display text-2xl md:text-3xl mb-12 max-w-sm" style={{ color: "var(--color-primary)" }}>
              {location.address}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] mb-5" style={{ color: "var(--color-accent)" }}>
              Horario
            </p>
            <table className="w-full text-sm">
              <tbody>
                {location.hours.map((row) => (
                  <tr key={row.day} style={{ borderTop: "1px solid var(--color-border)" }}>
                    <td className="py-3.5" style={{ color: "var(--color-primary)" }}>
                      {row.day}
                    </td>
                    <td className="py-3.5 text-right" style={{ color: "var(--color-muted)" }}>
                      {row.hours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className="relative aspect-[4/3] overflow-hidden"
            style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border)" }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              style={{ border: 0, filter: "grayscale(0.5) contrast(1.05) brightness(0.9)" }}
              loading="lazy"
              src={location.mapsEmbedSrc}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "color-mix(in srgb, var(--color-background) 18%, transparent)" }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
