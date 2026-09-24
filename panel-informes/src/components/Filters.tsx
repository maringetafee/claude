import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Selection } from "../../shared/engine.ts";
import { REL_SEP } from "../../shared/engine.ts";
import { fmtLabel } from "../format.ts";

/** Filtros guardados en la URL (?f=Columna::valor&desde=...&hasta=...), así los enlaces entre informes los conservan. */
export function useSelection() {
  const [params, setParams] = useSearchParams();
  const sel: Selection = useMemo(() => {
    const values: Record<string, string[]> = {};
    for (const f of params.getAll("f")) {
      const k = f.indexOf("::");
      if (k < 0) continue;
      const col = f.slice(0, k);
      (values[col] ??= []).push(f.slice(k + 2));
    }
    return { values, from: params.get("desde") ?? undefined, to: params.get("hasta") ?? undefined };
  }, [params]);

  const write = (next: Selection) => {
    const p = new URLSearchParams();
    for (const [col, vals] of Object.entries(next.values)) for (const v of vals) p.append("f", `${col}::${v}`);
    if (next.from) p.set("desde", next.from);
    if (next.to) p.set("hasta", next.to);
    setParams(p, { replace: true });
  };

  return {
    sel,
    query: params.toString(),
    setValues: (col: string, vals: string[]) => write({ ...sel, values: { ...sel.values, [col]: vals } }),
    toggle: (col: string, val: string) => {
      const cur = sel.values[col] ?? [];
      write({ ...sel, values: { ...sel.values, [col]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val] } });
    },
    setRange: (from?: string, to?: string) => write({ ...sel, from: from || undefined, to: to || undefined }),
    clear: () => write({ values: {} }),
    active: Object.values(sel.values).some((v) => v.length) || !!sel.from || !!sel.to,
  };
}

export function selectionToQuery(sel: Selection): string {
  const p = new URLSearchParams();
  for (const [col, vals] of Object.entries(sel.values)) for (const v of vals) p.append("f", `${col}::${v}`);
  if (sel.from) p.set("desde", sel.from);
  if (sel.to) p.set("hasta", sel.to);
  const s = p.toString();
  return s ? `?${s}` : "";
}

export function MultiSelect({ label, options, value, onChange }: { label: string; options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const shown = options.filter((o) => o.toLowerCase().includes(q.toLowerCase())).slice(0, 200);
  const short = label.split(REL_SEP).pop();
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition ${value.length ? "border-brand-500 bg-brand-50 text-brand-700" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"}`}
        title={label}
      >
        <span className="max-w-[12rem] truncate">{short}</span>
        {value.length > 0 && <span className="rounded-full bg-brand-600 px-1.5 text-xs text-white">{value.length}</span>}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          {options.length > 8 && <input autoFocus className="input mb-2 py-1.5" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />}
          <div className="max-h-64 overflow-auto">
            {shown.map((o) => (
              <label key={o} className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 text-sm hover:bg-slate-50">
                <input
                  type="checkbox"
                  className="accent-brand-600"
                  checked={value.includes(o)}
                  onChange={() => onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o])}
                />
                <span className="truncate">{fmtLabel(o)}</span>
              </label>
            ))}
            {!shown.length && <p className="px-2 py-1 text-sm text-slate-400">Sin resultados</p>}
          </div>
          {value.length > 0 && (
            <button className="mt-1 w-full rounded px-2 py-1 text-left text-xs text-slate-500 hover:bg-slate-50" onClick={() => onChange([])}>
              Quitar selección
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function DateRange({ from, to, onChange }: { from?: string; to?: string; onChange: (from?: string, to?: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-600">
      <input type="date" className="input w-auto py-1.5" value={from ?? ""} onChange={(e) => onChange(e.target.value, to)} aria-label="Desde" />
      <span>–</span>
      <input type="date" className="input w-auto py-1.5" value={to ?? ""} onChange={(e) => onChange(from, e.target.value)} aria-label="Hasta" />
    </div>
  );
}

export function ActiveChips({ sel, onRemove, onClear }: { sel: Selection; onRemove: (col: string, val: string) => void; onClear: () => void }) {
  const chips = Object.entries(sel.values).flatMap(([col, vals]) => vals.map((v) => ({ col, v })));
  if (!chips.length && !sel.from && !sel.to) return null;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {chips.map(({ col, v }) => (
        <button key={col + v} onClick={() => onRemove(col, v)} className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-0.5 text-xs text-white hover:bg-brand-700">
          {col.split(REL_SEP).pop()}: {fmtLabel(v)} <span aria-hidden>×</span>
        </button>
      ))}
      {(sel.from || sel.to) && (
        <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs text-brand-700">
          {sel.from ? fmtLabel(sel.from) : "…"} – {sel.to ? fmtLabel(sel.to) : "…"}
        </span>
      )}
      <button onClick={onClear} className="text-xs text-slate-500 underline hover:text-slate-800">
        Quitar filtros
      </button>
    </div>
  );
}
