"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServicesConfig, ServiceCategoryConfig } from "@/lib/types";
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
      className={`grid grid-cols-12 gap-4 py-5 items-baseline transition-all duration-[600ms] ease-[var(--ease-standard)] ${
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

function CategoryBlock({
  category,
  index,
  active,
  onActivate,
}: {
  category: ServiceCategoryConfig;
  index: number;
  active: boolean;
  onActivate: () => void;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const number = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={ref}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      className={`transition-all duration-[700ms] ease-[var(--ease-smooth)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="flex items-baseline gap-4 mb-3">
        <span
          className="font-display text-base transition-colors duration-[var(--duration-normal)]"
          style={{ color: active ? "var(--color-accent)" : "var(--color-muted)" }}
        >
          {number}
        </span>
        <p className="text-xs uppercase tracking-[0.3em]" style={{ color: "var(--color-muted)" }}>
          {category.name}
        </p>
      </div>

      {category.image && (
        <div className="relative h-44 mb-5 overflow-hidden lg:hidden">
          <img src={category.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}

      <div className="pl-0 sm:pl-9">
        {category.items.map((item) => (
          <ServiceRow key={item.name} {...item} />
        ))}
      </div>
    </div>
  );
}

export function Services({ services }: { services: ServicesConfig }) {
  const withImage = services.categories.filter((c) => c.image);
  const [active, setActive] = useState<string | null>(withImage[0]?.name ?? null);

  return (
    <section id="services" className="py-[var(--space-xl)]">
      <Container>
        <SectionHeading eyebrow={services.eyebrow} title={services.title} />
        <div className="mt-14 grid lg:grid-cols-12 gap-x-12 gap-y-14">
          <div className="lg:col-span-7 space-y-14">
            {services.categories.map((category, i) => (
              <CategoryBlock
                key={category.name}
                category={category}
                index={i}
                active={active === category.name}
                onActivate={() => category.image && setActive(category.name)}
              />
            ))}
          </div>

          {withImage.length > 0 && (
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-32 relative aspect-[3/4] overflow-hidden">
                {withImage.map((category) => (
                  <img
                    key={category.name}
                    src={category.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[700ms] ease-[var(--ease-smooth)]"
                    style={{ opacity: active === category.name ? 1 : 0 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
