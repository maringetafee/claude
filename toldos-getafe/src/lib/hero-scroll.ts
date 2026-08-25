export const HERO_FRAME_COUNT = 55;
export const HERO_DESKTOP_BREAKPOINT = 768;
// How much scroll distance (in viewport heights) the frame sequence scrubs
// over before settling on the final frame. The hero's own pinned content
// uses the exact same distance so it releases right as the background
// finishes scrubbing.
export const HERO_SCRUB_VH = 2.8;

export function heroFrameUrl(index: number, mobile: boolean) {
  const n = String(index).padStart(3, "0");
  return mobile
    ? `/hero/frames-mobile/frame-${n}.webp`
    : `/hero/frames/frame-${n}.webp`;
}
