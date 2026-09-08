import { Container, Section } from "@/components/ui/Section";
import { figures, suppliers } from "@/data/company";

export default function TrustBand() {
  return (
    <Section tone="steel" space="md">
      <Container>
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {figures.map((f) => (
            <div key={f.label} className="flex flex-col gap-1">
              <dt className="order-2 text-sm text-[var(--color-ink-soft)]">
                {f.label}
              </dt>
              <dd className="order-1 font-display text-3xl font-bold text-[var(--color-brand)] sm:text-4xl">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col gap-5 border-t border-[var(--color-line-strong)] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ink-muted)]">
            Distribuidor oficial
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {suppliers.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-75 transition-opacity hover:opacity-100"
                aria-label={s.name}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- vector-ish supplier logo, tiny, no optimisation needed */}
                <img
                  src={`/images/${s.logo}-600.webp`}
                  alt={s.name}
                  width={1063}
                  height={354}
                  loading="lazy"
                  decoding="async"
                  className="h-7 w-auto"
                />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
