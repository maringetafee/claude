import { useMemo } from "react";
import type { KpiSpec, ReportSpec, TableData } from "../../shared/types.ts";
import { aggregate, colIndex, distinctValues, firstDateColumn, type Selection } from "../../shared/engine.ts";
import { fmt } from "../format.ts";
import { ChartView } from "./Chart.tsx";
import { DataTable } from "./DataTable.tsx";
import { ActiveChips, DateRange, MultiSelect } from "./Filters.tsx";

export function kpiValue(t: TableData, k: KpiSpec): number | null {
  if (k.column === null) return k.agg === "count" ? t.rows.length : null;
  const i = colIndex(t, k.column);
  if (i < 0) return null;
  return aggregate(t.rows.map((r) => r[i]), k.agg);
}

export function KpiCard({ label, value, format, compact }: { label: string; value: number | null; format: KpiSpec["format"]; compact?: boolean }) {
  return (
    <div className={compact ? "min-w-0" : "card min-w-0 p-4"}>
      <p className="truncate text-xs font-medium text-slate-500" title={label}>{label}</p>
      <p className={`mt-1 truncate font-semibold tabular-nums tracking-tight text-slate-900 ${compact ? "text-lg" : "text-2xl"}`}>{fmt(value, format, compact)}</p>
    </div>
  );
}

interface Props {
  source: TableData; // sin filtrar (para opciones de segmentadores)
  filtered: TableData;
  spec: ReportSpec;
  sel: Selection;
  toggle: (col: string, val: string) => void;
  setValues: (col: string, vals: string[]) => void;
  setRange: (from?: string, to?: string) => void;
  clear: () => void;
}

export function ReportBody({ source, filtered, spec, sel, toggle, setValues, setRange, clear }: Props) {
  const options = useMemo(() => Object.fromEntries(spec.slicers.map((s) => [s, distinctValues(source, s)])), [source, spec.slicers]);
  const hasDate = !!firstDateColumn(source);
  return (
    <div className="space-y-5">
      {(spec.slicers.length > 0 || hasDate) && (
        <div className="card flex flex-wrap items-center gap-2 p-3">
          <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Filtros</span>
          {spec.slicers.filter((s) => colIndex(source, s) > -1).map((s) => (
            <MultiSelect key={s} label={s} options={options[s] ?? []} value={sel.values[s] ?? []} onChange={(v) => setValues(s, v)} />
          ))}
          {hasDate && <DateRange from={sel.from} to={sel.to} onChange={setRange} />}
          <div className="w-full">
            <ActiveChips sel={sel} onRemove={toggle} onClear={clear} />
          </div>
        </div>
      )}

      {spec.kpis.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {spec.kpis.map((k) => (
            <KpiCard key={k.id} label={k.label} value={kpiValue(filtered, k)} format={k.format} />
          ))}
        </div>
      )}

      {spec.charts.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-2">
          {spec.charts.map((c, i) => (
            <div key={c.id} className={`card p-4 ${c.type === "line" && i === 0 && spec.charts.length % 2 === 1 ? "lg:col-span-2" : ""}`}>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">{c.title}</h3>
              <ChartView spec={c} table={filtered} onSelect={toggle} selected={sel.values[c.dimension]} />
            </div>
          ))}
        </div>
      )}

      <div className="card p-4">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Detalle</h3>
        <DataTable table={filtered} columns={spec.tableColumns} />
      </div>
    </div>
  );
}
