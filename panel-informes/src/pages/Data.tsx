import { useRef, useState, type DragEvent } from "react";
import { Link } from "react-router-dom";
import type { Bootstrap, DatasetMeta, Source } from "../../shared/types.ts";
import { ORIGIN_COL } from "../../shared/types.ts";
import { parseWorkbook, type ParsedTable } from "../../shared/excel.ts";
import type { UploadMode } from "../../shared/merge.ts";
import { signatureOf, similarity } from "../../shared/values.ts";
import { api } from "../api.ts";
import { autoDetectRelationships, canEdit, uploadGroup, useApp, useBoot } from "../store.tsx";
import { sampleTables } from "../sample.ts";
import { Alert, Badge, PageHeader, Section } from "../components/ui.tsx";
import { fmtDateTime } from "../format.ts";

interface Proposal {
  key: string;
  parts: ParsedTable[];
  datasetId: string; // "" = tabla nueva
  newName: string;
  area: string;
  mode: UploadMode;
  include: boolean;
}

const MODE_LABEL: Record<UploadMode, string> = {
  auto: "Añadir (y sustituir si el archivo ya se cargó)",
  append: "Añadir siempre",
  replace: "Sustituir todos los datos de la tabla",
};

function defaultArea(boot: Bootstrap): string {
  const u = boot.user!;
  if (u.role === "admin" || u.areas.includes("*")) return boot.areas[0] ?? "General";
  return u.areas[0] ?? "General";
}

/** Decide a qué tabla va cada hoja: misma estructura que una tabla existente → esa tabla; si no, agrupa hojas iguales en una tabla nueva. */
function propose(parsed: ParsedTable[], boot: Bootstrap): Proposal[] {
  const out: Proposal[] = [];
  const editable = boot.datasets.filter((d) => canEdit(boot, d.area));
  for (const t of parsed) {
    const sig = signatureOf(t.columns, ORIGIN_COL);
    let best: DatasetMeta | null = null;
    let score = 0;
    for (const d of editable) {
      const s = similarity(sig, d.signature);
      if (s > score) (score = s), (best = d);
    }
    if (best && score >= 0.75) {
      const p = out.find((x) => x.datasetId === best!.id);
      if (p) p.parts.push(t);
      else out.push({ key: t.fileName + t.sheetName, parts: [t], datasetId: best.id, newName: "", area: best.area, mode: "auto", include: true });
      continue;
    }
    const group = out.find((x) => !x.datasetId && similarity(sig, signatureOf(x.parts[0].columns, ORIGIN_COL)) >= 0.9);
    if (group) group.parts.push(t);
    else out.push({ key: t.fileName + t.sheetName, parts: [t], datasetId: "", newName: t.suggestedName, area: defaultArea(boot), mode: "auto", include: true });
  }
  return out;
}

export function DataPage() {
  const boot = useBoot();
  return (
    <div className="space-y-6">
      <PageHeader title="Datos y cargas" subtitle="Sube Excel, revisa las tablas y programa cargas automáticas. Los informes se actualizan solos." />
      <Uploader />
      <DatasetList />
      <Sources />
      {boot.user!.role === "admin" && <ApiAccess />}
      <ActivityLog />
    </div>
  );
}

function Uploader() {
  const boot = useBoot();
  const { refresh } = useApp();
  const input = useRef<HTMLInputElement>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [result, setResult] = useState<{ kind: "ok" | "error"; text: string; links?: DatasetMeta[] } | null>(null);
  const editable = boot.datasets.filter((d) => canEdit(boot, d.area));

  const readFiles = async (files: FileList | File[]) => {
    setResult(null);
    const parsed: ParsedTable[] = [];
    const errors: string[] = [];
    for (const f of Array.from(files)) {
      try {
        const t = parseWorkbook(await f.arrayBuffer(), f.name);
        if (!t.length) errors.push(`${f.name}: no se ha encontrado ninguna tabla con cabecera y datos`);
        parsed.push(...t);
      } catch (e) {
        errors.push(`${f.name}: ${(e as Error).message}`);
      }
    }
    if (errors.length) setResult({ kind: "error", text: errors.join(" · ") });
    setProposals((p) => [...p, ...propose(parsed, boot)]);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files.length) readFiles(e.dataTransfer.files);
  };

  const upd = (i: number, patch: Partial<Proposal>) => setProposals(proposals.map((p, n) => (n === i ? { ...p, ...patch } : p)));

  const run = async () => {
    setBusy("Preparando…");
    setResult(null);
    const done: DatasetMeta[] = [];
    try {
      for (const p of proposals.filter((x) => x.include)) {
        const target = p.datasetId ? { datasetId: p.datasetId } : { newName: p.newName, area: p.area };
        done.push(await uploadGroup({ target, mode: p.mode, parts: p.parts }, setBusy));
      }
      setBusy("Buscando relaciones entre tablas…");
      const b = await refresh();
      const rels = b ? await autoDetectRelationships(b) : 0;
      if (rels) await refresh();
      setProposals([]);
      setResult({
        kind: "ok",
        text: `Carga completada. ${done.length} tabla(s) actualizada(s)${rels ? ` y ${rels} relación(es) nueva(s) detectada(s)` : ""}. Los informes ya están al día.`,
        links: done,
      });
    } catch (e) {
      setResult({ kind: "error", text: (e as Error).message });
      await refresh();
    } finally {
      setBusy(null);
    }
  };

  return (
    <Section
      title="Subir Excel"
      description="Arrastra uno o varios archivos (.xlsx, .xls, .csv). Se detecta la cabecera, los tipos de columna y a qué tabla pertenece cada archivo."
      actions={!boot.datasets.length ? <button className="btn btn-ghost" onClick={() => setProposals(propose(sampleTables(), boot))}>Probar con datos de ejemplo</button> : null}
    >
      <div
        onDragOver={(e) => (e.preventDefault(), setDrag(true))}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => input.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${drag ? "border-brand-500 bg-brand-50" : "border-slate-300 hover:border-brand-500 hover:bg-slate-50"}`}
      >
        <p className="text-sm font-medium text-slate-700">Arrastra aquí tus Excel o pulsa para elegirlos</p>
        <p className="mt-1 text-xs text-slate-500">Los archivos con la misma estructura (p. ej. ventas de cada mes) se juntan en una sola tabla.</p>
        <input ref={input} type="file" multiple accept=".xlsx,.xlsm,.xls,.csv,.ods" className="hidden" onChange={(e) => e.target.files && (readFiles(e.target.files), (e.target.value = ""))} />
      </div>

      {proposals.length > 0 && (
        <div className="mt-5 space-y-3">
          {proposals.map((p, i) => (
            <div key={p.key} className={`rounded-lg border p-4 ${p.include ? "border-slate-200" : "border-dashed border-slate-200 opacity-60"}`}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">
                    {p.parts.map((x) => x.fileName +(x.sheetName && !/^(hoja|sheet)\s*\d*$/i.test(x.sheetName) ? ` › ${x.sheetName}` : "")).join(", ")}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {p.parts.reduce((s, x) => s + x.rows.length, 0).toLocaleString("es-ES")} filas · columnas: {p.parts[0].columns.map((c) => `${c.name}${c.type === "number" ? " (nº)" : c.type === "date" ? " (fecha)" : ""}`).join(", ")}
                  </p>
                  {p.parts.flatMap((x) => x.warnings).map((w, n) => <p key={n} className="mt-1 text-xs text-amber-700">⚠ {w}</p>)}
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-brand-600" checked={p.include} onChange={(e) => upd(i, { include: e.target.checked })} /> Cargar
                </label>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-4">
                <div className="md:col-span-1">
                  <label className="label">Destino</label>
                  <select className="input" value={p.datasetId} onChange={(e) => upd(i, { datasetId: e.target.value })}>
                    <option value="">Tabla nueva</option>
                    {editable.map((d) => <option key={d.id} value={d.id}>{d.name} ({d.area})</option>)}
                  </select>
                </div>
                {!p.datasetId ? (
                  <>
                    <div><label className="label">Nombre de la tabla</label><input className="input" value={p.newName} onChange={(e) => upd(i, { newName: e.target.value })} /></div>
                    <div>
                      <label className="label">Área</label>
                      <input className="input" list="areas" value={p.area} onChange={(e) => upd(i, { area: e.target.value })} />
                    </div>
                  </>
                ) : (
                  <div className="md:col-span-2 self-end pb-2 text-xs text-emerald-700">✓ Tiene la misma estructura que esta tabla: se añadirá a sus datos.</div>
                )}
                {p.datasetId && (
                  <div>
                    <label className="label">Cómo cargar</label>
                    <select className="input" value={p.mode} onChange={(e) => upd(i, { mode: e.target.value as UploadMode })}>
                      {(Object.keys(MODE_LABEL) as UploadMode[]).map((m) => <option key={m} value={m}>{MODE_LABEL[m]}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
          ))}
          <datalist id="areas">
            {[...new Set([...boot.areas, ...(boot.user!.areas.includes("*") ? [] : boot.user!.areas)])].map((a) => <option key={a} value={a} />)}
          </datalist>
          <div className="flex flex-wrap items-center gap-2">
            <button className="btn btn-primary" disabled={!!busy || !proposals.some((p) => p.include)} onClick={run}>
              {busy ? "Cargando…" : "Cargar y actualizar informes"}
            </button>
            <button className="btn btn-ghost" disabled={!!busy} onClick={() => setProposals([])}>Descartar</button>
            {busy && <span className="text-sm text-slate-500">{busy}</span>}
          </div>
        </div>
      )}
      {result && (
        <div className="mt-4">
          <Alert kind={result.kind}>
            {result.text}
            {result.links && (
              <span className="mt-2 flex flex-wrap gap-2">
                <Link to="/" className="font-medium underline">Ver informe maestro</Link>
                {result.links.map((d) => <Link key={d.id} to={`/informe/${d.id}`} className="underline">{d.name}</Link>)}
              </span>
            )}
          </Alert>
        </div>
      )}
    </Section>
  );
}

function DatasetList() {
  const boot = useBoot();
  const { refresh } = useApp();
  const [err, setErr] = useState<string | null>(null);
  const act = async (fn: () => Promise<unknown>) => {
    setErr(null);
    try {
      await fn();
      await refresh();
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  if (!boot.datasets.length) return null;
  return (
    <Section title="Tablas" description="Cada tabla junta todos los Excel con la misma estructura. La columna «Archivo» indica de dónde viene cada fila.">
      {err && <div className="mb-3"><Alert kind="error">{err}</Alert></div>}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr><th className="th">Tabla</th><th className="th">Área</th><th className="th text-right">Filas</th><th className="th">Archivos</th><th className="th">Actualizada</th><th className="th" /></tr>
          </thead>
          <tbody>
            {boot.datasets.map((d) => (
              <tr key={d.id}>
                <td className="td font-medium"><Link to={`/informe/${d.id}`} className="text-brand-700 hover:underline">{d.name}</Link></td>
                <td className="td"><Badge>{d.area}</Badge></td>
                <td className="td text-right tabular-nums">{d.rowCount.toLocaleString("es-ES")}</td>
                <td className="td max-w-64 truncate text-xs text-slate-500" title={d.files.join("\n")}>{d.files.length}: {d.files.join(", ")}</td>
                <td className="td text-xs text-slate-500">{fmtDateTime(d.updatedAt)}</td>
                <td className="td text-right">
                  {canEdit(boot, d.area) && (
                    <span className="flex justify-end gap-3 text-xs">
                      <button className="text-slate-600 hover:underline" onClick={() => {
                        const name = prompt("Nuevo nombre de la tabla", d.name);
                        if (name) act(() => api(`datasets/${d.id}`, { method: "PATCH", body: { name } }));
                      }}>Renombrar</button>
                      <button className="text-slate-600 hover:underline" onClick={() => {
                        const area = prompt("Área (quién la ve depende de esto)", d.area);
                        if (area) act(() => api(`datasets/${d.id}`, { method: "PATCH", body: { area } }));
                      }}>Cambiar área</button>
                      <button className="text-red-600 hover:underline" onClick={() => {
                        if (confirm(`¿Borrar la tabla «${d.name}» con todos sus datos, su informe y las tablas derivadas que dependan de ella?`)) act(() => api(`datasets/${d.id}`, { method: "DELETE" }));
                      }}>Borrar</button>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

const emptySource = (area: string): Source => ({ id: "", name: "", url: "", datasetId: null, area, everyHours: 24, lastRun: null, lastStatus: null, lastMessage: "" });

function Sources() {
  const boot = useBoot();
  const { refresh } = useApp();
  const [form, setForm] = useState<Source | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [running, setRunning] = useState<string | null>(null);
  const editable = boot.datasets.filter((d) => canEdit(boot, d.area));
  const save = async () => {
    setErr(null);
    try {
      await api(`sources/${form!.id || "new"}`, { method: "PUT", body: form });
      setForm(null);
      await refresh();
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  const run = async (s: Source) => {
    setRunning(s.id);
    try {
      await api(`sources/${s.id}/run`, { method: "POST", body: {} });
      const b = await refresh();
      if (b && (await autoDetectRelationships(b))) await refresh();
    } finally {
      setRunning(null);
    }
  };
  return (
    <Section
      title="Cargas automáticas desde OneDrive / SharePoint"
      description="Pega el enlace de un Excel y la aplicación lo vuelve a leer cada X horas. Si lo actualizáis en OneDrive o SharePoint, los informes se actualizan solos."
      actions={!form ? <button className="btn btn-ghost" onClick={() => setForm(emptySource(defaultArea(boot)))}>+ Nueva carga automática</button> : null}
    >
      {form && (
        <div className="mb-4 space-y-3 rounded-lg border border-slate-200 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="label">Nombre</label><input className="input" placeholder="Ventas diarias" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="label">Enlace del Excel</label><input className="input" placeholder="https://empresa.sharepoint.com/:x:/..." value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} /></div>
            <div>
              <label className="label">Tabla de destino</label>
              <select className="input" value={form.datasetId ?? ""} onChange={(e) => setForm({ ...form, datasetId: e.target.value || null })}>
                <option value="">Automático (por estructura o tabla nueva)</option>
                {editable.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="label">Área (si crea tabla)</label><input className="input" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} /></div>
              <div><label className="label">Cada (horas)</label><input type="number" min={1} max={168} className="input" value={form.everyHours} onChange={(e) => setForm({ ...form, everyHours: Number(e.target.value) })} /></div>
            </div>
          </div>
          <Alert kind="info">
            Cómo conseguir el enlace: en OneDrive o SharePoint, <b>Compartir → Configuración del vínculo → «Cualquier persona con el vínculo»</b> (solo lectura) y copia el enlace. Si tu empresa no permite ese tipo de vínculo, usa la carga por API con Power Automate (sección de abajo) o sube el Excel a mano.
          </Alert>
          {err && <Alert kind="error">{err}</Alert>}
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={save}>Guardar</button>
            <button className="btn btn-ghost" onClick={() => setForm(null)}>Cancelar</button>
          </div>
        </div>
      )}
      {boot.sources.length === 0 && !form && <p className="text-sm text-slate-500">No hay cargas automáticas configuradas.</p>}
      <div className="divide-y divide-slate-100">
        {boot.sources.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{s.name} <span className="font-normal text-slate-500">· cada {s.everyHours} h · {s.datasetId ? boot.datasets.find((d) => d.id === s.datasetId)?.name : "destino automático"}</span></p>
              <p className="truncate text-xs text-slate-500">{s.url}</p>
              {s.lastRun && (
                <p className={`text-xs ${s.lastStatus === "ok" ? "text-emerald-700" : "text-red-700"}`}>
                  {fmtDateTime(s.lastRun)}: {s.lastMessage}
                </p>
              )}
            </div>
            <button className="btn btn-ghost py-1" disabled={running === s.id} onClick={() => run(s)}>{running === s.id ? "Cargando…" : "Cargar ahora"}</button>
            <button className="btn btn-ghost py-1" onClick={() => setForm(s)}>Editar</button>
            <button className="btn btn-danger py-1" onClick={async () => { if (confirm("¿Quitar esta carga automática? Los datos ya cargados se quedan.")) { await api(`sources/${s.id}`, { method: "DELETE" }); await refresh(); } }}>Quitar</button>
          </div>
        ))}
      </div>
    </Section>
  );
}

function ApiAccess() {
  const boot = useBoot();
  const { refresh } = useApp();
  const [key, setKey] = useState<string | null>(null);
  const origin = window.location.origin;
  return (
    <Section
      title="Carga por API (Power Automate, scripts)"
      description="Para automatizar desde Microsoft: un flujo de Power Automate puede enviar aquí cada Excel nuevo que llegue a una carpeta o a un correo."
      actions={<button className="btn btn-ghost" onClick={async () => { if (!boot.hasApiKey || confirm("La clave anterior dejará de funcionar. ¿Continuar?")) { setKey((await api<{ key: string }>("apikey", { method: "POST", body: {} })).key); await refresh(); } }}>{boot.hasApiKey ? "Regenerar clave" : "Crear clave"}</button>}
    >
      {key && <div className="mb-3"><Alert kind="warn">Copia la clave ahora, no se volverá a mostrar: <code className="select-all break-all font-mono">{key}</code></Alert></div>}
      <div className="space-y-2 text-sm text-slate-600">
        <p>Petición: <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">POST {origin}/api/ingest?area=General</code> (opcional <code className="font-mono text-xs">&dataset=ID_TABLA</code>)</p>
        <p>Cabeceras: <code className="font-mono text-xs">X-Api-Key: tu_clave</code>, <code className="font-mono text-xs">X-File-Name: ventas_marzo.xlsx</code> y <code className="font-mono text-xs">Content-Type: application/octet-stream</code>. Cuerpo: el archivo tal cual.</p>
        <p>En Power Automate: disparador «Cuando se crea un archivo (SharePoint/OneDrive)» → «Obtener contenido de archivo» → acción <b>HTTP</b> (conector premium) con esos datos.</p>
        <p className="text-xs text-slate-500">IDs de tabla: {boot.datasets.map((d) => `${d.name} = ${d.id}`).join(" · ") || "aún no hay tablas"}</p>
      </div>
    </Section>
  );
}

function ActivityLog() {
  const boot = useBoot();
  if (!boot.activity.length) return null;
  return (
    <Section title="Actividad reciente">
      <ul className="max-h-72 space-y-1 overflow-auto text-sm">
        {boot.activity.map((a, i) => (
          <li key={i} className="flex gap-3">
            <span className="shrink-0 text-xs tabular-nums text-slate-400">{fmtDateTime(a.at)}</span>
            <span className="shrink-0 text-xs text-slate-500">{a.who}</span>
            <span className="text-slate-700">{a.what}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
