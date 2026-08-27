"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AboutConfig } from "@/lib/types";
import { useReveal } from "@/lib/useReveal";

export function About({ about }: { about: AboutConfig }) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="about" className="py-[var(--space-xl)]">
      <Container>
        <div className="grid md:grid-cols-12 gap-10 md:gap-16 items-center">
          <div className="md:col-span-5 md:order-2">
            <div
              ref={ref}
              className={`relative aspect-[3/4] overflow-hidden transition-all duration-[1000ms] ease-[var(--ease-smooth)] ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <img src={about.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
          <div className="md:col-span-7 md:order-1">
            <SectionHeading eyebrow={about.eyebrow} title={about.title} />
            <p className="mt-6 text-base md:text-lg leading-relaxed max-w-xl" style={{ color: "var(--color-secondary)" }}>
              {about.body}
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
