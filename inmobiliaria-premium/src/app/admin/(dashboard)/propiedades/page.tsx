import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getAllPropertiesAdmin } from "@/lib/admin/properties";
import { formatPrice } from "@/lib/format";
import { AdminPropertyFilters } from "./AdminPropertyFilters";
import { AdminPropertyRowActions } from "./AdminPropertyRowActions";

type SearchParams = { [key: string]: string | string[] | undefined };

function getParam(params: SearchParams, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const properties = await getAllPropertiesAdmin({
    operacion: getParam(params, "operacion"),
    publicada: getParam(params, "publicada") as "true" | "false" | undefined,
    destacada: getParam(params, "destacada") as "true" | "false" | undefined,
    q: getParam(params, "q"),
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <span className="block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
            Panel
          </span>
          <h1 className="mt-2 font-serif text-3xl font-light text-ink">Propiedades</h1>
        </div>
        <Link
          href="/admin/propiedades/nuevo"
          className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-paper transition-colors duration-300 hover:bg-accent"
        >
          Nueva propiedad
        </Link>
      </div>

      <div className="mt-8">
        <Suspense fallback={null}>
          <AdminPropertyFilters />
        </Suspense>
      </div>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full min-w-[860px] border-collapse text-left text-[0.85rem]">
          <thead>
            <tr className="border-b border-line text-[0.68rem] uppercase tracking-[0.14em] text-stone">
              <th className="px-4 py-3 font-medium">Imagen</th>
              <th className="px-4 py-3 font-medium">Referencia</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Operación</th>
              <th className="px-4 py-3 font-medium">Ubicación</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Destacada</th>
              <th className="px-4 py-3 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {properties.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-stone">
                  No hay propiedades que coincidan con los filtros.
                </td>
              </tr>
            )}
            {properties.map((property) => (
              <tr key={property.id} className="border-b border-line last:border-b-0">
                <td className="px-4 py-3">
                  <div className="relative h-12 w-16 overflow-hidden bg-line">
                    {property.cover.src && (
                      <Image src={property.cover.src} alt="" fill sizes="64px" className="object-cover" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-stone">{property.reference}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/propiedades/${property.id}`} className="text-ink hover:underline">
                    {property.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{formatPrice(property.price, property.priceSuffix)}</td>
                <td className="px-4 py-3 text-stone">{property.category}</td>
                <td className="px-4 py-3 text-stone">
                  {property.operation === "venta" ? "Venta" : "Alquiler"}
                </td>
                <td className="px-4 py-3 text-stone">{property.zone}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      property.published
                        ? "text-[0.72rem] uppercase tracking-[0.1em] text-ink"
                        : "text-[0.72rem] uppercase tracking-[0.1em] text-stone"
                    }
                  >
                    {property.published ? "Publicada" : "Borrador"}
                  </span>
                </td>
                <td className="px-4 py-3 text-stone">{property.featured ? "Sí" : "—"}</td>
                <td className="px-4 py-3">
                  <AdminPropertyRowActions property={property} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
