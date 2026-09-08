import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "solid" | "accent" | "outline" | "ghost" | "invert";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium tracking-tight rounded-[var(--radius-sm)] transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-[var(--ease-out)] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand)] active:translate-y-px disabled:opacity-55 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  solid:
    "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-strong)] shadow-[var(--shadow-sm)]",
  accent:
    "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-strong)] shadow-[var(--shadow-sm)]",
  outline:
    "border border-[var(--color-line-strong)] text-[var(--color-ink)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] bg-transparent",
  ghost:
    "text-[var(--color-ink-soft)] hover:text-[var(--color-brand)] hover:bg-[var(--color-brand-tint)]",
  invert:
    "bg-white text-[var(--color-ink)] hover:bg-[var(--color-ink-invert)]",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-2 min-h-9",
  md: "text-[0.95rem] px-5 py-2.5 min-h-11",
  lg: "text-base px-6 py-3.5 min-h-13",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "solid",
  size = "md",
  className = "",
  ...props
}: CommonProps & ComponentProps<"button">) {
  const { children, ...rest } = props;
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "solid",
  size = "md",
  className = "",
  href,
  children,
  external,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<
    ComponentProps<"a">,
    "href"
  >) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
  if (external || href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a
        href={href}
        className={cls}
        {...(external || href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
        {...rest}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
    </Link>
  );
}
