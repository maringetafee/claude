"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { searchProducts } from "@/lib/search";
import ProductGrid from "@/components/commerce/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";

export default function BuscarResults() {
  const q = (useSearchParams().get("q") ?? "").trim();
  const results = useMemo(
    () => searchProducts(q, 60).map((r) => r.product),
    [q],
  );

  if (!q) {
    return (
      <p className="text-[var(--color-ink-soft)]">
        Escribe un término en el buscador para ver resultados.{" "}
        <Link href="/productos" className="font-medium text-[var(--color-brand)] underline">
          Ver todo el catálogo
        </Link>
      </p>
    );
  }

  return (
    <div>
      <p className="mb-6 text-[var(--color-ink-soft)]">
        {results.length}{" "}
        {results.length === 1 ? "resultado" : "resultados"} para{" "}
        <strong className="text-[var(--color-ink)]">“{q}”</strong>
      </p>

      {results.length === 0 ? (
        <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-line-strong)] p-10 text-center">
          <p className="font-semibold">No hemos encontrado herramientas para esa búsqueda</p>
          <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
            Puede que la herramienta que necesitas sea a medida. Cuéntanos qué
            trabajo tienes que hacer.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <ButtonLink href="/productos" variant="outline" size="sm">
              Ver catálogo
            </ButtonLink>
            <ButtonLink href="/contacto" size="sm">
              Consultar
            </ButtonLink>
          </div>
        </div>
      ) : (
        <ProductGrid products={results} />
      )}
    </div>
  );
}
