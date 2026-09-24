import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, ApiError } from "./api.ts";
import type { Bootstrap, DatasetMeta, Relationship, TableData } from "../shared/types.ts";
import type { ParsedTable } from "../shared/excel.ts";
import type { UploadMode } from "../shared/merge.ts";
import { dependencies, detectRelationships, resolveTable, type Model } from "../shared/engine.ts";

// ---------- caché de datos en el navegador ----------

const cache = new Map<string, { updatedAt: string; promise: Promise<TableData> }>();

async function fetchDataset(meta: DatasetMeta): Promise<TableData> {
  const n = Math.max(1, meta.chunkCount);
  const parts: TableData["rows"][] = new Array(n);
  let next = 0;
  const worker = async () => {
    while (next < n) {
      const i = next++;
      parts[i] = (await api<{ rows: TableData["rows"] }>(`data/${meta.id}/${i}`)).rows;
    }
  };
  await Promise.all(Array.from({ length: Math.min(4, n) }, worker));
  return { id: meta.id, name: meta.name, area: meta.area, columns: meta.columns, rows: parts.flat() };
}

export function loadDataset(meta: DatasetMeta): Promise<TableData> {
  const hit = cache.get(meta.id);
  if (hit && hit.updatedAt === meta.updatedAt) {
    return hit.promise.then((t) => ({ ...t, name: meta.name, area: meta.area }));
  }
  const promise = fetchDataset(meta);
  cache.set(meta.id, { updatedAt: meta.updatedAt, promise });
  promise.catch(() => cache.delete(meta.id));
  return promise;
}

// ---------- estado global ----------

interface AppState {
  boot: Bootstrap | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<Bootstrap | null>;
}

const Ctx = createContext<AppState>(null as unknown as AppState);

export function AppProvider({ children }: { children: ReactNode }) {
  const [boot, setBoot] = useState<Bootstrap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(async () => {
    try {
      const b = await api<Bootstrap>("bootstrap");
      setBoot(b);
      setError(null);
      return b;
    } catch (e) {
      if (e instanceof ApiError && e.status === 401) {
        setBoot({ user: null } as Bootstrap);
        return null;
      }
      setError((e as Error).message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
  }, [refresh]);
  return <Ctx.Provider value={{ boot, loading, error, refresh }}>{children}</Ctx.Provider>;
}

export const useApp = () => useContext(Ctx);

export function useBoot(): Bootstrap {
  const { boot } = useApp();
  return boot!;
}

export function modelOf(boot: Bootstrap): Model {
  return { datasets: boot.datasets, derived: boot.derived, relationships: boot.relationships };
}

export function targetName(boot: Bootstrap, id: string): string {
  return boot.datasets.find((d) => d.id === id)?.name ?? boot.derived.find((d) => d.id === id)?.name ?? "Tabla";
}

export function targetArea(boot: Bootstrap, id: string): string {
  return boot.datasets.find((d) => d.id === id)?.area ?? boot.derived.find((d) => d.id === id)?.area ?? "";
}

export function canEdit(boot: Bootstrap, area?: string): boolean {
  const u = boot.user;
  if (!u) return false;
  if (u.role === "admin") return true;
  if (u.role !== "editor") return false;
  return area === undefined || u.areas.includes("*") || u.areas.includes(area);
}

/** Carga y resuelve varias tablas (datasets enriquecidos o derivadas). */
export function useTables(ids: string[]) {
  const boot = useBoot();
  const key = ids.join(",");
  const [state, setState] = useState<{ tables: Record<string, TableData>; loading: boolean; error: string | null }>({
    tables: {},
    loading: true,
    error: null,
  });
  const model = useMemo(() => modelOf(boot), [boot]);
  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    const need = [...new Set(ids.flatMap((id) => dependencies(id, model)))];
    const metas = need.map((id) => boot.datasets.find((d) => d.id === id)).filter(Boolean) as DatasetMeta[];
    Promise.all(metas.map((m) => loadDataset(m)))
      .then((loaded) => {
        if (!alive) return;
        const raw = new Map(loaded.map((t) => [t.id, t]));
        const tables: Record<string, TableData> = {};
        for (const id of ids) {
          const t = resolveTable(id, model, (x) => raw.get(x));
          if (t) tables[id] = { ...t, name: targetNameFromModel(model, id) };
        }
        setState({ tables, loading: false, error: null });
      })
      .catch((e) => alive && setState({ tables: {}, loading: false, error: (e as Error).message }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, model]);
  return state;
}

function targetNameFromModel(m: Model, id: string) {
  return m.datasets.find((d) => d.id === id)?.name ?? m.derived.find((d) => d.id === id)?.name ?? "Tabla";
}

// ---------- subida ----------

export interface UploadGroup {
  target: { datasetId: string } | { newName: string; area: string };
  mode: UploadMode;
  parts: ParsedTable[];
}

const MAX_CHUNK_CHARS = 2_500_000;

export async function uploadGroup(g: UploadGroup, onProgress?: (msg: string) => void): Promise<DatasetMeta> {
  const { uploadId } = await api<{ uploadId: string }>("upload/start", { body: { target: g.target, mode: g.mode } });
  let index = 0;
  for (const p of g.parts) {
    const fileName = g.parts.filter((x) => x.fileName === p.fileName).length > 1 ? `${p.fileName} [${p.sheetName}]` : p.fileName;
    let start = 0;
    while (start < p.rows.length || (start === 0 && p.rows.length === 0)) {
      // trozos de ~2,5 MB para no pasar el límite de 6 MB por petición
      let end = Math.min(p.rows.length, start + 5000);
      while (end - start > 200 && JSON.stringify(p.rows.slice(start, end)).length > MAX_CHUNK_CHARS) end = start + Math.floor((end - start) / 2);
      onProgress?.(`${fileName}: ${Math.min(end, p.rows.length)} de ${p.rows.length} filas`);
      await api(`upload/${uploadId}/chunk`, { body: { index: index++, fileName, columns: p.columns, rows: p.rows.slice(start, end) } });
      start = end;
      if (p.rows.length === 0) break;
    }
  }
  onProgress?.("Guardando y recalculando…");
  const { dataset } = await api<{ dataset: DatasetMeta }>(`upload/${uploadId}/commit`, { body: {} });
  return dataset;
}

/** Busca relaciones nuevas entre todas las tablas visibles y las guarda. Devuelve cuántas añadió. */
export async function autoDetectRelationships(boot: Bootstrap): Promise<number> {
  const tables = await Promise.all(boot.datasets.map((d) => loadDataset(d)));
  const found = detectRelationships(tables, boot.relationships);
  if (!found.length) return 0;
  const next: Relationship[] = [...boot.relationships, ...found];
  await api("relationships", { method: "PUT", body: { relationships: next } });
  return found.length;
}
