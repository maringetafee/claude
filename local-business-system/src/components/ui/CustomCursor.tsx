"use client";

import { useEffect, useRef } from "react";

/** Cursor de punto + anillo con retardo, propio del tema street-neon.
 * Se desactiva por completo (no monta nada, no oculta el cursor nativo) en
 * pantallas tactiles o si el usuario prefiere menos movimiento. */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.style.cursor = "none";

    let mx = 0,
      my = 0,
      rx = 0,
      ry = 0;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }
    };

    const tick = () => {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`;
        ringRef.current.style.top = `${ry}px`;
      }
      raf = requestAnimationFrame(tick);
    };

    const onEnter = () => {
      dotRef.current?.classList.add("cursor-dot-big");
      ringRef.current?.classList.add("cursor-ring-big");
    };
    const onLeave = () => {
      dotRef.current?.classList.remove("cursor-dot-big");
      ringRef.current?.classList.remove("cursor-ring-big");
    };

    document.addEventListener("mousemove", onMove);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });
    raf = requestAnimationFrame(tick);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.querySelectorAll("a, button").forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
        style={{ background: "var(--color-accent)" }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring fixed top-0 left-0 w-[38px] h-[38px] rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2"
        style={{ border: "1px solid color-mix(in srgb, var(--color-accent) 35%, transparent)" }}
        aria-hidden="true"
      />
    </>
  );
}
