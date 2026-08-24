"use client";

import { Reveal } from "./ui/Reveal";
import { ResponsivePhoto } from "./ui/ResponsivePhoto";

export function Team() {
  return (
    <section className="relative bg-carbon-950 py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        <div className="max-w-2xl">
          <Reveal as="div">
            <span className="mono-label text-[11px] text-signal-500">Personas reales</span>
            <h2 className="mt-4 text-balance font-display text-4xl font-bold tracking-tight text-bone-100 sm:text-5xl">
              Detrás de cada instalación hay un equipo.
            </h2>
            <p className="mt-6 max-w-md text-bone-500">
              Técnicos que suben a las azoteas de Madrid con el mismo cuidado desde hace más de 50 años. No es una empresa
              abstracta: es gente que conoce cada edificio en el que ha trabajado.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-6">
              <Reveal className="grain relative aspect-[4/5] overflow-hidden rounded-sm bg-carbon-800">
                <ResponsivePhoto
                  src="/images/portero-automatico.jpg"
                  alt="Técnico de S.B.S Telecomunicaciones instalando un portero automático"
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="object-cover"
                  style={{ filter: "grayscale(0.45) contrast(1.1) brightness(0.85)" }}
                />
              </Reveal>
              <Reveal delay={0.08} className="grain relative aspect-[4/5] overflow-hidden rounded-sm bg-carbon-800">
                <ResponsivePhoto
                  src="/images/atencion-cliente.jpg"
                  alt="Asesora de S.B.S Telecomunicaciones atendiendo a un cliente"
                  sizes="(min-width: 1024px) 30vw, 45vw"
                  className="object-cover"
                  style={{ filter: "grayscale(0.45) contrast(1.1) brightness(0.85)" }}
                />
              </Reveal>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
