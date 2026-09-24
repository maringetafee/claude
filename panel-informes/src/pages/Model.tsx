import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { Agg, DerivedTable, Filter, FilterOp, Grain, Relationship } from "../../shared/types.ts";
import { AGG_LABEL, GRAIN_LABEL, computeDerived } from "../../shared/engine.ts";
import { api } from "../api.ts";
import { autoDetectRelationships, canEdit, targetName, useApp, useBoot, useTables } from "../store.tsx";
import { DataTable } from "../components/DataTable.tsx";
import { Alert, Badge, PageHeader, Section, Spinner } from "../components/ui.tsx";

export function ModelPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Relaciones y tablas derivadas" subtitle="Conecta las tablas entre sí y crea tablas nuevas a partir de otras. Todo se recalcula solo cuando llegan datos." />
      <Relationships />
      <DerivedTables />
    </div>
  );
}

function Relationships() {
  const boot = useBoot();
  const { refresh } = useApp();
  const [msg, setMsg] = useState<{ kind: "ok" | "error" | "info"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<Relationship | null>(null);
  const save = async (list: Relationship[]) => {
    await api("relationships", { method: "PUT", body: { relationships: list } });
    await refresh();
  };
  const detect = async () => {
    setBusy(true);
    try {
      const n = await autoDetectRelationships(boot);
      await refresh();
      setMsg({ kind: n ? "ok" : "info", text: n ? `${n} relación(es) nueva(s) detectada(s).` : "No se han encontrado relaciones nuevas." });
    } catch (e) {
      setMsg({ kind: "error", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };
  const colsOf = (id: string) => boot.datasets.find((d) => d.id === id)?.columns.map((c) => c.name) ?? [];
  return (
    <Section
      title="Relaciones"
      description={<>Una relación une dos tablas por una columna común (p. ej. <i>Código cliente</i>). Así el informe de Ventas puede usar la zona del cliente, y los filtros del maestro afectan a todas las tablas conectadas.</>}
      actions={
        <>
          <button className="btn btn-ghost" disabled={busy} onClick={detect}>{busy ? "Buscando…" : "Detectar automáticamente"}</button>
          {boot.datasets.length > 1 && <button className="btn btn-ghost" onClick={() => setDraft({ id: `rel_${Date.now()}`, fromDataset: boot.datasets[0].id, fromColumn: boot.datasets[0].columns[0]?.name ?? "", toDataset: boot.datasets[1].id, toColumn: boot.datasets[1].columns[0]?.name ?? "", auto: false, enabled: true })}>+ Manual</button>}
        </>
      }
    >
      {msg && <div className="mb-3"><Alert kind={msg.kind}>{msg.text}</Alert></div>}
      {draft && (
        <div className="mb-4 grid gap-2 rounded-lg border border-slate-200 p-3 md:grid-cols-[1fr_1fr_auto_1fr_1fr_auto]">
          <select className="input" value={draft.fromDataset} onChange={(e) => setDraft({ ...draft, fromDataset: e.target.value, fromColumn: colsOf(e.target.value)[0] ?? "" })}>
            {boot.datasets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="input" value={draft.fromColumn} onChange={(e) => setDraft({ ...draft, fromColumn: e.target.value })}>
            {colsOf(draft.fromDataset).map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="self-center text-center text-slate-400">→</span>
          <select className="input" value={draft.toDataset} onChange={(e) => setDraft({ ...draft, toDataset: e.target.value, toColumn: colsOf(e.target.value)[0] ?? "" })}>
            {boot.datasets.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select className="input" value={draft.toColumn} onChange={(e) => setDraft({ ...draft, toColumn: e.target.value })}>
            {colsOf(draft.toDataset).map((c) => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={async () => { await save([...boot.relationships, draft]); setDraft(null); }}>Añadir</button>
            <button className="btn btn-ghost" onClick={() => setDraft(null)}>×</button>
          </div>
          <p className="text-xs text-slate-500 md:col-span-6">La tabla de la derecha debe ser la de consulta: cada valor aparece una sola vez (p. ej. la lista de clientes).</p>
        </div>
      )}
      {!boot.relationships.length ? (
        <p className="text-sm text-slate-500">Todavía no hay relaciones. Si dos tablas tienen una columna con el mismo nombre, pulsa «Detectar automáticamente».</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {boot.relationships.map((r) => (
            <div key={r.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <span className="min-w-0 flex-1">
                <b>{targetName(boot, r.fromDataset)}</b>.{r.fromColumn} <span className="text-slate-400">→</span> <b>{targetName(boot, r.toDataset)}</b>.{r.toColumn}
                {r.auto && <span className="ml-2"><Badge tone="brand">automática</Badge></span>}
              </span>
              {canEdit(boot) && (
                <>
                  <label className="flex items-center gap-1.5 text-xs">
                    <input type="checkbox" className="accent-brand-600" checked={r.enabled} onChange={() => save(boot.relationships.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)))} /> Activa
                  </label>
                  <button className="text-xs text-red-600 hover:underline" onClick={() => save(boot.relationships.filter((x) => x.id !== r.id))}>Quitar</button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

const OPS: Record<FilterOp, string> = { eq: "es igual a", neq: "no es", in: "es uno de (separar con |)", contains: "contiene", gt: "mayor que", gte: "mayor o igual", lt: "menor que", lte: "menor o igual" };

function blank(boot: ReturnType<typeof useBoot>): DerivedTable {
  const src = boot.datasets[0];
  return { id: "", name: "Nueva tabla", area: src?.area ?? "General", source: src?.id ?? "", filters: [], groupBy: [], measures: [], updatedAt: "" };
}

function DerivedTables() {
  const boot = useBoot();
  const [edit, setEdit] = useState<DerivedTable | null>(null);
  return (
    <Section
      title="Tablas derivadas"
      description="Tablas que salen de otra: filtradas (solo la zona Norte), resumidas (ventas por mes y comercial) o ambas. Cada una tiene su propio informe y se recalcula sola."
      actions={!edit && boot.datasets.length ? <button className="btn btn-ghost" onClick={() => setEdit(blank(boot))}>+ Nueva tabla derivada</button> : null}
    >
      {edit ? (
        <DerivedEditor spec={edit} onClose={() => setEdit(null)} />
      ) : !boot.derived.length ? (
        <p className="text-sm text-slate-500">Aún no hay tablas derivadas.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {boot.derived.map((d) => (
            <div key={d.id} className="flex flex-wrap items-center gap-3 py-2.5 text-sm">
              <span className="min-w-0 flex-1">
                <Link to={`/informe/${d.id}`} className="font-medium text-brand-700 hover:underline">{d.name}</Link>
                <span className="text-slate-500"> · de {targetName(boot, d.source)} · {d.groupBy.length ? `agrupada por ${d.groupBy.map((g) => g.column).join(", ")}` : "filtrada"}</span>
              </span>
              <Badge>{d.area}</Badge>
              {canEdit(boot, d.area) && <button className="text-xs text-slate-600 hover:underline" onClick={() => setEdit(structuredClone(d))}>Editar</button>}
            </div>
          ))}
        </div>
      )}
    </Section>
  );
}

function DerivedEditor({ spec: initial, onClose }: { spec: DerivedTable; onClose: () => void }) {
  const boot = useBoot();
  const { refresh } = useApp();
  const [spec, setSpec] = useState(initial);
  const [err, setErr] = useState<string | null>(null);
  const { tables, loading } = useTables(spec.source ? [spec.source] : []);
  const src = tables[spec.source];
  const preview = useMemo(() => (src ? computeDerived({ ...spec, id: spec.id || "dt_preview" }, src) : null), [src, spec]);
  const cols = src?.columns ?? [];
  const sources = [...boot.datasets.map((d) => ({ id: d.id, name: d.name })), ...boot.derived.filter((d) => d.id !== spec.id).map((d) => ({ id: d.id, name: `${d.name} (derivada)` }))];
  const set = (p: Partial<DerivedTable>) => setSpec({ ...spec, ...p });

  const save = async () => {
    setErr(null);
    try {
      await api(`derived/${spec.id || "new"}`, { method: "PUT", body: spec });
      await refresh();
      onClose();
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  const remove = async () => {
    if (!confirm(`¿Borrar la tabla derivada «${spec.name}»? Los datos de origen no se tocan.`)) return;
    await api(`derived/${spec.id}`, { method: "DELETE" });
    await refresh();
    onClose();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <div><label className="label">Nombre</label><input className="input" value={spec.name} onChange={(e) => set({ name: e.target.value })} /></div>
        <div>
          <label className="label">Sale de</label>
          <select className="input" value={spec.source} onChange={(e) => set({ source: e.target.value, filters: [], groupBy: [], measures: [] })}>
            {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div><label className="label">Área (quién la ve)</label><input className="input" list="areas-dt" value={spec.area} onChange={(e) => set({ area: e.target.value })} /><datalist id="areas-dt">{boot.areas.map((a) => <option key={a} value={a} />)}</datalist></div>
      </div>
      {loading && <Spinner />}
      {src && (
        <>
          <div>
            <div className="mb-1 flex items-center justify-between"><p className="label mb-0">Filtros</p><button className="text-xs text-brand-700 hover:underline" onClick={() => set({ filters: [...spec.filters, { column: cols[0].name, op: "eq", value: "" }] })}>+ Filtro</button></div>
            {spec.filters.map((f, i) => (
              <div key={i} className="mb-2 grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
                <select className="input" value={f.column} onChange={(e) => set({ filters: spec.filters.map((x, n) => (n === i ? { ...x, column: e.target.value } : x)) })}>{cols.map((c) => <option key={c.name}>{c.name}</option>)}</select>
                <select className="input" value={f.op} onChange={(e) => set({ filters: spec.filters.map((x, n) => (n === i ? { ...x, op: e.target.value as FilterOp } : x)) })}>{(Object.keys(OPS) as FilterOp[]).map((o) => <option key={o} value={o}>{OPS[o]}</option>)}</select>
                <input className="input" value={f.value} placeholder={cols.find((c) => c.name === f.column)?.type === "date" ? "AAAA-MM-DD" : "valor"} onChange={(e) => set({ filters: spec.filters.map((x, n): Filter => (n === i ? { ...x, value: e.target.value } : x)) })} />
                <button className="btn btn-danger" onClick={() => set({ filters: spec.filters.filter((_, n) => n !== i) })}>×</button>
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center justify-between"><p className="label mb-0">Agrupar por (opcional)</p><button className="text-xs text-brand-700 hover:underline" onClick={() => set({ groupBy: [...spec.groupBy, { column: cols[0].name }] })}>+ Columna</button></div>
              {spec.groupBy.map((g, i) => {
                const isDate = cols.find((c) => c.name === g.column)?.type === "date";
                return (
                  <div key={i} className="mb-2 flex gap-2">
                    <select className="input" value={g.column} onChange={(e) => set({ groupBy: spec.groupBy.map((x, n) => (n === i ? { column: e.target.value } : x)) })}>{cols.map((c) => <option key={c.name}>{c.name}</option>)}</select>
                    {isDate && (
                      <select className="input w-36" value={g.grain ?? "month"} onChange={(e) => set({ groupBy: spec.groupBy.map((x, n) => (n === i ? { ...x, grain: e.target.value as Grain } : x)) })}>
                        {(Object.keys(GRAIN_LABEL) as Grain[]).map((k) => <option key={k} value={k}>por {GRAIN_LABEL[k]}</option>)}
                      </select>
                    )}
                    <button className="btn btn-danger" onClick={() => set({ groupBy: spec.groupBy.filter((_, n) => n !== i) })}>×</button>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between"><p className="label mb-0">Cálculos</p><button className="text-xs text-brand-700 hover:underline" onClick={() => {
                const num = cols.find((c) => c.type === "number");
                set({ measures: [...spec.measures, num ? { column: num.name, agg: "sum", name: `Total ${num.name.toLowerCase()}` } : { column: null, agg: "count", name: "Registros" }] });
              }}>+ Cálculo</button></div>
              {spec.measures.map((m, i) => (
                <div key={i} className="mb-2 grid grid-cols-[1fr_1fr_1.2fr_auto] gap-2">
                  <select className="input" value={m.agg} onChange={(e) => set({ measures: spec.measures.map((x, n) => (n === i ? { ...x, agg: e.target.value as Agg } : x)) })}>{(Object.keys(AGG_LABEL) as Agg[]).map((a) => <option key={a} value={a}>{AGG_LABEL[a]}</option>)}</select>
                  <select className="input" value={m.column ?? ""} onChange={(e) => set({ measures: spec.measures.map((x, n) => (n === i ? { ...x, column: e.target.value || null } : x)) })}>
                    <option value="">(filas)</option>
                    {cols.map((c) => <option key={c.name}>{c.name}</option>)}
                  </select>
                  <input className="input" value={m.name} onChange={(e) => set({ measures: spec.measures.map((x, n) => (n === i ? { ...x, name: e.target.value } : x)) })} aria-label="Nombre de la columna" />
                  <button className="btn btn-danger" onClick={() => set({ measures: spec.measures.filter((_, n) => n !== i) })}>×</button>
                </div>
              ))}
            </div>
          </div>
          {preview && (
            <div>
              <p className="label">Vista previa ({preview.rows.length.toLocaleString("es-ES")} filas)</p>
              <DataTable table={preview} pageSize={8} />
            </div>
          )}
        </>
      )}
      {err && <Alert kind="error">{err}</Alert>}
      <div className="flex flex-wrap gap-2">
        <button className="btn btn-primary" onClick={save} disabled={!spec.source || !spec.name.trim()}>Guardar tabla</button>
        <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
        {spec.id && <button className="btn btn-danger ml-auto" onClick={remove}>Borrar</button>}
      </div>
    </div>
  );
}
