import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FrameSet {
  dir: string;
  count: number;
  width: number;
  height: number;
}

const HI: FrameSet = { dir: "/frames/hi", count: 148, width: 960, height: 540 };
const LO: FrameSet = { dir: "/frames/lo", count: 74, width: 480, height: 270 };

function pad4(n: number): string {
  return String(n).padStart(4, "0");
}

/** Picks the frame set for this device: fewer, smaller frames on small/low-memory devices. */
function pickFrameSet(): { set: FrameSet; step: number } {
  const isSmallViewport = window.innerWidth < 768;
  const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined
    && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;

  if (isSmallViewport || lowMemory) {
    // LO set only has every 2nd frame on disk, indices map 1..74 -> original 1..148 step 2
    return { set: LO, step: 2 };
  }
  return { set: HI, step: 1 };
}

export function initHeroScrollSequence(): void {
  const pin = document.querySelector<HTMLElement>("[data-hero-pin]");
  const stage = document.querySelector<HTMLElement>("[data-hero-stage]");
  const canvas = document.querySelector<HTMLCanvasElement>("[data-hero-canvas]");
  const wash = document.querySelector<HTMLElement>("[data-hero-wash]");
  const hint = document.querySelector<HTMLElement>("[data-scroll-hint]");
  const loading = document.querySelector<HTMLElement>("[data-hero-loading]");
  const loadingFill = document.querySelector<HTMLElement>("[data-hero-loading-fill]");

  if (!pin || !stage || !canvas) return;

  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const { set: frameSet, step } = pickFrameSet();
  const totalFrames = frameSet.count;

  const images: (HTMLImageElement | undefined)[] = new Array(totalFrames + 1);
  const loaded: boolean[] = new Array(totalFrames + 1).fill(false);
  let loadedCount = 0;
  let currentFrame = 1;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function frameSrc(index: number): string {
    return `${frameSet.dir}/frame-${pad4(index)}.webp`;
  }

  function sizeCanvas(): void {
    if (!canvas) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = stage!.clientWidth;
    const h = stage!.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  }

  function drawFrame(index: number): void {
    if (!canvas || !ctx) return;
    const img = images[index];
    if (!img) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = frameSet.width;
    const ih = frameSet.height;

    // cover-fit math: scale to fill, center-crop
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  /** Draws the nearest loaded frame to `index` so scrubbing never flashes black. */
  function drawNearest(index: number): void {
    if (loaded[index]) {
      currentFrame = index;
      drawFrame(index);
      return;
    }
    for (let d = 1; d < totalFrames; d++) {
      const down = index - d;
      const up = index + d;
      if (down >= 1 && loaded[down]) {
        drawFrame(down);
        return;
      }
      if (up <= totalFrames && loaded[up]) {
        drawFrame(up);
        return;
      }
    }
  }

  function updateLoadingUI(): void {
    if (!loadingFill || !loading) return;
    const pct = Math.round((loadedCount / totalFrames) * 100);
    loadingFill.style.width = `${pct}%`;
    if (loadedCount >= totalFrames || loadedCount >= Math.min(24, totalFrames)) {
      loading.setAttribute("data-done", "");
    }
  }

  function loadFrame(index: number, priority: boolean): Promise<void> {
    return new Promise((resolve) => {
      if (images[index]) {
        resolve();
        return;
      }
      const img = new Image();
      if (priority) img.fetchPriority = "high";
      img.decoding = "async";
      img.onload = () => {
        loaded[index] = true;
        loadedCount++;
        updateLoadingUI();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = frameSrc(index);
      images[index] = img;
    });
  }

  async function preload(): Promise<void> {
    // 1. First frame, blocking-ish, highest priority (LCP).
    await loadFrame(1, true);
    drawFrame(1);

    // 2. Sparse skeleton across the whole range so scrubbing anywhere
    //    immediately has *a* frame to show, even before the fill pass.
    const skeletonStride = Math.max(1, Math.round(totalFrames / 24));
    const skeleton: number[] = [];
    for (let i = 1; i <= totalFrames; i += skeletonStride) skeleton.push(i);
    if (skeleton[skeleton.length - 1] !== totalFrames) skeleton.push(totalFrames);

    await Promise.all(skeleton.map((i) => loadFrame(i, false)));

    // 3. Fill in the rest progressively, without blocking interaction.
    const remaining: number[] = [];
    for (let i = 1; i <= totalFrames; i++) if (!loaded[i]) remaining.push(i);

    for (const i of remaining) {
      await loadFrame(i, false);
      // yield to the main thread between loads so scroll stays smooth
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  sizeCanvas();
  window.addEventListener("resize", () => {
    sizeCanvas();
    drawNearest(currentFrame);
  });

  preload();

  if (reduceMotion) {
    // Static hero: show the final frame (eyes fully open) once available, no scrub.
    loadFrame(totalFrames, true).then(() => drawFrame(totalFrames));
    if (loading) loading.setAttribute("data-done", "");
    return;
  }

  let hintHidden = false;

  // The sticky visual pin is handled in CSS (`position: sticky` on .hero-stage
  // inside a tall .hero-pin container) — ScrollTrigger here only tracks
  // progress through that scroll distance to drive the canvas frame.
  ScrollTrigger.create({
    trigger: pin,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      if (!hintHidden && self.progress > 0.02 && hint) {
        hint.setAttribute("data-hidden", "");
        hintHidden = true;
      }

      // Map progress -> frame index on the ORIGINAL 1..148 timeline,
      // then translate to this device's frame set.
      const originalIndex = Math.min(
        totalFrames * step,
        Math.max(1, Math.round(self.progress * totalFrames * step) || 1)
      );
      const localIndex = Math.min(totalFrames, Math.max(1, Math.round(originalIndex / step)));
      drawNearest(localIndex);

      // Wash: fades in over the final 12% of the scrub, carrying the
      // video's colors into the page background for a seamless handoff.
      if (wash) {
        const washStart = 0.88;
        const t = Math.max(0, Math.min(1, (self.progress - washStart) / (1 - washStart)));
        wash.style.opacity = String(t);
      }
    },
  });
}
