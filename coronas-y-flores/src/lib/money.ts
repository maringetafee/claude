const withDecimals = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
const noDecimals = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** 2500 → "25 €", 2490 → "24,90 €" */
export function formatEUR(cents: number): string {
  return (cents % 100 === 0 ? noDecimals : withDecimals).format(cents / 100);
}

/** "24,90" | "24.9" | 24.9 → 2490. Devuelve NaN si no es un número. */
export function toCents(value: string | number): number {
  const n = typeof value === "number" ? value : Number(String(value).trim().replace(",", "."));
  return Number.isFinite(n) ? Math.round(n * 100) : NaN;
}

/** 2490 → "24,90" para rellenar inputs */
export function centsToInput(cents: number | null | undefined): string {
  if (cents == null) return "";
  return (cents / 100).toFixed(2).replace(".", ",").replace(/,00$/, "");
}
