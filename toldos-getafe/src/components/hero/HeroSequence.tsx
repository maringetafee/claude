"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { HERO_SCRUB_VH } from "@/lib/hero-scroll";

type HeroSequenceProps = {
  children: React.ReactNode;
};

/**
 * The hero's foreground content — pinned in place for the same scroll
 * distance the global fixed background (FixedCinematicBackground) takes
 * to scrub through the awning sequence, then releases. The background
 * itself lives outside this component so there's no seam once it hands
 * off to the sections below.
 */
export default function HeroSequence({ children }: HeroSequenceProps) {
  const wrapperRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    gsap.registerPlugin(ScrollTrigger);
    const REVEAL_START = 0.72;
    gsap.set(contentRef.current, { autoAlpha: 0, y: 24 });

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: `+=${HERO_SCRUB_VH * 100}%`,
        pin: true,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const reveal = gsap.utils.clamp(
            0,
            1,
            (self.progress - REVEAL_START) / (1 - REVEAL_START)
          );
          gsap.set(contentRef.current, {
            autoAlpha: reveal,
            y: 24 * (1 - reveal),
          });
        },
      });

      return () => st.kill();
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={wrapperRef}
      className="relative h-screen w-screen overflow-hidden"
      aria-label="Toldos Getafe — protección solar y diseño de espacios exteriores"
    >
      <div
        ref={contentRef}
        className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24"
      >
        {children}
      </div>
    </section>
  );
}
