import Image from "next/image";
import { soluciones } from "@/data/images";

const espacios = [
  {
    nombre: "Viviendas",
    texto: "Toldos y pérgolas integrados en la fachada y el jardín de casa.",
    imagen: soluciones.viviendas,
  },
  {
    nombre: "Terrazas",
    texto: "Protección solar a medida para ganar horas de terraza al aire libre.",
    imagen: soluciones.terrazas,
  },
  {
    nombre: "Jardines",
    texto: "Cerramientos y pérgolas que amplían el espacio útil del jardín.",
    imagen: soluciones.jardines,
  },
  {
    nombre: "Ventanas",
    texto: "Toldos verticales y Stor para controlar la luz de cada estancia.",
    imagen: soluciones.ventanas,
  },
  {
    nombre: "Restaurantes",
    texto: "Soluciones para terrazas de hostelería, resistentes y funcionales.",
    imagen: soluciones.restaurantes,
  },
  {
    nombre: "Espacios comerciales",
    texto: "Toldos e instalaciones a medida para locales y negocios.",
    imagen: soluciones.espaciosComerciales,
  },
];

export default function SolucionesSection() {
  return (
    <div className="flex h-[85vh] flex-col justify-center p-5 sm:h-[82vh] sm:p-8 lg:p-12">
      <div className="shrink-0 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-paper/70">
          Soluciones
        </p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl leading-[1.08] text-paper sm:text-4xl lg:text-5xl">
          Cada espacio necesita una solución diferente.
        </h2>
      </div>

      <div className="mt-6 flex min-h-0 flex-1 gap-3 overflow-x-auto snap-x snap-mandatory pb-2 sm:mt-8 sm:grid sm:grid-cols-3 sm:grid-rows-2 sm:gap-4 sm:overflow-visible sm:pb-0">
        {espacios.map((espacio, i) => (
          <div
            key={espacio.nombre}
            className="group relative h-full w-[62%] shrink-0 snap-start overflow-hidden rounded-2xl sm:w-auto sm:shrink"
          >
            <Image
              src={espacio.imagen.src}
              alt={espacio.imagen.alt}
              fill
              sizes="(min-width: 640px) 33vw, 62vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-ink/0" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-paper/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-1 font-display text-xl text-paper">
                {espacio.nombre}
              </h3>
              <p className="mt-1 text-sm text-paper/70 line-clamp-2">
                {espacio.texto}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
