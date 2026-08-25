import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contacta con Toldos Getafe: fabricación e instalación de toldos y pérgolas a medida en Fuenlabrada, Madrid, para particulares e instaladores profesionales.",
};

const inputClasses =
  "peer w-full border-0 border-b border-paper/25 bg-transparent px-0 py-3 text-paper placeholder-transparent outline-none transition-colors focus:border-accent-soft";
const labelClasses =
  "pointer-events-none absolute left-0 top-3 text-paper/50 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-accent-soft peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs";

export default function ContactoPage() {
  return (
    <main id="main" className="px-6 pb-20 pt-32 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-2xl [text-shadow:0_2px_20px_rgba(0,0,0,0.55)]">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
            Contacto
          </p>
          <h1 className="mt-4 font-display text-4xl leading-[1.05] text-paper sm:text-5xl lg:text-6xl">
            ¿Hablamos de tu proyecto?
          </h1>
          <p className="mt-6 text-paper/80">
            En Toldos Getafe estamos aquí para atender a todas tus
            necesidades, ya seas un particular que busca fabricación e
            instalación de toldos y pérgolas, o un instalador profesional
            que necesita encargar productos de alta calidad para tus
            proyectos.
          </p>
          <p className="mt-4 text-paper/70">
            Llámanos, envíanos un correo electrónico o rellena el
            formulario y te responderemos a la mayor brevedad posible.
          </p>
        </div>

        <div className="mt-16 grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div className="text-paper">
            <div className="space-y-3 text-lg">
              <a
                href={siteConfig.phone.href}
                className="block transition-colors hover:text-accent-soft"
              >
                {siteConfig.phone.display}
              </a>
              <a
                href={siteConfig.mobile.href}
                className="block transition-colors hover:text-accent-soft"
              >
                {siteConfig.mobile.display}
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block transition-colors hover:text-accent-soft"
              >
                {siteConfig.email}
              </a>
              <p className="text-paper/60">{siteConfig.address.line}</p>
            </div>

            <div className="mt-10 space-y-6 rounded-2xl border border-white/10 bg-ink/35 p-6 backdrop-blur-md">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">
                  Particulares
                </p>
                <p className="mt-2 text-sm text-paper/75">
                  Servicio completo de fabricación a medida e instalación
                  profesional para tu hogar.
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent-soft">
                  Instaladores profesionales
                </p>
                <p className="mt-2 text-sm text-paper/75">
                  Fabricación de productos personalizados y de alta
                  calidad, adaptados a las especificaciones de tus
                  proyectos.
                </p>
              </div>
            </div>
          </div>

          <form
            name="contacto"
            method="POST"
            action="/gracias/"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="flex flex-col gap-5"
          >
            <input type="hidden" name="form-name" value="contacto" />
            <p className="hidden">
              <label>
                No rellenar: <input name="bot-field" />
              </label>
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="relative">
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  placeholder=" "
                  className={inputClasses}
                />
                <label htmlFor="nombre" className={labelClasses}>
                  Nombre
                </label>
              </div>
              <div className="relative">
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  placeholder=" "
                  className={inputClasses}
                />
                <label htmlFor="telefono" className={labelClasses}>
                  Teléfono
                </label>
              </div>
            </div>

            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder=" "
                className={inputClasses}
              />
              <label htmlFor="email" className={labelClasses}>
                Correo
              </label>
            </div>

            <div className="relative">
              <select
                id="tipo"
                name="tipo"
                defaultValue=""
                required
                className="w-full appearance-none border-0 border-b border-paper/25 bg-transparent px-0 py-3 text-paper outline-none transition-colors focus:border-accent-soft [&>option]:text-ink"
              >
                <option value="" disabled>
                  Selecciona una opción
                </option>
                <option value="Particular">Particular</option>
                <option value="Instalador profesional">
                  Instalador profesional
                </option>
              </select>
              <label className="mt-1 block text-xs text-paper/50">
                Particular o profesional
              </label>
            </div>

            <div className="relative">
              <textarea
                id="consulta"
                name="consulta"
                rows={4}
                required
                placeholder=" "
                className={`${inputClasses} resize-none`}
              />
              <label htmlFor="consulta" className={labelClasses}>
                Cuéntanos tu proyecto
              </label>
            </div>

            <div className="space-y-3 text-xs text-paper/60">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="acepta_privacidad"
                  required
                  className="mt-0.5 accent-accent"
                />
                <span>
                  He leído y acepto la{" "}
                  <a
                    href="/politica-de-privacidad/"
                    className="underline underline-offset-2 hover:text-accent-soft"
                  >
                    Política de Privacidad
                  </a>{" "}
                  de Toldos Getafe.
                </span>
              </label>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="acepta_marketing"
                  className="mt-0.5 accent-accent"
                />
                <span>
                  Acepto recibir información comercial por correo
                  electrónico o teléfono.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 w-fit bg-accent px-8 py-3.5 text-sm font-medium text-paper transition-colors hover:bg-accent-soft"
            >
              Solicitar presupuesto
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
