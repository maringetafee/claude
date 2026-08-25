import { siteConfig } from "@/lib/site-config";

const inputClasses =
  "peer w-full border-0 border-b border-paper/25 bg-transparent px-0 py-3 text-paper placeholder-transparent outline-none transition-colors focus:border-accent-soft";
const labelClasses =
  "pointer-events-none absolute left-0 top-3 text-paper/50 transition-all peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-accent-soft peer-[:not(:placeholder-shown)]:-top-3.5 peer-[:not(:placeholder-shown)]:text-xs";

export default function ContactSection() {
  return (
    <div
      id="contacto"
      className="flex min-h-[100dvh] flex-col justify-center p-5 pt-24 text-paper sm:p-8 sm:pt-24 lg:h-[82vh] lg:min-h-0 lg:justify-center lg:p-10 lg:pt-10"
    >
      <div className="mx-auto grid w-full max-w-[1400px] gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/60">
            Contacto
          </p>
          <h2 className="mt-4 font-display text-3xl leading-[1.1] sm:text-4xl lg:text-5xl">
            ¿Hablamos de tu proyecto?
          </h2>
          <p className="mt-4 max-w-md text-sm text-paper/70 sm:text-base">
            Ya seas un particular que busca fabricación e instalación para
            su hogar, o un instalador profesional que necesita encargar
            producto de calidad, cuéntanos tu proyecto.
          </p>

          <div className="mt-5 space-y-2 text-base sm:text-lg">
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
        </div>

        <div>
          <form
            name="contacto"
            method="POST"
            action="/gracias/"
            data-netlify="true"
            netlify-honeypot="bot-field"
            className="flex flex-col gap-3.5"
          >
            <input type="hidden" name="form-name" value="contacto" />
            <p className="hidden">
              <label>
                No rellenar: <input name="bot-field" />
              </label>
            </p>

            <div className="grid gap-3.5 sm:grid-cols-2">
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
                rows={3}
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
                  Acepto recibir información comercial por correo electrónico
                  o teléfono.
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
    </div>
  );
}
