"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureItemConfig, FeaturesConfig } from "@/lib/types";
import { useReveal } from "@/lib/useReveal";

function FeatureRow({ item, index }: { item: FeatureItemConfig; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>(0.2);
  const reversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`grid md:grid-cols-12 gap-8 md:gap-10 items-center py-14 md:py-20 transition-all duration-[900ms] ease-[var(--ease-smooth)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ borderTop: index > 0 ? "1px solid var(--color-border)" : "none" }}
    >
      <div
        className={`md:col-span-6 relative aspect-[4/5] md:aspect-[5/6] overflow-hidden ${
          reversed ? "md:order-2" : "md:order-1"
        }`}
      >
        <img src={item.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className={`md:col-span-6 ${reversed ? "md:order-1" : "md:order-2"}`}>
        <span
          className="block font-display text-[clamp(3.5rem,7vw,6rem)] leading-none mb-4"
          style={{ color: "var(--color-accent)", opacity: 0.85 }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-display text-3xl md:text-4xl mb-5" style={{ color: "var(--color-primary)" }}>
          {item.title}
        </h3>
        <p className="text-base md:text-lg leading-relaxed max-w-md" style={{ color: "var(--color-secondary)" }}>
          {item.body}
        </p>
      </div>
    </div>
  );
}

export function Features({ features }: { features: FeaturesConfig }) {
  return (
    <section id="features" className="py-[var(--space-xl)]">
      <Container>
        <SectionHeading eyebrow={features.eyebrow} title={features.title} />
        <div className="mt-4">
          {features.items.map((item, i) => (
            <FeatureRow key={item.title} item={item} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
