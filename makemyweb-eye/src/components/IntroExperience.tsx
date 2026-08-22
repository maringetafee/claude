import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Phase = "video" | "frozen" | "done";

const SESSION_KEY = "mmw_intro_seen";
// Sampled the actual clip: it settles into the deep turquoise "inside the
// iris" tone by ~8s and holds. We freeze here — public/images/iris-bg.jpg
// is this exact frame, pre-cropped to the same zoom, and is the site's
// permanent background (see BackgroundField). Because both are identical
// pixels, fading the video out over it reads as no transition at all.
const VIDEO_CUTOFF = 8.3;
const FINAL_ZOOM = 1.9;
const ZOOM_START_TIME = 6.2; // start the cinematic zoom-in a couple seconds before the freeze
const HOLD_MS = 500; // beat on the frozen frame before handing off
const SAFETY_TIMEOUT_MS = 9500;

export function IntroExperience({ onDone }: { onDone: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [skip] = useState(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [phase, setPhase] = useState<Phase>(skip ? "done" : "video");
  const [videoTime, setVideoTime] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const finishedRef = useRef(false);
  const cutoffTriggeredRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    document.body.style.overflow = "";
    onDone();
  }, [onDone]);

  useEffect(() => {
    if (phase === "done") finish();
  }, [phase, finish]);

  useEffect(() => {
    if (skip) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => setShowSkip(true), 1200);
    const safety = setTimeout(() => {
      setPhase((p) => (p === "video" ? "frozen" : p));
    }, SAFETY_TIMEOUT_MS);
    return () => {
      clearTimeout(t);
      clearTimeout(safety);
    };
  }, [skip]);

  useEffect(() => {
    if (phase !== "frozen") return;
    const t = setTimeout(() => setPhase("done"), HOLD_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setVideoTime(v.currentTime);
    if (v.currentTime >= VIDEO_CUTOFF && !cutoffTriggeredRef.current) {
      cutoffTriggeredRef.current = true;
      v.pause();
      setPhase("frozen");
    }
  };

  const handleEnded = () => setPhase("frozen");
  const handleVideoError = () => setPhase("frozen");
  const handleSkip = () => setPhase("frozen");

  if (skip) return null;

  const zoomProgress = Math.min(
    Math.max((videoTime - ZOOM_START_TIME) / (VIDEO_CUTOFF - ZOOM_START_TIME), 0),
    1,
  );
  const zoomAmount = phase === "video" ? 1 + zoomProgress * (FINAL_ZOOM - 1) : FINAL_ZOOM;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-charcoal"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        >
          {!prefersReducedMotion && (
            <video
              ref={videoRef}
              className="h-full w-full object-cover"
              style={{
                transform: `scale(${zoomAmount})`,
                transition: "transform 60ms linear",
              }}
              src="/video/eye-intro.mp4"
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              onError={handleVideoError}
            />
          )}

          {prefersReducedMotion && (
            <div
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url(/images/iris-bg.jpg)" }}
            />
          )}

          {phase === "video" && (
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="font-display text-sm tracking-[0.35em] text-marble/70 uppercase">
                Entra en el ojo
              </p>
            </motion.div>
          )}

          <AnimatePresence>
            {showSkip && phase === "video" && (
              <motion.button
                type="button"
                onClick={handleSkip}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute top-6 right-6 z-10 rounded-full border border-marble/20 px-4 py-2 text-xs tracking-widest text-marble/60 uppercase transition-colors hover:border-iris/50 hover:text-marble cursor-pointer"
              >
                Saltar intro →
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
