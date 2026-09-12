"use client";

import { useState, useTransition } from "react";
import type { PanelUser } from "@/lib/admin/panel-users";
import { addPanelUser, changeMyPassword, removePanelUser } from "./access-actions";

type Msg = { ok: boolean; text: string } | null;

const dateFmt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Madrid",
});

// Sin caracteres que se confunden al dictarla (0/O, 1/l/I)
function generatePassword() {
  const chars = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint32Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

function Feedback({ msg }: { msg: Msg }) {
  if (!msg) return null;
  return (
    <span className={`adm-alert${msg.ok ? " adm-alert--ok" : ""}`} role="status">
      {msg.text}
    </span>
  );
}

function PasswordCard({ email }: { email: string }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="adm-card"
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        startTransition(async () => {
          const res = await changeMyPassword({ current, next, confirm });
          if (res.ok) {
            setCurrent("");
            setNext("");
            setConfirm("");
            setMsg({ ok: true, text: res.message });
          } else {
            setMsg({ ok: false, text: res.error });
          }
        });
      }}
    >
      <h2>
        Tu contraseña <small>{email}</small>
      </h2>
      {/* Para que el gestor de contraseñas del navegador sepa a qué cuenta pertenece */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <div className="adm-grid-3">
        <label className="adm-field">
          <span>Contraseña actual</span>
          <input className="adm-input" type="password" autoComplete="current-password" required value={current} onChange={(e) => setCurrent(e.target.value)} />
        </label>
        <label className="adm-field">
          <span>Contraseña nueva</span>
          <input className="adm-input" type="password" autoComplete="new-password" required minLength={8} value={next} onChange={(e) => setNext(e.target.value)} />
          <span className="adm-hint">Mínimo 8 caracteres.</span>
        </label>
        <label className="adm-field">
          <span>Repite la nueva</span>
          <input className="adm-input" type="password" autoComplete="new-password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
      </div>
      <div className="adm-row adm-row--end" style={{ marginTop: 16 }}>
        <Feedback msg={msg} />
        <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
          {pending ? "Cambiando…" : "Cambiar contraseña"}
        </button>
      </div>
    </form>
  );
}

function UsersCard({ users, usersError, meId }: { users: PanelUser[]; usersError: string | null; meId: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState<"add" | string | null>(null);
  const [pending, startTransition] = useTransition();

  function remove(u: PanelUser) {
    if (!window.confirm(`¿Quitar el acceso al panel a ${u.email}?\n\nSe borrará su usuario y ya no podrá entrar.`)) return;
    setMsg(null);
    setBusy(u.id);
    startTransition(async () => {
      const res = await removePanelUser(u.id);
      setBusy(null);
      setMsg(res.ok ? { ok: true, text: res.message } : { ok: false, text: res.error });
    });
  }

  return (
    <section className="adm-card">
      <h2>
        Usuarios del panel <small>{users.length === 1 ? "1 con acceso" : `${users.length} con acceso`}</small>
      </h2>

      {usersError ? (
        <div className="adm-alert">No se pudo cargar la lista de usuarios: {usersError}</div>
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Último acceso</th>
                <th aria-label="Acciones" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    {u.email} {u.id === meId && <span className="adm-badge">Tú</span>}
                  </td>
                  <td className="nowrap adm-muted">{u.lastSignInAt ? dateFmt.format(new Date(u.lastSignInAt)) : "Todavía no ha entrado"}</td>
                  <td className="num">
                    {u.id !== meId && (
                      <button type="button" className="adm-btn adm-btn--danger adm-btn--sm" disabled={pending} onClick={() => remove(u)}>
                        {busy === u.id ? "Quitando…" : "Quitar acceso"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <form
        style={{ marginTop: 22, paddingTop: 20, borderTop: "1px solid var(--line)" }}
        onSubmit={(e) => {
          e.preventDefault();
          setMsg(null);
          setBusy("add");
          const sentPassword = password;
          startTransition(async () => {
            const res = await addPanelUser({ email, password: sentPassword });
            setBusy(null);
            if (res.ok) {
              setEmail("");
              setPassword("");
              setMsg({
                ok: true,
                text: res.created ? `${res.message} Contraseña temporal: ${sentPassword} (cópiala ahora y pásasela).` : res.message,
              });
            } else {
              setMsg({ ok: false, text: res.error });
            }
          });
        }}
      >
        <h3 style={{ margin: "0 0 12px", fontSize: ".95rem", fontWeight: 600 }}>Dar acceso a otra persona</h3>
        <div className="adm-grid-2">
          <label className="adm-field">
            <span>Email</span>
            <input className="adm-input" type="email" required autoComplete="off" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nombre@correo.es" />
          </label>
          <div className="adm-field">
            <span>
              <label htmlFor="panel-user-password">Contraseña temporal</label>
            </span>
            <div className="adm-row" style={{ flexWrap: "nowrap" }}>
              <input
                id="panel-user-password"
                className="adm-input"
                type="text"
                required
                minLength={8}
                autoComplete="off"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="adm-btn" onClick={() => setPassword(generatePassword())}>
                Generar
              </button>
            </div>
            <span className="adm-hint">Pásasela en persona o por WhatsApp. Luego podrá cambiarla aquí, en «Tu contraseña».</span>
          </div>
        </div>
        <div className="adm-row adm-row--end" style={{ marginTop: 16 }}>
          <Feedback msg={msg} />
          <button type="submit" className="adm-btn adm-btn--primary" disabled={pending}>
            {busy === "add" ? "Dando acceso…" : "Dar acceso"}
          </button>
        </div>
      </form>
    </section>
  );
}

export function AccessManager({
  users,
  usersError,
  meId,
  meEmail,
}: {
  users: PanelUser[];
  usersError: string | null;
  meId: string;
  meEmail: string;
}) {
  return (
    <div className="adm-stack">
      <PasswordCard email={meEmail} />
      <UsersCard users={users} usersError={usersError} meId={meId} />
    </div>
  );
}
