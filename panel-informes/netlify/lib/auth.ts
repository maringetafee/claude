// Contraseñas (scrypt), sesión firmada en cookie y reglas de acceso por rol/área.
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import type { DatasetMeta, Relationship, Row, UserPublic } from "../../shared/types.ts";
import { normalizeHeader, normalizeKey } from "../../shared/values.ts";
import { db, readAllRows, type StoredUser } from "./store.ts";

const COOKIE = "pi_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 días

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("Falta SESSION_SECRET (mín. 32 caracteres) en las variables de Netlify");
  return s;
}

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")) {
  return { salt, hash: scryptSync(password, salt, 64).toString("hex") };
}

export function checkPassword(user: StoredUser, password: string): boolean {
  const h = scryptSync(password, user.salt, 64);
  const stored = Buffer.from(user.hash, "hex");
  return stored.length === h.length && timingSafeEqual(stored, h);
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function sessionCookie(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ u: userId, e: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export function clearCookie(): string {
  return `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function currentUser(req: Request): Promise<StoredUser | null> {
  const raw = (req.headers.get("cookie") ?? "").split(/;\s*/).find((c) => c.startsWith(`${COOKIE}=`));
  if (!raw) return null;
  const [payload, sig] = raw.slice(COOKIE.length + 1).split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) return null;
  try {
    const { u, e } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() > e) return null;
    return (await db.users()).find((x) => x.id === u) ?? null;
  } catch {
    return null;
  }
}

export function toPublic(u: StoredUser): UserPublic {
  return { id: u.id, email: u.email, name: u.name, role: u.role, areas: u.areas, rowFilters: u.rowFilters };
}

export function canSeeArea(u: StoredUser, area: string): boolean {
  return u.role === "admin" || u.areas.includes("*") || u.areas.includes(area);
}

export function canEditArea(u: StoredUser, area: string): boolean {
  return (u.role === "admin" || u.role === "editor") && canSeeArea(u, area);
}

export const isEditor = (u: StoredUser) => u.role === "admin" || u.role === "editor";

const colOf = (meta: DatasetMeta, name: string) => meta.columns.findIndex((c) => normalizeHeader(c.name) === normalizeHeader(name));

/**
 * Seguridad por filas: si el usuario tiene "Zona = Norte", solo recibe esas filas en cualquier tabla con columna Zona,
 * y también en las tablas relacionadas con una que la tenga (Ventas → Clientes.Zona).
 * Si una tabla no tiene la columna ni directa ni por relación, esa condición no le afecta.
 */
export async function rowFilter(u: StoredUser, meta: DatasetMeta): Promise<(r: Row) => boolean> {
  if (u.role === "admin" || !u.rowFilters.length) return () => true;
  const checks: ((r: Row) => boolean)[] = [];
  let rels: Relationship[] | null = null;
  let datasets: DatasetMeta[] | null = null;
  for (const f of u.rowFilters) {
    const allowed = new Set(f.values.map((v) => normalizeKey(v)));
    const i = colOf(meta, f.column);
    if (i > -1) {
      checks.push((r) => allowed.has(normalizeKey(r[i])));
      continue;
    }
    rels ??= await db.relationships();
    datasets ??= await db.datasets();
    for (const rel of rels.filter((x) => x.enabled && x.fromDataset === meta.id)) {
      const dim = datasets.find((d) => d.id === rel.toDataset);
      if (!dim) continue;
      const di = colOf(dim, f.column);
      const ki = colOf(dim, rel.toColumn);
      const fi = colOf(meta, rel.fromColumn);
      if (di < 0 || ki < 0 || fi < 0) continue;
      const keys = new Set((await readAllRows(dim)).filter((r) => allowed.has(normalizeKey(r[di]))).map((r) => normalizeKey(r[ki])));
      checks.push((r) => keys.has(normalizeKey(r[fi])));
    }
  }
  return (r) => checks.every((c) => c(r));
}

export async function hasRowFilterOn(u: StoredUser, meta: DatasetMeta): Promise<boolean> {
  if (u.role === "admin" || !u.rowFilters.length) return false;
  if (u.rowFilters.some((f) => colOf(meta, f.column) > -1)) return true;
  const rels = (await db.relationships()).filter((x) => x.enabled && x.fromDataset === meta.id);
  const datasets = await db.datasets();
  return rels.some((rel) => {
    const dim = datasets.find((d) => d.id === rel.toDataset);
    return !!dim && u.rowFilters.some((f) => colOf(dim, f.column) > -1);
  });
}
