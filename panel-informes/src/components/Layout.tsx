import { useState, type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { api } from "../api.ts";
import { canEdit, useApp, useBoot } from "../store.tsx";

const ROLE_LABEL = { admin: "Administración", editor: "Edición", viewer: "Lectura" } as const;

function Item({ to, children, end }: { to: string; children: ReactNode; end?: boolean }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `block truncate rounded-md px-3 py-1.5 text-sm transition ${isActive ? "bg-brand-50 font-medium text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`
      }
    >
      {children}
    </NavLink>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const boot = useBoot();
  const { refresh } = useApp();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const user = boot.user!;
  const byArea = new Map<string, { id: string; name: string; derived: boolean }[]>();
  for (const d of boot.datasets) (byArea.get(d.area) ?? byArea.set(d.area, []).get(d.area)!).push({ id: d.id, name: d.name, derived: false });
  for (const d of boot.derived) (byArea.get(d.area) ?? byArea.set(d.area, []).get(d.area)!).push({ id: d.id, name: d.name, derived: true });
  const areas = [...byArea.keys()].sort((a, b) => a.localeCompare(b, "es"));

  const logout = async () => {
    await api("logout", { method: "POST", body: {} });
    await refresh();
    nav("/");
  };

  const sidebar = (
    <nav className="flex h-full flex-col gap-5 overflow-y-auto p-4" onClick={() => setOpen(false)}>
      <div className="flex items-center gap-2 px-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-white">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="12" width="4" height="9" rx="1" /><rect x="10" y="7" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="18" rx="1" /></svg>
        </div>
        <span className="font-semibold text-slate-900">Panel de informes</span>
      </div>
      <div className="space-y-0.5">
        <Item to="/" end>
          Informe maestro
        </Item>
      </div>
      {areas.length > 0 && (
        <div>
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Informes</p>
          {areas.map((a) => (
            <div key={a} className="mb-2">
              <p className="px-3 py-1 text-xs font-medium text-slate-500">{a}</p>
              {byArea.get(a)!.map((t) => (
                <Item key={t.id} to={`/informe/${t.id}`}>
                  {t.derived ? "↳ " : ""}
                  {t.name}
                </Item>
              ))}
            </div>
          ))}
        </div>
      )}
      <div className="space-y-0.5">
        <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Gestión</p>
        {canEdit(boot) && <Item to="/datos">Datos y cargas</Item>}
        {canEdit(boot) && <Item to="/modelo">Relaciones y tablas</Item>}
        {user.role === "admin" && <Item to="/usuarios">Usuarios y roles</Item>}
        <Item to="/cuenta">Mi cuenta</Item>
      </div>
      <div className="mt-auto rounded-lg border border-slate-200 p-3 text-xs">
        <p className="truncate font-medium text-slate-800">{user.name || user.email}</p>
        <p className="truncate text-slate-500">{user.email}</p>
        <p className="mt-1 text-slate-500">{ROLE_LABEL[user.role]}</p>
        <button onClick={logout} className="mt-2 text-brand-700 hover:underline">
          Cerrar sesión
        </button>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="sticky top-0 hidden h-screen border-r border-slate-200 bg-white lg:block">{sidebar}</aside>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <span className="font-semibold">Panel de informes</span>
        <button className="btn btn-ghost px-2.5 py-1.5" onClick={() => setOpen(!open)} aria-label="Menú">
          ☰
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 bg-white" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </aside>
        </div>
      )}
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
