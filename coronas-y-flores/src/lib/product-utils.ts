import { madridNow } from "./delivery";
import type { Product } from "./types";

type SaleFields = Pick<Product, "discount_percent" | "sale_starts_on" | "sale_ends_on">;

/** ¿Tiene una oferta en vigor hoy (hora de Madrid)? Las fechas son inclusivas. */
export function isSaleActive(p: SaleFields, today: string = madridNow().date): boolean {
  if (!p.discount_percent || p.discount_percent <= 0) return false;
  if (p.sale_starts_on && today < p.sale_starts_on) return false;
  if (p.sale_ends_on && today > p.sale_ends_on) return false;
  return true;
}

/** % de descuento en vigor (0 si no hay oferta). */
export function activeDiscount(p: SaleFields, today?: string): number {
  return isSaleActive(p, today) ? Math.min(90, Math.max(0, Math.round(p.discount_percent))) : 0;
}

export function applyDiscount(cents: number, percent: number): number {
  return percent > 0 ? Math.round((cents * (100 - percent)) / 100) : cents;
}

export type PriceInfo = {
  /** Lo que se cobra */
  price: number;
  /** Precio tachado (antes), o null */
  compareAt: number | null;
  /** % de ahorro redondeado, o null */
  percent: number | null;
};

/**
 * Precio a mostrar para un precio base concreto (el del producto o el de un
 * tamaño): aplica la oferta en vigor o, si no la hay, el "precio anterior"
 * manual de los productos sin tamaños.
 */
export function priceFor(
  p: SaleFields & Pick<Product, "compare_at_cents" | "variants">,
  baseCents: number,
  today?: string,
): PriceInfo {
  const pct = activeDiscount(p, today);
  if (pct > 0) return { price: applyDiscount(baseCents, pct), compareAt: baseCents, percent: pct };
  if (!p.variants.length && p.compare_at_cents != null && p.compare_at_cents > baseCents) {
    return { price: baseCents, compareAt: p.compare_at_cents, percent: Math.round((1 - baseCents / p.compare_at_cents) * 100) };
  }
  return { price: baseCents, compareAt: null, percent: null };
}

/** ¿Se muestra como oferta en tarjetas, portada y /tienda/ofertas? */
export function isOnSale(p: SaleFields & Pick<Product, "compare_at_cents" | "variants" | "price_cents">, today?: string): boolean {
  return priceFor(p, fromPriceCents(p), today).compareAt !== null;
}

/** Precio "desde" para tarjetas: el más barato de sus tamaños, o el precio base. */
export function fromPriceCents(p: Pick<Product, "price_cents" | "variants">): number {
  if (p.variants.length) return Math.min(...p.variants.map((v) => v.price_cents));
  return p.price_cents;
}

export function hasPriceRange(p: Pick<Product, "variants">): boolean {
  if (p.variants.length < 2) return false;
  const prices = new Set(p.variants.map((v) => v.price_cents));
  return prices.size > 1;
}

export function isSoldOut(p: Pick<Product, "stock">): boolean {
  return p.stock !== null && p.stock <= 0;
}

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Si la foto es de Unsplash genera un srcset real; si no, deja solo src. */
export function unsplashSrcSet(url: string, widths: number[]): string | undefined {
  if (!url.includes("images.unsplash.com")) return undefined;
  return widths.map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(", ");
}
