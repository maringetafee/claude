import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Reveal } from "./Reveal";

function encode(data: Record<string, string>) {
  return Object.keys(data)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");
}

export function Contact() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || sending) return;
    setSending(true);
    setError(false);
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: encode({ "form-name": "contacto", email }),
      });
      if (!res.ok) throw new Error("submit failed");
      setSent(true);
      fetch("/.netlify/functions/notify-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => {});
    } catch {
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      id="contacto"
      className="relative overflow-hidden px-6 py-28 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
        <div className="h-[50vmin] w-[50vmin] rounded-full bg-[radial-gradient(circle,rgba(0,191,255,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-xl text-center">
        <Reveal>
          <p className="mb-4 text-xs tracking-[0.35em] text-iris uppercase">
            Último paso
          </p>
          <h2 className="font-display text-balance text-4xl text-marble sm:text-5xl">
            Hablemos de tu web
          </h2>
          <p className="mt-5 text-stone">
            Cuéntanos qué necesitas y te devolvemos un presupuesto claro en
            menos de 24 horas.
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.form
                key="form"
                exit={{ opacity: 0, scale: 0.96 }}
                onSubmit={handleSubmit}
                name="contacto"
                data-netlify="true"
                netlify-honeypot="bot-field"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <label className="hidden">
                    No rellenar
                    <input name="bot-field" tabIndex={-1} autoComplete="off" />
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full flex-1 rounded-full border border-marble/20 bg-marble/[0.03] px-6 py-4 text-marble placeholder:text-stone/60 transition-colors focus:border-iris/60 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris"
                  />
                  <button
                    type="submit"
                    disabled={sending}
                    className="shrink-0 cursor-pointer rounded-full bg-iris px-8 py-4 text-sm tracking-wide text-charcoal transition-transform hover:scale-[1.03] disabled:cursor-wait disabled:opacity-60"
                  >
                    {sending ? "Enviando…" : "Pide tu presupuesto"}
                  </button>
                </div>
                <p className="mt-4 text-xs text-stone/70">
                  Te contestamos en menos de 24 horas.
                </p>
                {error && (
                  <p className="mt-3 text-xs text-gold">
                    No se ha podido enviar. Escríbenos directamente a{" "}
                    <a href="mailto:makemyweb@gmail.com" className="underline">
                      makemyweb@gmail.com
                    </a>
                    .
                  </p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="sent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-4 rounded-2xl border border-iris/30 bg-iris/5 px-8 py-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 14 }}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-iris text-charcoal"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <p className="font-display text-xl text-marble">Enviado</p>
                <p className="text-sm text-stone">
                  Te escribiremos a {email} en menos de 24 horas.
                </p>
                <p className="max-w-sm text-xs text-stone/70">
                  Te hemos enviado ya un correo a {email} con todos los
                  detalles. Si no lo ves, revisa la carpeta de spam.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>

        <Reveal delay={0.25} className="mt-10">
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <a
              href="mailto:makemyweb@gmail.com"
              className="flex items-center gap-2 text-sm text-stone transition-colors hover:text-marble"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 5h18v14H3V5Zm0 0l9 7 9-7"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              makemyweb@gmail.com
            </a>
            <a
              href="tel:+34689872320"
              className="flex items-center gap-2 text-sm text-stone transition-colors hover:text-marble"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.4 21 3 14.6 3 6a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              689 87 23 20
            </a>
            <a
              href="tel:+34644434860"
              className="flex items-center gap-2 text-sm text-stone transition-colors hover:text-marble"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.4 21 3 14.6 3 6a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              644 43 48 60
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
