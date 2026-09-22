"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import {
  changeCustomerPassword,
  registerCustomer,
  requestPasswordReset,
  resetPassword,
  signInCustomer,
  updateProfile,
  type FormState,
} from "./actions";

function Status({ state }: { state: FormState }) {
  if (!state) return null;
  if (state.error)
    return (
      <div className="alert" role="alert">
        {state.error}
      </div>
    );
  if (state.ok)
    return (
      <div className="alert alert--info" role="status">
        {state.ok}
      </div>
    );
  return null;
}

function PasswordInput({ name, autoComplete, label, hint }: { name: string; autoComplete: string; label: string; hint?: string }) {
  const [show, setShow] = useState(false);
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <span className="pw">
        <input className="input" name={name} type={show ? "text" : "password"} autoComplete={autoComplete} required minLength={autoComplete === "current-password" ? 1 : 8} />
        <button type="button" className="pw__toggle" onClick={() => setShow((v) => !v)} aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}>
          {show ? "Ocultar" : "Ver"}
        </button>
      </span>
      {hint && <span className="field__hint">{hint}</span>}
    </label>
  );
}

export function AuthPanel({ mode, next }: { mode: "entrar" | "registro"; next: string }) {
  const [tab, setTab] = useState(mode);
  const [loginState, loginAction, loginPending] = useActionState<FormState, FormData>(signInCustomer, null);
  const [regState, regAction, regPending] = useActionState<FormState, FormData>(registerCustomer, null);

  return (
    <div className="auth">
      <div className="auth__tabs" role="tablist" aria-label="Acceso">
        <button type="button" role="tab" aria-selected={tab === "entrar"} className={tab === "entrar" ? "is-active" : undefined} onClick={() => setTab("entrar")}>
          Iniciar sesión
        </button>
        <button type="button" role="tab" aria-selected={tab === "registro"} className={tab === "registro" ? "is-active" : undefined} onClick={() => setTab("registro")}>
          Crear cuenta
        </button>
      </div>

      {tab === "entrar" ? (
        <form action={loginAction} className="auth__form" key="entrar">
          <Status state={loginState} />
          <input type="hidden" name="next" value={next} />
          <label className="field">
            <span className="field__label">Email</span>
            <input className="input" name="email" type="email" autoComplete="email" required />
          </label>
          <PasswordInput name="password" autoComplete="current-password" label="Contraseña" />
          <button type="submit" className="btn btn--solid btn--lg btn--block" disabled={loginPending}>
            {loginPending ? "Entrando…" : "Entrar"}
          </button>
          <p className="auth__alt">
            <Link href="/cuenta/recuperar">¿Has olvidado tu contraseña?</Link>
          </p>
        </form>
      ) : (
        <form action={regAction} className="auth__form" key="registro">
          <Status state={regState} />
          <input type="hidden" name="next" value={next === "/cuenta" ? "" : next} />
          <div className="auth__hp" aria-hidden="true">
            <label>
              Web
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <label className="field">
            <span className="field__label">Nombre y apellidos</span>
            <input className="input" name="name" autoComplete="name" required minLength={2} />
          </label>
          <div className="form-grid">
            <label className="field">
              <span className="field__label">Email</span>
              <input className="input" name="email" type="email" autoComplete="email" required />
            </label>
            <label className="field">
              <span className="field__label">Teléfono (opcional)</span>
              <input className="input" name="phone" type="tel" autoComplete="tel" />
            </label>
          </div>
          <PasswordInput name="password" autoComplete="new-password" label="Contraseña" hint="Mínimo 8 caracteres." />
          <label className="check">
            <input type="checkbox" name="accept" required />
            <span>
              He leído la{" "}
              <Link href="/legal/privacidad" target="_blank">
                política de privacidad
              </Link>
              .
            </span>
          </label>
          <button type="submit" className="btn btn--solid btn--lg btn--block" disabled={regPending}>
            {regPending ? "Creando tu cuenta…" : "Crear cuenta"}
          </button>
          <p className="auth__alt">Con tu cuenta ves tus pedidos y compras más rápido: guardamos tus datos de entrega.</p>
        </form>
      )}
    </div>
  );
}

export function RecoverForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(requestPasswordReset, null);
  return (
    <form action={action} className="auth__form">
      <Status state={state} />
      <label className="field">
        <span className="field__label">Email de tu cuenta</span>
        <input className="input" name="email" type="email" autoComplete="email" required />
      </label>
      <button type="submit" className="btn btn--solid btn--lg btn--block" disabled={pending}>
        {pending ? "Enviando…" : "Enviarme un enlace"}
      </button>
      <p className="auth__alt">
        <Link href="/cuenta/entrar">← Volver a iniciar sesión</Link>
      </p>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(resetPassword, null);
  return (
    <form action={action} className="auth__form">
      <Status state={state} />
      <input type="hidden" name="token" value={token} />
      <PasswordInput name="next" autoComplete="new-password" label="Contraseña nueva" hint="Mínimo 8 caracteres." />
      <PasswordInput name="confirm" autoComplete="new-password" label="Repítela" />
      <button type="submit" className="btn btn--solid btn--lg btn--block" disabled={pending}>
        {pending ? "Guardando…" : "Guardar contraseña"}
      </button>
      {state?.error && (
        <p className="auth__alt">
          <Link href="/cuenta/recuperar">Pedir un enlace nuevo</Link>
        </p>
      )}
    </form>
  );
}

export type ProfileValues = { name: string; phone: string; address: string; postal_code: string; city: string };

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfile, null);
  return (
    <form action={action} className="auth__form">
      <div className="form-grid">
        <label className="field">
          <span className="field__label">Nombre y apellidos</span>
          <input className="input" name="name" autoComplete="name" required defaultValue={initial.name} />
        </label>
        <label className="field">
          <span className="field__label">Teléfono</span>
          <input className="input" name="phone" type="tel" autoComplete="tel" defaultValue={initial.phone} />
        </label>
        <label className="field span-2">
          <span className="field__label">Dirección de entrega habitual</span>
          <input className="input" name="address" autoComplete="street-address" defaultValue={initial.address} placeholder="Calle, número, piso" />
        </label>
        <label className="field">
          <span className="field__label">Código postal</span>
          <input className="input" name="postal_code" inputMode="numeric" maxLength={5} pattern="\d{5}" autoComplete="postal-code" defaultValue={initial.postal_code} />
        </label>
        <label className="field">
          <span className="field__label">Localidad</span>
          <input className="input" name="city" autoComplete="address-level2" defaultValue={initial.city} />
        </label>
      </div>
      <Status state={state} />
      <button type="submit" className="btn btn--ink" disabled={pending} style={{ justifySelf: "start" }}>
        {pending ? "Guardando…" : "Guardar datos"}
      </button>
    </form>
  );
}

export function PasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(changeCustomerPassword, null);
  return (
    <form action={action} className="auth__form">
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <PasswordInput name="current" autoComplete="current-password" label="Contraseña actual" />
      <div className="form-grid">
        <PasswordInput name="next" autoComplete="new-password" label="Nueva" hint="Mínimo 8 caracteres." />
        <PasswordInput name="confirm" autoComplete="new-password" label="Repite la nueva" />
      </div>
      <Status state={state} />
      <button type="submit" className="btn btn--ghost" disabled={pending} style={{ justifySelf: "start" }}>
        {pending ? "Cambiando…" : "Cambiar contraseña"}
      </button>
    </form>
  );
}
