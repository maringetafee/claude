"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MenuConfig, MenuCategoryConfig, MenuItemConfig } from "@/lib/types";
import { useReveal } from "@/lib/useReveal";

function MenuRow({
  name,
  description,
  price,
  image,
  onHoverImage,
}: MenuItemConfig & { onHoverImage?: (src?: string) => void }) {
  const { ref, visible } = useReveal<HTMLLIElement>();
  return (
    <li
      ref={ref}
      onMouseEnter={() => image && onHoverImage?.(image)}
      onMouseLeave={() => image && onHoverImage?.(undefined)}
      className={`py-4 transition-all duration-[600ms] ease-[var(--ease-standard)] ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <div className="flex items-baseline gap-3">
        <span className="font-medium tracking-wide" style={{ color: "var(--color-primary)" }}>
          {name}
        </span>
        <span className="flex-1 border-b border-dotted translate-y-[-3px]" style={{ borderColor: "var(--color-border)" }} />
        <span className="font-display text-base" style={{ color: "var(--color-accent)" }}>
          {price}
        </span>
      </div>
      <p className="text-sm mt-1.5" style={{ color: "var(--color-muted)" }}>
        {description}
      </p>
    </li>
  );
}

function CategoryBlock({
  category,
  index,
  active,
  onActivate,
  onItemHoverImage,
}: {
  category: MenuCategoryConfig;
  index: number;
  active: boolean;
  onActivate: () => void;
  onItemHoverImage: (src?: string) => void;
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
      <div className="flex items-baseline gap-4 mb-1">
        <span
          className="font-display text-base transition-colors duration-[var(--duration-normal)]"
          style={{ color: active ? "var(--color-accent)" : "var(--color-muted)" }}
        >
          {number}
        </span>
        <p className="font-display text-2xl" style={{ color: "var(--color-primary)" }}>
          {category.name}
        </p>
      </div>

      {category.image && (
        <div className="relative h-44 mt-4 mb-2 overflow-hidden lg:hidden">
          <img src={category.image} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      )}

      <ul className="pl-0 sm:pl-9 mt-3">
        {category.items.map((item) => (
          <MenuRow key={item.name} {...item} onHoverImage={onItemHoverImage} />
        ))}
      </ul>
    </div>
  );
}

export function Menu({ menu }: { menu: MenuConfig }) {
  const withImage = menu.categories.filter((c) => c.image);
  const [active, setActive] = useState<string | null>(withImage[0]?.name ?? null);
  // Imagen de un plato concreto bajo el raton, por encima de la de su
  // categoria — undefined cuando no hay ningun plato bajo el raton, y la
  // panel vuelve a mostrar la imagen de la categoria activa.
  const [hoverImage, setHoverImage] = useState<string | undefined>(undefined);

  const activeCategoryImage = menu.categories.find((c) => c.name === active)?.image;
  const displaySrc = hoverImage ?? activeCategoryImage;

  // Todas las imagenes que pueden llegar a mostrarse (de categoria o de
  // plato individual) se apilan ya en el DOM y se cruzan por opacidad, para
  // que el cambio de una a otra no parpadee ni recargue la imagen.
  const allImages = Array.from(
    new Set(
      menu.categories
        .flatMap((c) => [c.image, ...c.items.map((i) => i.image)])
        .filter((src): src is string => Boolean(src))
    )
  );

  return (
    <section id="menu" className="py-[var(--space-xl)]" style={{ background: "var(--color-surface)" }}>
      <Container>
        <SectionHeading eyebrow={menu.eyebrow} title={menu.title} />
        {menu.subtitle && (
          <p className="mt-5 max-w-lg text-base" style={{ color: "var(--color-secondary)" }}>
            {menu.subtitle}
          </p>
        )}
        <div className="mt-14 grid lg:grid-cols-12 gap-x-12 gap-y-14">
          <div className="lg:col-span-7 space-y-16">
            {menu.categories.map((category, i) => (
              <CategoryBlock
                key={category.name}
                category={category}
                index={i}
                active={active === category.name}
                onActivate={() => {
                  if (category.image) {
                    setActive(category.name);
                    setHoverImage(undefined);
                  }
                }}
                onItemHoverImage={setHoverImage}
              />
            ))}
          </div>

          {allImages.length > 0 && (
            <div className="hidden lg:block lg:col-span-5">
              <div className="sticky top-32 relative aspect-[3/4] overflow-hidden">
                {allImages.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[700ms] ease-[var(--ease-smooth)]"
                    style={{ opacity: src === displaySrc ? 1 : 0 }}
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
