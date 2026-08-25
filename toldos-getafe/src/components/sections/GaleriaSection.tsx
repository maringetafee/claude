import Image from "next/image";
import { carrusel } from "@/data/images";

const spans = [
  "sm:col-span-3 sm:row-span-2",
  "sm:col-span-3",
  "sm:col-span-3",
  "sm:col-span-2",
  "sm:col-span-2",
  "sm:col-span-2",
];

export default function GaleriaSection() {
  return (
    <div className="flex h-[85vh] flex-col justify-center p-5 sm:h-[82vh] sm:p-8 lg:p-12">
      <div className="shrink-0 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
          Proyectos
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-[1.08] text-paper sm:text-4xl lg:text-5xl">
          Espacios exteriores que ya transformamos.
        </h2>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 gap-3 overflow-x-auto snap-x snap-mandatory pb-2 sm:mt-8 sm:grid sm:grid-cols-6 sm:grid-rows-2 sm:gap-4 sm:overflow-visible sm:pb-0">
        {carrusel.map((img, i) => (
          <div
            key={img.src}
            className={`group relative h-full w-[68%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-auto sm:shrink ${
              spans[i] ?? ""
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(min-width: 640px) 50vw, 68vw"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <p className="p-5 text-sm text-paper">{img.alt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
