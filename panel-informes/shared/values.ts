// Normalización de cabeceras y conversión de valores (formato español incluido).
import type { Cell, Column, ColType } from "./types.ts";

export function normalizeHeader(h: string): string {
  return h
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%€]+/g, " ")
    .trim();
}

export function normalizeKey(v: Cell): string {
  if (v === null || v === undefined) return "";
  return String(v).trim().toLowerCase();
}

const NUM_RE = /^[-+]?(\d{1,3}([.,\s]\d{3})+|\d+)([.,]\d+)?$|^[-+]?\d*[.,]\d+$/;

/** Convierte "1.234,56 €", "12,5%", "1234.5" o 1234 a número. null si no es número. */
export function parseNumber(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  let s = v.trim().replace(/[€$£% ]/g, "").replace(/\s+(eur|euros)$/i, "").trim();
  if (!s) return null;
  let neg = false;
  if (/^\(.*\)$/.test(s)) {
    neg = true;
    s = s.slice(1, -1);
  }
  if (!NUM_RE.test(s.replace(/\s/g, ""))) return null;
  s = s.replace(/\s/g, "");
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > -1 && lastDot > -1) {
    // el último separador es el decimal
    if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
  } else if (lastComma > -1) {
    // "1,234" con 3 decimales exactos y sin más comas se trata como decimal español
    s = s.replace(",", ".");
  } else if (lastDot > -1 && /^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, ""); // "1.234.567" = miles
  }
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  return neg ? -n : n;
}

const ISO_RE = /^(\d{4})-(\d{2})-(\d{2})/;
const ES_RE = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function isoDate(y: number, m: number, d: number): string | null {
  if (m < 1 || m > 12 || d < 1 || d > 31 || y < 1900 || y > 2200) return null;
  return `${y}-${pad(m)}-${pad(d)}`;
}

/** Convierte "2026-03-01", "01/03/2026" o Date a "YYYY-MM-DD". */
export function parseDate(v: unknown): string | null {
  if (v instanceof Date && !isNaN(v.getTime())) return isoDate(v.getFullYear(), v.getMonth() + 1, v.getDate());
  if (typeof v !== "string") return null;
  const s = v.trim();
  let m = ISO_RE.exec(s);
  if (m) return isoDate(+m[1], +m[2], +m[3]);
  m = ES_RE.exec(s);
  if (m) {
    let y = +m[3];
    if (y < 100) y += 2000;
    return isoDate(y, +m[2], +m[1]);
  }
  return null;
}

export function inferType(values: unknown[]): ColType {
  const present = values.filter((v) => v !== null && v !== undefined && String(v).trim() !== "");
  if (present.length === 0) return "text";
  let nums = 0;
  let dates = 0;
  for (const v of present) {
    if (typeof v === "string" && ISO_RE.test(v.trim())) dates++;
    else if (typeof v === "string" && ES_RE.test(v.trim()) && parseDate(v)) dates++;
    else if (parseNumber(v) !== null) nums++;
  }
  if (dates / present.length >= 0.9) return "date";
  if (nums / present.length >= 0.9) return "number";
  return "text";
}

export function coerce(v: unknown, type: ColType): Cell {
  if (v === null || v === undefined) return null;
  if (typeof v === "string" && v.trim() === "") return null;
  if (type === "number") return parseNumber(v);
  if (type === "date") return parseDate(v);
  if (typeof v === "string") return v.trim();
  return String(v);
}

export function signatureOf(columns: Column[], originCol: string): string[] {
  const origin = normalizeHeader(originCol);
  return columns.map((c) => normalizeHeader(c.name)).filter((h) => h && h !== origin).sort();
}

export function similarity(a: string[], b: string[]): number {
  if (!a.length || !b.length) return 0;
  const sa = new Set(a);
  const sb = new Set(b);
  let inter = 0;
  for (const x of sa) if (sb.has(x)) inter++;
  return inter / (sa.size + sb.size - inter);
}

const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
  "septiembre", "setiembre", "octubre", "noviembre", "diciembre",
  "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "sept", "oct", "nov", "dic",
  "january", "february", "march", "april", "june", "july", "august", "september", "october", "november", "december",
];

/** "ventas_enero_2026 (2).xlsx" → "Ventas" */
export function cleanName(fileOrSheet: string): string {
  const base = fileOrSheet.replace(/\.(xlsx|xlsm|xlsb|xls|csv|ods)$/i, "");
  const words = base
    .replace(/[_\-.()[\]]+/g, " ")
    .split(/\s+/)
    .filter((w) => w && !/^\d+$/.test(w) && !MONTHS.includes(w.toLowerCase()) && !/^(t|q)[1-4]$/i.test(w) && !/^v\d+$/i.test(w));
  const s = words.join(" ").trim() || base.trim() || "Tabla";
  return s.charAt(0).toUpperCase() + s.slice(1);
}
