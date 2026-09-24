// Motor de datos: relaciones, tablas derivadas, filtros y agregaciones.
import type {
  Agg, Cell, Column, DatasetMeta, DerivedTable, Filter, Grain, Relationship, Row, TableData,
} from "./types.ts";
import { ORIGIN_COL } from "./types.ts";
import { normalizeHeader, normalizeKey, parseNumber } from "./values.ts";

export const REL_SEP = " › ";

/** "2026", "2026-03" o "2026-T1": periodos que salen de agrupar fechas (se ordenan como tiempo). */
export const PERIOD_RE = /^\d{4}(-\d{2}|-T[1-4])?$/;

export function isPeriodColumn(t: TableData, i: number): boolean {
  if (t.columns[i]?.type !== "text") return false;
  let n = 0;
  for (const r of t.rows) {
    if (r[i] === null) continue;
    if (!PERIOD_RE.test(String(r[i]))) return false;
    if (++n > 200) break;
  }
  return n > 0;
}

// ---------- agregaciones ----------

export function aggregate(values: Cell[], agg: Agg): number | null {
  if (agg === "count") return values.length;
  if (agg === "countDistinct") return new Set(values.filter((v) => v !== null).map(String)).size;
  const nums: number[] = [];
  for (const v of values) {
    const n = typeof v === "number" ? v : parseNumber(v);
    if (n !== null) nums.push(n);
  }
  if (!nums.length) return null;
  switch (agg) {
    case "sum":
      return nums.reduce((a, b) => a + b, 0);
    case "avg":
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    case "min":
      return Math.min(...nums);
    case "max":
      return Math.max(...nums);
  }
}

export function grainKey(v: Cell, grain: Grain | undefined): string | null {
  if (v === null) return null;
  const s = String(v);
  if (!grain || !/^\d{4}-\d{2}-\d{2}/.test(s)) return s;
  const y = s.slice(0, 4);
  const m = +s.slice(5, 7);
  switch (grain) {
    case "day":
      return s.slice(0, 10);
    case "month":
      return `${y}-${s.slice(5, 7)}`;
    case "quarter":
      return `${y}-T${Math.ceil(m / 3)}`;
    case "year":
      return y;
  }
}

// ---------- filtros ----------

export function colIndex(t: { columns: Column[] }, name: string): number {
  let i = t.columns.findIndex((c) => c.name === name);
  if (i > -1) return i;
  const n = normalizeHeader(name);
  i = t.columns.findIndex((c) => normalizeHeader(c.name) === n);
  if (i > -1) return i;
  // "Zona" encuentra "Clientes › Zona"
  return t.columns.findIndex((c) => c.name.includes(REL_SEP) && normalizeHeader(c.name.split(REL_SEP).pop()!) === n);
}

function matches(v: Cell, f: Filter): boolean {
  const s = v === null ? "" : String(v);
  switch (f.op) {
    case "eq":
      return normalizeKey(v) === normalizeKey(f.value);
    case "neq":
      return normalizeKey(v) !== normalizeKey(f.value);
    case "in":
      return f.value.split("|").map((x) => normalizeKey(x)).includes(normalizeKey(v));
    case "contains":
      return s.toLowerCase().includes(f.value.toLowerCase());
    default: {
      if (v === null) return false;
      const a = typeof v === "number" ? v : parseNumber(v);
      const b = parseNumber(f.value);
      const cmp = a !== null && b !== null ? a - b : s.localeCompare(f.value);
      if (f.op === "gt") return cmp > 0;
      if (f.op === "gte") return cmp >= 0;
      if (f.op === "lt") return cmp < 0;
      return cmp <= 0;
    }
  }
}

export function applyFilters(t: TableData, filters: Filter[]): TableData {
  const active = filters.map((f) => ({ f, i: colIndex(t, f.column) })).filter((x) => x.i > -1);
  if (!active.length) return t;
  return { ...t, rows: t.rows.filter((r) => active.every(({ f, i }) => matches(r[i], f))) };
}

/** Selecciones de segmentadores: columna → valores elegidos; rango de fechas sobre la 1.ª columna de fecha. */
export interface Selection {
  values: Record<string, string[]>;
  from?: string;
  to?: string;
}

export function firstDateColumn(t: { columns: Column[] }): string | null {
  return t.columns.find((c) => c.type === "date")?.name ?? null;
}

export function applySelection(t: TableData, sel: Selection): TableData {
  const filters: Filter[] = [];
  for (const [col, vals] of Object.entries(sel.values)) if (vals.length) filters.push({ column: col, op: "in", value: vals.join("|") });
  const dc = firstDateColumn(t);
  if (dc && sel.from) filters.push({ column: dc, op: "gte", value: sel.from });
  if (dc && sel.to) filters.push({ column: dc, op: "lte", value: sel.to });
  return applyFilters(t, filters);
}

// ---------- relaciones ----------

/** Añade a la tabla las columnas de las tablas de consulta relacionadas ("Clientes › Zona"). */
export function enrich(base: TableData, rels: Relationship[], getTable: (id: string) => TableData | undefined): TableData {
  const mine = rels.filter((r) => r.enabled && r.fromDataset === base.id);
  if (!mine.length) return base;
  const columns = [...base.columns];
  let rows = base.rows.map((r) => [...r]);
  for (const rel of mine) {
    const dim = getTable(rel.toDataset);
    if (!dim) continue;
    const fi = colIndex(base, rel.fromColumn);
    const ti = colIndex(dim, rel.toColumn);
    if (fi < 0 || ti < 0) continue;
    const lookup = new Map<string, Row>();
    for (const r of dim.rows) {
      const k = normalizeKey(r[ti]);
      if (k && !lookup.has(k)) lookup.set(k, r);
    }
    const extra = dim.columns
      .map((c, i) => ({ c, i }))
      .filter(({ c, i }) => i !== ti && c.name !== ORIGIN_COL && !c.name.includes(REL_SEP));
    for (const { c } of extra) columns.push({ name: `${dim.name}${REL_SEP}${c.name}`, type: c.type });
    rows = rows.map((r, n) => {
      const hit = lookup.get(normalizeKey(base.rows[n][fi]));
      return r.concat(extra.map(({ i }) => (hit ? hit[i] : null)));
    });
  }
  return { ...base, columns, rows };
}

/**
 * Detecta relaciones por columnas con el mismo nombre: el lado "uno" es la tabla donde
 * los valores no se repiten, y al menos la mitad de los valores del otro lado deben existir en ella.
 */
export function detectRelationships(tables: TableData[], existing: Relationship[]): Relationship[] {
  const found: Relationship[] = [];
  const has = (a: string, ac: string, b: string, bc: string) =>
    [...existing, ...found].some(
      (r) =>
        (r.fromDataset === a && normalizeHeader(r.fromColumn) === normalizeHeader(ac) && r.toDataset === b) ||
        (r.fromDataset === b && r.toDataset === a && normalizeHeader(r.toColumn) === normalizeHeader(ac)),
    );
  const originKey = normalizeHeader(ORIGIN_COL);
  for (const a of tables) {
    for (const b of tables) {
      if (a.id === b.id) continue;
      for (const ca of a.columns) {
        const key = normalizeHeader(ca.name);
        if (key === originKey || ca.type === "date" || ca.name.includes(REL_SEP)) continue;
        const cb = b.columns.find((c) => normalizeHeader(c.name) === key);
        if (!cb) continue;
        if (has(a.id, ca.name, b.id, cb.name)) continue;
        const ia = colIndex(a, ca.name);
        const ib = colIndex(b, cb.name);
        const bVals = b.rows.map((r) => normalizeKey(r[ib])).filter(Boolean);
        const bSet = new Set(bVals);
        if (bVals.length < 2 || bSet.size !== bVals.length) continue; // b no es tabla de consulta
        const aVals = a.rows.map((r) => normalizeKey(r[ia])).filter(Boolean);
        if (!aVals.length) continue;
        const aSet = new Set(aVals);
        // si ambos son únicos, el "uno" es la tabla más pequeña
        if (aSet.size === aVals.length && a.rows.length < b.rows.length) continue;
        if (aSet.size === aVals.length && a.rows.length === b.rows.length && a.id > b.id) continue;
        let hit = 0;
        for (const v of aSet) if (bSet.has(v)) hit++;
        if (hit / aSet.size < 0.5) continue;
        found.push({
          id: `rel_${a.id}_${b.id}_${key.replace(/\W+/g, "")}`.slice(0, 80),
          fromDataset: a.id,
          fromColumn: ca.name,
          toDataset: b.id,
          toColumn: cb.name,
          auto: true,
          enabled: true,
        });
      }
    }
  }
  return found;
}

// ---------- tablas derivadas ----------

export function computeDerived(spec: DerivedTable, source: TableData): TableData {
  const filtered = applyFilters(source, spec.filters);
  if (!spec.groupBy.length && !spec.measures.length) {
    return { id: spec.id, name: spec.name, area: spec.area, columns: filtered.columns, rows: filtered.rows };
  }
  const gIdx = spec.groupBy.map((g) => colIndex(filtered, g.column));
  const mIdx = spec.measures.map((m) => (m.column === null ? -1 : colIndex(filtered, m.column)));
  const groups = new Map<string, { key: Cell[]; rows: Row[] }>();
  for (const r of filtered.rows) {
    const key = spec.groupBy.map((g, n) => (gIdx[n] < 0 ? null : grainKey(r[gIdx[n]], g.grain)));
    const k = JSON.stringify(key);
    let g = groups.get(k);
    if (!g) groups.set(k, (g = { key, rows: [] }));
    g.rows.push(r);
  }
  const columns: Column[] = [
    ...spec.groupBy.map((g, n) => ({
      name: g.grain ? `${g.column} (${GRAIN_LABEL[g.grain]})` : g.column,
      type: g.grain && g.grain !== "day" ? ("text" as const) : (gIdx[n] > -1 ? filtered.columns[gIdx[n]].type : ("text" as const)),
    })),
    ...spec.measures.map((m) => ({ name: m.name, type: "number" as const })),
  ];
  const rows: Row[] = [...groups.values()].map((g) => [
    ...g.key,
    ...spec.measures.map((m, n) => aggregate(m.column === null ? g.rows.map(() => 1) : g.rows.map((r) => (mIdx[n] < 0 ? null : r[mIdx[n]])), m.agg)),
  ]);
  rows.sort((a, b) => {
    for (let i = 0; i < spec.groupBy.length; i++) {
      const c = String(a[i] ?? "").localeCompare(String(b[i] ?? ""), "es", { numeric: true });
      if (c) return c;
    }
    return 0;
  });
  return { id: spec.id, name: spec.name, area: spec.area, columns, rows };
}

export const GRAIN_LABEL: Record<Grain, string> = { day: "día", month: "mes", quarter: "trimestre", year: "año" };
export const AGG_LABEL: Record<Agg, string> = {
  sum: "Suma", avg: "Media", count: "Recuento", countDistinct: "Distintos", min: "Mínimo", max: "Máximo",
};

// ---------- resolución de tablas ----------

export interface Model {
  datasets: DatasetMeta[];
  derived: DerivedTable[];
  relationships: Relationship[];
}

/** Devuelve la tabla lista para informes (dataset enriquecido o derivada calculada). */
export function resolveTable(
  id: string,
  model: Model,
  raw: (datasetId: string) => TableData | undefined,
  depth = 0,
): TableData | undefined {
  if (depth > 5) return undefined;
  if (id.startsWith("ds_")) {
    const t = raw(id);
    return t ? enrich(t, model.relationships, raw) : undefined;
  }
  const spec = model.derived.find((d) => d.id === id);
  if (!spec) return undefined;
  const src = resolveTable(spec.source, model, raw, depth + 1);
  return src ? computeDerived(spec, src) : undefined;
}

/** Datasets (en crudo) que hacen falta para calcular una tabla. */
export function dependencies(id: string, model: Model, depth = 0): string[] {
  if (depth > 5) return [];
  if (id.startsWith("ds_")) {
    return [id, ...model.relationships.filter((r) => r.enabled && r.fromDataset === id).map((r) => r.toDataset)];
  }
  const spec = model.derived.find((d) => d.id === id);
  return spec ? dependencies(spec.source, model, depth + 1) : [];
}

export function groupForChart(
  t: TableData,
  dimension: string,
  grain: Grain | undefined,
  measure: { column: string | null; agg: Agg },
  topN: number,
): { name: string; value: number }[] {
  const di = colIndex(t, dimension);
  const mi = measure.column === null ? -1 : colIndex(t, measure.column);
  if (di < 0) return [];
  const isDate = t.columns[di].type === "date";
  const isPeriod = !isDate && isPeriodColumn(t, di);
  const groups = new Map<string, Cell[]>();
  for (const r of t.rows) {
    const k = grainKey(r[di], isDate ? grain ?? "month" : undefined) ?? "(vacío)";
    let g = groups.get(k);
    if (!g) groups.set(k, (g = []));
    g.push(measure.column === null ? 1 : mi < 0 ? null : r[mi]);
  }
  let out = [...groups.entries()].map(([name, vals]) => ({ name, value: aggregate(vals, measure.agg) ?? 0 }));
  if (isDate || isPeriod) out.sort((a, b) => a.name.localeCompare(b.name));
  else {
    out.sort((a, b) => b.value - a.value);
    if (topN > 0 && out.length > topN) {
      const rest = out.slice(topN);
      out = out.slice(0, topN);
      if (measure.agg === "sum" || measure.agg === "count") out.push({ name: "Otros", value: rest.reduce((s, x) => s + x.value, 0) });
    }
  }
  return out;
}

export function distinctValues(t: TableData, column: string, limit = 500): string[] {
  const i = colIndex(t, column);
  if (i < 0) return [];
  const set = new Set<string>();
  for (const r of t.rows) {
    if (r[i] !== null) set.add(String(r[i]));
    if (set.size > limit) break;
  }
  return [...set].sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
}
