import { siteConfig } from "@/lib/site-config";

/**
 * Wordmark: the "DIACORT / SEMA-DUR" lockup rebuilt as SVG + text so it stays
 * crisp at any size and adapts to light / dark surfaces. `size` drives scale.
 */
export default function Logo({
  className = "",
  size = 32,
  invert = false,
}: {
  className?: string;
  size?: number;
  invert?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 ${className}`}
      style={{ fontSize: size }}
    >
      <svg
        viewBox="0 0 32 32"
        width="1em"
        height="1em"
        role="img"
        aria-label={`${siteConfig.name} (${siteConfig.brand})`}
        className="shrink-0"
      >
        <path d="M16 2l14 14-14 14L2 16z" fill="var(--color-brand)" />
        <path d="M16 2l14 14-14 5z" fill="var(--color-accent)" />
        <path d="M16 2L2 16l14 5z" fill="var(--brand-600)" />
      </svg>
      <span className="flex flex-col leading-none">
        <span
          className={`font-display font-bold tracking-[0.2em] ${
            invert
              ? "text-[var(--color-ink-invert-soft)]"
              : "text-[var(--color-accent-strong)]"
          }`}
          style={{ fontSize: "0.36em" }}
        >
          DIACORT
        </span>
        <span
          className={`font-display font-bold leading-none tracking-tight ${
            invert ? "text-white" : "text-[var(--color-ink)]"
          }`}
          style={{ fontSize: "0.62em", marginTop: "0.08em" }}
        >
          SEMA-DUR
        </span>
      </span>
    </span>
  );
}
