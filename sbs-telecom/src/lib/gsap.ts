"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out", duration: 0.8 });
}

/** CSS `prefers-reduced-motion` only mutes CSS transitions/animations — GSAP tweens
 *  set inline styles via rAF and ignore it entirely, so every scroll/parallax/timeline
 *  effect must check this explicitly and fall back to an instant, static end-state. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export { gsap, ScrollTrigger };
