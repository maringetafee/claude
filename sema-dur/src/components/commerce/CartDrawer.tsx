"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, variantSummary } from "@/lib/cart";
import Icon from "@/components/ui/Icon";
import Picture from "@/components/ui/Picture";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { Button, ButtonLink } from "@/components/ui/Button";

export default function CartDrawer() {
  const { lines, count, isOpen, closeCart } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (isOpen && !dlg.open) dlg.showModal();
    if (!isOpen && dlg.open) dlg.close();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) closeCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <dialog
      ref={dialogRef}
      onClose={closeCart}
      aria-label="Solicitud de presupuesto"
      className="cart-drawer m-0 ml-auto h-dvh max-h-dvh w-full max-w-[27rem] bg-[var(--color-bg)] p-0 text-[var(--color-ink)]"
    >
      <div className="flex h-full flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Icon name="quote" size={18} className="text-[var(--color-brand)]" />
            Tu solicitud
            <span className="text-[var(--color-ink-muted)]">({count})</span>
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar"
            className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-soft)] hover:bg-[var(--color-bg-soft)]"
          >
            <Icon name="close" size={22} />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-[var(--color-bg-soft)] text-[var(--color-ink-muted)]">
              <Icon name="cart" size={24} />
            </span>
            <p className="text-[var(--color-ink-soft)]">
              Aún no has añadido herramientas a tu solicitud de presupuesto.
            </p>
            <Button variant="outline" size="sm" onClick={closeCart}>
              Ver el catálogo
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-[var(--color-line)] overflow-y-auto px-5">
              {lines.map((line) => (
                <CartDrawerLine key={line.key} lineKey={line.key} />
              ))}
            </ul>

            <div className="border-t border-[var(--color-line)] bg-[var(--color-bg-soft)] px-5 py-4">
              <div className="mb-3 flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--color-brand-tint)] px-3 py-2.5 text-[0.8rem] text-[var(--color-brand-strong)]">
                <Icon name="file" size={15} className="mt-0.5 shrink-0" />
                <span>
                  El precio, el IVA y el envío se confirman en el presupuesto que
                  te enviaremos. No se realiza ningún cargo ahora.
                </span>
              </div>
              <ButtonLink href="/checkout" size="lg" className="w-full">
                Continuar con la solicitud
                <Icon name="arrow-right" size={17} />
              </ButtonLink>
              <Link
                href="/carrito"
                className="mt-2 block text-center text-sm font-medium text-[var(--color-brand)]"
              >
                Ver solicitud completa
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

function CartDrawerLine({ lineKey }: { lineKey: string }) {
  const { lines, setQty, remove } = useCart();
  const line = lines.find((l) => l.key === lineKey);
  if (!line) return null;

  return (
    <li className="flex gap-3 py-4">
      <Link
        href={`/producto/${line.slug}`}
        className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border border-[var(--color-line)] bg-white"
      >
        {line.image ? (
          <Picture
            image={line.image}
            alt={line.name}
            sizes="64px"
            aspectRatio="1 / 1"
          />
        ) : (
          <span className="grid h-full place-items-center text-[var(--color-line-strong)]">
            <Icon name="wrench" size={20} />
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/producto/${line.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug hover:text-[var(--color-brand)]"
        >
          {line.name}
        </Link>
        <span className="text-xs text-[var(--color-ink-muted)]">
          Ref. {line.ref}
          {line.variant ? ` · ${variantSummary(line.variant)}` : ""}
        </span>
        <div className="mt-1 flex items-center justify-between">
          <QuantitySelector
            size="sm"
            value={line.qty}
            onChange={(n) => setQty(line.key, n)}
          />
          <button
            type="button"
            onClick={() => remove(line.key)}
            className="text-xs font-medium text-[var(--color-ink-muted)] underline underline-offset-2 hover:text-[var(--color-danger)]"
          >
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
}
