"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { Reveal } from "./ui/Reveal";

const nodes = [
  { x: 120, y: 90 }, { x: 260, y: 60 }, { x: 340, y: 150 }, { x: 200, y: 190 },
  { x: 420, y: 100 }, { x: 460, y: 220 }, { x: 320, y: 270 }, { x: 150, y: 260 },
  { x: 60, y: 180 }, { x: 380, y: 320 }, { x: 220, y: 340 }, { x: 500, y: 300 },
];

const links: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0], [1, 4], [4, 5], [5, 2], [2, 6], [6, 3],
  [3, 7], [7, 8], [0, 8], [6, 9], [9, 5], [6, 10], [7, 10], [9, 11], [5, 11],
];

export function MadridNetwork() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const paths = svgRef.current?.querySelectorAll<SVGLineElement>("[data-link]");
      const pulses = svgRef.current?.querySelectorAll<SVGCircleElement>("[data-pulse]");
      gsap.set(paths ?? [], { opacity: 0.5 });
      gsap.set(pulses ?? [], { opacity: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const paths = svgRef.current?.querySelectorAll<SVGLineElement>("[data-link]");
      const dots = svgRef.current?.querySelectorAll<SVGCircleElement>("[data-node]");

      gsap.set(paths ?? [], { opacity: 0 });
      gsap.set(dots ?? [], { scale: 0, transformOrigin: "center" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: rootRef.current, start: "top 65%", once: true },
      });
      tl.to(paths ?? [], { opacity: 0.5, duration: 1, stagger: 0.03, ease: "power1.out" })
        .to(dots ?? [], { scale: 1, duration: 0.4, stagger: 0.04, ease: "back.out(1.6)" }, "-=0.7");

      // Traveling pulse along a couple of links, looping subtly.
      const pulses = svgRef.current?.querySelectorAll<SVGCircleElement>("[data-pulse]");
      pulses?.forEach((pulse, i) => {
        const path = svgRef.current?.querySelector<SVGLineElement>(`[data-link-index="${i % links.length}"]`);
        if (!path) return;
        const x1 = Number(path.getAttribute("x1"));
        const y1 = Number(path.getAttribute("y1"));
        const x2 = Number(path.getAttribute("x2"));
        const y2 = Number(path.getAttribute("y2"));
        gsap.set(pulse, { attr: { cx: x1, cy: y1 }, opacity: 0 });
        gsap.to(pulse, {
          attr: { cx: x2, cy: y2 },
          opacity: 1,
          duration: 2.2,
          delay: 1.4 + i * 1.1,
          repeat: -1,
          repeatDelay: 2.4,
          ease: "power1.inOut",
          yoyo: false,
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-carbon-950 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <Reveal>
            <span className="mono-label text-[11px] text-signal-500">Cobertura</span>
            <h2 className="mt-4 max-w-md text-balance font-display text-4xl font-bold tracking-tight text-bone-100 sm:text-5xl">
              Una red que conecta Madrid.
            </h2>
            <p className="mt-6 max-w-sm text-bone-500">
              Trabajamos en toda la Comunidad de Madrid, desde el mantenimiento de una sola antena hasta la
              conservación integral de comunidades enteras.
            </p>
            <div className="mt-8 grain relative h-40 w-32 overflow-hidden rounded-sm bg-carbon-800">
              <Image
                src="/images/madrid-torre.jpg"
                alt="Antena de telecomunicaciones sobre un edificio en Madrid"
                fill
                sizes="130px"
                className="object-cover"
                style={{ filter: "grayscale(0.3) contrast(1.1) brightness(0.85)" }}
              />
            </div>
          </Reveal>

          <div className="relative">
            <svg
              ref={svgRef}
              viewBox="0 0 560 400"
              className="w-full text-bone-400"
              fill="none"
              role="img"
              aria-label="Representación estilizada de una red de telecomunicaciones extendida por el territorio"
            >
              {links.map(([a, b], i) => (
                <line
                  key={i}
                  data-link
                  data-link-index={i}
                  x1={nodes[a].x}
                  y1={nodes[a].y}
                  x2={nodes[b].x}
                  y2={nodes[b].y}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              ))}
              {nodes.map((n, i) => (
                <circle key={i} data-node cx={n.x} cy={n.y} r={i % 5 === 0 ? 4 : 2.5} fill={i % 5 === 0 ? "var(--color-signal-500)" : "currentColor"} />
              ))}
              {[0, 1, 2].map((i) => {
                const [a] = links[i % links.length];
                return (
                  <circle
                    key={`pulse-${i}`}
                    data-pulse
                    cx={nodes[a].x}
                    cy={nodes[a].y}
                    r="3.5"
                    fill="var(--color-signal-500)"
                  />
                );
              })}
            </svg>
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] tracking-[0.12em] text-bone-600">
              <span>RED ESTILIZADA — REPRESENTACIÓN NO CARTOGRÁFICA</span>
              <span>MADRID</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
