"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesConfig } from "@/lib/types";
import { useReveal } from "@/lib/useReveal";

function ServiceRow({
  name,
  description,
  price,
  duration,
}: {
  name: string;
  description: string;
  price: string;
  duration: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`grid grid-cols-12 gap-4 py-6 items-baseline transition-all duration-[600ms] ease-[var(--ease-standard)] ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div className="col-span-7 md:col-span-6">
        <p className="font-display text-lg" style={{ color: "var(--color-primary)" }}>
          {name}
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
          {description}
        </p>
      </div>
      <div className="col-span-3 md:col-span-4 text-sm" style={{ color: "var(--color-muted)" }}>
        {duration}
      </div>
      <div className="col-span-2 text-right font-medium" style={{ color: "var(--color-primary)" }}>
        {price}
      </div>
    </div>
  );
}

export function Services({ services }: { services: ServicesConfig }) {
  return (
    <section id="services" className="py-[var(--space-xl)]">
      <Container>
        <SectionHeading eyebrow={services.eyebrow} title={services.title} />
        <div className="mt-14 space-y-14">
          {services.categories.map((category) => (
            <div key={category.name}>
              <p className="text-xs uppercase tracking-[0.3em] mb-2" style={{ color: "var(--color-muted)" }}>
                {category.name}
              </p>
              <div>
                {category.items.map((item) => (
                  <ServiceRow key={item.name} {...item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
