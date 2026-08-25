import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import PageCTA from "@/components/ui/PageCTA";
import { toldos } from "@/data/images";

export const metadata: Metadata = {
  title: "Toldos a medida",
  description:
    "Fábrica de toldos a medida en Madrid: extensibles, cofre, portada, verticales, Stor, motorizados. Para terrazas, jardines y ventanas — particulares e instaladores profesionales.",
};

const dedicadas = [
  {
    nombre: "Toldos extensibles",
    href: "/toldos/extensibles",
    image: toldos.extensible,
  },
  {
    nombre: "Toldos cofre",
    href: "/toldos/cofres",
    image: toldos.cofreTile,
  },
  {
    nombre: "Toldos portada",
    href: "/toldos/portada",
    image: toldos.portadaTile,
  },
];

const otrosTipos = [
  {
    nombre: "Toldos motorizados",
    texto: "Toldos con motor y mando a distancia, interruptor o sensores sol-viento.",
  },
  {
    nombre: "Toldos verticales",
    texto: "Recogen la tela en cofre, ideales para ventanas y balcones.",
  },
  {
    nombre: "Toldos Stor",
    texto: "Protección solar sencilla y compacta para ventanas.",
  },
  {
    nombre: "Toldos para terrazas",
    texto: "Toldos para cubrir grandes superficies.",
  },
  {
    nombre: "Toldos para jardín",
    texto: "Toldos para disfrutar de tu jardín protegido del sol.",
  },
  {
    nombre: "Toldos para ventanas",
    texto:
      "Toldos para ventanas que te ayudan a ahorrar en gastos de aire acondicionado.",
  },
  {
    nombre: "Toldos para balcones",
    texto: "Toldos para balcones con enganche especial para barandillas.",
  },
];

export default function ToldosPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Toldos"
        title="Fábrica de toldos a medida"
        subtitle="Fabricamos toldos por encargo tanto para particulares como para instaladores profesionales."
      />

      <div className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-display text-2xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-3xl">
            Toldos con más detalle
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {dedicadas.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              >
                <Image
                  src={cat.image.src}
                  alt={cat.image.alt}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-ink/0" />
                <p className="absolute bottom-5 left-5 font-display text-lg text-paper">
                  {cat.nombre}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <h2 className="font-display text-2xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-3xl">
            Más tipos de toldos
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otrosTipos.map((cat) => (
              <div
                key={cat.nombre}
                className="rounded-2xl border border-white/10 bg-ink/35 p-6 backdrop-blur-md"
              >
                <h3 className="font-display text-lg text-paper">
                  {cat.nombre}
                </h3>
                <p className="mt-2 text-sm text-paper/70">{cat.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PageCTA />
    </main>
  );
}
