"use client";

import Icon from "./Icon";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  label = "Cantidad",
  size = "md",
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const btn =
    size === "sm"
      ? "h-8 w-8"
      : "h-11 w-11";
  const field = size === "sm" ? "w-10 text-sm" : "w-12 text-base";

  const clamp = (n: number) => Math.max(min, Math.min(max, n));

  return (
    <div className="inline-flex items-center rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className={`${btn} grid place-items-center text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-brand)] disabled:opacity-40`}
        aria-label={`Quitar una unidad. ${label} actual: ${value}`}
      >
        <Icon name="minus" size={16} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        aria-label={label}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          onChange(Number.isNaN(n) ? min : clamp(n));
        }}
        className={`${field} border-x border-[var(--color-line)] bg-transparent py-2 text-center font-medium tabular-nums outline-none focus-visible:bg-[var(--color-brand-tint)]`}
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className={`${btn} grid place-items-center text-[var(--color-ink-soft)] transition-colors hover:text-[var(--color-brand)] disabled:opacity-40`}
        aria-label={`Añadir una unidad. ${label} actual: ${value}`}
      >
        <Icon name="plus" size={16} />
      </button>
    </div>
  );
}
