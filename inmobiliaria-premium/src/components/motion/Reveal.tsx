"use client";

import { useInView } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { Children, cloneElement, isValidElement, useRef } from "react";
import { cn } from "@/lib/cn";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  duration?: number;
  once?: boolean;
}

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 0.9,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : `translateY(${y}px)`,
    transitionProperty: "opacity, transform",
    transitionDuration: `${duration}s`,
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${delay}s`,
  };

  return (
    <div ref={ref} className={cn(className)} style={style}>
      {children}
    </div>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
}

export function Stagger({ children, className, once = true }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-10% 0px -10% 0px" });

  const items = Children.toArray(children);

  return (
    <div ref={ref} className={cn(className)}>
      {items.map((child, i) =>
        isValidElement(child)
          ? cloneElement(child as React.ReactElement<{ inView?: boolean; index?: number }>, {
              inView,
              index: i,
            })
          : child
      )}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  inView = false,
  index = 0,
  step = 0.12,
}: {
  children: ReactNode;
  className?: string;
  inView?: boolean;
  index?: number;
  step?: number;
}) {
  const style: CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transitionProperty: "opacity, transform",
    transitionDuration: "0.8s",
    transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
    transitionDelay: `${0.05 + index * step}s`,
  };

  return (
    <div className={cn(className)} style={style}>
      {children}
    </div>
  );
}
