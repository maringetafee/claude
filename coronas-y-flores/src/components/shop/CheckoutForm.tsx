"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { LockIcon } from "@/components/Icons";
import { cartSubtotal, useCart, useMounted } from "@/lib/cart-store";
import {
  addDays,
  dateChipParts,
  formatDateLong,
  madridNow,
  slotsForDate,
  upcomingDates,
  type DeliveryRules,
} from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import type { ShippingMethod } from "@/lib/types";

type Props = {
  methods: ShippingMethod[];
  rules: DeliveryRules;
  cancelled: boolean;
};

export function CheckoutForm({ methods, rules, cancelled }: Props) {
  const items = useCart();
  const mounted = useMounted();
  const errorRef = useRef<HTMLDivElement>(null);

  const [customer, setCustomer] = useState({ name: "", email: "", phone: "" });
  const [methodId, setMethodId] = useState(methods[0]?.id ?? "");
  const [selfRecipient, setSelfRecipient] = useState(false);
  const [recipient, setRecipient] = useState({ name: "", phone: "", address: "", postalCode: "", city: "Alcorcón" });
  const [pickedDate, setPickedDate] = useState("");
  const [pickedSlot, setPickedSlot] = useState("");
  const [cardMessage, setCardMessage] = useState("");
  const [notes, setNotes] = useState("");
  const [accept, setAccept] = useState(false);
  const [error, setError] = useState<string | null>(cancelled ? "El pago no se completó. Tu carrito sigue aquí: puedes intentarlo de nuevo." : null);
  const [submitting, setSubmitting] = useState(false);

  // Fechas calculadas solo en el navegador (la página puede estar cacheada)
  const now = useMemo(() => (mounted ? madridNow() : null), [mounted]);
  const dates = useMemo(() => (now ? upcomingDates(rules, 10, now) : []), [now, rules]);
  const date = pickedDate || dates[0] || "";
  const slots = now && date ? slotsForDate(rules, date, now) : [];
  const slotId = slots.some((s) => s.id === pickedSlot) ? pickedSlot : slots[0]?.id ?? "";

  const method = methods.find((m) => m.id === methodId) ?? null;
  const isDelivery = method?.kind === "delivery";
  const subtotal = cartSubtotal(items);
  const shipping = !method ? 0 : method.free_over_cents != null && subtotal >= method.free_over_cents ? 0 : method.price_cents;
  const total = subtotal + shipping;
  const cpOutOfZone =
    isDelivery && method && method.postal_codes.length > 0 && /^\d{5}$/.test(recipient.postalCode) && !method.postal_codes.includes(recipient.postalCode);

  if (!mounted) return <div style={{ minHeight: 480 }} aria-busy="true" />;

  if (!items.length) {
    return (
      <div className="empty">
        <h2>No hay nada en el carrito</h2>
        <p>Añade algún ramo o composición para poder hacer el pedido.</p>
        <Link className="btn btn--solid" href="/tienda">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  if (!methods.length) {
    return (
      <div className="empty">
        <h2>Pedidos online en pausa</h2>
        <p>Ahora mismo no hay métodos de entrega disponibles. Llámanos y te preparamos el pedido.</p>
        <Link className="btn btn--ink" href="/#visitanos">
          Ver contacto
        </Link>
      </div>
    );
  }

  const showError = (msg: string) => {
    setError(msg);
    requestAnimationFrame(() => errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !slotId) return showError("Elige una fecha y una franja de entrega.");
    if (cpOutOfZone) return showError(`No repartimos en el código postal ${recipient.postalCode} con «${method?.name}». Elige otro método de entrega.`);
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, variantId: i.variantId, qty: i.qty, ribbonText: i.ribbonText })),
          customer,
          shippingMethodId: methodId,
          recipient: isDelivery
            ? {
                ...recipient,
                name: selfRecipient ? customer.name : recipient.name,
                phone: selfRecipient ? customer.phone : recipient.phone,
              }
            : undefined,
          deliveryDate: date,
          slotId,
          cardMessage,
          notes,
          acceptTerms: accept,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "No hemos podido iniciar el pago. Inténtalo de nuevo.");
      window.location.assign(data.url);
    } catch (err) {
      setSubmitting(false);
      showError(err instanceof Error ? err.message : "Algo ha fallado. Inténtalo de nuevo.");
    }
  }

  const maxDate = now ? addDays(now.date, rules.maxDaysAhead) : undefined;

  return (
    <form className="checkout__grid" onSubmit={onSubmit} noValidate={false}>
      <div>
        {error && (
          <div ref={errorRef} className="alert" role="alert" style={{ marginBottom: 28 }}>
            {error}
          </div>
        )}

        <section className="step" aria-labelledby="step-1">
          <div className="step__head">
            <span className="step__num">01</span>
            <h2 className="step__title" id="step-1">
              Tus datos
            </h2>
          </div>
          <div className="form-grid">
            <label className="field span-2">
              <span className="field__label">Nombre y apellidos</span>
              <input className="input" required autoComplete="name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
            </label>
            <label className="field">
              <span className="field__label">Email</span>
              <input className="input" type="email" required autoComplete="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            </label>
            <label className="field">
              <span className="field__label">Teléfono</span>
              <input className="input" type="tel" required minLength={9} autoComplete="tel" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            </label>
          </div>
        </section>

        <section className="step" aria-labelledby="step-2">
          <div className="step__head">
            <span className="step__num">02</span>
            <h2 className="step__title" id="step-2">
              Entrega
            </h2>
          </div>

          <div className="choice-list" role="radiogroup" aria-label="Método de entrega">
            {methods.map((m) => {
              const cost = m.free_over_cents != null && subtotal >= m.free_over_cents ? 0 : m.price_cents;
              return (
                <label key={m.id} className="choice">
                  <input type="radio" name="method" value={m.id} checked={methodId === m.id} onChange={() => setMethodId(m.id)} />
                  <span className="choice__body">
                    <span className="choice__title">{m.name}</span>
                    {m.description && <span className="choice__desc">{m.description}</span>}
                  </span>
                  <span className="choice__price">{cost ? formatEUR(cost) : "Gratis"}</span>
                </label>
              );
            })}
          </div>

          {isDelivery && (
            <div className="form-grid">
              <label className="check span-2">
                <input type="checkbox" checked={selfRecipient} onChange={(e) => setSelfRecipient(e.target.checked)} />
                <span>Lo recibo yo (mismo nombre y teléfono)</span>
              </label>
              {!selfRecipient && (
                <>
                  <label className="field">
                    <span className="field__label">Nombre de quien lo recibe</span>
                    <input className="input" required autoComplete="shipping name" value={recipient.name} onChange={(e) => setRecipient({ ...recipient, name: e.target.value })} />
                  </label>
                  <label className="field">
                    <span className="field__label">Su teléfono</span>
                    <input className="input" type="tel" required minLength={9} value={recipient.phone} onChange={(e) => setRecipient({ ...recipient, phone: e.target.value })} />
                    <span className="field__hint">Solo para coordinar la entrega.</span>
                  </label>
                </>
              )}
              <label className="field span-2">
                <span className="field__label">Dirección de entrega</span>
                <input
                  className="input"
                  required
                  autoComplete="shipping street-address"
                  placeholder="Calle, número, piso · o nombre del tanatorio y sala"
                  value={recipient.address}
                  onChange={(e) => setRecipient({ ...recipient, address: e.target.value })}
                />
              </label>
              <label className="field">
                <span className="field__label">Código postal</span>
                <input
                  className="input"
                  required
                  inputMode="numeric"
                  pattern="\d{5}"
                  maxLength={5}
                  autoComplete="shipping postal-code"
                  value={recipient.postalCode}
                  onChange={(e) => setRecipient({ ...recipient, postalCode: e.target.value.replace(/\D/g, "") })}
                />
              </label>
              <label className="field">
                <span className="field__label">Localidad</span>
                <input className="input" required autoComplete="shipping address-level2" value={recipient.city} onChange={(e) => setRecipient({ ...recipient, city: e.target.value })} />
              </label>
              {cpOutOfZone && (
                <div className="alert span-2" role="status">
                  Este código postal no está dentro de la zona de «{method?.name}». Prueba con otro método de entrega.
                </div>
              )}
            </div>
          )}

          <div>
            <span className="opt-label">{isDelivery ? "Día de entrega" : "Día de recogida"}</span>
            {dates.length ? (
              <div className="date-chips" role="radiogroup" aria-label="Fecha">
                {dates.map((d) => {
                  const parts = dateChipParts(d, now!);
                  return (
                    <label key={d} className="date-chip" title={formatDateLong(d)}>
                      <input type="radio" name="date" value={d} checked={date === d} onChange={() => setPickedDate(d)} />
                      <span>
                        <small>{parts.top}</small>
                        <strong>{parts.day}</strong>
                        <small>{parts.month}</small>
                      </span>
                    </label>
                  );
                })}
              </div>
            ) : (
              <p className="alert">Ahora mismo no hay fechas de entrega disponibles.</p>
            )}
            <label className="field" style={{ marginTop: 14, maxWidth: 260 }}>
              <span className="field__hint">¿Otra fecha?</span>
              <input
                className="input"
                type="date"
                min={dates[0]}
                max={maxDate}
                value={date && !dates.includes(date) ? date : ""}
                onChange={(e) => setPickedDate(e.target.value)}
              />
            </label>
          </div>

          {date && (
            <div>
              <span className="opt-label">Franja horaria · {formatDateLong(date)}</span>
              {slots.length ? (
                <div className="opt-chips" role="radiogroup" aria-label="Franja horaria">
                  {slots.map((s) => (
                    <label key={s.id} className="opt-chip">
                      <input type="radio" name="slot" value={s.id} checked={slotId === s.id} onChange={() => setPickedSlot(s.id)} />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="alert">Ese día no hacemos entregas. Elige otra fecha.</p>
              )}
            </div>
          )}
        </section>

        <section className="step" aria-labelledby="step-3">
          <div className="step__head">
            <span className="step__num">03</span>
            <h2 className="step__title" id="step-3">
              Tarjeta y detalles
            </h2>
          </div>
          <label className="field">
            <span className="field__label">Mensaje para la tarjeta (opcional)</span>
            <textarea className="input" maxLength={300} value={cardMessage} onChange={(e) => setCardMessage(e.target.value)} placeholder="Lo escribimos a mano en una tarjeta que acompaña al pedido." />
            <span className="field__hint">{cardMessage.length}/300</span>
          </label>
          <label className="field">
            <span className="field__label">Notas para la floristería (opcional)</span>
            <textarea
              className="input"
              maxLength={500}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferencias de color, hora del velatorio, indicaciones para el repartidor…"
              style={{ minHeight: 90 }}
            />
          </label>
          <label className="check">
            <input type="checkbox" required checked={accept} onChange={(e) => setAccept(e.target.checked)} />
            <span>
              He leído y acepto las{" "}
              <Link href="/legal/condiciones-de-venta" target="_blank">
                condiciones de venta
              </Link>{" "}
              y la{" "}
              <Link href="/legal/privacidad" target="_blank">
                política de privacidad
              </Link>
              .
            </span>
          </label>
        </section>
      </div>

      <aside className="summary" aria-label="Resumen del pedido">
        <h2 className="summary__title">Tu pedido</h2>
        <div className="summary__lines" data-lenis-prevent>
          {items.map((i) => (
            <div className="summary__line" key={i.key}>
              <div className="summary__thumb">
                {i.image && <Image src={i.image} alt="" fill sizes="60px" />}
                <b>{i.qty}</b>
              </div>
              <div>
                {i.name}
                {i.variantName && <small>{i.variantName}</small>}
                {i.ribbonText && <small>Cinta: «{i.ribbonText}»</small>}
              </div>
              <span>{formatEUR(i.unitPriceCents * i.qty)}</span>
            </div>
          ))}
        </div>
        <div className="summary__row">
          <span>Subtotal</span>
          <span>{formatEUR(subtotal)}</span>
        </div>
        <div className="summary__row">
          <span>{method?.name ?? "Entrega"}</span>
          <span>{shipping ? formatEUR(shipping) : "Gratis"}</span>
        </div>
        {method?.free_over_cents != null && shipping > 0 && (
          <div className="summary__row" style={{ fontSize: ".82rem" }}>
            <span>Te faltan {formatEUR(method.free_over_cents - subtotal)} para la entrega gratis</span>
          </div>
        )}
        <div className="summary__total">
          <span>Total</span>
          <span>{formatEUR(total)}</span>
        </div>
        <button type="submit" className="btn btn--solid btn--lg btn--block" disabled={submitting || !accept}>
          {submitting ? "Redirigiendo al pago…" : `Pagar ${formatEUR(total)}`}
        </button>
        <p className="secure-note">
          <LockIcon /> Pago seguro con Stripe. IVA incluido.
        </p>
      </aside>
    </form>
  );
}
