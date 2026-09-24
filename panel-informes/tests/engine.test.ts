import { test } from "node:test";
import assert from "node:assert/strict";
import * as XLSX from "xlsx";
import { parseWorkbook } from "../shared/excel.ts";
import { mergeTables } from "../shared/merge.ts";
import { applySelection, computeDerived, detectRelationships, enrich, groupForChart, resolveTable } from "../shared/engine.ts";
import { autoReport } from "../shared/autoreport.ts";
import { cleanName, parseDate, parseNumber } from "../shared/values.ts";
import type { TableData } from "../shared/types.ts";

function xlsx(aoa: unknown[][], dateCols: number[] = []): Uint8Array {
  const ws = XLSX.utils.aoa_to_sheet(aoa, { cellDates: true });
  for (const key of Object.keys(ws)) {
    if (key.startsWith("!")) continue;
    const c = XLSX.utils.decode_cell(key);
    if (dateCols.includes(c.c) && ws[key].t === "d") {
      // Excel guarda las fechas como número de serie con formato de fecha
      const d = ws[key].v as Date;
      ws[key] = { t: "n", v: (Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(1899, 11, 30)) / 864e5, z: "dd/mm/yyyy" };
    }
  }
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Hoja1");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" });
}

test("números y fechas en formato español", () => {
  assert.equal(parseNumber("1.234,56 €"), 1234.56);
  assert.equal(parseNumber("1,234.56"), 1234.56);
  assert.equal(parseNumber("12,5%"), 12.5);
  assert.equal(parseNumber("1.234.567"), 1234567);
  assert.equal(parseNumber("(300)"), -300);
  assert.equal(parseNumber("abc"), null);
  assert.equal(parseDate("05/03/2026"), "2026-03-05");
  assert.equal(parseDate("2026-03-05"), "2026-03-05");
  assert.equal(cleanName("ventas_enero_2026 (2).xlsx"), "Ventas");
});

test("lee un Excel con título, fila de totales, fechas e importes en texto", () => {
  const bytes = xlsx(
    [
      ["Informe de ventas 2026"],
      [],
      ["Fecha", "Cliente", "Importe"],
      [new Date(2026, 0, 15), "C001", "1.200,50"],
      [new Date(2026, 1, 3), "C002", 300],
      ["Total", null, 1500.5],
    ],
    [0],
  );
  const [t] = parseWorkbook(bytes, "ventas_enero.xlsx");
  assert.deepEqual(t.columns.map((c) => [c.name, c.type]), [["Fecha", "date"], ["Cliente", "text"], ["Importe", "number"]]);
  assert.equal(t.rows.length, 2);
  assert.deepEqual(t.rows[0], ["2026-01-15", "C001", 1200.5]);
  assert.equal(t.suggestedName, "Ventas");
  assert.ok(t.warnings.some((w) => w.includes("totales")));
});

test("lee CSV con punto y coma", () => {
  const csv = "Fecha;Zona;Importe\n01/02/2026;Norte;10,5\n02/02/2026;Sur;20\n";
  const [t] = parseWorkbook(new TextEncoder().encode(csv), "gastos.csv");
  assert.deepEqual(t.columns.map((c) => c.type), ["date", "text", "number"]);
  assert.deepEqual(t.rows[0], ["2026-02-01", "Norte", 10.5]);
});

test("unir archivos: modo auto sustituye el mismo archivo y añade los nuevos", () => {
  const cols = [{ name: "Zona", type: "text" as const }, { name: "Importe", type: "number" as const }];
  const a = mergeTables(null, [{ fileName: "enero.xlsx", columns: cols, rows: [["Norte", 1], ["Sur", 2]] }], "auto");
  assert.deepEqual(a.columns.map((c) => c.name), ["Zona", "Importe", "Archivo"]);
  const b = mergeTables(a, [{ fileName: "febrero.xlsx", columns: [...cols, { name: "Extra", type: "text" }], rows: [["Este", 3, "x"]] }], "auto");
  assert.equal(b.rows.length, 3);
  assert.deepEqual(b.columns.map((c) => c.name), ["Zona", "Importe", "Extra", "Archivo"]);
  const c = mergeTables(b, [{ fileName: "enero.xlsx", columns: cols, rows: [["Norte", 10]] }], "auto");
  assert.equal(c.rows.length, 2); // enero sustituido (2 → 1) + febrero
  assert.deepEqual(c.files.sort(), ["enero.xlsx", "febrero.xlsx"]);
  const d = mergeTables(c, [{ fileName: "x.xlsx", columns: cols, rows: [["Norte", 1]] }], "replace");
  assert.equal(d.rows.length, 1);
});

const ventas: TableData = {
  id: "ds_v",
  name: "Ventas",
  area: "Comercial",
  columns: [
    { name: "Fecha", type: "date" },
    { name: "Código cliente", type: "text" },
    { name: "Importe", type: "number" },
    { name: "Archivo", type: "text" },
  ],
  rows: [
    ["2026-01-10", "C1", 100, "a"],
    ["2026-01-20", "C2", 50, "a"],
    ["2026-02-05", "C1", 25, "b"],
    ["2026-02-07", "C3", 10, "b"],
  ],
};
const clientes: TableData = {
  id: "ds_c",
  name: "Clientes",
  area: "Comercial",
  columns: [
    { name: "Código cliente", type: "text" },
    { name: "Zona", type: "text" },
    { name: "Archivo", type: "text" },
  ],
  rows: [["C1", "Norte", "c"], ["C2", "Sur", "c"], ["C3", "Norte", "c"]],
};

test("detecta la relación Ventas → Clientes y añade las columnas del cliente", () => {
  const rels = detectRelationships([ventas, clientes], []);
  assert.equal(rels.length, 1);
  assert.equal(rels[0].fromDataset, "ds_v");
  assert.equal(rels[0].toDataset, "ds_c");
  const e = enrich(ventas, rels, (id) => (id === "ds_c" ? clientes : undefined));
  assert.ok(e.columns.some((c) => c.name === "Clientes › Zona"));
  // filtro común "Zona" funciona sobre la columna enriquecida
  const norte = applySelection(e, { values: { Zona: ["Norte"] } });
  assert.equal(norte.rows.length, 3);
  const byZona = groupForChart(e, "Clientes › Zona", undefined, { column: "Importe", agg: "sum" }, 10);
  assert.deepEqual(byZona, [{ name: "Norte", value: 135 }, { name: "Sur", value: 50 }]);
});

test("tabla derivada: ventas por mes y zona, a partir de datos relacionados", () => {
  const rels = detectRelationships([ventas, clientes], []);
  const model = { datasets: [], derived: [{ id: "dt_1", name: "Por mes", area: "Comercial", source: "ds_v", filters: [{ column: "Zona", op: "eq" as const, value: "norte" }], groupBy: [{ column: "Fecha", grain: "month" as const }], measures: [{ column: "Importe", agg: "sum" as const, name: "Total" }, { column: null, agg: "count" as const, name: "Pedidos" }], updatedAt: "" }], relationships: rels };
  const t = resolveTable("dt_1", model, (id) => ({ ds_v: ventas, ds_c: clientes })[id]);
  assert.ok(t);
  assert.deepEqual(t.columns.map((c) => c.name), ["Fecha (mes)", "Total", "Pedidos"]);
  assert.deepEqual(t.rows, [["2026-01", 100, 1], ["2026-02", 35, 2]]);
  const direct = computeDerived(model.derived[0], enrich(ventas, rels, (id) => (id === "ds_c" ? clientes : undefined)));
  assert.deepEqual(direct.rows, t.rows);
});

test("informe automático: KPIs de importe, evolución temporal y filtros", () => {
  const r = autoReport(enrich(ventas, detectRelationships([ventas, clientes], []), (id) => (id === "ds_c" ? clientes : undefined)));
  assert.equal(r.kpis[0].agg, "count");
  assert.ok(r.kpis.some((k) => k.column === "Importe" && k.agg === "sum" && k.format === "currency"));
  assert.equal(r.charts[0].type, "line");
  assert.ok(r.slicers.includes("Clientes › Zona"));
});
