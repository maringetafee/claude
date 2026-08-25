"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Direction = "top" | "right" | "bottom" | "left";

const OFFSET: Record<Direction, { xPercent?: number; yPercent?: number }> = {
  top: { yPercent: -55 },
  bottom: { yPercent: 55 },
  left: { xPercent: -55 },
  right: { xPercent: 55 },
};

type PanelSectionProps = {
  children: React.ReactNode;
  from?: Direction;
  id?: string;
  className?: string;
};

/**
 * A near-full-screen panel that slides in from one edge (over the fixed
 * toldo backdrop) the first time it scrolls into view, then stays put in
 * normal document flow — no pinning, no scroll-jacking.
 */
export default function PanelSection({
  children,
  from = "bottom",
  id,
  className = "",
}: PanelSectionProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const panel = panelRef.current;
    if (!el || !panel) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    const offset = OFFSET[from];
    gsap.set(panel, { autoAlpha: 0, ...offset });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.to(panel, {
          autoAlpha: 1,
          xPercent: 0,
          yPercent: 0,
          duration: 1.1,
          ease: "power3.out",
        });
        observer.disconnect();
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [from]);

  return (
    <section
      id={id}
      ref={wrapRef}
      className="relative z-10 flex min-h-[100dvh] items-center justify-center overflow-x-hidden px-3 py-4 sm:px-5 sm:py-6"
    >
      <div ref={panelRef} className={`w-full max-w-[1600px] ${className}`}>
        {children}
      </div>
    </section>
  );
}
