"use client";

import Link from "next/link";
import { useTransition } from "react";
import type { AdminPropertyListItem } from "@/lib/admin/properties";
import { deleteProperty, duplicateProperty, toggleFeatured, togglePublished } from "./actions";

export function AdminPropertyRowActions({ property }: { property: AdminPropertyListItem }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-3 text-[0.72rem] uppercase tracking-[0.1em]">
      <Link href={`/admin/propiedades/${property.id}`} className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink">
        Editar
      </Link>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => duplicateProperty(property.id))}
        className="text-ink-soft hover:text-ink disabled:opacity-50"
      >
        Duplicar
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => togglePublished(property.id, !property.published))}
        className="text-ink-soft hover:text-ink disabled:opacity-50"
      >
        {property.published ? "Despublicar" : "Publicar"}
      </button>
      <button
        disabled={isPending}
        onClick={() => startTransition(() => toggleFeatured(property.id, !property.featured))}
        className="text-ink-soft hover:text-ink disabled:opacity-50"
      >
        {property.featured ? "Quitar destacado" : "Destacar"}
      </button>
      <button
        disabled={isPending}
        onClick={() => {
          if (window.confirm(`¿Eliminar "${property.title}"? Esta acción no se puede deshacer.`)) {
            startTransition(() => deleteProperty(property.id));
          }
        }}
        className="text-accent hover:underline disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
