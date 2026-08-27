"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MenuConfig } from "@/lib/types";
import { useReveal } from "@/lib/useReveal";

function MenuCategoryBlock({ name, items }: { name: string; items: { name: string; description: string; price: string }[] }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`transition-all duration-[700ms] ease-[var(--ease-smooth)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <h3 className="font-display text-xl mb-6" style={{ color: "var(--color-accent)" }}>
        {name}
      </h3>
      <ul className="space-y-6">
        {items.map((item) => (
          <li key={item.name}>
            <div className="flex items-baseline gap-3">
              <span className="font-medium" style={{ color: "var(--color-primary)" }}>
                {item.name}
              </span>
              <span className="flex-1 border-b border-dotted" style={{ borderColor: "var(--color-border)" }} />
              <span className="font-display text-sm" style={{ color: "var(--color-primary)" }}>
                {item.price}
              </span>
            </div>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>
              {item.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Menu({ menu }: { menu: MenuConfig }) {
  return (
    <section id="menu" className="py-[var(--space-xl)]" style={{ background: "var(--color-surface)" }}>
      <Container>
        <SectionHeading eyebrow={menu.eyebrow} title={menu.title} align="center" />
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-14 mt-16">
          {menu.categories.map((category) => (
            <MenuCategoryBlock key={category.name} name={category.name} items={category.items} />
          ))}
        </div>
      </Container>
    </section>
  );
}
