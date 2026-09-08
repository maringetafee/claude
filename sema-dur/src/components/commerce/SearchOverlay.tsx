"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useUI } from "@/lib/ui-state";
import { searchProducts } from "@/lib/search";
import { categoryName } from "@/data/products";
import Icon from "@/components/ui/Icon";
import Picture from "@/components/ui/Picture";

const SUGGESTIONS = [
  "Herramientas PCD",
  "Portacuchillas",
  "Fresa de compresión",
  "Cono HSK",
  "Reafilado",
];

export default function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => searchProducts(query, 6), [query]);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    if (searchOpen && !dlg.open) {
      dlg.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!searchOpen && dlg.open) dlg.close();
  }, [searchOpen]);

  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0);
  }, [query]);

  function submit(q: string) {
    const term = q.trim();
    if (!term) return;
    closeSearch();
    router.push(`/buscar/?q=${encodeURIComponent(term)}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) {
        closeSearch();
        router.push(`/producto/${hit.product.slug}/`);
      } else {
        submit(query);
      }
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={closeSearch}
      aria-label="Buscar en el catálogo"
      className="modal-pop m-0 mx-auto mt-0 w-full max-w-2xl bg-transparent p-3 sm:mt-[8vh]"
    >
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white shadow-[var(--shadow-lg)]">
        <search>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              submit(query);
            }}
            className="flex items-center gap-3 border-b border-[var(--color-line)] px-4"
          >
            <Icon name="search" size={20} className="text-[var(--color-ink-muted)]" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Busca por nombre, referencia o familia…"
              aria-label="Términos de búsqueda"
              autoComplete="off"
              className="flex-1 bg-transparent py-4 text-base outline-none placeholder:text-[var(--color-ink-muted)]"
            />
            <button
              type="button"
              onClick={closeSearch}
              aria-label="Cerrar búsqueda"
              className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] text-[var(--color-ink-muted)] hover:bg-[var(--color-bg-soft)]"
            >
              <Icon name="close" size={20} />
            </button>
          </form>
        </search>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {query.trim() === "" ? (
            <div className="p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                Búsquedas habituales
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setQuery(s)}
                    className="rounded-full border border-[var(--color-line-strong)] px-3 py-1.5 text-sm text-[var(--color-ink-soft)] transition-colors hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <p className="p-4 text-sm text-[var(--color-ink-soft)]">
              No hay resultados para <strong>{query}</strong>. Prueba con otro
              término o{" "}
              <Link
                href="/contacto"
                className="font-medium text-[var(--color-brand)] underline"
                onClick={closeSearch}
              >
                consúltanos directamente
              </Link>
              .
            </p>
          ) : (
            <ul>
              {results.map((r, i) => (
                <li key={r.product.id}>
                  <Link
                    href={`/producto/${r.product.slug}/`}
                    onClick={closeSearch}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 ${
                      i === active ? "bg-[var(--color-bg-soft)]" : ""
                    }`}
                  >
                    <span className="h-11 w-11 shrink-0 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--color-line)] bg-white">
                      {r.product.image ? (
                        <Picture
                          image={r.product.image}
                          alt=""
                          sizes="44px"
                          aspectRatio="1 / 1"
                        />
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-[var(--color-ink)]">
                        {r.product.name}
                      </span>
                      <span className="block text-xs text-[var(--color-ink-muted)]">
                        {categoryName(r.product.categorySlug)} · Ref. {r.product.ref}
                      </span>
                    </span>
                    <Icon
                      name="arrow-right"
                      size={16}
                      className="text-[var(--color-ink-muted)]"
                    />
                  </Link>
                </li>
              ))}
              <li className="border-t border-[var(--color-line)] mt-1 pt-1">
                <button
                  type="button"
                  onClick={() => submit(query)}
                  className="w-full rounded-[var(--radius-sm)] px-3 py-2.5 text-left text-sm font-medium text-[var(--color-brand)] hover:bg-[var(--color-bg-soft)]"
                >
                  Ver todos los resultados para “{query}”
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </dialog>
  );
}
