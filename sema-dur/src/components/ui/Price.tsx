import type { Product } from "@/data/products";

/**
 * Price display. The catalogue is quote-first: no product carries a price yet.
 * When a product later gets `price`/`compareAt`, extend this component — the
 * data model and callers already treat price as optional.
 */
export default function Price({
  size = "md",
  className = "",
}: {
  /** Kept for when priced products arrive; unused while the catalogue is quote-only. */
  product?: Pick<Product, "availability">;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeCls =
    size === "lg"
      ? "text-xl"
      : size === "sm"
        ? "text-sm"
        : "text-base";
  return (
    <span className={`font-display font-semibold text-[var(--color-ink)] ${sizeCls} ${className}`}>
      Consultar precio
    </span>
  );
}

export function PriceNote({ className = "" }: { className?: string }) {
  return (
    <span className={`text-sm text-[var(--color-ink-muted)] ${className}`}>
      Presupuesto sin compromiso · IVA no incluido
    </span>
  );
}
