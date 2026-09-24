// Lectura de Excel/CSV: detecta la fila de cabecera, limpia totales y deduce tipos.
import * as XLSX from "xlsx";
import type { Column, Row } from "./types.ts";
import { cleanName, coerce, inferType, isoDate } from "./values.ts";

export interface ParsedTable {
  fileName: string;
  sheetName: string;
  suggestedName: string;
  columns: Column[];
  rows: Row[];
  warnings: string[];
}

type Raw = string | number | null;

function cellValue(cell: XLSX.CellObject | undefined): Raw {
  if (!cell) return null;
  switch (cell.t) {
    case "n": {
      const v = cell.v as number;
      if (cell.z && XLSX.SSF.is_date(cell.z as string)) {
        const d = XLSX.SSF.parse_date_code(v);
        if (d) return isoDate(d.y, d.m, d.d);
      }
      return v;
    }
    case "d": {
      const d = cell.v as Date;
      return isoDate(d.getFullYear(), d.getMonth() + 1, d.getDate());
    }
    case "s": {
      const s = String(cell.v ?? "").trim();
      return s === "" ? null : s;
    }
    case "b":
      return cell.v ? "Sí" : "No";
    default:
      return null;
  }
}

function sheetToMatrix(ws: XLSX.WorkSheet): Raw[][] {
  const ref = ws["!ref"];
  if (!ref) return [];
  const range = XLSX.utils.decode_range(ref);
  const out: Raw[][] = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row: Raw[] = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      row.push(cellValue(ws[XLSX.utils.encode_cell({ r, c })] as XLSX.CellObject | undefined));
    }
    out.push(row);
  }
  return out;
}

const TOTAL_RE = /^(total|totales|suma|subtotal|total general)\b/i;

export function matrixToTable(matrix: Raw[][], fileName: string, sheetName: string, suggestedName: string): ParsedTable | null {
  const rows = matrix.filter((r) => r.some((v) => v !== null));
  if (rows.length < 2) return null;

  // Cabecera: primera fila (de las 20 primeras) con muchas celdas de texto.
  const scan = rows.slice(0, 20);
  const textCount = scan.map((r) => r.filter((v) => typeof v === "string").length);
  const best = Math.max(...textCount);
  if (best < 1) return null;
  const headerIdx = textCount.findIndex((n) => n >= Math.max(1, Math.ceil(best * 0.6)));
  const header = rows[headerIdx];
  const body = rows.slice(headerIdx + 1);

  // Columnas que tienen cabecera o algún dato
  const keep: number[] = [];
  for (let c = 0; c < header.length; c++) {
    if (header[c] !== null || body.some((r) => r[c] !== null)) keep.push(c);
  }
  const names: string[] = [];
  const seen = new Map<string, number>();
  for (const c of keep) {
    let name = header[c] === null ? `Columna ${c + 1}` : String(header[c]).replace(/\s+/g, " ").trim();
    const k = name.toLowerCase();
    const n = (seen.get(k) ?? 0) + 1;
    seen.set(k, n);
    if (n > 1) name = `${name} (${n})`;
    names.push(name);
  }

  const warnings: string[] = [];
  let totals = 0;
  const dataRows = body
    .map((r) => keep.map((c) => r[c] ?? null))
    .filter((r) => {
      if (r.every((v) => v === null)) return false;
      const first = r.find((v) => v !== null);
      if (typeof first === "string" && TOTAL_RE.test(first)) {
        totals++;
        return false;
      }
      return true;
    });
  if (totals) warnings.push(`Se han quitado ${totals} fila(s) de totales para no contar dos veces.`);
  if (headerIdx > 0) warnings.push(`La cabecera está en la fila ${headerIdx + 1}; las filas de arriba se han ignorado.`);
  if (!dataRows.length) return null;

  const columns: Column[] = names.map((name, i) => ({ name, type: inferType(dataRows.map((r) => r[i])) }));
  const typed: Row[] = dataRows.map((r) => r.map((v, i) => coerce(v, columns[i].type)));
  return { fileName, sheetName, suggestedName, columns, rows: typed, warnings };
}

const DEFAULT_SHEET = /^(hoja|sheet|feuil|tabelle)\s*\d*$/i;

export function parseWorkbook(data: ArrayBuffer | Uint8Array, fileName: string): ParsedTable[] {
  const isCsv = /\.(csv|txt)$/i.test(fileName);
  let wb: XLSX.WorkBook;
  if (isCsv) {
    const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
    let text = new TextDecoder("utf-8").decode(bytes);
    if (text.includes("�")) text = new TextDecoder("windows-1252").decode(bytes);
    wb = XLSX.read(text, { type: "string", raw: true });
  } else {
    wb = XLSX.read(data, { type: "array", cellDates: false, cellNF: true });
  }
  const out: ParsedTable[] = [];
  const visible = wb.SheetNames.filter((n, i) => !wb.Workbook?.Sheets?.[i]?.Hidden);
  for (const sheetName of visible) {
    const matrix = sheetToMatrix(wb.Sheets[sheetName]);
    const useSheetName = visible.length > 1 && !DEFAULT_SHEET.test(sheetName.trim());
    const suggested = useSheetName ? cleanName(sheetName) : cleanName(fileName);
    const t = matrixToTable(matrix, fileName, sheetName, suggested);
    if (t) out.push(t);
  }
  return out;
}

export function tableToXlsx(name: string, columns: Column[], rows: Row[]): Uint8Array {
  const ws = XLSX.utils.aoa_to_sheet([columns.map((c) => c.name), ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31).replace(/[\\/?*[\]:]/g, " ") || "Datos");
  return XLSX.write(wb, { type: "array", bookType: "xlsx" }) as Uint8Array;
}
