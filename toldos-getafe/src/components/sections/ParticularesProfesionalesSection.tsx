const profesionalPuntos = [
  "Precios competitivos",
  "Descuentos por volumen",
  "Facilidades de pago",
  "Tiempos de entrega preferenciales",
  "Soporte postventa",
];

export default function ParticularesProfesionalesSection() {
  return (
    <div className="flex min-h-[100dvh] flex-col justify-center p-5 pt-24 sm:p-8 sm:pt-24 lg:h-[82vh] lg:min-h-0 lg:p-12 lg:pt-12">
      <div className="shrink-0 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
          Cómo trabajamos
        </p>
        <h2 className="mt-3 max-w-3xl font-display text-3xl leading-[1.08] text-paper sm:text-4xl lg:text-5xl">
          Una solución. Dos formas de trabajar.
        </h2>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 lg:min-h-0 lg:flex-1">
        <div className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-ink/40 p-5 text-paper backdrop-blur-md sm:p-7 lg:overflow-y-auto lg:p-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-soft">
              01 — Particulares
            </p>
            <h3 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
              Fabricación e instalación a medida para tu hogar.
            </h3>
            <p className="mt-3 max-w-md text-sm text-paper/75 sm:text-base">
              Diseñamos, fabricamos e instalamos tu toldo, pérgola o
              cerramiento adaptado a tu vivienda, terraza o jardín.
            </p>
          </div>
          <a
            href="/contacto/"
            className="mt-6 inline-flex w-fit items-center gap-3 border border-paper/40 px-6 py-3 text-sm font-medium transition-colors hover:border-accent-soft hover:text-accent-soft"
          >
            Quiero mi toldo
          </a>
        </div>

        <div className="group flex flex-col justify-between rounded-2xl border border-white/10 bg-ink/40 p-5 text-paper backdrop-blur-md sm:p-7 lg:overflow-y-auto lg:p-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-accent-soft">
              02 — Profesionales
            </p>
            <h3 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
              Fabricación a medida para instaladores y distribuidores.
            </h3>
            <p className="mt-3 max-w-md text-sm text-paper/75 sm:text-base">
              Trabajamos como fabricante de referencia para instaladores
              profesionales, con condiciones pensadas para tu negocio.
            </p>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-1.5 text-sm text-paper/70 sm:grid-cols-2">
              {profesionalPuntos.map((punto) => (
                <li key={punto} className="flex items-center gap-2">
                  <span className="h-px w-4 bg-accent" />
                  {punto}
                </li>
              ))}
            </ul>
          </div>
          <a
            href="/profesionales/"
            className="mt-6 inline-flex w-fit items-center gap-3 bg-accent px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-accent-soft"
          >
            Soy profesional
          </a>
        </div>
      </div>
    </div>
  );
}
