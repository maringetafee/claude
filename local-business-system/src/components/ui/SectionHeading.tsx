"use client";

import { useReveal } from "@/lib/useReveal";

export function SectionHeading({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  align?: "left" | "center";
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""} transition-all duration-[var(--duration-slow)] ease-[var(--ease-smooth)] ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <p
        className="text-xs font-medium uppercase tracking-[0.3em] mb-4"
        style={{ color: "var(--color-accent)" }}
      >
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl md:text-5xl leading-[1.05]" style={{ color: "var(--color-primary)" }}>
        {title}
      </h2>
    </div>
  );
}
