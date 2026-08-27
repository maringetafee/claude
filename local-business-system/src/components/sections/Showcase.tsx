"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ShowcaseConfig } from "@/lib/types";
import { renderLines } from "@/lib/lines";
import { useReveal } from "@/lib/useReveal";

/** Momento fotografico a pantalla casi completa a mitad de pagina — variante
 * mas corta y alineada a la izquierda de CTA (que va justo antes del footer,
 * centrada y mas alta). Pensada para un solo plato/producto protagonista. */
export function Showcase({ showcase }: { showcase: ShowcaseConfig }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3);

  return (
    <section className="relative h-[72vh] min-h-[440px] max-h-[760px] flex items-end overflow-hidden">
      <img
        src={showcase.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: visible ? "scale(1)" : "scale(1.08)",
          transition: "transform 1.8s var(--ease-smooth)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, color-mix(in srgb, var(--color-scrim) 78%, transparent) 0%, color-mix(in srgb, var(--color-scrim) 30%, transparent) 55%, transparent 85%)",
        }}
      />
      <Container className="relative pb-16 pt-16">
        <div
          ref={ref}
          className={`max-w-lg transition-all duration-[900ms] ease-[var(--ease-smooth)] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {showcase.eyebrow && (
            <p className="text-xs uppercase tracking-[0.4em] mb-5" style={{ color: "var(--color-accent)" }}>
              {showcase.eyebrow}
            </p>
          )}
          <h2
            className="font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.98] mb-6"
            style={{ color: "var(--color-accent-foreground)" }}
          >
            {renderLines(showcase.title)}
          </h2>
          {showcase.subtitle && (
            <p className="text-base md:text-lg mb-9 max-w-sm" style={{ color: "var(--color-accent-foreground)", opacity: 0.82 }}>
              {showcase.subtitle}
            </p>
          )}
          {showcase.stats && showcase.stats.length > 0 && (
            <div className="flex gap-8 mb-9">
              {showcase.stats.map((stat) => (
                <div key={stat.label}>
                  <span className="font-display text-3xl block" style={{ color: "var(--color-accent)" }}>
                    {stat.value}
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-[0.2em]"
                    style={{ color: "var(--color-accent-foreground)", opacity: 0.6 }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Button href={showcase.cta.href}>{showcase.cta.label}</Button>
        </div>
      </Container>
    </section>
  );
}
