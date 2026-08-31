"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

type Status = "idle" | "loading" | "success" | "error";

interface FormState {
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  motivo: string;
  mensaje: string;
}

const emptyState: FormState = {
  nombre: "",
  apellidos: "",
  telefono: "",
  email: "",
  motivo: "",
  mensaje: "",
};

const reasonOptions = [
  { value: "comprar", label: "Comprar" },
  { value: "alquilar", label: "Alquilar" },
  { value: "vender", label: "Vender" },
  { value: "valoracion", label: "Valoración" },
  { value: "informacion", label: "Información" },
  { value: "otro", label: "Otro" },
];

function validate(state: FormState) {
  const errors: Partial<Record<keyof FormState, string>> = {};
  if (!state.nombre.trim()) errors.nombre = "Indica tu nombre";
  if (!state.telefono.trim()) errors.telefono = "Indica un teléfono de contacto";
  if (!state.email.trim() || !/^\S+@\S+\.\S+$/.test(state.email)) {
    errors.email = "Indica un email válido";
  }
  if (!state.mensaje.trim()) errors.mensaje = "Cuéntanos brevemente qué buscas";
  return errors;
}

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  variant?: "property" | "general";
  propertyId?: string;
  propertyTitle?: string;
  propertyReference?: string;
}

export function ContactForm({
  title = "Estoy interesado",
  subtitle,
  variant = "property",
  propertyId,
  propertyTitle,
  propertyReference,
}: ContactFormProps) {
  const [state, setState] = useState<FormState>(
    propertyTitle
      ? { ...emptyState, mensaje: `Me interesa la propiedad "${propertyTitle}". ¿Podríamos concertar una visita?` }
      : emptyState
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");

  function handleChange(field: keyof FormState, value: string) {
    setState((s) => ({ ...s, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate(state);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          propertyName: propertyTitle,
          propertyReference,
          name: state.nombre,
          surname: state.apellidos || undefined,
          email: state.email,
          phone: state.telefono,
          message: state.mensaje,
          reason: variant === "general" ? state.motivo || undefined : undefined,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      setStatus("success");
      setState(emptyState);
    } catch {
      setStatus("error");
    }
  }

  const fieldClass = (field: keyof FormState) =>
    cn(
      "w-full border-b bg-transparent py-3 font-sans text-[1rem] text-ink outline-none transition-colors duration-300 placeholder:text-stone/70",
      errors[field] ? "border-accent" : "border-line focus:border-ink"
    );

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border border-line bg-surface p-8 text-center md:p-10"
      >
        <p className="font-serif text-2xl font-light text-ink">Mensaje enviado</p>
        <p className="mt-3 text-[0.95rem] text-stone">
          Gracias por escribirnos. Un asesor se pondrá en contacto contigo en
          menos de 24 horas.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 text-[0.8rem] uppercase tracking-[0.14em] text-ink underline underline-offset-4"
        >
          Enviar otro mensaje
        </button>
      </motion.div>
    );
  }

  return (
    <form id="contacto-form" onSubmit={handleSubmit} className="border border-line bg-surface p-8 md:p-10">
      <h3 className="font-serif text-2xl font-light text-ink">{title}</h3>
      {subtitle && <p className="mt-2 text-[0.92rem] text-stone">{subtitle}</p>}

      <div className="mt-8 space-y-6">
        <div className={variant === "property" ? "grid grid-cols-1 gap-6 sm:grid-cols-2" : undefined}>
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={state.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className={fieldClass("nombre")}
              disabled={status === "loading"}
            />
            {errors.nombre && <p className="mt-1.5 text-[0.78rem] text-accent">{errors.nombre}</p>}
          </div>

          {variant === "property" && (
            <div>
              <input
                type="text"
                placeholder="Apellidos"
                value={state.apellidos}
                onChange={(e) => handleChange("apellidos", e.target.value)}
                className={fieldClass("apellidos")}
                disabled={status === "loading"}
              />
            </div>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Teléfono"
            value={state.telefono}
            onChange={(e) => handleChange("telefono", e.target.value)}
            className={fieldClass("telefono")}
            disabled={status === "loading"}
          />
          {errors.telefono && <p className="mt-1.5 text-[0.78rem] text-accent">{errors.telefono}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className={fieldClass("email")}
            disabled={status === "loading"}
          />
          {errors.email && <p className="mt-1.5 text-[0.78rem] text-accent">{errors.email}</p>}
        </div>

        {variant === "general" && (
          <div>
            <select
              value={state.motivo}
              onChange={(e) => handleChange("motivo", e.target.value)}
              className={cn(fieldClass("motivo"), !state.motivo && "text-stone/70")}
              disabled={status === "loading"}
            >
              <option value="">Motivo de tu consulta</option>
              {reasonOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <textarea
            placeholder="Mensaje"
            rows={4}
            value={state.mensaje}
            onChange={(e) => handleChange("mensaje", e.target.value)}
            className={cn(fieldClass("mensaje"), "resize-none")}
            disabled={status === "loading"}
          />
          {errors.mensaje && <p className="mt-1.5 text-[0.78rem] text-accent">{errors.mensaje}</p>}
        </div>
      </div>

      {status === "error" && (
        <p className="mt-6 text-[0.85rem] text-accent">
          No hemos podido enviar tu mensaje. Inténtalo de nuevo en unos minutos.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="group mt-8 inline-flex items-center gap-3 bg-ink px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60"
      >
        {status === "loading" ? "Enviando…" : "Solicitar información"}
        {status !== "loading" && (
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="transition-transform duration-400 ease-out group-hover:translate-x-1">
            <path d="M0.5 5H15.5M15.5 5L11 0.5M15.5 5L11 9.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        )}
      </button>
    </form>
  );
}
