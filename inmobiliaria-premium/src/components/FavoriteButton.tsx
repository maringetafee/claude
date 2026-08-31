"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe, toggleFavorite } from "@/lib/favorites-store";
import { cn } from "@/lib/cn";

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
  size?: "sm" | "md";
  tone?: "overlay" | "solid";
}

const HEART_PATH =
  "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";

const toneClasses = {
  overlay: "border-paper/60 bg-ink/30 text-paper backdrop-blur-[2px] hover:bg-ink/50",
  solid: "border-line text-ink hover:bg-paper-dim",
};

export function FavoriteButton({
  propertyId,
  className,
  size = "md",
  tone = "overlay",
}: FavoriteButtonProps) {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const active = ids.includes(propertyId);
  const reduceMotion = useReducedMotion();
  const dim = size === "sm" ? 32 : 38;
  const iconSize = size === "sm" ? 15 : 17;

  return (
    <button
      type="button"
      aria-label={active ? "Quitar de favoritos" : "Añadir a favoritos"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      className={cn(
        "flex items-center justify-center border transition-colors duration-300",
        toneClasses[tone],
        className
      )}
      style={{ width: dim, height: dim }}
    >
      <motion.svg
        key={active ? "active" : "inactive"}
        width={iconSize}
        height={iconSize}
        viewBox="0 0 24 24"
        animate={reduceMotion ? undefined : { scale: [1, 1.28, 1] }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
      >
        <path
          d={HEART_PATH}
          fill={active ? "#b3134f" : "none"}
          stroke={active ? "#b3134f" : "currentColor"}
          strokeWidth="1.6"
        />
      </motion.svg>
    </button>
  );
}
