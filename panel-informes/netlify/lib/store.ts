// Almacenamiento en Netlify Blobs.
//   meta/*            → configuración (usuarios, tablas, relaciones, informes...)
//   data/<id>/<n>     → filas de cada tabla en trozos de CHUNK filas
//   staging/<id>/...  → subidas en curso
import { getStore } from "@netlify/blobs";
import type {
  Activity, DatasetMeta, DerivedTable, MasterSpec, Relationship, ReportSpec, Row, Source,
} from "../../shared/types.ts";

export const CHUNK = 5000;

export function store() {
  return getStore({ name: "informes", consistency: "strong" });
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "editor" | "viewer";
  areas: string[];
  rowFilters: { column: string; values: string[] }[];
  salt: string;
  hash: string;
}

export interface Settings {
  apiKeyHash: string | null;
}

async function readJSON<T>(key: string, fallback: T): Promise<T> {
  const v = (await store().get(key, { type: "json" })) as T | null;
  return v ?? fallback;
}
async function writeJSON(key: string, value: unknown) {
  await store().setJSON(key, value);
}

export const db = {
  users: () => readJSON<StoredUser[]>("meta/users", []),
  saveUsers: (v: StoredUser[]) => writeJSON("meta/users", v),
  datasets: () => readJSON<DatasetMeta[]>("meta/datasets", []),
  saveDatasets: (v: DatasetMeta[]) => writeJSON("meta/datasets", v),
  relationships: () => readJSON<Relationship[]>("meta/relationships", []),
  saveRelationships: (v: Relationship[]) => writeJSON("meta/relationships", v),
  derived: () => readJSON<DerivedTable[]>("meta/derived", []),
  saveDerived: (v: DerivedTable[]) => writeJSON("meta/derived", v),
  reports: () => readJSON<Record<string, ReportSpec>>("meta/reports", {}),
  saveReports: (v: Record<string, ReportSpec>) => writeJSON("meta/reports", v),
  master: () => readJSON<MasterSpec>("meta/master", { title: "Informe maestro", subtitle: "", items: null }),
  saveMaster: (v: MasterSpec) => writeJSON("meta/master", v),
  sources: () => readJSON<Source[]>("meta/sources", []),
  saveSources: (v: Source[]) => writeJSON("meta/sources", v),
  settings: () => readJSON<Settings>("meta/settings", { apiKeyHash: null }),
  saveSettings: (v: Settings) => writeJSON("meta/settings", v),
  activity: () => readJSON<Activity[]>("meta/activity", []),
  async log(who: string, what: string) {
    const list = await readJSON<Activity[]>("meta/activity", []);
    list.unshift({ at: new Date().toISOString(), who, what });
    await writeJSON("meta/activity", list.slice(0, 200));
  },
};

export async function readChunk(id: string, n: number): Promise<Row[]> {
  return ((await store().get(`data/${id}/${n}`, { type: "json" })) as Row[] | null) ?? [];
}

export async function readAllRows(meta: DatasetMeta): Promise<Row[]> {
  const parts = await Promise.all(Array.from({ length: meta.chunkCount }, (_, n) => readChunk(meta.id, n)));
  return parts.flat();
}

/** Escribe todas las filas y borra los trozos sobrantes. Devuelve el nº de trozos. */
export async function writeAllRows(id: string, rows: Row[], previousChunks: number): Promise<number> {
  const s = store();
  const count = Math.max(1, Math.ceil(rows.length / CHUNK));
  for (let n = 0; n < count; n += 8) {
    await Promise.all(
      Array.from({ length: Math.min(8, count - n) }, (_, k) => s.setJSON(`data/${id}/${n + k}`, rows.slice((n + k) * CHUNK, (n + k + 1) * CHUNK))),
    );
  }
  const stale = [];
  for (let n = count; n < previousChunks; n++) stale.push(s.delete(`data/${id}/${n}`));
  await Promise.all(stale);
  return count;
}

export async function deleteRows(id: string, chunks: number) {
  const s = store();
  await Promise.all(Array.from({ length: chunks }, (_, n) => s.delete(`data/${id}/${n}`)));
}

export async function deletePrefix(prefix: string) {
  const s = store();
  const { blobs } = await s.list({ prefix });
  await Promise.all(blobs.map((b) => s.delete(b.key)));
}

export function newId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
