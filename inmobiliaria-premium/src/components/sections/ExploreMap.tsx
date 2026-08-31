import { getProperties } from "@/lib/properties";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { MapPreview } from "@/components/sections/MapPreview";

export async function ExploreMap() {
  const properties = await getProperties({ limit: 12 });
  if (properties.length === 0) return null;

  return (
    <section className="bg-paper py-section-y">
      <div className="container-edit">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Explora el mapa"
            lines={["Busca por", "ubicación"]}
            subtitle="Descubre dónde está cada propiedad y compara distancias, barrios y zonas de un vistazo."
            className="max-w-lg"
          />
          <Reveal delay={0.2} y={16} className="shrink-0">
            <Button href="/propiedades?vista=mapa" variant="secondary">
              Ver mapa completo
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14 h-[420px] border border-line md:mt-16 md:h-[520px]">
          <MapPreview properties={properties} />
        </Reveal>
      </div>
    </section>
  );
}
