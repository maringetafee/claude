import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/ui/PageHero";
import Prose from "@/components/ui/Prose";
import PageCTA from "@/components/ui/PageCTA";
import { pergolas } from "@/data/images";

export const metadata: Metadata = {
  title: "Pérgolas",
  description:
    "Pérgolas con lona y pérgolas bioclimáticas a medida en Madrid, para particulares e instaladores profesionales. Transforma tu terraza o jardín en un espacio para todo el año.",
};

export default function PergolasPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Pérgolas"
        title="Pérgolas estándar o bioclimáticas"
        subtitle="Venta directa al profesional o particular."
      />

      <div className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <Prose>
            <p>
              Fabricamos pérgolas por encargo tanto para particulares como
              para instaladores profesionales. Las pérgolas con lona y las
              pérgolas bioclimáticas no solo aportan funcionalidad a tus
              espacios exteriores, sino que también elevan su estética.
            </p>
          </Prose>
        </div>

        <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={pergolas.lona.src}
              alt={pergolas.lona.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/0" />
            <p className="absolute bottom-6 left-6 font-display text-2xl text-paper">
              Pérgolas con lona
            </p>
          </div>
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl">
            <Image
              src={pergolas.bioclimatica1.src}
              alt={pergolas.bioclimatica1.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/0 to-ink/0" />
            <p className="absolute bottom-6 left-6 font-display text-2xl text-paper">
              Pérgolas bioclimáticas
            </p>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl">
          <Prose>
            <p>
              Las pérgolas con lona ofrecen un encanto clásico y versátil,
              con una amplia variedad de colores y diseños que pueden
              adaptarse a cualquier estilo arquitectónico.
            </p>
            <p>
              Por otro lado, las pérgolas bioclimáticas combinan
              modernidad y elegancia, con lamas ajustables que permiten
              controlar la luz y ventilación, creando un espacio
              sofisticado y adaptable. Ambas opciones transforman tu
              jardín, terraza o patio en un lugar acogedor y visualmente
              atractivo, ideal para disfrutar al aire libre.
            </p>
          </Prose>
        </div>
      </div>

      <PageCTA title="¿Empezamos con tu pérgola?" />
    </main>
  );
}
