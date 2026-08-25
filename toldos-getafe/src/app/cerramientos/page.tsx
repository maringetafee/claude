import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import PageCTA from "@/components/ui/PageCTA";
import { cerramientos } from "@/data/images";

export const metadata: Metadata = {
  title: "Cerramientos de lona",
  description:
    "Cerramientos de lona transparente, acrílica y PVC a medida en Madrid, para viviendas, bares y restaurantes. Fabricación para particulares y profesionales.",
};

export default function CerramientosPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Cerramientos"
        title="Cerramientos de lona"
        subtitle="Para viviendas, bares o restaurantes."
      />

      <div className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={cerramientos.transparente.src}
              alt={cerramientos.transparente.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
            <p className="absolute bottom-6 left-6 font-display text-xl text-paper">
              Lona transparente
            </p>
          </div>
          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <Image
              src={cerramientos.acrilicaPvc.src}
              alt={cerramientos.acrilicaPvc.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
            <p className="absolute bottom-6 left-6 font-display text-xl text-paper">
              Lona acrílica y PVC
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <Prose>
            <h2>Cerramientos de lona transparente</h2>
            <p>
              Protección sin perder la vista, ideal para disfrutar de tus
              espacios exteriores todo el año.
            </p>
            <h2>Cerramientos de lona acrílica y PVC</h2>
            <p>
              Durabilidad y estilo para proteger y embellecer tus espacios
              exteriores en cualquier estación.
            </p>
            <p>
              Fabricamos cerramientos por encargo tanto para particulares
              como para empresas o instaladores profesionales, con
              estructura de aluminio.
            </p>
          </Prose>
        </div>
      </div>

      <PageCTA title="¿Cerramos tu espacio exterior?" />
    </main>
  );
}
