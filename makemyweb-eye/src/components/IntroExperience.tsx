import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const SESSION_KEY = "mmw_intro_seen";
const FRAME_COUNT = 100;
// How many viewport-heights of scroll it takes to scrub through every frame.
const TRACK_VH = 260;
// Cap the canvas backing store on very-high-DPR phones so each redraw stays cheap.
const MAX_DPR = 2;
const SKIP_DELAY_MS = 900;
// Progress (0-1) at which the intro starts dissolving into the page. It reaches
// full transparency right as the sticky frame releases, so the handoff to the
// header/hero underneath reads as one continuous transition, not a scroll-reveal.
const FADE_START = 0.88;

const framePath = (i: number) =>
  `/images/intro-frames/f${String(i).padStart(3, "0")}.webp`;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (img.decode) {
        img
          .decode()
          .then(() => resolve(img))
          .catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = () => reject(new Error(`failed to load ${src}`));
    img.src = src;
  });
}

export function IntroExperience() {
  const prefersReducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastFrameRef = useRef(-1);
  const trackHeightRef = useRef(0);
  const finishedRef = useRef(false);

  const [skip] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [ready, setReady] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const active = !skip && !prefersReducedMotion && !dismissed;

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable */
    }
  };

  // A reload can restore the browser's previous scroll position before this
  // component ever mounts, which would desync the frame from actual scroll.
  useEffect(() => {
    if (!active) return;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, [active]);

  // Preload every frame up front so scrubbing never hits a missing image.
  // Scrolling stays locked until this resolves.
  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    let cancelled = false;

    const skipTimer = setTimeout(() => setShowSkip(true), SKIP_DELAY_MS);

    Promise.all(
      Array.from({ length: FRAME_COUNT }, (_, i) => loadImage(framePath(i))),
    )
      .then((imgs) => {
        if (cancelled) return;
        imagesRef.current = imgs;
        document.body.style.overflow = "";
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        finish();
        document.body.style.overflow = "";
        setDismissed(true);
      });

    return () => {
      cancelled = true;
      clearTimeout(skipTimer);
    };
  }, [active]);

  // The actual scroll-scrub loop: rAF-throttled so it draws at most once per
  // frame no matter how many scroll events fire.
  useEffect(() => {
    if (!active || !ready) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let ticking = false;

    const drawCover = (img: HTMLImageElement) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const imgRatio = img.width / img.height;
      const canvasRatio = w / h;
      let sx = 0;
      let sy = 0;
      let sw = img.width;
      let sh = img.height;
      if (imgRatio > canvasRatio) {
        sh = img.height;
        sw = sh * canvasRatio;
        sx = (img.width - sw) / 2;
      } else {
        sw = img.width;
        sh = sw / canvasRatio;
        sy = (img.height - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
    };

    const getProgress = () => {
      const total = trackHeightRef.current - window.innerHeight;
      if (total <= 0) return 1;
      return Math.min(1, Math.max(0, window.scrollY / total));
    };

    const draw = () => {
      ticking = false;
      const progress = getProgress();
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT),
      );
      if (frameIndex !== lastFrameRef.current) {
        lastFrameRef.current = frameIndex;
        const img = imagesRef.current[frameIndex];
        if (img) drawCover(img);
      }

      const fade =
        progress <= FADE_START
          ? 1
          : 1 - (progress - FADE_START) / (1 - FADE_START);
      if (wrapperRef.current) {
        wrapperRef.current.style.opacity = String(fade);
        wrapperRef.current.style.pointerEvents = fade <= 0 ? "none" : "auto";
      }

      if (progress >= 1) finish();
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      trackHeightRef.current = trackRef.current?.offsetHeight ?? 0;
      lastFrameRef.current = -1;
      draw();
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", resize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      window.removeEventListener("orientationchange", resize);
    };
  }, [active, ready]);

  const handleSkip = () => {
    if (!ready) {
      finish();
      document.body.style.overflow = "";
      setDismissed(true);
      return;
    }
    const total = trackHeightRef.current - window.innerHeight;
    window.scrollTo({ top: Math.max(total, 0) + 4, behavior: "smooth" });
  };

  if (!active) return null;

  return (
    <div ref={trackRef} style={{ height: `${TRACK_VH}vh` }} className="relative">
      <div
        ref={wrapperRef}
        className="sticky top-0 z-50 h-[100dvh] overflow-hidden bg-charcoal"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-charcoal">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-marble/20 border-t-iris" />
          </div>
        )}

        {ready && (
          <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
            <p className="font-display text-sm tracking-[0.35em] text-marble/70 uppercase">
              Desliza para entrar
            </p>
          </div>
        )}

        {showSkip && (
          <button
            type="button"
            onClick={handleSkip}
            className="absolute top-6 right-6 z-10 rounded-full border border-marble/20 px-4 py-2 text-xs tracking-widest text-marble/60 uppercase transition-colors hover:border-iris/50 hover:text-marble cursor-pointer"
          >
            Saltar intro →
          </button>
        )}
      </div>
    </div>
  );
}
