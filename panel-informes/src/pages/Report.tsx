import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import type { Bootstrap } from "../../shared/types.ts";
import { autoReport } from "../../shared/autoreport.ts";
import { applySelection } from "../../shared/engine.ts";
import { canEdit, targetArea, targetName, useBoot, useTables } from "../store.tsx";
import { useSelection } from "../components/Filters.tsx";
import { ReportBody } from "../components/ReportBody.tsx";
import { Alert, Badge, Empty, PageHeader, Spinner } from "../components/ui.tsx";
import { fmtDateTime } from "../format.ts";

/** Informes conectados: tablas de consulta, tablas que la usan y tablas derivadas. */
export function relatedTargets(boot: Bootstrap, id: string): { id: string; why: string }[] {
  const out = new Map<string, string>();
  for (const r of boot.relationships.filter((r) => r.enabled)) {
    if (r.fromDataset === id) out.set(r.toDataset, `por ${r.fromColumn}`);
    if (r.toDataset === id) out.set(r.fromDataset, `por ${r.toColumn}`);
  }
  for (const d of boot.derived) {
    if (d.source === id) out.set(d.id, "tabla derivada");
    if (d.id === id) out.set(d.source, "tabla de origen");
  }
  out.delete(id);
  return [...out.entries()]
    .filter(([t]) => boot.datasets.some((d) => d.id === t) || boot.derived.some((d) => d.id === t))
    .map(([t, why]) => ({ id: t, why }));
}

export function Report() {
  const { id = "" } = useParams();
  const boot = useBoot();
  const { tables, loading, error } = useTables([id]);
  const s = useSelection();
  const table = tables[id];
  const spec = useMemo(() => boot.reports[id] ?? (table ? autoReport(table) : null), [boot.reports, id, table]);
  const filtered = useMemo(() => (table ? applySelection(table, s.sel) : null), [table, s.sel]);
  const exists = boot.datasets.some((d) => d.id === id) || boot.derived.some((d) => d.id === id);
  if (!exists) return <Empty title="Informe no encontrado">Puede que se haya borrado o que no tengas acceso a esta área.</Empty>;

  const meta = boot.datasets.find((d) => d.id === id);
  const related = relatedTargets(boot, id);
  const area = targetArea(boot, id);
  const q = s.query ? `?${s.query}` : "";

  return (
    <div>
      <div className="mb-2 text-sm">
        <Link to={`/${q}`} className="text-brand-700 hover:underline">← Informe maestro</Link>
      </div>
      <PageHeader
        title={spec?.title || targetName(boot, id)}
        subtitle={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone="brand">{area}</Badge>
            {id.startsWith("dt_") ? <Badge>Tabla derivada</Badge> : null}
            {meta && <span>Actualizado {fmtDateTime(meta.updatedAt)} · {meta.files.length} archivo(s)</span>}
            {spec?.description && <span>· {spec.description}</span>}
          </span>
        }
        actions={canEdit(boot, area) ? <Link to={`/informe/${id}/editar`} className="btn btn-ghost">Personalizar informe</Link> : null}
      />
      {related.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-500">Informes relacionados:</span>
          {related.map((r) => (
            <Link key={r.id} to={`/informe/${r.id}${q}`} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-700 hover:border-brand-500 hover:text-brand-700">
              {targetName(boot, r.id)} <span className="text-slate-400">({r.why})</span>
            </Link>
          ))}
        </div>
      )}
      {loading && <Spinner label="Cargando datos…" />}
      {error && <Alert kind="error">{error}</Alert>}
      {!loading && table && spec && filtered && (
        <ReportBody source={table} filtered={filtered} spec={spec} sel={s.sel} toggle={s.toggle} setValues={s.setValues} setRange={s.setRange} clear={s.clear} />
      )}
    </div>
  );
}
