import { siteConfig } from "./site-config";

const eur = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatEUR(amount: number): string {
  return eur.format(amount);
}

/** IVA breakdown for informational display (prices are quote-only for now). */
export function vatBreakdown(base: number) {
  const vat = base * siteConfig.vatRate;
  return { base, vat, total: base + vat, rate: siteConfig.vatRate };
}

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

/** Quote/order reference: SD-YYYYMMDD-XXXX (X = base36). */
export function newReference(prefix = "SD"): string {
  const d = new Date();
  const ymd =
    d.getFullYear().toString() +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${ymd}-${rand}`;
}

export function pluralize(n: number, one: string, many: string): string {
  return n === 1 ? one : many;
}
