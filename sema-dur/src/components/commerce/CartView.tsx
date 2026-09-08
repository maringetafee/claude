"use client";

import Link from "next/link";
import { useCart, variantSummary } from "@/lib/cart";
import Picture from "@/components/ui/Picture";
import Icon from "@/components/ui/Icon";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { ButtonLink } from "@/components/ui/Button";
import { availabilityLabel, productsBySlug } from "@/data/products";

export default function CartView() {
  const { lines, count, hydrated, setQty, remove, clear } = useCart();

  if (!hydrated) {
    return (
      <div className="grid min-h-[40vh] place-items-center text-[var(--color-ink-muted)]">
        Cargando tu solicitud…
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-ink-muted)]">
          <Icon name="cart" size={28} />
        </span>
        <h1 className="font-display text-2xl font-bold">Tu solicitud está vacía</h1>
        <p className="text-[var(--color-ink-soft)]">
          Explora el catálogo y añade las herramientas de las que quieras
          presupuesto. Puedes pedir varias a la vez.
        </p>
        <ButtonLink href="/productos" size="lg">
          Ver catálogo
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">
            Tu solicitud{" "}
            <span className="text-[var(--color-ink-muted)]">
              ({count} {count === 1 ? "artículo" : "artículos"})
            </span>
          </h1>
          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-[var(--color-ink-muted)] underline hover:text-[var(--color-danger)]"
          >
            Vaciar
          </button>
        </div>

        <ul className="divide-y divide-[var(--color-line)] rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white">
          {lines.map((line) => {
            const product = productsBySlug[line.slug];
            return (
              <li key={line.key} className="flex gap-4 p-4">
                <Link
                  href={`/producto/${line.slug}/`}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-white"
                >
                  {line.image ? (
                    <Picture
                      image={line.image}
                      alt={line.name}
                      sizes="80px"
                      aspectRatio="1 / 1"
                    />
                  ) : (
                    <span className="grid h-full place-items-center text-[var(--color-line-strong)]">
                      <Icon name="wrench" size={22} />
                    </span>
                  )}
                </Link>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Link
                    href={`/producto/${line.slug}/`}
                    className="font-semibold leading-snug hover:text-[var(--color-brand)]"
                  >
                    {line.name}
                  </Link>
                  <span className="text-xs text-[var(--color-ink-muted)]">
                    Ref. {line.ref}
                    {line.variant ? ` · ${variantSummary(line.variant)}` : ""}
                  </span>
                  {product ? (
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      {availabilityLabel[product.availability]}
                    </span>
                  ) : null}
                  <div className="mt-2 flex items-center gap-4">
                    <QuantitySelector
                      value={line.qty}
                      onChange={(n) => setQty(line.key, n)}
                      size="sm"
                    />
                    <button
                      type="button"
                      onClick={() => remove(line.key)}
                      className="text-xs font-medium text-[var(--color-ink-muted)] underline hover:text-[var(--color-danger)]"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <div className="hidden text-right text-sm font-medium text-[var(--color-ink-soft)] sm:block">
                  Consultar
                </div>
              </li>
            );
          })}
        </ul>

        <Link
          href="/productos"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-brand)]"
        >
          <Icon name="chevron-right" size={15} className="rotate-180" />
          Seguir añadiendo herramientas
        </Link>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-5">
          <h2 className="text-lg font-bold">Resumen</h2>
          <dl className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)]">Artículos</dt>
              <dd className="font-medium">{count}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)]">Subtotal</dt>
              <dd className="font-medium">A presupuestar</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)]">IVA (21%)</dt>
              <dd className="font-medium">Se calcula en el presupuesto</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[var(--color-ink-soft)]">Envío</dt>
              <dd className="font-medium">Según destino</dd>
            </div>
          </dl>
          <div className="my-4 border-t border-[var(--color-line)]" />
          <ButtonLink href="/checkout" size="lg" className="w-full">
            Solicitar presupuesto
            <Icon name="arrow-right" size={17} />
          </ButtonLink>
          <p className="mt-3 text-xs leading-relaxed text-[var(--color-ink-muted)]">
            No se realiza ningún cargo. Recibirás un presupuesto con precio,
            plazo y gastos de envío para su aprobación.
          </p>
        </div>
      </aside>
    </div>
  );
}
