"use client";

import Image from "next/image";
import Link from "next/link";
import { LockIcon } from "@/components/Icons";
import { cartSubtotal, MAX_QTY, removeFromCart, setQty, useCart, useMounted } from "@/lib/cart-store";
import { formatEUR } from "@/lib/money";

export function CartView() {
  const items = useCart();
  const mounted = useMounted();

  if (!mounted) return <div style={{ minHeight: 320 }} aria-busy="true" />;

  if (!items.length) {
    return (
      <div className="empty">
        <h2>Tu carrito está vacío</h2>
        <p>Echa un vistazo a los ramos y composiciones de esta semana.</p>
        <Link className="btn btn--solid" href="/tienda">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(items);

  return (
    <div className="cart__grid">
      <div>
        {items.map((item) => (
          <div className="cart-line" key={item.key}>
            <Link href={`/producto/${item.slug}`} className="cart-line__media" aria-label={item.name}>
              {item.image && <Image src={item.image} alt="" fill sizes="110px" />}
            </Link>
            <div>
              <h2 className="cart-line__name">
                <Link href={`/producto/${item.slug}`}>{item.name}</Link>
              </h2>
              <div className="cart-line__meta">
                {item.variantName && <span>{item.variantName} · </span>}
                {formatEUR(item.unitPriceCents)} / ud.
                {item.ribbonText && <div>Cinta: «{item.ribbonText}»</div>}
              </div>
              <div className="cart-line__actions">
                <div className="qty qty--sm">
                  <button type="button" aria-label="Quitar uno" onClick={() => setQty(item.key, item.qty - 1)}>
                    −
                  </button>
                  <output aria-label="Cantidad">{item.qty}</output>
                  <button type="button" aria-label="Añadir uno" disabled={item.qty >= MAX_QTY} onClick={() => setQty(item.key, item.qty + 1)}>
                    +
                  </button>
                </div>
                <button type="button" className="link-btn" onClick={() => removeFromCart(item.key)}>
                  Eliminar
                </button>
              </div>
            </div>
            <div className="cart-line__total">{formatEUR(item.unitPriceCents * item.qty)}</div>
          </div>
        ))}
        <p style={{ marginTop: 24 }}>
          <Link className="link-btn" href="/tienda">
            ← Seguir comprando
          </Link>
        </p>
      </div>

      <aside className="summary" aria-label="Resumen del pedido">
        <h2 className="summary__title">Resumen</h2>
        <div className="summary__row">
          <span>Subtotal</span>
          <span>{formatEUR(subtotal)}</span>
        </div>
        <div className="summary__row">
          <span>Entrega</span>
          <span>Se calcula en el siguiente paso</span>
        </div>
        <div className="summary__total">
          <span>Total</span>
          <span>{formatEUR(subtotal)}</span>
        </div>
        <Link className="btn btn--solid btn--lg btn--block" href="/checkout">
          Finalizar pedido
        </Link>
        <p className="secure-note">
          <LockIcon /> Pago seguro con tarjeta, Apple Pay o Google Pay
        </p>
      </aside>
    </div>
  );
}
