import type { Cell, ColType, NumberFormat } from "../shared/types.ts";

const nf = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 });
const nfCompact = new Intl.NumberFormat("es-ES", { notation: "compact", maximumFractionDigits: 1 });
const cf = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 2 });
const cfShort = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const cfCompact = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", notation: "compact", maximumFractionDigits: 1 });

export function fmt(v: number | null | undefined, format: NumberFormat = "number", compact = false): string {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  if (format === "currency") return (compact ? (Math.abs(v) >= 10000 ? cfCompact : cfShort) : cf).format(v);
  if (format === "percent") {
    const p = Math.abs(v) <= 1.5 ? v * 100 : v; // 0,25 o 25 → 25 %
    return `${nf.format(Math.round(p * 10) / 10)} %`;
  }
  return (compact && Math.abs(v) >= 10000 ? nfCompact : nf).format(v);
}

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

/** "2026-03" → "mar 2026", "2026-03-05" → "05/03/2026" */
export function fmtLabel(s: string): string {
  let m = /^(\d{4})-(\d{2})$/.exec(s);
  if (m) return `${MONTHS[+m[2] - 1]} ${m[1]}`;
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return s;
}

export function fmtCell(v: Cell, type: ColType): string {
  if (v === null) return "";
  if (type === "number" && typeof v === "number") return nf.format(v);
  if (type === "date") return fmtLabel(String(v));
  return String(v);
}

export function fmtDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
}

export const PALETTE = ["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#14b8a6", "#ec4899", "#64748b", "#84cc16", "#f97316"];
