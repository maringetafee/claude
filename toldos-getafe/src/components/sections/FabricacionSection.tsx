import Image from "next/image";
import Link from "next/link";
import { fabrica } from "@/data/images";

export default function FabricacionSection() {
  return (
    <div
      id="fabricacion"
      className="flex h-[85vh] flex-col justify-center p-5 text-paper sm:h-[82vh] sm:p-8 lg:p-12"
    >
      <div className="grid min-h-0 flex-1 gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <div className="flex flex-col justify-center overflow-y-auto [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
            Fabricación propia
          </p>
          <h2 className="mt-3 font-display text-3xl leading-[1.08] sm:text-4xl lg:text-5xl">
            Del diseño a la fabricación.
          </h2>
          <p className="mt-4 max-w-md text-sm text-paper/80 sm:text-base">
            No somos solo instaladores: fabricamos cada toldo, pérgola y
            cerramiento a medida en nuestro propio taller de Madrid, tanto
            para particulares como para instaladores profesionales.
          </p>
          <ul className="mt-6 space-y-2.5 text-sm text-paper/85">
            <li className="flex items-start gap-3">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
              Materiales de alta calidad para asegurar durabilidad y
              funcionalidad.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
              Soluciones a medida, adaptadas a cada espacio y proyecto.
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-2 h-px w-4 shrink-0 bg-accent" />
              Soporte técnico y asesoramiento en cada instalación.
            </li>
          </ul>
          <Link
            href="/profesionales"
            className="mt-6 inline-flex w-fit items-center gap-3 border border-paper/40 px-6 py-3 text-sm font-medium transition-colors hover:border-accent-soft hover:text-accent-soft"
          >
            Fabricamos para profesionales
          </Link>
        </div>

        <div className="relative hidden overflow-hidden rounded-2xl sm:block">
          <Image
            src={fabrica.profesionalesHero.src}
            alt={fabrica.profesionalesHero.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-6 flex shrink-0 gap-2 overflow-x-auto sm:mt-8 sm:grid sm:grid-cols-8 sm:gap-3 sm:overflow-visible">
        {fabrica.taller.map((img) => (
          <div
            key={img.src}
            className="relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg sm:w-auto sm:shrink"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 640px) 12vw, 80px"
              className="object-cover grayscale transition-all duration-500 hover:grayscale-0"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
