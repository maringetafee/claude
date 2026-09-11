import type { Product } from "./types";

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
