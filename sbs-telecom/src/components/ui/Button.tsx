import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
};

export function Button({ href, children, variant = "primary", className = "", external }: ButtonProps) {
  const base =
    "group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full px-7 py-3.5 text-sm font-semibold tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-signal-500 focus-visible:outline-offset-4";

  const styles =
    variant === "primary"
      ? "bg-bone-100 text-carbon-950 hover:text-bone-100"
      : "border border-bone-100/25 text-bone-100 hover:border-signal-500/60";

  const content = (
    <>
      {variant === "primary" && (
        <span
          className="absolute inset-0 -translate-x-[101%] bg-signal-500 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
          aria-hidden
        />
      )}
      <span className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0.5">
        {children}
      </span>
    </>
  );

  if (external) {
    return (
      <a href={href} className={`${base} ${styles} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {content}
    </Link>
  );
}
