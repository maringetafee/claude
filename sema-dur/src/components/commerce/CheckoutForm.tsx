"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart, variantSummary } from "@/lib/cart";
import { saveRequest } from "@/lib/orders";
import { newReference } from "@/lib/format";
import { Input, Textarea, Select } from "@/components/ui/Field";
import { Button, ButtonLink } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { availabilityLabel, productsBySlug } from "@/data/products";

const COUNTRIES = [
  "España",
  "Portugal",
  "Francia",
  "Colombia",
  "Venezuela",
  "Guinea Ecuatorial",
  "Otro",
];

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");
}

export default function CheckoutForm() {
  const { lines, count, hydrated, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (hydrated && lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-12 text-center">
        <h1 className="font-display text-2xl font-bold">No hay nada que solicitar</h1>
        <p className="text-[var(--color-ink-soft)]">
          Añade herramientas a tu solicitud antes de continuar.
        </p>
        <ButtonLink href="/productos" size="lg">
          Ir al catálogo
        </ButtonLink>
      </div>
    );
  }

  const linesText = lines
    .map(
      (l) =>
        `• ${l.qty}× ${l.name} (Ref. ${l.ref}${
          l.variant ? `, ${variantSummary(l.variant)}` : ""
        })`,
    )
    .join("\n");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSubmitting(true);
    setError(null);

    const fd = new FormData(form);
    const reference = newReference();
    const payload: Record<string, string> = { "form-name": "solicitud-presupuesto", reference };
    fd.forEach((v, k) => {
      payload[k] = typeof v === "string" ? v : "";
    });
    payload["lineas"] = linesText;

    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      });

      saveRequest({
        reference,
        createdAt: new Date().toISOString(),
        status: "pendiente",
        customer: {
          name: `${payload.nombre ?? ""} ${payload.apellidos ?? ""}`.trim(),
          company: payload.empresa || undefined,
          email: payload.email ?? "",
          phone: payload.telefono ?? "",
          city: payload.ciudad || undefined,
          country: payload.pais || undefined,
        },
        lines: lines.map((l) => ({
          name: l.name,
          ref: l.ref,
          qty: l.qty,
          variant: l.variant,
          slug: l.slug,
        })),
        notes: payload.observaciones || undefined,
      });

      clear();
      router.push(`/gracias/?ref=${encodeURIComponent(reference)}`);
    } catch {
      setError(
        "No hemos podido enviar la solicitud. Revisa tu conexión e inténtalo de nuevo, o escríbenos a administracion@sema-dur.com.",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
      <form
        name="solicitud-presupuesto"
        method="POST"
        action="/gracias/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={onSubmit}
        noValidate
        className="flex flex-col gap-8"
      >
        <input type="hidden" name="form-name" value="solicitud-presupuesto" />
        <input type="hidden" name="lineas" value={linesText} readOnly />
        <p className="visually-hidden">
          <label>
            No rellenar: <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 font-display text-lg font-bold">
            Datos de contacto
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Nombre" name="nombre" required autoComplete="given-name" />
            <Input label="Apellidos" name="apellidos" required autoComplete="family-name" />
          </div>
          <Input label="Empresa" name="empresa" autoComplete="organization" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Email"
              name="email"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
            />
            <Input
              label="Teléfono"
              name="telefono"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
            />
          </div>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 font-display text-lg font-bold">
            Dirección de envío
          </legend>
          <Input
            label="Dirección"
            name="direccion"
            required
            autoComplete="street-address"
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Código postal"
              name="cp"
              inputMode="numeric"
              autoComplete="postal-code"
              required
            />
            <Input
              label="Ciudad"
              name="ciudad"
              autoComplete="address-level2"
              required
            />
            <Input
              label="Provincia"
              name="provincia"
              autoComplete="address-level1"
              required
            />
          </div>
          <Select
            label="País"
            name="pais"
            defaultValue="España"
            required
            autoComplete="country-name"
          >
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className="mb-1 font-display text-lg font-bold">
            Datos fiscales y observaciones
          </legend>
          <Input label="NIF / CIF" name="nif" />
          <Textarea
            label="Observaciones"
            name="observaciones"
            hint="Máquina, material, perfil, plazo deseado, adjuntos que enviarás por email…"
          />
        </fieldset>

        {error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--color-danger)] bg-[color-mix(in_oklab,var(--color-danger),white_88%)] px-3 py-2.5 text-sm text-[var(--color-danger)]"
          >
            <Icon name="close" size={16} className="mt-0.5 shrink-0" />
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "Enviando…" : "Enviar solicitud de presupuesto"}
          </Button>
          <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
            Al enviar aceptas que Sema-Dur trate tus datos para responder a esta
            solicitud, conforme a la{" "}
            <Link href="/politica-de-privacidad" className="underline">
              política de privacidad
            </Link>
            . No se realiza ningún cargo: recibirás un presupuesto para su
            aprobación.
          </p>
        </div>
      </form>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white">
          <h2 className="border-b border-[var(--color-line)] px-5 py-4 font-display text-lg font-bold">
            Tu solicitud ({count})
          </h2>
          <ul className="divide-y divide-[var(--color-line)] px-5">
            {lines.map((l) => {
              const p = productsBySlug[l.slug];
              return (
                <li key={l.key} className="flex gap-2 py-3 text-sm">
                  <span className="font-medium tabular-nums text-[var(--color-ink-muted)]">
                    {l.qty}×
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium leading-snug">{l.name}</span>
                    <span className="text-xs text-[var(--color-ink-muted)]">
                      Ref. {l.ref}
                      {l.variant ? ` · ${variantSummary(l.variant)}` : ""}
                      {p ? ` · ${availabilityLabel[p.availability]}` : ""}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-[var(--color-line)] px-5 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[var(--color-ink-soft)]">Total</span>
              <span className="font-semibold">Según presupuesto</span>
            </div>
            <p className="mt-2 text-xs text-[var(--color-ink-muted)]">
              Precio, IVA y envío se detallan en el presupuesto.
            </p>
          </div>
        </div>
        <Link
          href="/carrito"
          className="mt-3 block text-center text-sm font-medium text-[var(--color-brand)]"
        >
          Editar solicitud
        </Link>
      </aside>
    </div>
  );
}
