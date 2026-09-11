"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

/** Referencia al smooth scroll para poder pausarlo (menú móvil abierto). */
export const lenisRef: { current: Lenis | null } = { current: null };

const HOVER_TARGETS = "a, button, label, .magnetic, .service-card, .look, .product-card";

// Mismas animaciones que la plantilla original (GSAP + ScrollTrigger + Lenis),
// adaptadas a navegación entre páginas: lo global se monta una vez y lo de
// cada página se crea y se destruye al cambiar de ruta.
export function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer:fine)").matches;
    const cleanups: Array<() => void> = [];

    if (!reduceMotion && finePointer) {
      // Smooth scroll
      const lenis = new Lenis({ duration: 1.05, smoothWheel: true });
      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time: number) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      cleanups.push(() => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        lenisRef.current = null;
      });

      // Cursor personalizado
      const dot = document.querySelector<HTMLElement>(".cursor-dot");
      const ring = document.querySelector<HTMLElement>(".cursor-ring");
      if (dot && ring) {
        document.body.classList.add("has-custom-cursor");
        const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
        const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
        const ringX = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
        const ringY = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          dotX(e.clientX);
          dotY(e.clientY);
          ringX(e.clientX);
          ringY(e.clientY);
        };
        const onOver = (e: MouseEvent) => {
          const target = e.target instanceof Element ? e.target : null;
          ring.classList.toggle("is-active", Boolean(target?.closest(HOVER_TARGETS)));
        };
        window.addEventListener("pointermove", onMove);
        document.addEventListener("mouseover", onOver);
        cleanups.push(() => {
          window.removeEventListener("pointermove", onMove);
          document.removeEventListener("mouseover", onOver);
          document.body.classList.remove("has-custom-cursor");
        });
      }

      // Botones magnéticos (delegado: funciona con elementos de cualquier página)
      let current: HTMLElement | null = null;
      const release = (el: HTMLElement) => gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, .4)" });
      const onMagnet = (e: PointerEvent) => {
        const target = e.target instanceof Element ? e.target.closest<HTMLElement>(".magnetic") : null;
        if (current && current !== target) release(current);
        current = target;
        if (!target) return;
        const r = target.getBoundingClientRect();
        gsap.to(target, {
          x: (e.clientX - r.left - r.width / 2) * 0.35,
          y: (e.clientY - r.top - r.height / 2) * 0.35,
          duration: 0.4,
          ease: "power3.out",
        });
      };
      document.addEventListener("pointermove", onMagnet);
      cleanups.push(() => document.removeEventListener("pointermove", onMagnet));
    }

    // Barra de progreso de lectura
    const progress = gsap.to(".scroll-progress", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: true },
    });
    cleanups.push(() => {
      progress.scrollTrigger?.kill();
      progress.kill();
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const has = (selector: string) => document.querySelector(selector) !== null;

    const ctx = gsap.context(() => {
      // Pétalos flotando en el hero
      if (!reduceMotion) {
        gsap.utils.toArray<HTMLElement>(".petal").forEach((petal, i) => {
          gsap.to(petal, { y: "+=40", x: "+=18", rotate: 25, duration: 6 + i, repeat: -1, yoyo: true, ease: "sine.inOut", delay: i * 0.4 });
        });
      }

      // Manifiesto: las palabras se colorean al hacer scroll
      const words = gsap.utils.toArray<HTMLElement>(".manifesto__text .word");
      if (words.length) {
        if (reduceMotion) words.forEach((w) => (w.style.color = w.dataset.color || "#23281f"));
        else
          gsap.to(words, {
            color: (_i: number, el: HTMLElement) => el.dataset.color || "#23281f",
            stagger: 0.03,
            scrollTrigger: { trigger: ".manifesto__text", start: "top 78%", end: "bottom 55%", scrub: true },
          });
      }

      if (reduceMotion) return;

      // Imágenes que se descubren con barrido
      gsap.utils.toArray<HTMLElement>(".reveal-img").forEach((el) => {
        gsap.set(el, { clipPath: "inset(0 0 0 100%)" });
        gsap.to(el, { clipPath: "inset(0 0 0 0%)", duration: 1, ease: "power4.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        const img = el.querySelector("img");
        if (img) gsap.to(img, { scale: 1, duration: 1.3, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
      });

      if (has(".looks__grid"))
        gsap.from(".look", { opacity: 0, y: 40, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".looks__grid", start: "top 85%" } });

      // Contadores
      gsap.utils.toArray<HTMLElement>(".stat strong[data-count]").forEach((el) => {
        const target = Number(el.dataset.count) || 0;
        const counter = { value: 0 };
        el.textContent = "0";
        gsap.to(counter, {
          value: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onUpdate() {
            el.textContent = Math.round(counter.value).toLocaleString("es-ES");
          },
        });
      });

      if (has(".craft__list"))
        gsap.from(".craft__list li", { opacity: 0, x: -24, duration: 0.5, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ".craft__list", start: "top 82%" } });

      if (has(".reviews__grid"))
        gsap.from(".review-card", { opacity: 0, y: 30, duration: 0.6, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: ".reviews__grid", start: "top 85%" } });
    });

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [pathname]);

  return null;
}
