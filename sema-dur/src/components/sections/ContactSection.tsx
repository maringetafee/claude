"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`)
    .join("&");
}

type Props = {
  formName: "contacto" | "pedido" | "empleo";
  submitLabel: string;
  messageLabel: string;
  messageHint?: string;
  extraFields?: React.ReactNode;
};

export default function ContactSection({
  formName,
  submitLabel,
  messageLabel,
  messageHint,
  extraFields,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const payload: Record<string, string> = { "form-name": formName };
    fd.forEach((v, k) => {
      payload[k] = typeof v === "string" ? v : "";
    });
    try {
      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode(payload),
      });
      router.push("/gracias/");
    } catch {
      setError(
        `No se ha podido enviar. Inténtalo de nuevo o escríbenos a ${siteConfig.email}.`,
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      name={formName}
      method="POST"
      action="/gracias/"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4"
    >
      <input type="hidden" name="form-name" value={formName} />
      <p className="visually-hidden">
        <label>
          No rellenar: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Nombre y apellidos" name="nombre" required autoComplete="name" />
        <Input label="Empresa" name="empresa" autoComplete="organization" />
      </div>
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

      {extraFields}

      <Textarea
        label={messageLabel}
        name="mensaje"
        required
        hint={messageHint}
      />

      {error ? (
        <p role="alert" className="text-sm font-medium text-[var(--color-danger)]">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={submitting}>
        {submitting ? "Enviando…" : submitLabel}
      </Button>
      <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
        Al enviar aceptas el tratamiento de tus datos conforme a la{" "}
        <Link href="/politica-de-privacidad" className="underline">
          política de privacidad
        </Link>
        .
      </p>
    </form>
  );
}
