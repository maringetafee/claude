"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { process } from "@/lib/content";
import { Reveal } from "./ui/Reveal";

export function Process() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const path = lineRef.current;
      if (!path) return;
      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.4,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="empresa" ref={rootRef} className="relative bg-carbon-950 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <Reveal className="mb-16 lg:mb-24">
          <span className="mono-label text-[11px] text-signal-500">Empresa · Proceso</span>
          <h2 className="mt-4 max-w-2xl text-balance font-display text-4xl font-bold tracking-tight text-bone-100 sm:text-5xl">
            Instalamos. Reparamos. Mantenemos.
          </h2>
          <p className="mt-5 max-w-lg text-bone-500">
            Acompañamos cada instalación durante todo su ciclo de vida, desde el primer cableado hasta el contrato de conservación.
          </p>
        </Reveal>

        <div className="relative">
          <svg className="absolute left-0 right-0 top-[26px] hidden w-full lg:block" height="4" viewBox="0 0 1200 4" fill="none" aria-hidden preserveAspectRatio="none">
            <path ref={lineRef} d="M0 2 H1200" stroke="var(--color-signal-500)" strokeWidth="1.5" />
          </svg>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-14">
            {process.map((step, i) => (
              <Reveal key={step.code} delay={i * 0.08}>
                <div className="relative">
                  <div className="mb-7 flex items-center gap-4">
                    <span className="relative z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border border-signal-500/50 bg-carbon-950 font-mono text-sm text-signal-500">
                      {step.code}
                    </span>
                    <div className="h-px flex-1 bg-bone-100/10 lg:hidden" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-bone-100">{step.title}</h3>
                  <p className="mt-3 max-w-xs text-bone-500">{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
