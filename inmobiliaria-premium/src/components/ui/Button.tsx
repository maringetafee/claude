import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "light";

interface BaseProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-ink text-paper border border-ink hover:bg-transparent hover:text-ink",
  secondary:
    "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
  light:
    "bg-transparent text-paper border border-paper/70 hover:bg-paper hover:text-ink",
  ghost: "bg-transparent text-ink border border-transparent hover:border-ink",
};

const base =
  "group inline-flex items-center gap-3 px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-colors duration-400 ease-out";

function Arrow() {
  return (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      fill="none"
      className="shrink-0 transition-transform duration-400 ease-out group-hover:translate-x-1"
    >
      <path
        d="M0.5 5H15.5M15.5 5L11 0.5M15.5 5L11 9.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  href,
  ...rest
}: BaseProps & ComponentPropsWithoutRef<"a"> & { href?: string }) {
  const classes = cn(base, variantClasses[variant], className);
  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        <span>{children}</span>
        <Arrow />
      </Link>
    );
  }
  return (
    <button
      className={classes}
      {...(rest as ComponentPropsWithoutRef<"button">)}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  );
}
