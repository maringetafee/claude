"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "span";
  delay?: number;
  y?: number;
  /** Element tag wraps once — set to false to reveal children individually via [data-reveal-item] */
  stagger?: number;
};

export function Reveal({ children, className = "", as = "div", delay = 0, y = 28, stagger }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger ? Array.from(el.querySelectorAll<HTMLElement>("[data-reveal-item]")) : [el];
    if (stagger && targets.length === 0) targets.push(el);

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0, clipPath: "none" });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y, clipPath: "inset(0 0 12% 0)" });

      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0 0% 0)",
            duration: 0.9,
            ease: "power3.out",
            delay,
            stagger: stagger ?? 0,
          });
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [delay, y, stagger]);

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
