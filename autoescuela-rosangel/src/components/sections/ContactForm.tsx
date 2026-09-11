"use client";

import { useState } from "react";
import { centers } from "@/lib/site-config";

const inputClasses =
  "w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-ink outline-none transition-colors focus:border-signal";
const labelClasses = "mb-1.5 block text-xs font-medium text-ink-soft";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    if ((formData.get("bot-field") as string)?.length) {
      // honeypot relleno: probablemente spam, no enviamos pero mostramos éxito
      setStatus("success");
      return;
    }

    const payload: Record<string, string> = { "form-name": "contacto" };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    setStatus("loading");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      });
      if (!res.ok) throw new Error("network");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[320px] flex-col justify-center rounded-sm border border-line bg-paper-soft p-8 text-center">
        <p className="font-display text-2xl font-bold">¡Gracias!</p>
        <p className="mt-2 text-ink-soft">
          Hemos recibido tu solicitud. Te contactaremos lo antes posible.
        </p>
      </div>
    );
  }

  return (
    <form
      name="contacto"
      method="POST"
      action="/gracias/"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="flex flex-col gap-5"
    >
      <input type="hidden" name="form-name" value="contacto" />
      <p className="hidden">
        <label>
          No rellenar: <input name="bot-field" />
        </label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className={labelClasses}>Nombre</label>
          <input id="nombre" name="nombre" type="text" required className={inputClasses} />
        </div>
        <div>
          <label htmlFor="telefono" className={labelClasses}>Teléfono</label>
          <input id="telefono" name="telefono" type="tel" required className={inputClasses} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="permiso" className={labelClasses}>Permiso que te interesa</label>
          <select id="permiso" name="permiso" defaultValue="" className={`${inputClasses} appearance-none`}>
            <option value="">No lo tengo claro todavía</option>
            <option value="Permiso B">Permiso B (coche)</option>
            <option value="Permiso A2">Permiso A2 (moto)</option>
          </select>
        </div>
        <div>
          <label htmlFor="centro" className={labelClasses}>Centro preferido</label>
          <select id="centro" name="centro" defaultValue="" className={`${inputClasses} appearance-none`}>
            <option value="">Cualquiera / el más cercano</option>
            {centers.map((c) => (
              <option key={c.slug} value={c.fullName}>
                {c.zoneLabel} — {c.street}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensaje" className={labelClasses}>Mensaje (opcional)</label>
        <textarea id="mensaje" name="mensaje" rows={3} className={`${inputClasses} resize-none`} />
      </div>

      <label className="flex items-start gap-3 text-xs text-ink-soft">
        <input type="checkbox" name="acepta_privacidad" required className="mt-0.5 accent-signal" />
        <span>
          He leído y acepto la{" "}
          <a href="/politica-de-privacidad/" className="underline underline-offset-2 hover:text-signal">
            Política de Privacidad
          </a>{" "}
          de {"Autoescuela Rosangel"}.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-1 inline-flex w-fit items-center gap-2 rounded-sm bg-signal px-8 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-signal-dark disabled:opacity-60"
      >
        {status === "loading" ? "Enviando…" : "Solicitar información"}
      </button>

      {status === "error" && (
        <p className="text-sm text-signal" role="alert">
          No hemos podido enviar el formulario. Escríbenos mejor por WhatsApp o llámanos.
        </p>
      )}
    </form>
  );
}
