import { cn } from "@/lib/cn";
import { LineReveal } from "@/components/motion/LineReveal";
import { Reveal } from "@/components/motion/Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  lines: string[];
  subtitle?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  titleClassName?: string;
}

export function SectionHeading({
  eyebrow,
  lines,
  subtitle,
  align = "left",
  tone = "dark",
  className,
  titleClassName,
}: SectionHeadingProps) {
  const isCenter = align === "center";
  const subtleColor = tone === "dark" ? "text-stone" : "text-paper/70";
  return (
    <div className={cn(isCenter && "text-center mx-auto", className)}>
      {eyebrow && (
        <Reveal y={12} duration={0.7}>
          <span
            className={cn(
              "block text-[0.72rem] font-medium uppercase tracking-[0.24em] mb-5",
              subtleColor
            )}
          >
            {eyebrow}
          </span>
        </Reveal>
      )}
      <h2
        className={cn(
          "font-serif font-light leading-[1.05] text-balance",
          "text-[clamp(2.2rem,5vw,4.25rem)]",
          tone === "dark" ? "text-ink" : "text-paper",
          titleClassName
        )}
      >
        <LineReveal lines={lines} />
      </h2>
      {subtitle && (
        <Reveal y={16} delay={0.15} className={cn("mt-6 max-w-xl", isCenter && "mx-auto")}>
          <p className={cn("text-[1.05rem] leading-relaxed", subtleColor)}>
            {subtitle}
          </p>
        </Reveal>
      )}
    </div>
  );
}
