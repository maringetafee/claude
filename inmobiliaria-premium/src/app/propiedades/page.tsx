import type { Metadata } from "next";
import { Suspense } from "react";
import { getProperties } from "@/lib/properties";
import { PropertyFilters } from "@/components/sections/PropertyFilters";
import { PropertyGrid } from "@/components/sections/PropertyGrid";
import { PropertyMapView } from "@/components/sections/PropertyMapView";
import { LineReveal } from "@/components/motion/LineReveal";

export const metadata: Metadata = {
  title: "Propiedades",
  description:
    "Explora nuestra selección de propiedades en venta y alquiler en el sur de Madrid: Getafe, Leganés, Alcorcón y Carabanchel.",
};

export const revalidate = 60;

type SearchParams = { [key: string]: string | string[] | undefined };

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filtered = await getProperties({
    operacion: getParam(params, "operacion"),
    zona: getParam(params, "zona"),
    tipo: getParam(params, "tipo"),
    habitaciones: getParam(params, "habitaciones"),
    min: getParam(params, "min"),
    max: getParam(params, "max"),
  });
  const vista = getParam(params, "vista");

  return (
    <div className="pt-36 pb-section-y md:pt-44">
      <div className="container-edit">
        <span className="mb-6 block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
          Catálogo
        </span>
        <h1 className="max-w-2xl font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.05] text-ink text-balance">
          <LineReveal lines={["Propiedades", "disponibles"]} trigger="mount" />
        </h1>
        <p className="mt-6 max-w-md text-[1rem] text-stone">
          {filtered.length} {filtered.length === 1 ? "propiedad encontrada" : "propiedades encontradas"}
        </p>

        <div className="mt-10">
          <Suspense fallback={null}>
            <PropertyFilters />
          </Suspense>
        </div>

        <div className="mt-14">
          {vista === "mapa" ? (
            <PropertyMapView properties={filtered} />
          ) : (
            <PropertyGrid properties={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}
