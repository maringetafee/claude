import Link from "next/link";
import { centers, whatsappHref, whatsappMessages } from "@/lib/site-config";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import RouteGraphic from "./RouteGraphic";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pb-24">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8 lg:px-10">
        <div className="animate-[hero-in_0.8s_var(--ease-out)_both]">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-signal">
            Getafe · Madrid
          </p>
          <h1 className="mt-4 font-display text-[13vw] font-bold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-[5.2vw] xl:text-7xl">
            El carnet se
            <br />
            saca aquí.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            Autoescuela Rosangel: tres centros en Getafe y más de veinte años
            enseñando a conducir con paciencia, a los vecinos de siempre.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/contacto/"
              className="group inline-flex items-center gap-2 rounded-sm bg-signal px-6 py-3.5 text-sm font-semibold text-paper transition-colors hover:bg-signal-dark"
            >
              Quiero información
              <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href={whatsappHref(whatsappMessages.general)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-sm border border-ink/15 px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Hablar por WhatsApp
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-line pt-6">
            <div>
              <dt className="text-xs text-stone">Centros</dt>
              <dd className="font-display text-2xl font-bold">{centers.length}</dd>
            </div>
            <div>
              <dt className="text-xs text-stone">Permisos</dt>
              <dd className="font-display text-2xl font-bold">B · A2</dd>
            </div>
            <div>
              <dt className="text-xs text-stone">En Getafe desde</dt>
              <dd className="font-display text-2xl font-bold">2000</dd>
            </div>
          </dl>
        </div>

        <div className="relative">
          <RouteGraphic />
        </div>
      </div>
    </section>
  );
}
