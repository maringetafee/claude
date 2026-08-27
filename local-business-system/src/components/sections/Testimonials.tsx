"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TestimonialItemConfig, TestimonialsConfig } from "@/lib/types";
import { renderLines } from "@/lib/lines";
import { useReveal } from "@/lib/useReveal";

function Stars({ count }: { count: number }) {
  return (
    <span className="tracking-[0.1em]" style={{ color: "var(--color-accent)" }} aria-hidden="true">
      {"★".repeat(count)}
      <span style={{ opacity: 0.25 }}>{"★".repeat(Math.max(0, 5 - count))}</span>
    </span>
  );
}

function ReviewCard({ author, timeAgo, stars, quote, index }: TestimonialItemConfig & { index: number }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`shrink-0 w-[280px] sm:w-[320px] snap-start p-6 transition-all duration-[700ms] ease-[var(--ease-smooth)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
        transitionDelay: `${(index % 4) * 90}ms`,
      }}
    >
      <Stars count={stars} />
      <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6 flex items-center gap-3">
        <span
          className="flex items-center justify-center w-9 h-9 text-xs font-semibold font-display shrink-0"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-foreground)", borderRadius: "50%" }}
        >
          {author.charAt(0)}
        </span>
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--color-primary)" }}>
            {author}
          </p>
          <p className="text-xs" style={{ color: "var(--color-muted)" }}>
            {timeAgo}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ testimonials }: { testimonials: TestimonialsConfig }) {
  return (
    <section id="testimonials" className="py-[var(--space-xl)]">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading eyebrow={testimonials.eyebrow} title={testimonials.title} />
          <div className="flex items-center gap-4">
            <span className="font-display text-5xl leading-none" style={{ color: "var(--color-primary)" }}>
              {testimonials.rating}
            </span>
            <div>
              <Stars count={Math.round(Number(testimonials.rating))} />
              <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>
                {testimonials.ratingCount} · {testimonials.source}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 -mx-[var(--page-padding)] px-[var(--page-padding)] flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4">
          {testimonials.items.map((item, i) => (
            <ReviewCard key={item.author + i} {...item} index={i} />
          ))}
        </div>

        {testimonials.sourceHref && (
          <a
            href={testimonials.sourceHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-sm underline decoration-[var(--color-border)] underline-offset-4"
            style={{ color: "var(--color-secondary)" }}
          >
            {renderLines(`Ver todas las reseñas en ${testimonials.source} →`)}
          </a>
        )}
      </Container>
    </section>
  );
}
