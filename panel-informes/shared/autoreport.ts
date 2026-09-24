// Genera un informe razonable a partir de cualquier tabla, sin configurar nada.
import type { ChartSpec, KpiSpec, NumberFormat, ReportSpec, TableData } from "./types.ts";
import { ORIGIN_COL } from "./types.ts";
import { REL_SEP, colIndex, isPeriodColumn } from "./engine.ts";

const ID_LIKE = /(^id$|^id\b|\bid$|c[oó]digo|^cod\b|\bcp\b|postal|tel[eé]fono|m[oó]vil|\bnif\b|\bcif\b|\bdni\b|^a[nñ]o$|^year$|^mes$|^month$|n[uú]mero|^num\b|^n[ºo°]|\bref\b|referencia|latitud|longitud)/i;
const MONEY = /(importe|precio|total|coste|costo|venta|ingreso|gasto|factur|€|\beur\b|beneficio|margen|saldo|pago|cobro|presupuesto|base imponible|iva|salario|sueldo|n[oó]mina)/i;
const AVERAGE = /(precio|tasa|%|porcentaje|media|promedio|edad|puntuaci|valoraci|nota|ratio|margen %)/i;
const PERCENT = /(%|porcentaje|tasa)/i;

export const isIdLike = (name: string) => ID_LIKE.test(name.split(REL_SEP).pop()!) || /^nombre$|^name$|raz[oó]n social|descripci[oó]n|direcci[oó]n|email|correo/i.test(name.split(REL_SEP).pop()!);

export function formatFor(name: string): NumberFormat {
  if (PERCENT.test(name)) return "percent";
  if (MONEY.test(name)) return "currency";
  return "number";
}

function distinctCount(t: TableData, i: number, cap = 200): number {
  const s = new Set<string>();
  for (const r of t.rows) {
    if (r[i] !== null) s.add(String(r[i]));
    if (s.size > cap) break;
  }
  return s.size;
}

export function measureColumns(t: TableData): string[] {
  return t.columns
    .map((c, i) => ({ c, i }))
    .filter(({ c, i }) => {
      if (c.type !== "number" || ID_LIKE.test(c.name) || c.name.includes(REL_SEP)) return false;
      // enteros todos distintos = identificador
      const vals = t.rows.map((r) => r[i]).filter((v) => v !== null) as number[];
      if (vals.length > 5 && vals.every((v) => Number.isInteger(v)) && new Set(vals).size === vals.length) return false;
      return true;
    })
    .sort((a, b) => Number(MONEY.test(b.c.name)) - Number(MONEY.test(a.c.name)))
    .map(({ c }) => c.name);
}

export function categoryColumns(t: TableData, max = 40): { name: string; distinct: number }[] {
  return t.columns
    .map((c, i) => ({ c, i }))
    .filter(({ c, i }) => c.type === "text" && c.name !== ORIGIN_COL && !ID_LIKE.test(c.name.split(REL_SEP).pop()!) && !isPeriodColumn(t, i))
    .map(({ c, i }) => ({ name: c.name, distinct: distinctCount(t, i) }))
    .filter((x) => x.distinct >= 2 && x.distinct <= max && x.distinct < Math.max(3, t.rows.length * 0.9));
}

export function autoReport(t: TableData): ReportSpec {
  const measures = measureColumns(t);
  const kpis: KpiSpec[] = [{ id: "k_count", label: "Registros", column: null, agg: "count", format: "number" }];
  for (const m of measures.slice(0, 3)) {
    const avg = AVERAGE.test(m);
    const label = avg ? `Media ${m.toLowerCase()}` : /total|suma/i.test(m) ? m : `Total ${m.toLowerCase()}`;
    kpis.push({ id: `k_${kpis.length}`, label, column: m, agg: avg ? "avg" : "sum", format: formatFor(m) });
  }
  const main = measures[0] ?? null;
  const mainAgg = main && AVERAGE.test(main) ? "avg" : main ? "sum" : "count";
  const mainFmt = main ? formatFor(main) : "number";
  const measureLabel = main ? `${mainAgg === "avg" ? "Media de" : ""} ${main.toLowerCase()}`.trim() : "Registros";

  const charts: ChartSpec[] = [];
  const date = t.columns.find((c) => c.type === "date");
  if (date) {
    const di = colIndex(t, date.name);
    const dates = t.rows.map((r) => r[di]).filter(Boolean).map(String).sort();
    const spanDays = dates.length ? (Date.parse(dates[dates.length - 1]) - Date.parse(dates[0])) / 864e5 : 0;
    const grain = spanDays > 1100 ? "year" : spanDays > 62 ? "month" : "day";
    charts.push({
      id: "c_time", type: "line", title: `${measureLabel.charAt(0).toUpperCase() + measureLabel.slice(1)} por ${grain === "year" ? "año" : grain === "month" ? "mes" : "día"}`,
      dimension: date.name, grain, measure: { column: main, agg: mainAgg }, format: mainFmt, topN: 0,
    });
  }
  const periodIdx = date ? -1 : t.columns.findIndex((_, i) => isPeriodColumn(t, i));
  if (periodIdx > -1) {
    const p = t.columns[periodIdx].name;
    charts.push({ id: "c_time", type: "line", title: `${measureLabel.charAt(0).toUpperCase() + measureLabel.slice(1)} por ${p.toLowerCase()}`, dimension: p, measure: { column: main, agg: mainAgg }, format: mainFmt, topN: 0 });
  }
  const cats = categoryColumns(t).sort((a, b) => Number(a.name.includes(REL_SEP)) - Number(b.name.includes(REL_SEP)) || a.distinct - b.distinct);
  let pieUsed = false;
  for (const c of cats.slice(0, 3)) {
    const label = c.name.split(REL_SEP).pop()!;
    const type = !pieUsed && c.distinct <= 6 ? "pie" : c.distinct > 8 ? "hbar" : "bar";
    if (type === "pie") pieUsed = true;
    charts.push({
      id: `c_${charts.length}`, type, title: `${measureLabel.charAt(0).toUpperCase() + measureLabel.slice(1)} por ${label.toLowerCase()}`,
      dimension: c.name, measure: { column: main, agg: mainAgg }, format: mainFmt, topN: 10,
    });
  }
  const slicers = cats.filter((c) => c.distinct <= 60).slice(0, 4).map((c) => c.name);
  return {
    targetId: t.id,
    title: t.name,
    description: "",
    kpis,
    charts,
    slicers,
    tableColumns: null,
    auto: true,
    updatedAt: "",
  };
}
