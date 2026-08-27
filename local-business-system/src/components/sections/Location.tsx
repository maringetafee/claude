import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LocationConfig } from "@/lib/types";

export function Location({ location }: { location: LocationConfig }) {
  return (
    <section id="location" className="py-[var(--space-xl)]" style={{ background: "var(--color-surface)" }}>
      <Container>
        <SectionHeading eyebrow="Ubicación" title="Cómo llegar" />
        <div className="grid md:grid-cols-2 gap-10 mt-12 items-start">
          <div>
            <p className="text-base mb-8" style={{ color: "var(--color-secondary)" }}>
              {location.address}
            </p>
            <table className="w-full text-sm">
              <tbody>
                {location.hours.map((row) => (
                  <tr key={row.day} style={{ borderTop: "1px solid var(--color-border)" }}>
                    <td className="py-3" style={{ color: "var(--color-primary)" }}>
                      {row.day}
                    </td>
                    <td className="py-3 text-right" style={{ color: "var(--color-muted)" }}>
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
              style={{ border: 0, filter: "grayscale(0.3)" }}
              loading="lazy"
              src={location.mapsEmbedSrc}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
