// Unión de un Excel nuevo con los datos que ya tiene una tabla.
import { ORIGIN_COL, type Column, type Row } from "./types.ts";
import { coerce, normalizeHeader } from "./values.ts";

export type UploadMode = "auto" | "append" | "replace";

export interface MergeInput {
  columns: Column[];
  rows: Row[];
  fileName: string;
}

/**
 * - auto: sustituye las filas que vinieran del mismo archivo y añade el resto (re-subir un Excel corregido no duplica)
 * - append: añade siempre
 * - replace: borra todo lo anterior
 */
export function mergeTables(
  existing: { columns: Column[]; rows: Row[] } | null,
  incoming: MergeInput[],
  mode: UploadMode,
): { columns: Column[]; rows: Row[]; files: string[] } {
  const columns: Column[] = existing && mode !== "replace" ? existing.columns.map((c) => ({ ...c })) : [];
  const index = new Map(columns.map((c, i) => [normalizeHeader(c.name), i]));
  const addCol = (c: Column) => {
    const k = normalizeHeader(c.name);
    if (!index.has(k)) {
      index.set(k, columns.length);
      columns.push({ name: c.name, type: c.type });
    }
    return index.get(k)!;
  };

  // El origen siempre va al final de las columnas de datos
  const originKey = normalizeHeader(ORIGIN_COL);
  for (const inc of incoming) for (const c of inc.columns) if (normalizeHeader(c.name) !== originKey) addCol(c);
  const originIdx = addCol({ name: ORIGIN_COL, type: "text" });
  if (originIdx !== columns.length - 1) {
    const [o] = columns.splice(originIdx, 1);
    columns.push(o);
    index.clear();
    columns.forEach((c, i) => index.set(normalizeHeader(c.name), i));
  }
  const width = columns.length;

  const out: Row[] = [];
  if (existing && mode !== "replace") {
    const replaced = new Set(mode === "auto" ? incoming.map((i) => i.fileName) : []);
    const map = existing.columns.map((c) => index.get(normalizeHeader(c.name))!);
    const exOrigin = existing.columns.findIndex((c) => normalizeHeader(c.name) === originKey);
    for (const r of existing.rows) {
      if (exOrigin > -1 && replaced.has(String(r[exOrigin]))) continue;
      const row: Row = new Array(width).fill(null);
      map.forEach((to, from) => (row[to] = r[from] ?? null));
      out.push(row);
    }
  }
  for (const inc of incoming) {
    const map = inc.columns.map((c) => index.get(normalizeHeader(c.name))!);
    for (const r of inc.rows) {
      const row: Row = new Array(width).fill(null);
      map.forEach((to, from) => {
        if (to !== columns.length - 1) row[to] = coerce(r[from], columns[to].type);
      });
      row[width - 1] = inc.fileName;
      out.push(row);
    }
  }
  const files = [...new Set(out.map((r) => String(r[width - 1] ?? "")))].filter(Boolean);
  return { columns, rows: out, files };
}
