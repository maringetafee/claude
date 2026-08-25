"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  HERO_FRAME_COUNT,
  HERO_DESKTOP_BREAKPOINT,
  HERO_SCRUB_VH,
  heroFrameUrl,
} from "@/lib/hero-scroll";

/**
 * The awning sequence as a single fixed layer behind the entire page —
 * not just the hero. It scrubs frame-by-frame with the first stretch of
 * scroll, then holds on the last frame as the permanent backdrop for
 * every section below, so there is no seam between "hero background" and
 * "page background": it is the same element throughout.
 */
export default function FixedCinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameIndexRef = useRef(0);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  // Only the homepage plays the scroll-scrub; every other page shows the
  // final frame immediately as a plain static backdrop.
  const shouldScrub = pathname === "/";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      !shouldScrub ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < HERO_DESKTOP_BREAKPOINT;
    let cancelled = false;

    function draw(img: HTMLImageElement) {
      const c = canvasRef.current;
      const c2 = c?.getContext("2d");
      if (!c || !c2 || !img.complete || img.naturalWidth === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c2.setTransform(dpr, 0, 0, dpr, 0, 0);
      c2.imageSmoothingEnabled = true;
      c2.imageSmoothingQuality = "high";

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const boxRatio = w / h;
      let drawW: number, drawH: number, dx: number, dy: number;
      if (imgRatio > boxRatio) {
        drawH = h;
        drawW = h * imgRatio;
        dx = (w - drawW) / 2;
        dy = 0;
      } else {
        drawW = w;
        drawH = w / imgRatio;
        dx = 0;
        dy = (h - drawH) / 2;
      }
      c2.clearRect(0, 0, w, h);
      c2.drawImage(img, dx, dy, drawW, drawH);
    }

    const preload = async () => {
      const urls = Array.from({ length: HERO_FRAME_COUNT }, (_, i) =>
        heroFrameUrl(i, mobile)
      );
      const loaded = await Promise.all(
        urls.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve) => {
              const img = new Image();
              img.decoding = "async";
              img.onload = () => resolve(img);
              img.onerror = () => resolve(img);
              img.src = src;
            })
        )
      );
      if (cancelled) return;
      imagesRef.current = loaded;
      const startIndex = reduceMotion ? HERO_FRAME_COUNT - 1 : 0;
      frameIndexRef.current = startIndex;
      draw(loaded[startIndex]);
      setReady(true);
    };

    preload();

    const handleResize = () => {
      const current = imagesRef.current[frameIndexRef.current];
      if (current) draw(current);
    };
    window.addEventListener("resize", handleResize);

    if (reduceMotion) {
      return () => {
        cancelled = true;
        window.removeEventListener("resize", handleResize);
      };
    }

    const scrubDistance = () => window.innerHeight * HERO_SCRUB_VH;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const progress = Math.min(
          1,
          Math.max(0, window.scrollY / scrubDistance())
        );
        const idx = Math.min(
          HERO_FRAME_COUNT - 1,
          Math.floor(progress * HERO_FRAME_COUNT)
        );
        if (idx !== frameIndexRef.current) {
          frameIndexRef.current = idx;
          const img = imagesRef.current[idx];
          if (img) draw(img);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      cancelled = true;
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [shouldScrub]);

  return (
    <div className="fixed inset-0 -z-10 bg-ink" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full transition-opacity duration-500"
        style={{ opacity: ready ? 1 : 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/25 to-ink/40" />
    </div>
  );
}
