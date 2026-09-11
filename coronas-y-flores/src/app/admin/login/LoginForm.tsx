"use client";

import { useActionState } from "react";
import { signIn, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(signIn, null);
  return (
    <form action={action} className="adm-form">
      {state?.error && (
        <div className="adm-alert" role="alert">
          {state.error}
        </div>
      )}
      <label className="adm-field">
        <span>Email</span>
        <input className="adm-input" name="email" type="email" autoComplete="username" required autoFocus />
      </label>
      <label className="adm-field">
        <span>Contraseña</span>
        <input className="adm-input" name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="adm-btn adm-btn--primary" type="submit" disabled={pending} style={{ minHeight: 46 }}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
