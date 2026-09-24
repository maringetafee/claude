import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Agg, ChartSpec, ChartType, Grain, KpiSpec, NumberFormat, ReportSpec } from "../../shared/types.ts";
import { autoReport, formatFor } from "../../shared/autoreport.ts";
import { AGG_LABEL, GRAIN_LABEL, applySelection } from "../../shared/engine.ts";
import { api } from "../api.ts";
import { useApp, useBoot, useTables } from "../store.tsx";
import { useSelection } from "../components/Filters.tsx";
import { ReportBody } from "../components/ReportBody.tsx";
import { Alert, PageHeader, Section, Spinner } from "../components/ui.tsx";

const CHART_LABEL: Record<ChartType, string> = { bar: "Barras", hbar: "Barras horizontales", line: "Líneas (evolución)", pie: "Circular", table: "Tabla resumen" };
const FORMAT_LABEL: Record<NumberFormat, string> = { number: "Número", currency: "Euros", percent: "Porcentaje" };
const uid = () => Math.random().toString(36).slice(2, 8);

export function ReportEditor() {
  const { id = "" } = useParams();
  const boot = useBoot();
  const { refresh } = useApp();
  const nav = useNavigate();
  const { tables, loading } = useTables([id]);
  const table = tables[id];
  const [spec, setSpec] = useState<ReportSpec | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const s = useSelection();

  useEffect(() => {
    if (table && !spec) setSpec(structuredClone(boot.reports[id] ?? autoReport(table)));
  }, [table, spec, boot.reports, id]);

  const filtered = useMemo(() => (table ? applySelection(table, s.sel) : null), [table, s.sel]);
  if (loading || !table || !spec || !filtered) return <Spinner />;

  const cols = table.columns;
  const numeric = cols.filter((c) => c.type === "number").map((c) => c.name);
  const dims = cols.map((c) => c.name);
  const set = (patch: Partial<ReportSpec>) => setSpec({ ...spec, ...patch });
  const setKpi = (i: number, patch: Partial<KpiSpec>) => set({ kpis: spec.kpis.map((k, n) => (n === i ? { ...k, ...patch } : k)) });
  const setChart = (i: number, patch: Partial<ChartSpec>) => set({ charts: spec.charts.map((c, n) => (n === i ? { ...c, ...patch } : c)) });

  const save = async () => {
    setErr(null);
    try {
      await api(`reports/${id}`, { method: "PUT", body: spec });
      await refresh();
      nav(`/informe/${id}`);
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  const reset = async () => {
    if (!confirm("¿Volver al informe automático? Se perderán los cambios guardados.")) return;
    await api(`reports/${id}`, { method: "DELETE" });
    await refresh();
    nav(`/informe/${id}`);
  };

  const measureSelect = (value: string | null, agg: Agg, onChange: (column: string | null, agg: Agg) => void) => (
    <>
      <select className="input" value={value ?? ""} onChange={(e) => {
        const col = e.target.value || null;
        onChange(col, col === null ? "count" : agg === "count" ? "sum" : agg);
      }}>
        <option value="">(Nº de registros)</option>
        {dims.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select className="input" value={agg} onChange={(e) => onChange(value, e.target.value as Agg)} disabled={value === null}>
        {(Object.keys(AGG_LABEL) as Agg[]).filter((a) => numeric.includes(value ?? "") || a === "count" || a === "countDistinct").map((a) => (
          <option key={a} value={a}>{AGG_LABEL[a]}</option>
        ))}
      </select>
    </>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Personalizar: ${spec.title}`}
        subtitle="Los cambios se ven abajo al momento. Nadie más los verá hasta que guardes."
        actions={
          <>
            <Link to={`/informe/${id}`} className="btn btn-ghost">Cancelar</Link>
            <button className="btn btn-ghost" onClick={reset}>Volver a automático</button>
            <button className="btn btn-primary" onClick={save}>Guardar informe</button>
          </>
        }
      />
      {err && <Alert kind="error">{err}</Alert>}

      <Section title="General">
        <div className="grid gap-3 md:grid-cols-2">
          <div><label className="label">Título</label><input className="input" value={spec.title} onChange={(e) => set({ title: e.target.value })} /></div>
          <div><label className="label">Descripción</label><input className="input" value={spec.description} onChange={(e) => set({ description: e.target.value })} /></div>
        </div>
      </Section>

      <Section title="Indicadores (KPIs)" actions={<button className="btn btn-ghost" onClick={() => set({ kpis: [...spec.kpis, { id: `k_${uid()}`, label: "Nuevo indicador", column: numeric[0] ?? null, agg: numeric[0] ? "sum" : "count", format: numeric[0] ? formatFor(numeric[0]) : "number" }] })}>+ Añadir</button>}>
        <div className="space-y-2">
          {spec.kpis.map((k, i) => (
            <div key={k.id} className="grid gap-2 md:grid-cols-[1.4fr_1.2fr_1fr_1fr_auto]">
              <input className="input" value={k.label} onChange={(e) => setKpi(i, { label: e.target.value })} aria-label="Nombre" />
              {measureSelect(k.column, k.agg, (column, agg) => setKpi(i, { column, agg, format: column ? formatFor(column) : "number" }))}
              <select className="input" value={k.format} onChange={(e) => setKpi(i, { format: e.target.value as NumberFormat })}>
                {(Object.keys(FORMAT_LABEL) as NumberFormat[]).map((f) => <option key={f} value={f}>{FORMAT_LABEL[f]}</option>)}
              </select>
              <button className="btn btn-danger" onClick={() => set({ kpis: spec.kpis.filter((_, n) => n !== i) })}>Quitar</button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Gráficos" actions={<button className="btn btn-ghost" onClick={() => set({ charts: [...spec.charts, { id: `c_${uid()}`, type: "bar", title: "Nuevo gráfico", dimension: dims[0], measure: { column: numeric[0] ?? null, agg: numeric[0] ? "sum" : "count" }, format: "number", topN: 10 }] })}>+ Añadir</button>}>
        <div className="space-y-3">
          {spec.charts.map((c, i) => {
            const isDate = cols.find((x) => x.name === c.dimension)?.type === "date";
            return (
              <div key={c.id} className="grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-4">
                <div className="md:col-span-2"><label className="label">Título</label><input className="input" value={c.title} onChange={(e) => setChart(i, { title: e.target.value })} /></div>
                <div><label className="label">Tipo</label>
                  <select className="input" value={c.type} onChange={(e) => setChart(i, { type: e.target.value as ChartType })}>
                    {(Object.keys(CHART_LABEL) as ChartType[]).map((t) => <option key={t} value={t}>{CHART_LABEL[t]}</option>)}
                  </select>
                </div>
                <div><label className="label">Agrupar por</label>
                  <select className="input" value={c.dimension} onChange={(e) => setChart(i, { dimension: e.target.value })}>
                    {dims.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                {isDate && (
                  <div><label className="label">Periodo</label>
                    <select className="input" value={c.grain ?? "month"} onChange={(e) => setChart(i, { grain: e.target.value as Grain })}>
                      {(Object.keys(GRAIN_LABEL) as Grain[]).map((g) => <option key={g} value={g}>{GRAIN_LABEL[g]}</option>)}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 md:col-span-2">
                  <div className="col-span-2 -mb-1 text-xs font-medium text-slate-600">Valor</div>
                  {measureSelect(c.measure.column, c.measure.agg, (column, agg) => setChart(i, { measure: { column, agg }, format: column ? formatFor(column) : "number" }))}
                </div>
                <div><label className="label">Mostrar los</label>
                  <input type="number" min={0} className="input" value={c.topN} onChange={(e) => setChart(i, { topN: Number(e.target.value) })} title="0 = todos" />
                </div>
                <div className="flex items-end gap-2">
                  <select className="input" value={c.format} onChange={(e) => setChart(i, { format: e.target.value as NumberFormat })} aria-label="Formato">
                    {(Object.keys(FORMAT_LABEL) as NumberFormat[]).map((f) => <option key={f} value={f}>{FORMAT_LABEL[f]}</option>)}
                  </select>
                  <button className="btn btn-danger" onClick={() => set({ charts: spec.charts.filter((_, n) => n !== i) })}>Quitar</button>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Filtros y tabla de detalle">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="label">Filtros disponibles para quien vea el informe</p>
            <div className="max-h-56 space-y-1 overflow-auto rounded-lg border border-slate-200 p-2">
              {cols.filter((c) => c.type === "text").map((c) => (
                <label key={c.name} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-brand-600" checked={spec.slicers.includes(c.name)} onChange={() => set({ slicers: spec.slicers.includes(c.name) ? spec.slicers.filter((x) => x !== c.name) : [...spec.slicers, c.name] })} />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="label">Columnas de la tabla de detalle</p>
            <div className="max-h-56 space-y-1 overflow-auto rounded-lg border border-slate-200 p-2">
              {cols.map((c) => {
                const on = spec.tableColumns ? spec.tableColumns.includes(c.name) : true;
                return (
                  <label key={c.name} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="accent-brand-600" checked={on} onChange={() => {
                      const cur = spec.tableColumns ?? cols.map((x) => x.name);
                      set({ tableColumns: on ? cur.filter((x) => x !== c.name) : cols.map((x) => x.name).filter((x) => x === c.name || cur.includes(x)) });
                    }} />
                    {c.name}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Vista previa</h2>
        <ReportBody source={table} filtered={filtered} spec={spec} sel={s.sel} toggle={s.toggle} setValues={s.setValues} setRange={s.setRange} clear={s.clear} />
      </div>
    </div>
  );
}
