"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HeroConfig } from "@/lib/types";
import { renderLines } from "@/lib/lines";

/** Parallax sutil de la foto del hero al hacer scroll — imperativo (no via
 * React state) para no pelear con la transicion de escala de entrada, que
 * vive en el div contenedor, no en la imagen. Desactivado si el usuario
 * prefiere menos movimiento. */
function useHeroParallax(enabled: boolean) {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const offset = Math.min(window.scrollY * 0.12, 40);
        if (imgRef.current) imgRef.current.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return imgRef;
}

function ScrollCue({ visible }: { visible: boolean }) {
  return (
    <div
      className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity duration-[1200ms] ${
        visible ? "opacity-70" : "opacity-0"
      }`}
      style={{ transitionDelay: "700ms" }}
      aria-hidden="true"
    >
      <span className="text-[10px] uppercase tracking-[0.35em]" style={{ color: "var(--color-primary)" }}>
        Scroll
      </span>
      <span
        className="w-px h-8 animate-pulse"
        style={{ background: "var(--color-primary)" }}
      />
    </div>
  );
}

export function Hero({ hero }: { hero: HeroConfig }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const parallaxRef = useHeroParallax(hero.type === "fullscreen");

  const revealClass = `transition-all duration-[900ms] ease-[var(--ease-smooth)] ${
    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
  }`;
  const delay = (ms: number, extra: CSSProperties = {}): CSSProperties => ({
    transitionDelay: `${ms}ms`,
    ...extra,
  });

  if (hero.type === "fullscreen") {
    return (
      <section id="hero" className="relative h-[100dvh] min-h-[560px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ transform: mounted ? "scale(1.04)" : "scale(1.12)", transition: "transform 1.6s var(--ease-smooth)" }}
        >
          <img
            ref={parallaxRef}
            src={hero.image}
            alt=""
            className="absolute -top-10 -bottom-10 inset-x-0 w-full h-[calc(100%+5rem)] object-cover"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in srgb, var(--color-background) 10%, transparent) 0%, color-mix(in srgb, var(--color-background) 92%, transparent) 92%)",
          }}
        />
        <Container className="relative pb-24 pt-40">
          <p className={`text-xs uppercase tracking-[0.4em] mb-5 ${revealClass}`} style={delay(0, { color: "var(--color-accent)" })}>
            {hero.eyebrow}
          </p>
          <h1
            className={`font-display text-[clamp(3rem,9vw,7rem)] leading-[0.95] max-w-4xl mb-6 ${revealClass}`}
            style={delay(120, { color: "var(--color-primary)" })}
          >
            {renderLines(hero.title)}
          </h1>
          <p className={`text-lg max-w-md mb-10 ${revealClass}`} style={delay(240, { color: "var(--color-secondary)" })}>
            {hero.subtitle}
          </p>
          <div className={`flex flex-wrap gap-4 ${revealClass}`} style={delay(360)}>
            <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
            {hero.ctaSecondary && (
              <Button href={hero.ctaSecondary.href} variant="ghost">
                {hero.ctaSecondary.label}
              </Button>
            )}
          </div>
        </Container>
        <ScrollCue visible={mounted} />
      </section>
    );
  }

  if (hero.type === "split") {
    return (
      <section id="hero" className="relative min-h-[100dvh] pt-24 grid md:grid-cols-2">
        <div className="flex flex-col justify-center py-16 md:py-0 order-2 md:order-1">
          <Container className="!mx-0 md:pr-12 md:pl-[var(--page-padding)]">
            <p className={`text-xs uppercase tracking-[0.35em] mb-5 ${revealClass}`} style={delay(0, { color: "var(--color-accent)" })}>
              {hero.eyebrow}
            </p>
            <h1
              className={`font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.98] mb-6 ${revealClass}`}
              style={delay(120, { color: "var(--color-primary)" })}
            >
              {renderLines(hero.title)}
            </h1>
            <p className={`text-base max-w-sm mb-10 ${revealClass}`} style={delay(240, { color: "var(--color-secondary)" })}>
              {hero.subtitle}
            </p>
            <div className={`flex flex-wrap gap-4 ${revealClass}`} style={delay(360)}>
              <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
              {hero.ctaSecondary && (
                <Button href={hero.ctaSecondary.href} variant="ghost">
                  {hero.ctaSecondary.label}
                </Button>
              )}
            </div>
          </Container>
        </div>
        <div className="relative h-[50vh] md:h-auto order-1 md:order-2 overflow-hidden">
          <img
            src={hero.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: mounted ? "scale(1)" : "scale(1.08)", transition: "transform 1.4s var(--ease-smooth)" }}
          />
        </div>
      </section>
    );
  }

  /* editorial — asymmetric, generous whitespace, image offset lower-right */
  return (
    <section id="hero" className="relative min-h-[100dvh] pt-40 pb-16 flex flex-col justify-center">
      <Container>
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <p className={`text-xs uppercase tracking-[0.4em] mb-6 ${revealClass}`} style={delay(0, { color: "var(--color-accent)" })}>
              {hero.eyebrow}
            </p>
            <h1
              className={`font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.96] mb-8 ${revealClass}`}
              style={delay(120, { color: "var(--color-primary)" })}
            >
              {renderLines(hero.title)}
            </h1>
            <p className={`text-lg max-w-md mb-10 ${revealClass}`} style={delay(240, { color: "var(--color-secondary)" })}>
              {hero.subtitle}
            </p>
            <div className={`flex flex-wrap gap-4 ${revealClass}`} style={delay(360)}>
              <Button href={hero.ctaPrimary.href}>{hero.ctaPrimary.label}</Button>
              {hero.ctaSecondary && (
                <Button href={hero.ctaSecondary.href} variant="ghost">
                  {hero.ctaSecondary.label}
                </Button>
              )}
            </div>
          </div>
          <div className="md:col-span-5 md:mt-24">
            <div
              className={`relative aspect-[4/5] overflow-hidden transition-all duration-[1200ms] ease-[var(--ease-smooth)] ${
                mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
              }`}
            >
              <img src={hero.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
