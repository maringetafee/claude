"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { categories } from "@/data/categories";
import { sectors, materials } from "@/data/sectors";
import { searchProducts } from "@/lib/search";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";

type SortKey = "relevancia" | "nombre" | "familia";
const PAGE = 12;

const availabilityOptions = [
  { value: "consultar", label: "Consultar disponibilidad" },
  { value: "a-medida", label: "Fabricación a medida" },
  { value: "bajo-pedido", label: "Bajo pedido" },
];

export default function CatalogueBrowser({
  allProducts,
  lockedCategory,
  initialQuery = "",
}: {
  allProducts: Product[];
  lockedCategory?: string;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [cat, setCat] = useState<string[]>(lockedCategory ? [lockedCategory] : []);
  const [sec, setSec] = useState<string[]>([]);
  const [mat, setMat] = useState<string[]>([]);
  const [avail, setAvail] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [visible, setVisible] = useState(PAGE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggle = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    value: string,
  ) =>
    setter((cur) =>
      cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
    );

  const filtered = useMemo(() => {
    let list = allProducts;

    if (query.trim()) {
      const ranked = searchProducts(query, 200).map((r) => r.product.id);
      const rank = new Map(ranked.map((id, i) => [id, i]));
      list = list
        .filter((p) => rank.has(p.id))
        .sort((a, b) => (rank.get(a.id) ?? 0) - (rank.get(b.id) ?? 0));
    }

    if (cat.length) list = list.filter((p) => cat.includes(p.categorySlug));
    if (sec.length)
      list = list.filter((p) => p.sectors.some((s) => sec.includes(s)));
    if (mat.length)
      list = list.filter((p) => p.materials.some((m) => mat.includes(m)));
    if (avail.length) list = list.filter((p) => avail.includes(p.availability));

    if (sort === "nombre") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "familia") {
      list = [...list].sort(
        (a, b) =>
          a.categorySlug.localeCompare(b.categorySlug) ||
          a.name.localeCompare(b.name),
      );
    }
    return list;
  }, [allProducts, query, cat, sec, mat, avail, sort]);

  const shown = filtered.slice(0, visible);
  const activeCount =
    (lockedCategory ? 0 : cat.length) + sec.length + mat.length + avail.length;

  const clearAll = () => {
    setCat(lockedCategory ? [lockedCategory] : []);
    setSec([]);
    setMat([]);
    setAvail([]);
    setQuery("");
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[15rem_1fr]">
      {/* Filters */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-3 flex items-center justify-between lg:hidden">
          <button
            type="button"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
            className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] px-3 py-2 text-sm font-medium"
          >
            <Icon name="menu" size={16} />
            Filtros{activeCount ? ` (${activeCount})` : ""}
          </button>
          {activeCount ? (
            <button
              type="button"
              onClick={clearAll}
              className="text-sm font-medium text-[var(--color-brand)] underline"
            >
              Limpiar
            </button>
          ) : null}
        </div>

        <div className={`${filtersOpen ? "block" : "hidden"} lg:block`}>
          <div className="flex flex-col gap-6 rounded-[var(--radius-md)] border border-[var(--color-line)] bg-white p-4 lg:border-0 lg:bg-transparent lg:p-0">
            {!lockedCategory ? (
              <FilterGroup title="Familia">
                {categories.map((c) => (
                  <FilterCheck
                    key={c.slug}
                    label={c.shortName}
                    checked={cat.includes(c.slug)}
                    onChange={() => toggle(setCat, c.slug)}
                  />
                ))}
              </FilterGroup>
            ) : null}

            <FilterGroup title="Sector">
              {sectors.map((s) => (
                <FilterCheck
                  key={s.slug}
                  label={s.name}
                  checked={sec.includes(s.slug)}
                  onChange={() => toggle(setSec, s.slug)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Material">
              {materials.map((m) => (
                <FilterCheck
                  key={m.slug}
                  label={m.name}
                  checked={mat.includes(m.slug)}
                  onChange={() => toggle(setMat, m.slug)}
                />
              ))}
            </FilterGroup>

            <FilterGroup title="Disponibilidad">
              {availabilityOptions.map((a) => (
                <FilterCheck
                  key={a.value}
                  label={a.label}
                  checked={avail.includes(a.value)}
                  onChange={() => toggle(setAvail, a.value)}
                />
              ))}
            </FilterGroup>

            <p className="text-xs leading-relaxed text-[var(--color-ink-muted)]">
              No mostramos filtro de precio: todas las referencias se presupuestan
              a medida.
            </p>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative flex-1 sm:max-w-xs">
            <span className="visually-hidden">Buscar en el catálogo</span>
            <Icon
              name="search"
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-muted)]"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE);
              }}
              placeholder="Buscar…"
              className="w-full rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white py-2 pl-9 pr-3 text-sm outline-none focus-visible:border-[var(--color-brand)]"
            />
          </label>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-[var(--color-ink-muted)]">
              {filtered.length}{" "}
              {filtered.length === 1 ? "resultado" : "resultados"}
            </span>
            <label className="flex items-center gap-1.5">
              <span className="visually-hidden">Ordenar por</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white px-2 py-2 text-sm outline-none focus-visible:border-[var(--color-brand)]"
              >
                <option value="relevancia">Relevancia</option>
                <option value="nombre">Nombre A–Z</option>
                <option value="familia">Familia</option>
              </select>
            </label>
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="rounded-[var(--radius-md)] border border-dashed border-[var(--color-line-strong)] p-10 text-center">
            <p className="font-semibold">Sin resultados con estos filtros</p>
            <p className="mt-1 text-sm text-[var(--color-ink-soft)]">
              Prueba a quitar algún filtro o cuéntanos qué necesitas.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={clearAll}>
                Limpiar filtros
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
            {visible < filtered.length ? (
              <div className="mt-8 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => setVisible((v) => v + PAGE)}
                >
                  Ver más ({filtered.length - visible})
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-ink)]">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function FilterCheck({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-[var(--color-ink-soft)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 accent-[var(--color-brand)]"
      />
      {label}
    </label>
  );
}
