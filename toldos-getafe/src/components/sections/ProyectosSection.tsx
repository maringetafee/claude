import Image from "next/image";
import BeforeAfter from "@/components/ui/BeforeAfter";
import Reveal from "@/components/ui/Reveal";
import { proyectos } from "@/data/images";

export default function ProyectosSection() {
  return (
    <div className="flex min-h-[100dvh] flex-col justify-center p-5 text-paper sm:p-8 lg:min-h-0 lg:p-12">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="[text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
            Proyectos
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
            Instalaciones en Getafe y Madrid Sur.
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {proyectos.map((p, i) => (
            <Reveal key={p.tipo + i} delay={(i % 3) * 90} as="div">
              {p.antes ? (
                <BeforeAfter
                  antes={p.antes}
                  despues={p.imagen}
                  municipio={p.municipio}
                  tipo={p.tipo}
                  className="aspect-[4/3] w-full"
                />
              ) : (
                <figure className="group relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-ink/40">
                  <Image
                    src={p.imagen.src}
                    alt={p.imagen.alt}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4">
                    <span className="block text-xs uppercase tracking-wide text-paper/70">
                      {p.municipio}
                    </span>
                    <span className="mt-0.5 block font-display text-lg text-paper">
                      {p.tipo}
                    </span>
                  </figcaption>
                </figure>
              )}
            </Reveal>
          ))}
        </div>

        <p className="mt-6 text-xs text-paper/50">
          Fotografías de instalaciones propias. Ubicación orientativa.
        </p>
      </div>
    </div>
  );
}
