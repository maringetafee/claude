// Guardado de datos en una tabla (nueva o existente) y carga automática desde enlaces/API.
import { parseWorkbook, type ParsedTable } from "../../shared/excel.ts";
import { mergeTables, type MergeInput, type UploadMode } from "../../shared/merge.ts";
import { ORIGIN_COL, type DatasetMeta, type Source } from "../../shared/types.ts";
import { signatureOf, similarity } from "../../shared/values.ts";
import { db, newId, readAllRows, writeAllRows } from "./store.ts";

export type Target = { datasetId: string } | { newName: string; area: string };

export async function commitToDataset(target: Target, incoming: MergeInput[], mode: UploadMode, who: string): Promise<DatasetMeta> {
  const datasets = await db.datasets();
  const now = new Date().toISOString();
  let meta: DatasetMeta;
  let existingRows = null;
  if ("datasetId" in target) {
    const found = datasets.find((d) => d.id === target.datasetId);
    if (!found) throw new HttpError(404, "La tabla ya no existe");
    meta = found;
    existingRows = mode === "replace" ? null : { columns: meta.columns, rows: await readAllRows(meta) };
  } else {
    meta = {
      id: newId("ds"),
      name: uniqueName(target.newName.trim() || "Tabla", datasets),
      area: target.area.trim() || "General",
      columns: [],
      rowCount: 0,
      chunkCount: 0,
      files: [],
      signature: [],
      createdAt: now,
      updatedAt: now,
    };
    datasets.push(meta);
  }
  const merged = mergeTables(existingRows, incoming, mode);
  const chunkCount = await writeAllRows(meta.id, merged.rows, meta.chunkCount);
  Object.assign(meta, {
    columns: merged.columns,
    rowCount: merged.rows.length,
    chunkCount,
    files: merged.files,
    signature: signatureOf(merged.columns, ORIGIN_COL),
    updatedAt: now,
  });
  await db.saveDatasets(datasets);
  const added = incoming.reduce((s, i) => s + i.rows.length, 0);
  await db.log(who, `${added} filas → «${meta.name}» (${incoming.map((i) => i.fileName).join(", ")})`);
  return meta;
}

function uniqueName(name: string, datasets: DatasetMeta[]) {
  let n = name;
  let k = 2;
  while (datasets.some((d) => d.name.toLowerCase() === n.toLowerCase())) n = `${name} ${k++}`;
  return n;
}

export function bestMatch(t: ParsedTable, datasets: DatasetMeta[]): DatasetMeta | null {
  const sig = signatureOf(t.columns, ORIGIN_COL);
  let best: DatasetMeta | null = null;
  let score = 0;
  for (const d of datasets) {
    const s = similarity(sig, d.signature);
    if (s > score) {
      score = s;
      best = d;
    }
  }
  return score >= 0.75 ? best : null;
}

/** Procesa un archivo recibido por el servidor (enlace programado o API). */
export async function ingestFile(
  bytes: Uint8Array,
  fileName: string,
  opts: { datasetId: string | null; area: string },
  who: string,
): Promise<string> {
  const tables = parseWorkbook(bytes, fileName);
  if (!tables.length) throw new HttpError(422, "El archivo no tiene ninguna tabla con cabecera y datos");
  const datasets = await db.datasets();
  const done: string[] = [];
  for (const [n, t] of tables.entries()) {
    let target: Target;
    if (opts.datasetId && n === 0) target = { datasetId: opts.datasetId };
    else {
      const m = bestMatch(t, datasets);
      target = m ? { datasetId: m.id } : { newName: t.suggestedName, area: opts.area };
    }
    const label = tables.length > 1 ? `${fileName} [${t.sheetName}]` : fileName;
    const meta = await commitToDataset(target, [{ columns: t.columns, rows: t.rows, fileName: label }], "auto", who);
    if (!datasets.some((d) => d.id === meta.id)) datasets.push(meta);
    done.push(`${meta.name} (${t.rows.length} filas)`);
  }
  return done.join(", ");
}

/** Convierte enlaces de OneDrive/SharePoint en enlaces de descarga directa. */
export function downloadUrl(url: string): string {
  const u = new URL(url.trim());
  if (u.hostname === "1drv.ms" || u.hostname.endsWith("onedrive.live.com")) {
    const b64 = Buffer.from(url.trim()).toString("base64").replace(/=+$/, "").replace(/\//g, "_").replace(/\+/g, "-");
    return `https://api.onedrive.com/v1.0/shares/u!${b64}/root/content`;
  }
  if (u.hostname.endsWith("sharepoint.com")) {
    u.searchParams.set("download", "1");
    return u.toString();
  }
  return u.toString();
}

export async function runSource(src: Source): Promise<Source> {
  try {
    const res = await fetch(downloadUrl(src.url), { redirect: "follow" });
    if (!res.ok) throw new Error(`El enlace respondió ${res.status}. ¿Está compartido como "cualquier persona con el enlace"?`);
    const type = res.headers.get("content-type") ?? "";
    if (type.includes("text/html")) throw new Error("El enlace abre una página web, no el archivo. Compártelo con acceso sin iniciar sesión.");
    const bytes = new Uint8Array(await res.arrayBuffer());
    const ext = /csv/.test(type) || /\.csv(\?|$)/i.test(src.url) ? ".csv" : ".xlsx";
    const msg = await ingestFile(bytes, `${src.name}${ext}`, { datasetId: src.datasetId, area: src.area }, `Fuente «${src.name}»`);
    return { ...src, lastRun: new Date().toISOString(), lastStatus: "ok", lastMessage: msg };
  } catch (e) {
    return { ...src, lastRun: new Date().toISOString(), lastStatus: "error", lastMessage: (e as Error).message };
  }
}

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
