"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTAConfig } from "@/lib/types";
import { renderLines } from "@/lib/lines";
import { useReveal } from "@/lib/useReveal";

export function CTA({ cta }: { cta: CTAConfig }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.3);

  return (
    <section className="relative h-[85vh] min-h-[520px] max-h-[900px] flex items-center justify-center overflow-hidden">
      <img
        src={cta.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
        style={{
          transform: visible ? "scale(1)" : "scale(1.08)",
          transition: "transform 1.8s var(--ease-smooth)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--color-scrim) 62%, transparent)" }}
      />
      <Container className="relative">
        <div
          ref={ref}
          className={`text-center transition-all duration-[900ms] ease-[var(--ease-smooth)] ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span
            className="block w-10 h-px mx-auto mb-7"
            style={{ background: "var(--color-accent)" }}
            aria-hidden="true"
          />
          <h2
            className="font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.96] mb-7"
            style={{ color: "var(--color-accent-foreground)" }}
          >
            {renderLines(cta.title)}
          </h2>
          {cta.subtitle && (
            <p
              className="text-base md:text-lg mb-10 max-w-md mx-auto"
              style={{ color: "var(--color-accent-foreground)", opacity: 0.82 }}
            >
              {cta.subtitle}
            </p>
          )}
          <Button href={cta.cta.href}>{cta.cta.label}</Button>
        </div>
      </Container>
    </section>
  );
}
