import type { ElementType, ReactNode } from "react";

export function Container({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return <Tag className={`container-page ${className}`}>{children}</Tag>;
}

type SectionProps = {
  children: ReactNode;
  className?: string;
  /** Vertical rhythm. */
  space?: "sm" | "md" | "lg";
  tone?: "default" | "soft" | "steel" | "ink";
  id?: string;
  as?: ElementType;
};

const spaceMap = {
  sm: "py-12 sm:py-16",
  md: "py-16 sm:py-24",
  lg: "py-20 sm:py-32",
};

const toneMap = {
  default: "bg-[var(--color-bg)] text-[var(--color-ink)]",
  soft: "bg-[var(--color-bg-soft)] text-[var(--color-ink)]",
  steel: "bg-[var(--color-bg-steel)] text-[var(--color-ink)]",
  ink: "bg-[var(--color-bg-invert)] text-[var(--color-ink-invert)]",
};

export function Section({
  children,
  className = "",
  space = "md",
  tone = "default",
  id,
  as: Tag = "section",
}: SectionProps) {
  return (
    <Tag id={id} className={`${spaceMap[space]} ${toneMap[tone]} ${className}`}>
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "start",
  className = "",
  invert = false,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  className?: string;
  invert?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-4 ${
        align === "center" ? "items-center text-center mx-auto max-w-2xl" : "max-w-2xl"
      } ${className}`}
    >
      {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
      <h2 className="text-3xl sm:text-[2.6rem] leading-[1.06]">{title}</h2>
      {lead ? (
        <p
          className={`text-lg leading-relaxed ${
            invert ? "text-[var(--color-ink-invert-soft)]" : "text-[var(--color-ink-soft)]"
          }`}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
