import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Bootstrap, MasterItem, MasterSpec, ReportSpec, TableData } from "../../shared/types.ts";
import { autoReport, isIdLike } from "../../shared/autoreport.ts";
import { applySelection, colIndex, distinctValues, firstDateColumn, REL_SEP } from "../../shared/engine.ts";
import { normalizeHeader } from "../../shared/values.ts";
import { api } from "../api.ts";
import { canEdit, targetArea, targetName, useApp, useBoot, useTables } from "../store.tsx";
import { ActiveChips, DateRange, MultiSelect, selectionToQuery, useSelection } from "../components/Filters.tsx";
import { ChartView } from "../components/Chart.tsx";
import { KpiCard, kpiValue } from "../components/ReportBody.tsx";
import { Alert, Badge, Empty, PageHeader, Spinner } from "../components/ui.tsx";

function allTargets(boot: Bootstrap): string[] {
  const ds = [...boot.datasets].sort((a, b) => a.area.localeCompare(b.area, "es") || a.name.localeCompare(b.name, "es"));
  return [...ds.map((d) => d.id), ...boot.derived.map((d) => d.id)];
}

function itemsOf(boot: Bootstrap): MasterItem[] {
  const visible = new Set(allTargets(boot));
  if (!boot.master.items) return allTargets(boot).map((id) => ({ targetId: id, kpiIds: null, chartId: null }));
  return boot.master.items.filter((i) => visible.has(i.targetId));
}

/** Columnas de texto que comparten varias tablas: sirven de filtro común para todo el maestro. */
function commonFilters(tables: TableData[]): { name: string; options: string[] }[] {
  const seen = new Map<string, { name: string; tables: Set<string> }>();
  for (const t of tables) {
    for (const c of t.columns) {
      if (c.type !== "text" || c.name === "Archivo" || isIdLike(c.name)) continue;
      const short = c.name.split(REL_SEP).pop()!;
      const k = normalizeHeader(short);
      const e = seen.get(k) ?? { name: short, tables: new Set() };
      e.tables.add(t.id);
      seen.set(k, e);
    }
  }
  return [...seen.values()]
    .filter((e) => e.tables.size >= 2)
    .map((e) => {
      const opts = new Set<string>();
      for (const t of tables) if (colIndex(t, e.name) > -1) distinctValues(t, e.name, 100).forEach((v) => opts.add(v));
      return { name: e.name, options: [...opts].sort((a, b) => a.localeCompare(b, "es", { numeric: true })) };
    })
    .filter((f) => f.options.length >= 2 && f.options.length <= 30)
    .slice(0, 5);
}

export function Master() {
  const boot = useBoot();
  const nav = useNavigate();
  const items = useMemo(() => itemsOf(boot), [boot]);
  const ids = items.map((i) => i.targetId);
  const { tables, loading, error } = useTables(ids);
  const s = useSelection();
  const [editing, setEditing] = useState(false);

  const specs: Record<string, ReportSpec> = useMemo(() => {
    const out: Record<string, ReportSpec> = {};
    for (const id of ids) if (tables[id]) out[id] = boot.reports[id] ?? autoReport(tables[id]);
    return out;
  }, [tables, boot.reports, ids.join(",")]);
  const filters = useMemo(() => commonFilters(Object.values(tables)), [tables]);
  const anyDate = Object.values(tables).some((t) => firstDateColumn(t));
  const q = selectionToQuery(s.sel);

  if (!boot.datasets.length) {
    return (
      <div>
        <PageHeader title={boot.master.title} />
        <Empty title="Todavía no hay datos">
          {canEdit(boot) ? (
            <>
              Sube tus Excel en <Link className="text-brand-700 underline" to="/datos">Datos y cargas</Link> (o prueba con los datos de ejemplo) y aquí aparecerá el resumen de todo.
            </>
          ) : (
            "Cuando se carguen datos aparecerán aquí los resúmenes."
          )}
        </Empty>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={boot.master.title}
        subtitle={boot.master.subtitle || "Resumen de todos los informes. Pulsa en una tarjeta o en un gráfico para ir al informe detallado."}
        actions={canEdit(boot) ? <button className="btn btn-ghost" onClick={() => setEditing(!editing)}>{editing ? "Cerrar" : "Personalizar maestro"}</button> : null}
      />
      {editing && <MasterEditor boot={boot} tables={tables} specs={specs} onDone={() => setEditing(false)} />}

      {(filters.length > 0 || anyDate) && (
        <div className="card mb-5 flex flex-wrap items-center gap-2 p-3">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Filtros comunes</span>
          {filters.map((f) => (
            <MultiSelect key={f.name} label={f.name} options={f.options} value={s.sel.values[f.name] ?? []} onChange={(v) => s.setValues(f.name, v)} />
          ))}
          {anyDate && <DateRange from={s.sel.from} to={s.sel.to} onChange={s.setRange} />}
          <div className="w-full">
            <ActiveChips sel={s.sel} onRemove={s.toggle} onClear={s.clear} />
          </div>
        </div>
      )}

      {loading && <Spinner label="Calculando resúmenes…" />}
      {error && <Alert kind="error">{error}</Alert>}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const t = tables[item.targetId];
            const spec = specs[item.targetId];
            if (!t || !spec) return null;
            const f = applySelection(t, s.sel);
            const kpis = item.kpiIds ? spec.kpis.filter((k) => item.kpiIds!.includes(k.id)) : spec.kpis.slice(0, 2);
            const chart = item.chartId === "none" ? null : spec.charts.find((c) => c.id === item.chartId) ?? spec.charts[0];
            const href = `/informe/${item.targetId}${q}`;
            return (
              <div key={item.targetId} className="card flex flex-col p-4 transition hover:border-brand-500/50 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link to={href} className="block truncate text-base font-semibold text-slate-900 hover:text-brand-700">{spec.title || targetName(boot, item.targetId)}</Link>
                    <div className="mt-1 flex gap-1.5">
                      <Badge tone="brand">{targetArea(boot, item.targetId)}</Badge>
                      {item.targetId.startsWith("dt_") && <Badge>Derivada</Badge>}
                    </div>
                  </div>
                  <Link to={href} className="shrink-0 text-sm font-medium text-brand-700 hover:underline">Ver informe →</Link>
                </div>
                {kpis.length > 0 && (
                  <div className="mb-3 grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
                    {kpis.map((k) => <KpiCard key={k.id} compact label={k.label} value={kpiValue(f, k)} format={k.format} />)}
                  </div>
                )}
                {chart && (
                  <div className="mt-auto">
                    <p className="mb-1 text-xs font-medium text-slate-500">{chart.title}</p>
                    <ChartView
                      spec={{ ...chart, topN: Math.min(chart.topN || 6, 6) }}
                      table={f}
                      height={170}
                      onSelect={(dim, val) => nav(`/informe/${item.targetId}${selectionToQuery({ ...s.sel, values: { ...s.sel.values, [dim]: [val] } })}`)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MasterEditor({ boot, tables, specs, onDone }: { boot: Bootstrap; tables: Record<string, TableData>; specs: Record<string, ReportSpec>; onDone: () => void }) {
  const { refresh } = useApp();
  const all = allTargets(boot);
  const [spec, setSpec] = useState<MasterSpec>(() => ({ ...boot.master, items: itemsOf(boot) }));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const items = spec.items!;
  const included = new Set(items.map((i) => i.targetId));
  const setItems = (next: MasterItem[]) => setSpec({ ...spec, items: next });
  const move = (i: number, d: number) => {
    const next = [...items];
    const [x] = next.splice(i, 1);
    next.splice(Math.max(0, Math.min(next.length, i + d)), 0, x);
    setItems(next);
  };
  const save = async (auto = false) => {
    setBusy(true);
    setErr(null);
    try {
      await api("master", { method: "PUT", body: { ...spec, items: auto ? null : items } });
      await refresh();
      onDone();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="card mb-5 space-y-4 p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <div><label className="label">Título</label><input className="input" value={spec.title} onChange={(e) => setSpec({ ...spec, title: e.target.value })} /></div>
        <div><label className="label">Subtítulo</label><input className="input" value={spec.subtitle} onChange={(e) => setSpec({ ...spec, subtitle: e.target.value })} /></div>
      </div>
      <div>
        <p className="label">Tarjetas del maestro (orden, indicadores y gráfico de cada una)</p>
        <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
          {items.map((it, i) => {
            const sp = specs[it.targetId];
            return (
              <div key={it.targetId} className="flex flex-wrap items-center gap-3 px-3 py-2 text-sm">
                <div className="flex gap-1">
                  <button className="btn btn-ghost px-2 py-0.5" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir">↑</button>
                  <button className="btn btn-ghost px-2 py-0.5" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Bajar">↓</button>
                </div>
                <span className="min-w-40 flex-1 font-medium">{targetName(boot, it.targetId)}</span>
                {sp && (
                  <>
                    <span className="flex flex-wrap gap-2">
                      {sp.kpis.map((k) => {
                        const on = it.kpiIds ? it.kpiIds.includes(k.id) : sp.kpis.slice(0, 2).some((x) => x.id === k.id);
                        return (
                          <label key={k.id} className="flex items-center gap-1 text-xs">
                            <input type="checkbox" className="accent-brand-600" checked={on} onChange={() => {
                              const cur = it.kpiIds ?? sp.kpis.slice(0, 2).map((x) => x.id);
                              setItems(items.map((x) => (x === it ? { ...x, kpiIds: on ? cur.filter((c) => c !== k.id) : [...cur, k.id] } : x)));
                            }} />
                            {k.label}
                          </label>
                        );
                      })}
                    </span>
                    <select className="input w-auto py-1 text-xs" value={it.chartId ?? ""} onChange={(e) => setItems(items.map((x) => (x === it ? { ...x, chartId: e.target.value || null } : x)))}>
                      <option value="">Primer gráfico</option>
                      {sp.charts.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                      <option value="none">Sin gráfico</option>
                    </select>
                  </>
                )}
                <button className="text-xs text-red-600 hover:underline" onClick={() => setItems(items.filter((x) => x !== it))}>Quitar</button>
              </div>
            );
          })}
        </div>
        {all.filter((id) => !included.has(id)).length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-slate-500">Añadir:</span>
            {all.filter((id) => !included.has(id)).map((id) => (
              <button key={id} className="rounded-full border border-dashed border-slate-300 px-3 py-0.5 hover:border-brand-500" onClick={() => setItems([...items, { targetId: id, kpiIds: null, chartId: null }])}>
                + {targetName(boot, id)}
              </button>
            ))}
          </div>
        )}
        {!Object.keys(tables).length && <p className="text-sm text-slate-500">Cargando…</p>}
      </div>
      {err && <Alert kind="error">{err}</Alert>}
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" disabled={busy} onClick={() => save(false)}>Guardar</button>
        <button className="btn btn-ghost" disabled={busy} onClick={() => save(true)}>Volver a automático (todos los informes)</button>
      </div>
    </div>
  );
}
