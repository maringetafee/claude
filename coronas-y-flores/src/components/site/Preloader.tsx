"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

// El preloader de la plantilla solo se reproduce en la primera carga de la
// visita; al volver a la portada navegando dentro de la web no se repite.
let hasPlayed = false;

export function Preloader({ word, meta }: { word: string; meta: string }) {
  const [visible, setVisible] = useState(() => !hasPlayed);

  useEffect(() => {
    if (!visible) return;
    hasPlayed = true;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.style.overflow = "hidden";
    let started = false;
    let tl: gsap.core.Timeline | null = null;

    const reveal = () => {
      if (started) return;
      started = true;
      document.body.style.overflow = "";
      if (reduceMotion) {
        setVisible(false);
        return;
      }
      tl = gsap.timeline({ defaults: { ease: "power3.out" }, onComplete: () => setVisible(false) });
      tl.to(".preloader__line span", { scaleX: 1, duration: 0.3 }, 0)
        .to(".preloader__percent", { textContent: 100, duration: 0.3, snap: { textContent: 1 } }, 0)
        .to(".preloader__word", { opacity: 0, y: -20, duration: 0.3 }, 0.2)
        .to(".preloader", { yPercent: -100, duration: 0.5, ease: "power4.inOut" }, 0.32)
        .from(".site-header", { y: -40, opacity: 0, duration: 0.4, clearProps: "transform,opacity" }, 0.5)
        .from(".hero__kicker", { y: 16, opacity: 0, duration: 0.35 }, 0.55)
        .from(".hero__title .line span", { yPercent: 110, duration: 0.55, stagger: 0.07 }, 0.58)
        .from(".hero__copy, .hero__actions", { y: 20, opacity: 0, duration: 0.4, stagger: 0.06 }, 0.78);
    };

    const timer = window.setTimeout(reveal, 900);
    const raf = document.readyState === "complete" ? requestAnimationFrame(reveal) : 0;
    window.addEventListener("load", reveal, { once: true });

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      window.removeEventListener("load", reveal);
      document.body.style.overflow = "";
      tl?.kill();
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div aria-hidden="true" className="preloader">
      <div className="preloader__inner">
        <div className="preloader__word">{word}</div>
        <div className="preloader__line">
          <span />
        </div>
        <div className="preloader__meta">
          <span>{meta}</span>
          <span className="preloader__percent">0%</span>
        </div>
      </div>
    </div>
  );
}
