"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Button } from "./ui/Button";
import { ResponsivePhoto } from "./ui/ResponsivePhoto";
import { company } from "@/lib/content";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<SVGSVGElement>(null);
  const statRef = useRef<HTMLSpanElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      if (statRef.current) statRef.current.textContent = String(company.foundedYears);
      return;
    }

    const ctx = gsap.context(() => {
      const paths = linesRef.current?.querySelectorAll<SVGPathElement>("[data-line]");
      const nodes = linesRef.current?.querySelectorAll<SVGCircleElement>("[data-node]");

      paths?.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(nodes ?? [], { scale: 0, transformOrigin: "center" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.15 });

      tl.to(paths ?? [], { strokeDashoffset: 0, duration: 1.6, stagger: 0.08, ease: "power2.inOut" })
        .to(nodes ?? [], { scale: 1, duration: 0.5, stagger: 0.05 }, "-=1.1")
        .from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 0.6 }, 0.2)
        .from(
          "[data-hero-line]",
          { opacity: 0, y: 42, clipPath: "inset(0 0 100% 0)", duration: 0.9, stagger: 0.09 },
          0.3
        )
        .from("[data-hero-sub]", { opacity: 0, y: 16, duration: 0.7 }, 0.75)
        .from("[data-hero-cta]", { opacity: 0, y: 12, duration: 0.6, stagger: 0.07 }, 0.85)
        .from(
          photoRef.current,
          { opacity: 0, scale: 1.08, clipPath: "inset(4% 4% 4% 4%)", duration: 1.3, ease: "power3.out" },
          0.35
        )
        .from("[data-hero-frame]", { opacity: 0, duration: 0.6 }, 1.1)
        .from("[data-hero-stat]", { opacity: 0, y: 20, duration: 0.7 }, 0.95);

      if (statRef.current) {
        const counter = { val: 0 };
        gsap.to(counter, {
          val: company.foundedYears,
          duration: 1.4,
          delay: 1.1,
          ease: "power2.out",
          onUpdate: () => {
            if (statRef.current) statRef.current.textContent = Math.round(counter.val).toString();
          },
        });
      }

      // Extremely light parallax — physical, not floaty.
      gsap.to(photoRef.current, {
        yPercent: 6,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(linesRef.current, {
        yPercent: -4,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={rootRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-carbon-950 pt-28 pb-16 lg:pt-32"
    >
      {/* Coordinate / network line art — the invisible infrastructure, made visible */}
      <svg
        ref={linesRef}
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]"
        viewBox="0 0 1440 900"
        fill="none"
        aria-hidden
        preserveAspectRatio="xMidYMid slice"
      >
        <path data-line d="M-40 620 L340 620 L420 540 L780 540 L860 460 L1480 460" stroke="var(--color-bone-400)" strokeWidth="1" />
        <path data-line d="M-40 180 L260 180 L340 260 L700 260 L780 180 L1480 180" stroke="var(--color-bone-400)" strokeWidth="1" />
        <path data-line d="M980 -40 L980 220 L1120 360 L1120 900" stroke="var(--color-bone-400)" strokeWidth="1" />
        <path data-line d="M240 -40 L240 120 L140 220 L140 900" stroke="var(--color-signal-500)" strokeWidth="1" strokeOpacity="0.7" />
        <circle data-node cx="420" cy="540" r="3.5" fill="var(--color-signal-500)" />
        <circle data-node cx="780" cy="540" r="3" fill="var(--color-bone-400)" />
        <circle data-node cx="1120" cy="360" r="3" fill="var(--color-bone-400)" />
        <circle data-node cx="700" cy="260" r="3" fill="var(--color-bone-400)" />
        <circle data-node cx="140" cy="220" r="3.5" fill="var(--color-signal-500)" />
      </svg>

      <div className="relative mx-auto grid w-full max-w-[1400px] grid-cols-1 items-center gap-16 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10 lg:px-10">
        {/* Copy column */}
        <div>
          <div data-hero-eyebrow className="mb-7 flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-signal-500" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-500" />
            </span>
            <span className="mono-label text-[11px] text-bone-400">Telecomunicaciones · Madrid</span>
          </div>

          <h1
            aria-label="Construimos la infraestructura invisible de Madrid."
            className="font-display max-w-2xl text-[13vw] leading-[0.97] font-bold tracking-[-0.03em] text-bone-100 sm:text-6xl lg:text-[4.6rem] xl:text-[5.1rem]"
          >
            <span aria-hidden="true">
              <span className="block overflow-hidden">
                <span data-hero-line className="block">Construimos la</span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className="block">infraestructura</span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className="block text-signal-500">invisible</span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-line className="block">de Madrid.</span>
              </span>
            </span>
          </h1>

          <p data-hero-sub className="mt-8 max-w-md text-balance text-lg leading-relaxed text-bone-400">
            Instalación, reparación y mantenimiento de antenas, porteros y sistemas de seguridad para comunidades y negocios en toda la Comunidad de Madrid.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span data-hero-cta>
              <Button href="#contacto">
                Solicitar presupuesto
                <ArrowIcon />
              </Button>
            </span>
            <span data-hero-cta>
              <Button href="#servicios" variant="ghost">
                Ver servicios
              </Button>
            </span>
          </div>
        </div>

        {/* Photographic panel — architectural frame, not a full-bleed cliché */}
        <div className="relative">
          <div
            ref={photoRef}
            className="grain relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-carbon-800 lg:aspect-[3/4]"
          >
            <ResponsivePhoto
              src="/images/rooftop-wide.jpg"
              alt="Instalación de un portero automático por un técnico de S.B.S Telecomunicaciones"
              priority
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
              style={{ objectPosition: "78% center", filter: "grayscale(0.55) contrast(1.15) brightness(0.62) sepia(0.15)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon-950 via-carbon-950/10 to-signal-950/30" />
            <div className="absolute inset-0 bg-gradient-to-br from-carbon-950/40 via-transparent to-transparent" />
          </div>

          {/* Blueprint corner marks + coordinates */}
          <div data-hero-frame className="pointer-events-none absolute -inset-3 hidden sm:block">
            <CornerMark className="absolute -top-0 -left-0" />
            <CornerMark className="absolute -top-0 -right-0 rotate-90" />
            <CornerMark className="absolute -bottom-0 -left-0 -rotate-90" />
            <CornerMark className="absolute -bottom-0 -right-0 rotate-180" />
          </div>
          <div data-hero-frame className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-[0.12em] text-bone-600">
            <span>40.4168° N, 3.7038° W</span>
            <span>MADRID — ES</span>
          </div>
        </div>
      </div>

      {/* Stat — editorial protagonism, not a feature card */}
      <div data-hero-stat className="absolute bottom-10 left-6 hidden items-end gap-3 lg:flex lg:left-10">
        <span ref={statRef} className="font-display text-6xl leading-none font-bold tracking-tight text-bone-100">
          0
        </span>
        <div className="pb-1.5 leading-tight">
          <div className="mono-label text-[10px] text-signal-500">Años</div>
          <div className="max-w-[10rem] text-xs text-bone-600">de experiencia en telecomunicaciones</div>
        </div>
      </div>
    </section>
  );
}

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="shrink-0" aria-hidden>
      <path d="M3 7.5H12M12 7.5L8 3.5M12 7.5L8 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CornerMark({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={className} aria-hidden>
      <path d="M1 8V1H8" stroke="var(--color-signal-500)" strokeOpacity="0.7" strokeWidth="1.2" />
    </svg>
  );
}
