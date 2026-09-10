import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import PageCTA from "@/components/ui/PageCTA";
import Prose from "@/components/ui/Prose";
import { siteConfig, serviceAreas } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Zona de actuación",
  description:
    "Instalamos toldos y pérgolas a medida en Getafe, Fuenlabrada y toda la zona sur de Madrid, además de Madrid capital. Fábrica propia en Fuenlabrada.",
};

export default function ZonaDeActuacionPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Zona de actuación"
        title="Getafe, Fuenlabrada y toda la zona sur de Madrid"
        subtitle="Fabricamos en nuestro taller de Fuenlabrada e instalamos en toda Madrid Sur y Madrid capital."
      />

      <div className="px-6 pb-16 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <Prose>
              <p>
                Nuestra fábrica está en{" "}
                <strong>{siteConfig.address.line}</strong>, desde donde
                damos servicio a particulares, comunidades de vecinos,
                bares, restaurantes y comercios de toda la zona sur de la
                Comunidad de Madrid.
              </p>
              <p>
                Al fabricar e instalar nosotros mismos, coordinamos la
                medición, la fabricación y el montaje sin depender de
                terceros, con un único interlocutor de principio a fin.
              </p>
            </Prose>

            <h2 className="mt-10 font-display text-2xl text-paper [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">
              Municipios donde instalamos
            </h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {serviceAreas.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-white/15 bg-ink/40 px-4 py-1.5 text-sm text-paper/85 backdrop-blur-md"
                >
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-paper/60">
              ¿No ves tu municipio? Escríbenos y te confirmamos si llegamos.
            </p>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-white/10 lg:min-h-full">
            <iframe
              title="Ubicación de la fábrica de Toldos Getafe en Fuenlabrada"
              src={siteConfig.google.mapEmbedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </div>

      <PageCTA
        title="¿Instalamos en tu zona? Pídenos presupuesto."
        ctaLabel="Solicitar presupuesto"
      />
    </main>
  );
}
