"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

export default function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      (product.variants ?? []).map((g) => [g.label, g.options[0]]),
    ),
  );
  const [added, setAdded] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const payload = () => ({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    ref: product.ref,
    categorySlug: product.categorySlug,
    image: product.image,
    kind: product.kind,
    variant: product.variants?.length ? variant : undefined,
    qty,
  });

  return (
    <div className="flex flex-col gap-5">
      {product.variants?.length ? (
        <div className="flex flex-col gap-4">
          {product.variants.map((group) => (
            <fieldset key={group.label} className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-[var(--color-ink)]">
                {group.label}
              </legend>
              <div className="flex flex-wrap gap-2">
                {group.options.map((opt) => {
                  const selected = variant[group.label] === opt;
                  return (
                    <label
                      key={opt}
                      className={`cursor-pointer rounded-[var(--radius-sm)] border px-3 py-1.5 text-sm transition-colors ${
                        selected
                          ? "border-[var(--color-brand)] bg-[var(--color-brand-tint)] text-[var(--color-brand-strong)]"
                          : "border-[var(--color-line-strong)] text-[var(--color-ink-soft)] hover:border-[var(--color-brand)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={group.label}
                        value={opt}
                        checked={selected}
                        onChange={() =>
                          setVariant((v) => ({ ...v, [group.label]: opt }))
                        }
                        className="visually-hidden"
                      />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector value={qty} onChange={setQty} />
        <span className="text-sm text-[var(--color-ink-muted)]">
          Precio bajo presupuesto
        </span>
      </div>

      <div className="flex flex-col gap-2.5">
        <Button
          size="lg"
          className="w-full"
          aria-live="polite"
          onClick={() => {
            add(payload());
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1800);
          }}
        >
          {added ? (
            <>
              <Icon name="check" size={18} /> Añadido a la solicitud
            </>
          ) : (
            <>
              <Icon name="plus" size={18} /> Añadir a la solicitud
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full"
          onClick={() => {
            add(payload());
            router.push("/checkout/");
          }}
        >
          Solicitar presupuesto ahora
        </Button>
      </div>

      <div className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-[var(--color-bg-soft)] px-3 py-2.5 text-[0.8rem] text-[var(--color-ink-muted)]">
        <Icon name="clock" size={15} className="mt-0.5 shrink-0" />
        <span>
          Pago con tarjeta disponible próximamente para las referencias con
          precio y stock cerrados. De momento, todo pedido se confirma por
          presupuesto.
        </span>
      </div>

      <div ref={sentinelRef} aria-hidden className="h-px w-full" />

      {/* Sticky add-to-quote bar — mobile only, once the main CTA is scrolled past */}
      {showBar ? (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-[var(--color-line)] bg-white/95 px-4 py-3 shadow-[0_-6px_20px_rgba(11,27,43,0.08)] backdrop-blur lg:hidden">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{product.name}</p>
            <p className="text-xs text-[var(--color-ink-muted)]">Consultar precio</p>
          </div>
          <Button
            size="md"
            onClick={() => {
              add(payload());
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1800);
            }}
          >
            {added ? <Icon name="check" size={17} /> : <Icon name="plus" size={17} />}
            Añadir
          </Button>
        </div>
      ) : null}
    </div>
  );
}
