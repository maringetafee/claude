import { PropertyCard } from "@/components/PropertyCard";
import { Reveal } from "@/components/motion/Reveal";
import type { Property } from "@/lib/types";

export function PropertyGrid({ properties }: { properties: Property[] }) {
  if (properties.length === 0) {
    return (
      <div className="border border-line py-24 text-center">
        <p className="font-serif text-2xl font-light text-ink">
          No hay propiedades que coincidan con tu búsqueda
        </p>
        <p className="mt-3 text-[0.95rem] text-stone">
          Prueba a ampliar los filtros o hablar con un asesor para acceder a
          propiedades fuera de mercado.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property, i) => (
        <Reveal key={property.id} delay={(i % 3) * 0.1}>
          <PropertyCard property={property} />
        </Reveal>
      ))}
    </div>
  );
}
