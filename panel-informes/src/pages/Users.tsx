import { useEffect, useState } from "react";
import type { Role, RowFilter, UserPublic } from "../../shared/types.ts";
import { api } from "../api.ts";
import { useBoot } from "../store.tsx";
import { Alert, Badge, PageHeader, Section, Spinner } from "../components/ui.tsx";

const ROLE_INFO: Record<Role, { label: string; text: string }> = {
  admin: { label: "Administración", text: "Todo: usuarios, datos, informes y todas las áreas." },
  editor: { label: "Edición", text: "Sube datos y personaliza informes de sus áreas." },
  viewer: { label: "Lectura", text: "Solo ve los informes de sus áreas." },
};

type Draft = UserPublic & { password: string };
const empty = (): Draft => ({ id: "", email: "", name: "", role: "viewer", areas: [], rowFilters: [], password: "" });

export function UsersPage() {
  const boot = useBoot();
  const [users, setUsers] = useState<UserPublic[] | null>(null);
  const [edit, setEdit] = useState<Draft | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const load = async () => setUsers((await api<{ users: UserPublic[] }>("users")).users);
  useEffect(() => {
    load().catch((e) => setErr(e.message));
  }, []);

  const save = async () => {
    if (!edit) return;
    setErr(null);
    try {
      const body = { ...edit, password: edit.password || undefined };
      if (edit.id) await api(`users/${edit.id}`, { method: "PATCH", body });
      else await api("users", { method: "POST", body });
      setEdit(null);
      await load();
    } catch (e) {
      setErr((e as Error).message);
    }
  };
  const remove = async (u: UserPublic) => {
    if (!confirm(`¿Borrar el acceso de ${u.email}?`)) return;
    try {
      await api(`users/${u.id}`, { method: "DELETE" });
      await load();
    } catch (e) {
      setErr((e as Error).message);
    }
  };

  const allCols = [...new Set(boot.datasets.flatMap((d) => d.columns.filter((c) => c.type === "text" && c.name !== "Archivo").map((c) => c.name)))].sort();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuarios y roles"
        subtitle="Cada persona ve solo las áreas que le asignes. Con «ver solo filas» puedes limitarla, por ejemplo, a su zona o su delegación."
        actions={!edit ? <button className="btn btn-primary" onClick={() => setEdit(empty())}>+ Nuevo usuario</button> : null}
      />
      {err && <Alert kind="error">{err}</Alert>}

      {edit && (
        <Section title={edit.id ? `Editar ${edit.email}` : "Nuevo usuario"}>
          <div className="grid gap-3 md:grid-cols-2">
            <div><label className="label">Nombre</label><input className="input" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
            <div><label className="label">Correo</label><input className="input" type="email" value={edit.email} disabled={!!edit.id} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></div>
            <div>
              <label className="label">{edit.id ? "Nueva contraseña (vacío = no cambiar)" : "Contraseña inicial (mín. 8)"}</label>
              <input className="input" type="text" autoComplete="new-password" value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} />
            </div>
            <div>
              <label className="label">Rol</label>
              <select className="input" value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value as Role })}>
                {(Object.keys(ROLE_INFO) as Role[]).map((r) => <option key={r} value={r}>{ROLE_INFO[r].label} — {ROLE_INFO[r].text}</option>)}
              </select>
            </div>
          </div>
          {edit.role !== "admin" && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="label">Áreas que puede ver</p>
                <label className="mb-1 flex items-center gap-2 text-sm">
                  <input type="checkbox" className="accent-brand-600" checked={edit.areas.includes("*")} onChange={(e) => setEdit({ ...edit, areas: e.target.checked ? ["*"] : [] })} /> Todas (también las que se creen)
                </label>
                {!edit.areas.includes("*") && (
                  <>
                    {boot.areas.map((a) => (
                      <label key={a} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="accent-brand-600" checked={edit.areas.includes(a)} onChange={() => setEdit({ ...edit, areas: edit.areas.includes(a) ? edit.areas.filter((x) => x !== a) : [...edit.areas, a] })} /> {a}
                      </label>
                    ))}
                    <input className="input mt-2" placeholder="Otra área (escribe y pulsa Intro)" onKeyDown={(e) => {
                      const v = (e.target as HTMLInputElement).value.trim();
                      if (e.key === "Enter" && v) { e.preventDefault(); setEdit({ ...edit, areas: [...new Set([...edit.areas, v])] }); (e.target as HTMLInputElement).value = ""; }
                    }} />
                    {edit.areas.filter((a) => !boot.areas.includes(a)).map((a) => <span key={a} className="mr-1"><Badge>{a}</Badge></span>)}
                  </>
                )}
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <p className="label mb-0">Ver solo filas donde… (opcional)</p>
                  <button className="text-xs text-brand-700 hover:underline" onClick={() => setEdit({ ...edit, rowFilters: [...edit.rowFilters, { column: allCols[0] ?? "", values: [] }] })}>+ Condición</button>
                </div>
                {edit.rowFilters.map((f, i) => (
                  <div key={i} className="mb-2 grid grid-cols-[1fr_1.3fr_auto] gap-2">
                    <input className="input" list="cols-users" value={f.column} onChange={(e) => setEdit({ ...edit, rowFilters: edit.rowFilters.map((x, n): RowFilter => (n === i ? { ...x, column: e.target.value } : x)) })} />
                    <input className="input" placeholder="Valores separados por comas" value={f.values.join(", ")} onChange={(e) => setEdit({ ...edit, rowFilters: edit.rowFilters.map((x, n) => (n === i ? { ...x, values: e.target.value.split(",").map((v) => v.trim()) } : x)) })} />
                    <button className="btn btn-danger" onClick={() => setEdit({ ...edit, rowFilters: edit.rowFilters.filter((_, n) => n !== i) })}>×</button>
                  </div>
                ))}
                <datalist id="cols-users">{allCols.map((c) => <option key={c} value={c} />)}</datalist>
                <p className="text-xs text-slate-500">Se aplica en el servidor a cualquier tabla que tenga esa columna: la persona no recibe las demás filas.</p>
              </div>
            </div>
          )}
          <div className="mt-4 flex gap-2">
            <button className="btn btn-primary" onClick={save}>Guardar</button>
            <button className="btn btn-ghost" onClick={() => setEdit(null)}>Cancelar</button>
          </div>
        </Section>
      )}

      {!users ? (
        <Spinner />
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead><tr><th className="th">Persona</th><th className="th">Rol</th><th className="th">Áreas</th><th className="th">Solo filas</th><th className="th" /></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="td"><p className="font-medium">{u.name || "—"}</p><p className="text-xs text-slate-500">{u.email}</p></td>
                  <td className="td"><Badge tone={u.role === "admin" ? "brand" : u.role === "editor" ? "green" : "slate"}>{ROLE_INFO[u.role].label}</Badge></td>
                  <td className="td text-sm">{u.role === "admin" || u.areas.includes("*") ? "Todas" : u.areas.join(", ") || <span className="text-red-600">Ninguna</span>}</td>
                  <td className="td text-xs text-slate-600">{u.rowFilters.map((f) => `${f.column}: ${f.values.join(", ")}`).join(" · ") || "—"}</td>
                  <td className="td text-right text-xs">
                    <button className="mr-3 text-slate-600 hover:underline" onClick={() => setEdit({ ...u, password: "" })}>Editar</button>
                    {u.id !== boot.user!.id && <button className="text-red-600 hover:underline" onClick={() => remove(u)}>Borrar</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
