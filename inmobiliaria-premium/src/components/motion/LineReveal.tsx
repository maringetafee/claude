"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

interface LineRevealProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  trigger?: "view" | "mount";
}

export function LineReveal({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.12,
  once = true,
  trigger = "view",
}: LineRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once, margin: "-5% 0px -5% 0px" });
  const active = trigger === "mount" || inView;

  return (
    <span ref={ref} className={cn("block", className)}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <span
            className={cn("block", lineClassName)}
            style={{
              transform: active ? "translateY(0%)" : "translateY(110%)",
              transitionProperty: "transform",
              transitionDuration: "0.95s",
              transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
              transitionDelay: `${delay + i * stagger}s`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}
