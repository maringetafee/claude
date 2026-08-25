import Link from "next/link";
import Image from "next/image";
import { toldos } from "@/data/images";

const categorias = [
  {
    nombre: "Toldos extensibles",
    href: "/toldos/extensibles",
    span: "sm:col-span-2 sm:row-span-2",
    image: toldos.extensible,
  },
  {
    nombre: "Toldos cofre",
    href: "/toldos/cofres",
    span: "",
    image: toldos.cofreTile,
  },
  {
    nombre: "Toldos portada",
    href: "/toldos/portada",
    span: "",
    image: toldos.portadaTile,
  },
  {
    nombre: "Toldos verticales",
    href: "/toldos",
    span: "",
    image: toldos.vertical,
  },
  {
    nombre: "Toldos Stor",
    href: "/toldos",
    span: "",
    image: toldos.balcon,
  },
  {
    nombre: "Toldos motorizados",
    href: "/toldos",
    span: "sm:col-span-2",
    image: toldos.overviewHero,
  },
];

export default function ToldosSection() {
  return (
    <div className="flex h-[85vh] flex-col justify-center p-5 sm:h-[82vh] sm:p-8 lg:p-12">
      <div className="flex shrink-0 flex-col justify-between gap-4 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
            Toldos
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl leading-[1.08] text-paper sm:text-4xl lg:text-5xl">
            Cada toldo, pensado a medida de tu espacio.
          </h2>
        </div>
        <Link
          href="/toldos"
          className="inline-flex w-fit items-center gap-3 border-b border-paper/50 pb-1 text-sm font-medium text-paper transition-colors hover:border-accent-soft hover:text-accent-soft"
        >
          Descubrir todos los toldos →
        </Link>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 gap-3 overflow-x-auto snap-x snap-mandatory pb-2 sm:mt-8 sm:grid sm:grid-cols-3 sm:grid-rows-2 sm:gap-4 sm:overflow-visible sm:pb-0">
        {categorias.map((cat) => (
          <div
            key={cat.nombre}
            className={`group relative h-full w-[70%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-auto sm:shrink ${cat.span}`}
          >
            <Link href={cat.href} className="block h-full w-full">
              <Image
                src={cat.image.src}
                alt={cat.image.alt}
                fill
                sizes="(min-width: 640px) 33vw, 70vw"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-ink/0" />
              <p className="absolute bottom-5 left-5 font-display text-lg text-paper sm:text-xl">
                {cat.nombre}
              </p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
