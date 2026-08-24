"use client";

import { useState, type FormEvent } from "react";
import { company, serviceFormOptions } from "@/lib/content";
import { Reveal } from "./ui/Reveal";

type Status = "idle" | "loading" | "success" | "error";

type Errors = Partial<Record<"nombre" | "apellidos" | "email" | "servicio" | "mensaje" | "privacidad", string>>;

const inputClasses =
  "w-full border-0 border-b border-bone-100/20 bg-transparent py-3 text-bone-100 placeholder:text-bone-600 transition-colors focus:border-signal-500 focus:outline-none";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nombre = String(form.get("nombre") || "").trim();
    const apellidos = String(form.get("apellidos") || "").trim();
    const email = String(form.get("email") || "").trim();
    const telefono = String(form.get("telefono") || "").trim();
    const servicio = String(form.get("servicio") || "").trim();
    const mensaje = String(form.get("mensaje") || "").trim();
    const privacidad = form.get("privacidad");

    const nextErrors: Errors = {};
    if (!nombre) nextErrors.nombre = "Indica tu nombre.";
    if (!apellidos) nextErrors.apellidos = "Indica tus apellidos.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Indica un email válido.";
    if (!servicio) nextErrors.servicio = "Selecciona un servicio.";
    if (!mensaje) nextErrors.mensaje = "Cuéntanos brevemente qué necesitas.";
    if (!privacidad) nextErrors.privacidad = "Debes aceptar la política de privacidad.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("error");
      return;
    }

    setErrors({});
    setStatus("loading");

    const body = [
      `Nombre: ${nombre} ${apellidos}`,
      `Email: ${email}`,
      telefono ? `Teléfono: ${telefono}` : null,
      `Servicio: ${servicio}`,
      "",
      mensaje,
    ]
      .filter(Boolean)
      .join("\n");

    const mailto = `mailto:${company.email}?subject=${encodeURIComponent(
      `Solicitud de presupuesto — ${servicio}`
    )}&body=${encodeURIComponent(body)}`;

    window.setTimeout(() => {
      window.location.href = mailto;
      setStatus("success");
    }, 350);
  }

  return (
    <section id="contacto" className="relative bg-carbon-950 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <span className="mono-label text-[11px] text-signal-500">Contacto</span>
            <h2 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-bone-100 sm:text-5xl">
              Hablemos de tu instalación.
            </h2>

            <dl className="mt-12 space-y-8">
              <div>
                <dt className="mono-label text-[10px] text-bone-600">Dirección</dt>
                <dd className="mt-2 text-bone-300">
                  {company.legalName}
                  <br />
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}, {company.address.country}
                </dd>
              </div>
              <div>
                <dt className="mono-label text-[10px] text-bone-600">Teléfono</dt>
                <dd className="mt-2">
                  <a href={company.phoneHref} className="font-mono text-xl text-bone-100 hover:text-signal-400">
                    {company.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="mono-label text-[10px] text-bone-600">Email</dt>
                <dd className="mt-2">
                  <a href={company.emailHref} className="text-bone-100 hover:text-signal-400">
                    {company.email}
                  </a>
                </dd>
              </div>
            </dl>

            <div className="grain relative mt-10 aspect-[4/3] overflow-hidden rounded-sm bg-carbon-800">
              <iframe
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${company.address.street}, ${company.address.postalCode} ${company.address.city}, ${company.address.country}`
                )}&output=embed`}
                title="Ubicación de S.B.S Telecomunicaciones en Madrid"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale invert-[0.92] contrast-[0.9]"
                style={{ border: 0 }}
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-bone-100/10" />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
              <Field label="Nombre" name="nombre" error={errors.nombre} />
              <Field label="Apellidos" name="apellidos" error={errors.apellidos} />
              <Field label="Email" name="email" type="email" error={errors.email} />
              <Field label="Teléfono" name="telefono" type="tel" />

              <div className="col-span-full mb-3 mt-2">
                <label htmlFor="servicio" className="mono-label mb-1 block text-[10px] text-bone-600">
                  Servicio
                </label>
                <select
                  id="servicio"
                  name="servicio"
                  defaultValue=""
                  className={`${inputClasses} appearance-none`}
                  aria-invalid={Boolean(errors.servicio)}
                  aria-describedby={errors.servicio ? "servicio-error" : undefined}
                >
                  <option value="" disabled>
                    Selecciona un servicio
                  </option>
                  {serviceFormOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-carbon-900">
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.servicio && (
                  <p id="servicio-error" className="mt-1 text-xs text-signal-400">
                    {errors.servicio}
                  </p>
                )}
              </div>

              <div className="col-span-full mb-3">
                <label htmlFor="mensaje" className="mono-label mb-1 block text-[10px] text-bone-600">
                  Mensaje
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  rows={4}
                  placeholder="Cuéntanos qué necesitas"
                  className={`${inputClasses} resize-none`}
                  aria-invalid={Boolean(errors.mensaje)}
                  aria-describedby={errors.mensaje ? "mensaje-error" : undefined}
                />
                {errors.mensaje && (
                  <p id="mensaje-error" className="mt-1 text-xs text-signal-400">
                    {errors.mensaje}
                  </p>
                )}
              </div>

              <div className="col-span-full mt-2 space-y-3">
                <label className="flex items-start gap-3 text-sm text-bone-500">
                  <input
                    type="checkbox"
                    name="privacidad"
                    className="mt-1 h-4 w-4 shrink-0 accent-signal-500"
                    aria-invalid={Boolean(errors.privacidad)}
                  />
                  He leído y acepto la política de privacidad. *
                </label>
                {errors.privacidad && <p className="text-xs text-signal-400">{errors.privacidad}</p>}
                <label className="flex items-start gap-3 text-sm text-bone-500">
                  <input type="checkbox" name="comercial" className="mt-1 h-4 w-4 shrink-0 accent-signal-500" />
                  Autorizo a que me contacten por email o por cualquier otro medio con fines comerciales.
                </label>
              </div>

              <div className="col-span-full mt-8 flex flex-wrap items-center gap-6">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-bone-100 px-7 py-3.5 text-sm font-semibold text-carbon-950 transition-colors duration-300 hover:text-bone-100 disabled:opacity-70"
                >
                  <span
                    className="absolute inset-0 -translate-x-[101%] bg-signal-500 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0"
                    aria-hidden
                  />
                  <span className="relative z-10">{status === "loading" ? "Preparando…" : "Enviar mensaje"}</span>
                </button>

                <div aria-live="polite">
                  {status === "success" && (
                    <p className="max-w-xs text-sm text-signal-400">
                      Se ha abierto tu gestor de correo con el mensaje listo para enviar a {company.email}. Si no se
                      abre automáticamente, escríbenos directamente.
                    </p>
                  )}
                  {status === "error" && Object.keys(errors).length > 0 && (
                    <p className="max-w-xs text-sm text-bone-500">Revisa los campos marcados antes de continuar.</p>
                  )}
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  error,
}: {
  label: string;
  name: string;
  type?: string;
  error?: string;
}) {
  return (
    <div className="mb-3">
      <label htmlFor={name} className="mono-label mb-1 block text-[10px] text-bone-600">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={inputClasses}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-xs text-signal-400">
          {error}
        </p>
      )}
    </div>
  );
}
