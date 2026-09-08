"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadRequests, statusLabel, type StoredQuoteRequest } from "@/lib/orders";
import { formatDate } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";

export default function RequestsList() {
  const [requests, setRequests] = useState<StoredQuoteRequest[] | null>(null);

  useEffect(() => {
    // Reads localStorage — client-only, runs once after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRequests(loadRequests());
  }, []);

  if (requests === null) {
    return <p className="text-[var(--color-ink-muted)]">Cargando…</p>;
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-line-strong)] p-10 text-center">
        <p className="font-semibold">Todavía no has enviado ninguna solicitud</p>
        <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
          Cuando envíes una solicitud de presupuesto aparecerá aquí, en este
          navegador.
        </p>
        <div className="mt-4 flex justify-center">
          <ButtonLink href="/productos" size="sm">
            Ver catálogo
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {requests.map((r) => (
        <li
          key={r.reference}
          className="rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-display font-bold">{r.reference}</span>
            <span className="rounded-[var(--radius-xs)] bg-[var(--color-brand-tint)] px-2 py-1 text-xs font-semibold text-[var(--color-brand-strong)]">
              {statusLabel[r.status]}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Enviada el {formatDate(r.createdAt)}
          </p>
          <ul className="mt-3 flex flex-col gap-1 text-sm text-[var(--color-ink-soft)]">
            {r.lines.map((l, i) => (
              <li key={i}>
                {l.qty}× {l.name}{" "}
                <span className="text-[var(--color-ink-muted)]">(Ref. {l.ref})</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/contacto" className="font-medium text-[var(--color-brand)] underline">
              Consultar estado
            </Link>
            <Link href="/productos" className="font-medium text-[var(--color-brand)] underline">
              Repetir pedido
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
