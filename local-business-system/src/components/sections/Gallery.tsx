"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GalleryConfig } from "@/lib/types";
import { useReveal } from "@/lib/useReveal";

const SPAN_PATTERNS = [
  "md:col-span-7 md:row-span-2 aspect-[4/5] md:aspect-auto",
  "md:col-span-5 aspect-[4/3]",
  "md:col-span-5 aspect-[4/3]",
  "md:col-span-4 aspect-square",
  "md:col-span-4 aspect-square",
  "md:col-span-4 aspect-square",
];

function GalleryTile({ src, alt, span, index }: { src: string; alt: string; span: string; index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden aspect-square ${span} transition-all duration-[700ms] ease-[var(--ease-smooth)] ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
      }`}
      style={{ transitionDelay: `${(index % 3) * 90}ms` }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] group-hover:scale-[1.04]"
      />
      <div
        className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-[var(--duration-normal)]"
        style={{ background: "linear-gradient(0deg, color-mix(in srgb, var(--color-primary) 35%, transparent), transparent 55%)" }}
      >
        <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--color-background)" }}>
          Ver
        </span>
      </div>
    </div>
  );
}

export function Gallery({ gallery }: { gallery: GalleryConfig }) {
  return (
    <section id="gallery" className="py-[var(--space-xl)]" style={{ background: "var(--color-surface)" }}>
      <Container>
        <SectionHeading eyebrow={gallery.eyebrow} title={gallery.title} />
        <div className="grid grid-cols-2 md:grid-cols-12 auto-rows-[minmax(140px,1fr)] gap-3 md:gap-4 mt-14">
          {gallery.images.map((img, i) => (
            <GalleryTile
              key={img.src}
              src={img.src}
              alt={img.alt}
              index={i}
              span={SPAN_PATTERNS[i % SPAN_PATTERNS.length]}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
