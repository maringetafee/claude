"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addToCart, MAX_QTY } from "@/lib/cart-store";
import { formatEUR } from "@/lib/money";
import { applyDiscount } from "@/lib/product-utils";
import type { ProductVariant } from "@/lib/types";

export type AddToCartTexts = {
  sizeLabel: string;
  ribbonLabel: string;
  ribbonPlaceholder: string;
  ribbonHint: string;
  addToCart: string;
  buyNow: string;
  soldOut: string;
  lowStock: string;
};

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price_cents: number;
    compare_at_cents: number | null;
    stock: number | null;
    allow_ribbon: boolean;
    image: string | null;
    variants: ProductVariant[];
    /** % de la oferta en vigor (lo calcula el servidor), 0 si no hay */
    discountPercent: number;
  };
  texts: AddToCartTexts;
};

export function AddToCart({ product, texts }: Props) {
  const router = useRouter();
  const [variantId, setVariantId] = useState<string | null>(product.variants[0]?.id ?? null);
  const [qty, setQty] = useState(1);
  const [ribbon, setRibbon] = useState("");

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const base = variant ? variant.price_cents : product.price_cents;
  const pct = product.discountPercent;
  const unit = applyDiscount(base, pct);
  const compareAt =
    pct > 0 ? base : !variant && product.compare_at_cents != null && product.compare_at_cents > base ? product.compare_at_cents : null;
  const soldOut = product.stock !== null && product.stock <= 0;
  const maxQty = Math.max(1, Math.min(MAX_QTY, product.stock ?? MAX_QTY));

  const add = () =>
    addToCart(
      {
        productId: product.id,
        variantId: variant?.id ?? null,
        slug: product.slug,
        name: product.name,
        variantName: variant?.name ?? null,
        image: product.image,
        unitPriceCents: unit,
        ribbonText: product.allow_ribbon ? ribbon : "",
      },
      qty,
    );

  return (
    <form
      className="pdp__form"
      onSubmit={(e) => {
        e.preventDefault();
        add();
      }}
    >
      <div className={`pdp__price${compareAt ? " is-sale" : ""}`} aria-live="polite">
        <span>{formatEUR(unit * qty)}</span>
        {compareAt && (
          <s>
            <span className="sr-only">Antes </span>
            {formatEUR(compareAt * qty)}
          </s>
        )}
        {compareAt && <em className="pdp__save">Ahorras {formatEUR((compareAt - unit) * qty)}</em>}
      </div>

      {product.variants.length > 0 && (
        <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
          <legend className="opt-label">{texts.sizeLabel}</legend>
          <div className="opt-chips">
            {product.variants.map((v) => (
              <label key={v.id} className="opt-chip">
                <input type="radio" name="variant" value={v.id} checked={variantId === v.id} onChange={() => setVariantId(v.id)} />
                <span>
                  {v.name}
                  <small>
                    {formatEUR(applyDiscount(v.price_cents, pct))}
                    {pct > 0 && <s> {formatEUR(v.price_cents)}</s>}
                  </small>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {product.allow_ribbon && (
        <label className="field">
          <span className="opt-label" style={{ marginBottom: 0 }}>
            {texts.ribbonLabel}
          </span>
          <input className="input" value={ribbon} onChange={(e) => setRibbon(e.target.value)} maxLength={80} placeholder={texts.ribbonPlaceholder} />
          {texts.ribbonHint && <span className="field__hint">{texts.ribbonHint}</span>}
        </label>
      )}

      <div>
        <span className="opt-label">Cantidad</span>
        <div className="pdp__actions">
          <div className="qty">
            <button type="button" aria-label="Quitar uno" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <output aria-live="polite">{qty}</output>
            <button type="button" aria-label="Añadir uno" disabled={qty >= maxQty} onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>
              +
            </button>
          </div>
          <button type="submit" className="btn btn--solid btn--lg magnetic" disabled={soldOut}>
            {soldOut ? texts.soldOut : texts.addToCart}
          </button>
        </div>
      </div>

      {!soldOut && (
        <button
          type="button"
          className="btn btn--ink btn--lg btn--block"
          onClick={() => {
            add();
            router.push("/checkout");
          }}
        >
          {texts.buyNow}
        </button>
      )}
      {product.stock !== null && product.stock > 0 && product.stock <= 5 && texts.lowStock && (
        <p className="pdp__stock">{texts.lowStock.replace("{n}", String(product.stock))}</p>
      )}
    </form>
  );
}
