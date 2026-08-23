"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "./ui/Reveal";

export function Team() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.to(bigRef.current, {
        yPercent: -6,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top bottom", end: "bottom top", scrub: 0.6 },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative bg-carbon-950 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5 lg:col-start-1" as="div">
            <span className="mono-label text-[11px] text-signal-500">Personas reales</span>
            <h2 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-bone-100 sm:text-5xl">
              Detrás de cada instalación hay un equipo.
            </h2>
            <p className="mt-6 max-w-md text-bone-500">
              Técnicos que suben a las azoteas de Madrid con el mismo cuidado desde hace 26 años. No es una empresa
              abstracta: es gente que conoce cada edificio en el que ha trabajado.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <Reveal className="grain relative aspect-[4/5] overflow-hidden rounded-sm bg-carbon-800">
                <Image
                  src="/images/portero-automatico.jpg"
                  alt="Técnico de S.B.S Telecomunicaciones instalando un portero automático"
                  fill
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="object-cover"
                  style={{ filter: "grayscale(0.45) contrast(1.1) brightness(0.85)" }}
                />
              </Reveal>
              <Reveal delay={0.08} className="grain relative aspect-[4/5] overflow-hidden rounded-sm bg-carbon-800">
                <Image
                  src="/images/atencion-cliente.jpg"
                  alt="Asesora de S.B.S Telecomunicaciones atendiendo a un cliente"
                  fill
                  sizes="(min-width: 1024px) 20vw, 45vw"
                  className="object-cover"
                  style={{ filter: "grayscale(0.45) contrast(1.1) brightness(0.85)" }}
                />
              </Reveal>
            </div>
          </Reveal>

          <div className="lg:col-span-6 lg:col-start-7">
            <div ref={bigRef} className="grain relative aspect-[4/5] overflow-hidden rounded-sm bg-carbon-800 lg:aspect-[3/4]">
              <Image
                src="/images/tecnico-instalacion.jpg"
                alt="Técnico de S.B.S Telecomunicaciones trabajando en una azotea de Madrid con antenas parabólicas"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
                style={{ filter: "grayscale(0.4) contrast(1.15) brightness(0.75)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-carbon-950/70 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
