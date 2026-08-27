import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}

export function Button({ href, children, variant = "primary", className = "" }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-7 py-3.5 text-sm font-medium tracking-wide transition-all duration-[var(--duration-normal)] ease-[var(--ease-standard)] active:scale-[0.97]";

  const styles =
    variant === "primary"
      ? "text-[var(--color-background)] bg-[var(--color-primary)] hover:bg-[var(--color-accent)] hover:text-[var(--color-background)]"
      : "text-[var(--color-primary)] bg-transparent border border-[var(--color-border)] hover:border-[var(--color-primary)]";

  return (
    <Link
      href={href}
      className={`${base} ${styles} ${className}`}
      style={{ borderRadius: "var(--radius-sm)" }}
    >
      {children}
    </Link>
  );
}
