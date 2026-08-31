import { getProperties } from "@/lib/properties";
import { PropertyCard } from "@/components/PropertyCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export async function FeaturedProperties() {
  const properties = await getProperties({ limit: 5 });
  if (properties.length === 0) return null;
  const [main, ...rest] = properties;
  const secondary = rest.slice(0, 4);

  return (
    <section className="bg-paper py-section-y">
      <div className="container-edit">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selección actual"
            lines={["Propiedades", "seleccionadas"]}
            className="max-w-lg"
          />
          <Reveal delay={0.2} y={16} className="shrink-0">
            <Button href="/propiedades" variant="secondary">
              Ver todas
            </Button>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 md:mt-20 lg:grid-cols-5">
          <Reveal className="lg:col-span-3 lg:h-full" delay={0.1}>
            <PropertyCard property={main} size="large" priority />
          </Reveal>

          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-1">
            {secondary.slice(0, 2).map((property, i) => (
              <Reveal key={property.id} delay={0.2 + i * 0.1}>
                <PropertyCard property={property} size="small" />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {secondary.slice(2, 4).map((property, i) => (
            <Reveal key={property.id} delay={0.1 + i * 0.1}>
              <PropertyCard property={property} size="medium" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
