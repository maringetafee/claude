import type { Config } from "@netlify/functions";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import type {
  Bootstrap, DerivedTable, MasterSpec, Relationship, ReportSpec, Role, Source,
} from "../../shared/types.ts";
import type { MergeInput, UploadMode } from "../../shared/merge.ts";
import { dependencies } from "../../shared/engine.ts";
import {
  canEditArea, canSeeArea, checkPassword, clearCookie, currentUser, hashPassword, hasRowFilterOn, isEditor,
  rowFilter, sessionCookie, toPublic,
} from "../lib/auth.ts";
import { commitToDataset, HttpError, ingestFile, runSource, type Target } from "../lib/ingest.ts";
import { db, deletePrefix, deleteRows, newId, readChunk, store, type StoredUser } from "../lib/store.ts";

export const config: Config = { path: "/api/*" };

const json = (data: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });

const ROLES: Role[] = ["admin", "editor", "viewer"];

export default async (req: Request) => {
  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean).map(decodeURIComponent);
  const method = req.method;
  try {
    // Carga por API (Power Automate, scripts): autenticada con clave, sin cookie
    if (parts[0] === "ingest" && method === "POST") return await ingestApi(req, url);

    if (method !== "GET") {
      const origin = req.headers.get("origin");
      if (origin && new URL(origin).host !== url.host) throw new HttpError(403, "Origen no permitido");
    }

    if (parts[0] === "setup" && method === "POST") return await setup(req);
    if (parts[0] === "login" && method === "POST") return await login(req);
    if (parts[0] === "logout") return json({ ok: true }, 200, { "set-cookie": clearCookie() });

    const user = await currentUser(req);
    if (parts[0] === "bootstrap" && method === "GET") {
      if (!user) {
        const needsSetup = (await db.users()).length === 0;
        return json({ needsSetup, user: null }, needsSetup ? 200 : 401);
      }
      return json(await bootstrap(user));
    }
    if (!user) throw new HttpError(401, "Inicia sesión");

    const body = method === "GET" || method === "DELETE" ? null : await req.json().catch(() => ({}));
    switch (parts[0]) {
      case "data":
        return await data(user, parts[1], Number(parts[2] ?? 0));
      case "upload":
        return await upload(user, parts, body);
      case "datasets":
        return await datasets(user, method, parts[1], body);
      case "relationships":
        return await relationships(user, method, body);
      case "derived":
        return await derived(user, method, parts[1], body);
      case "reports":
        return await reports(user, method, parts[1], body);
      case "master":
        return await master(user, method, body);
      case "users":
        return await users(user, method, parts[1], body);
      case "sources":
        return await sources(user, method, parts[1], parts[2], body);
      case "apikey":
        return await apiKey(user, method);
      case "password":
        return await changePassword(user, body);
    }
    throw new HttpError(404, "Ruta no encontrada");
  } catch (e) {
    if (e instanceof HttpError) return json({ error: e.message }, e.status);
    console.error(e);
    return json({ error: (e as Error).message || "Error interno" }, 500);
  }
};

// ---------- sesión ----------

async function setup(req: Request) {
  const { token, email, name, password } = await req.json();
  const users = await db.users();
  if (users.length) throw new HttpError(409, "La aplicación ya está configurada");
  const expected = process.env.SETUP_TOKEN;
  if (!expected || token !== expected) throw new HttpError(403, "Código de instalación incorrecto");
  validatePassword(password);
  const u: StoredUser = {
    id: newId("u"), email: normEmail(email), name: String(name || "Administración"), role: "admin",
    areas: ["*"], rowFilters: [], ...hashPassword(password),
  };
  await db.saveUsers([u]);
  await db.log(u.email, "Aplicación configurada");
  return json({ ok: true }, 200, { "set-cookie": sessionCookie(u.id) });
}

async function login(req: Request) {
  const { email, password } = await req.json();
  const u = (await db.users()).find((x) => x.email === normEmail(email));
  if (!u || !checkPassword(u, String(password ?? ""))) {
    await new Promise((r) => setTimeout(r, 600));
    throw new HttpError(401, "Correo o contraseña incorrectos");
  }
  return json({ user: toPublic(u) }, 200, { "set-cookie": sessionCookie(u.id) });
}

async function changePassword(user: StoredUser, body: { current: string; next: string }) {
  if (!checkPassword(user, String(body.current ?? ""))) throw new HttpError(400, "La contraseña actual no es correcta");
  validatePassword(body.next);
  const users = await db.users();
  Object.assign(users.find((u) => u.id === user.id)!, hashPassword(body.next));
  await db.saveUsers(users);
  return json({ ok: true });
}

const normEmail = (e: unknown) => String(e ?? "").trim().toLowerCase();
function validatePassword(p: unknown) {
  if (typeof p !== "string" || p.length < 8) throw new HttpError(400, "La contraseña debe tener al menos 8 caracteres");
}

// ---------- lectura ----------

async function visibleDatasets(user: StoredUser) {
  return (await db.datasets()).filter((d) => canSeeArea(user, d.area));
}

async function bootstrap(user: StoredUser): Promise<Bootstrap> {
  const [all, rels, der, reps, mast, srcs, act, settings] = await Promise.all([
    db.datasets(), db.relationships(), db.derived(), db.reports(), db.master(), db.sources(), db.activity(), db.settings(),
  ]);
  const ds = all.filter((d) => canSeeArea(user, d.area));
  const ids = new Set(ds.map((d) => d.id));
  const relationships = rels.filter((r) => ids.has(r.fromDataset) && ids.has(r.toDataset));
  const model = { datasets: ds, derived: der, relationships };
  const derived = der.filter((d) => canSeeArea(user, d.area) && dependencies(d.id, model).every((x) => ids.has(x)) && dependencies(d.id, model).length > 0);
  const targets = new Set([...ids, ...derived.map((d) => d.id)]);
  const reports = Object.fromEntries(Object.entries(reps).filter(([k]) => targets.has(k)));
  const areaSet = new Set([...all.map((d) => d.area), ...der.map((d) => d.area)]);
  const areas = [...areaSet].filter((a) => canSeeArea(user, a)).sort((a, b) => a.localeCompare(b, "es"));
  return {
    user: toPublic(user),
    datasets: ds,
    relationships,
    derived,
    reports,
    master: mast,
    areas,
    sources: isEditor(user) ? srcs.filter((s) => canSeeArea(user, s.area)) : [],
    activity: isEditor(user) ? act.slice(0, 60) : [],
    hasApiKey: !!settings.apiKeyHash,
  };
}

async function data(user: StoredUser, id: string, n: number) {
  const meta = (await db.datasets()).find((d) => d.id === id);
  if (!meta || !canSeeArea(user, meta.area)) throw new HttpError(404, "Tabla no encontrada");
  if (!(n >= 0 && n < Math.max(1, meta.chunkCount))) throw new HttpError(404, "Trozo fuera de rango");
  const keep = await rowFilter(user, meta);
  const rows = (await readChunk(id, n)).filter(keep);
  return json({ rows, updatedAt: meta.updatedAt }, 200, { "cache-control": "private, no-cache" });
}

// ---------- subida de Excel (en trozos para no pasar el límite de 6 MB por petición) ----------

async function checkTarget(user: StoredUser, target: Target): Promise<void> {
  if ("datasetId" in target) {
    const meta = (await db.datasets()).find((d) => d.id === target.datasetId);
    if (!meta) throw new HttpError(404, "La tabla no existe");
    if (!canEditArea(user, meta.area)) throw new HttpError(403, "No puedes cargar datos en esta área");
    if (await hasRowFilterOn(user, meta)) throw new HttpError(403, "Tienes acceso solo a una parte de esta tabla; pide a administración que cargue el archivo");
  } else {
    if (!target.newName?.trim()) throw new HttpError(400, "Falta el nombre de la tabla nueva");
    if (!canEditArea(user, target.area?.trim() || "General")) throw new HttpError(403, "No puedes crear tablas en esa área");
  }
}

async function upload(user: StoredUser, parts: string[], body: any) {
  if (!isEditor(user)) throw new HttpError(403, "Solo edición o administración puede cargar datos");
  const s = store();
  if (parts[1] === "start") {
    const target = body.target as Target;
    const mode = (["auto", "append", "replace"].includes(body.mode) ? body.mode : "auto") as UploadMode;
    await checkTarget(user, target);
    const uploadId = newId("up");
    await s.setJSON(`staging/${uploadId}/meta`, { target, mode, user: user.id, at: Date.now() });
    return json({ uploadId });
  }
  const uploadId = parts[1];
  const meta = (await s.get(`staging/${uploadId}/meta`, { type: "json" })) as { target: Target; mode: UploadMode; user: string } | null;
  if (!meta || meta.user !== user.id) throw new HttpError(404, "Subida no encontrada");
  if (parts[2] === "chunk") {
    const { index, fileName, columns, rows } = body;
    if (!Array.isArray(rows) || !Array.isArray(columns)) throw new HttpError(400, "Datos incorrectos");
    await s.setJSON(`staging/${uploadId}/c${String(index).padStart(5, "0")}`, { fileName, columns, rows });
    return json({ ok: true });
  }
  if (parts[2] === "commit") {
    await checkTarget(user, meta.target);
    const { blobs } = await s.list({ prefix: `staging/${uploadId}/c` });
    blobs.sort((a, b) => a.key.localeCompare(b.key));
    const chunks = await Promise.all(blobs.map((b) => s.get(b.key, { type: "json" }) as Promise<MergeInput>));
    const byFile = new Map<string, MergeInput>();
    for (const c of chunks) {
      const f = byFile.get(c.fileName);
      if (f) f.rows.push(...c.rows);
      else byFile.set(c.fileName, { fileName: c.fileName, columns: c.columns, rows: [...c.rows] });
    }
    const result = await commitToDataset(meta.target, [...byFile.values()], meta.mode, user.email);
    await deletePrefix(`staging/${uploadId}/`);
    return json({ dataset: result });
  }
  throw new HttpError(404, "Ruta no encontrada");
}

// ---------- tablas ----------

async function datasets(user: StoredUser, method: string, id: string, body: any) {
  const all = await db.datasets();
  const meta = all.find((d) => d.id === id);
  if (!meta || !canSeeArea(user, meta.area)) throw new HttpError(404, "Tabla no encontrada");
  if (!canEditArea(user, meta.area)) throw new HttpError(403, "No tienes permiso de edición en esta área");
  if (method === "PATCH") {
    if (typeof body.name === "string" && body.name.trim()) meta.name = body.name.trim();
    if (typeof body.area === "string" && body.area.trim()) {
      if (!canEditArea(user, body.area.trim())) throw new HttpError(403, "No puedes mover la tabla a esa área");
      meta.area = body.area.trim();
    }
    await db.saveDatasets(all);
    await db.log(user.email, `Tabla «${meta.name}» actualizada`);
    return json({ dataset: meta });
  }
  if (method === "DELETE") {
    if (await hasRowFilterOn(user, meta)) throw new HttpError(403, "No puedes borrar una tabla que solo ves en parte");
    await deleteRows(id, meta.chunkCount);
    await db.saveDatasets(all.filter((d) => d.id !== id));
    await db.saveRelationships((await db.relationships()).filter((r) => r.fromDataset !== id && r.toDataset !== id));
    const der = await db.derived();
    const gone = new Set([id]);
    let changed = true;
    while (changed) {
      changed = false;
      for (const d of der) if (!gone.has(d.id) && gone.has(d.source)) (gone.add(d.id), (changed = true));
    }
    await db.saveDerived(der.filter((d) => !gone.has(d.id)));
    const reps = await db.reports();
    for (const k of gone) delete reps[k];
    await db.saveReports(reps);
    const srcs = await db.sources();
    await db.saveSources(srcs.map((s) => (s.datasetId === id ? { ...s, datasetId: null } : s)));
    await db.log(user.email, `Tabla «${meta.name}» borrada`);
    return json({ ok: true });
  }
  throw new HttpError(405, "Método no permitido");
}

// ---------- modelo ----------

async function relationships(user: StoredUser, method: string, body: { relationships: Relationship[] }) {
  if (method !== "PUT" || !isEditor(user)) throw new HttpError(403, "Sin permiso");
  // Las relaciones deciden qué filas ve cada persona: quien tiene acceso parcial no puede tocarlas
  if (user.role !== "admin" && user.rowFilters.length) throw new HttpError(403, "Tu acceso está limitado por filas; pide a administración que cambie las relaciones");
  const visible = new Set((await visibleDatasets(user)).map((d) => d.id));
  const mine = (r: Relationship) => visible.has(r.fromDataset) && visible.has(r.toDataset);
  const incoming = (body.relationships ?? []).filter(mine);
  const kept = (await db.relationships()).filter((r) => !mine(r));
  await db.saveRelationships([...kept, ...incoming]);
  return json({ ok: true });
}

async function derived(user: StoredUser, method: string, id: string, body: DerivedTable) {
  const list = await db.derived();
  const existing = list.find((d) => d.id === id);
  if (existing && !canEditArea(user, existing.area)) throw new HttpError(403, "Sin permiso en esta área");
  if (method === "PUT") {
    if (!canEditArea(user, body.area)) throw new HttpError(403, "Sin permiso en esa área");
    const spec: DerivedTable = { ...body, id: existing ? id : newId("dt"), updatedAt: new Date().toISOString() };
    if (spec.source === spec.id) throw new HttpError(400, "Una tabla no puede salir de sí misma");
    const next = existing ? list.map((d) => (d.id === id ? spec : d)) : [...list, spec];
    await db.saveDerived(next);
    await db.log(user.email, `Tabla derivada «${spec.name}» guardada`);
    return json({ derived: spec });
  }
  if (method === "DELETE" && existing) {
    await db.saveDerived(list.filter((d) => d.id !== id));
    const reps = await db.reports();
    delete reps[id];
    await db.saveReports(reps);
    await db.log(user.email, `Tabla derivada «${existing.name}» borrada`);
    return json({ ok: true });
  }
  throw new HttpError(404, "No encontrada");
}

async function targetArea(id: string): Promise<string | null> {
  if (id.startsWith("ds_")) return (await db.datasets()).find((d) => d.id === id)?.area ?? null;
  return (await db.derived()).find((d) => d.id === id)?.area ?? null;
}

async function reports(user: StoredUser, method: string, id: string, body: ReportSpec) {
  const area = await targetArea(id);
  if (area === null) throw new HttpError(404, "Tabla no encontrada");
  if (!canEditArea(user, area)) throw new HttpError(403, "Sin permiso en esta área");
  const reps = await db.reports();
  if (method === "PUT") {
    reps[id] = { ...body, targetId: id, auto: false, updatedAt: new Date().toISOString() };
    await db.saveReports(reps);
    await db.log(user.email, `Informe «${body.title}» guardado`);
    return json({ report: reps[id] });
  }
  if (method === "DELETE") {
    delete reps[id];
    await db.saveReports(reps);
    return json({ ok: true });
  }
  throw new HttpError(405, "Método no permitido");
}

async function master(user: StoredUser, method: string, body: MasterSpec) {
  if (method !== "PUT" || !isEditor(user)) throw new HttpError(403, "Sin permiso");
  const current = await db.master();
  // Quien no ve todas las áreas no puede quitar del maestro lo que no ve
  let items = body.items;
  if (items && current.items && user.role !== "admin" && !user.areas.includes("*")) {
    const visible = new Set([...(await visibleDatasets(user)).map((d) => d.id), ...(await db.derived()).filter((d) => canSeeArea(user, d.area)).map((d) => d.id)]);
    items = [...items.filter((i) => visible.has(i.targetId)), ...current.items.filter((i) => !visible.has(i.targetId))];
  }
  await db.saveMaster({ title: String(body.title || "Informe maestro"), subtitle: String(body.subtitle ?? ""), items });
  await db.log(user.email, "Informe maestro actualizado");
  return json({ ok: true });
}

// ---------- usuarios ----------

async function users(user: StoredUser, method: string, id: string, body: any) {
  if (user.role !== "admin") throw new HttpError(403, "Solo administración");
  const list = await db.users();
  if (method === "GET") return json({ users: list.map(toPublic) });
  const clean = (b: any) => ({
    name: String(b.name ?? "").trim(),
    role: ROLES.includes(b.role) ? (b.role as Role) : "viewer",
    areas: Array.isArray(b.areas) ? b.areas.map(String).filter(Boolean) : [],
    rowFilters: Array.isArray(b.rowFilters)
      ? b.rowFilters
          .map((f: any) => ({ column: String(f.column ?? "").trim(), values: (f.values ?? []).map((v: unknown) => String(v).trim()).filter(Boolean) }))
          .filter((f: any) => f.column && f.values.length)
      : [],
  });
  if (method === "POST") {
    const email = normEmail(body.email);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new HttpError(400, "Correo no válido");
    if (list.some((u) => u.email === email)) throw new HttpError(409, "Ya existe un usuario con ese correo");
    validatePassword(body.password);
    const u: StoredUser = { id: newId("u"), email, ...clean(body), ...hashPassword(body.password) };
    await db.saveUsers([...list, u]);
    await db.log(user.email, `Usuario ${email} creado (${u.role})`);
    return json({ user: toPublic(u) });
  }
  const target = list.find((u) => u.id === id);
  if (!target) throw new HttpError(404, "Usuario no encontrado");
  const admins = list.filter((u) => u.role === "admin");
  if (method === "PATCH") {
    const next = clean({ ...toPublic(target), ...body });
    if (target.role === "admin" && next.role !== "admin" && admins.length === 1) throw new HttpError(400, "Debe quedar al menos una persona administradora");
    Object.assign(target, next);
    if (body.password) {
      validatePassword(body.password);
      Object.assign(target, hashPassword(body.password));
    }
    await db.saveUsers(list);
    await db.log(user.email, `Usuario ${target.email} actualizado`);
    return json({ user: toPublic(target) });
  }
  if (method === "DELETE") {
    if (target.id === user.id) throw new HttpError(400, "No puedes borrar tu propio usuario");
    await db.saveUsers(list.filter((u) => u.id !== id));
    await db.log(user.email, `Usuario ${target.email} borrado`);
    return json({ ok: true });
  }
  throw new HttpError(405, "Método no permitido");
}

// ---------- fuentes automáticas ----------

async function sources(user: StoredUser, method: string, id: string, action: string, body: Source) {
  if (!isEditor(user)) throw new HttpError(403, "Sin permiso");
  const list = await db.sources();
  const existing = list.find((s) => s.id === id);
  if (existing && !canEditArea(user, existing.area)) throw new HttpError(403, "Sin permiso en esta área");
  if (method === "POST" && action === "run" && existing) {
    const updated = await runSource(existing);
    await db.saveSources((await db.sources()).map((s) => (s.id === id ? updated : s)));
    return json({ source: updated });
  }
  if (method === "PUT") {
    try {
      new URL(body.url);
    } catch {
      throw new HttpError(400, "El enlace no es válido");
    }
    const area = String(body.area || "General").trim();
    if (!canEditArea(user, area)) throw new HttpError(403, "Sin permiso en esa área");
    if (body.datasetId) {
      const ds = (await db.datasets()).find((d) => d.id === body.datasetId);
      if (!ds || !canEditArea(user, ds.area) || (await hasRowFilterOn(user, ds))) throw new HttpError(403, "No puedes cargar datos en esa tabla");
    }
    const src: Source = {
      id: existing ? existing.id : newId("src"),
      name: String(body.name || "Fuente").trim(),
      url: body.url.trim(),
      datasetId: body.datasetId || null,
      area,
      everyHours: Math.min(168, Math.max(1, Number(body.everyHours) || 24)),
      lastRun: existing?.lastRun ?? null,
      lastStatus: existing?.lastStatus ?? null,
      lastMessage: existing?.lastMessage ?? "",
    };
    await db.saveSources(existing ? list.map((s) => (s.id === id ? src : s)) : [...list, src]);
    await db.log(user.email, `Fuente automática «${src.name}» guardada`);
    return json({ source: src });
  }
  if (method === "DELETE" && existing) {
    await db.saveSources(list.filter((s) => s.id !== id));
    return json({ ok: true });
  }
  throw new HttpError(404, "No encontrada");
}

// ---------- API de carga ----------

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

async function apiKey(user: StoredUser, method: string) {
  if (user.role !== "admin" || method !== "POST") throw new HttpError(403, "Solo administración");
  const key = `pi_${randomBytes(24).toString("base64url")}`;
  await db.saveSettings({ ...(await db.settings()), apiKeyHash: sha(key) });
  await db.log(user.email, "Clave de API regenerada");
  return json({ key });
}

async function ingestApi(req: Request, url: URL) {
  const settings = await db.settings();
  const key = req.headers.get("x-api-key") ?? "";
  const ok = settings.apiKeyHash && key && timingSafeEqual(Buffer.from(sha(key)), Buffer.from(settings.apiKeyHash));
  if (!ok) throw new HttpError(401, "Clave de API incorrecta");
  const fileName = decodeURIComponent(req.headers.get("x-file-name") ?? url.searchParams.get("file") ?? "api.xlsx");
  const datasetId = url.searchParams.get("dataset");
  const area = url.searchParams.get("area") ?? "General";
  const bytes = new Uint8Array(await req.arrayBuffer());
  if (!bytes.length) throw new HttpError(400, "No se ha recibido ningún archivo");
  if (datasetId && !(await db.datasets()).some((d) => d.id === datasetId)) throw new HttpError(404, "La tabla indicada no existe");
  const msg = await ingestFile(bytes, fileName, { datasetId, area }, "API");
  return json({ ok: true, message: msg });
}

