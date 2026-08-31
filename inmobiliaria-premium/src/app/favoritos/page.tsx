"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import type { Property } from "@/lib/types";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/favorites-store";
import { PropertyGrid } from "@/components/sections/PropertyGrid";
import { LineReveal } from "@/components/motion/LineReveal";
import { Button } from "@/components/ui/Button";

export default function FavoritosPage() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const currentKey = ids.join(",");
  const [result, setResult] = useState<{ key: string; properties: Property[] } | null>(null);

  useEffect(() => {
    if (ids.length === 0) return;
    let cancelled = false;
    fetch(`/api/properties/favorites?ids=${ids.join(",")}`)
      .then((res) => res.json())
      .then((data: { properties?: Property[] }) => {
        if (!cancelled) setResult({ key: ids.join(","), properties: data.properties ?? [] });
      });
    return () => {
      cancelled = true;
    };
  }, [ids]);

  const properties = ids.length === 0 || result?.key !== currentKey ? [] : result.properties;
  const loading = ids.length > 0 && result?.key !== currentKey;

  return (
    <div className="pt-36 pb-section-y md:pt-44">
      <div className="container-edit">
        <span className="mb-6 block text-[0.72rem] font-medium uppercase tracking-[0.24em] text-stone">
          Tu selección
        </span>
        <h1 className="max-w-2xl font-serif text-[clamp(2.25rem,5vw,4rem)] font-light leading-[1.05] text-ink text-balance">
          <LineReveal lines={["Propiedades", "favoritas"]} trigger="mount" />
        </h1>

        <div className="mt-14">
          {loading ? (
            <div className="border border-line py-24 text-center">
              <p className="text-[0.95rem] text-stone">Cargando tus favoritos…</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="border border-line py-24 text-center">
              <p className="font-serif text-2xl font-light text-ink">
                Todavía no tienes propiedades guardadas
              </p>
              <p className="mt-3 text-[0.95rem] text-stone">
                Pulsa el corazón en cualquier propiedad para guardarla aquí y
                comparar más tarde.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/propiedades" variant="secondary">
                  Ver propiedades
                </Button>
              </div>
            </div>
          ) : (
            <PropertyGrid properties={properties} />
          )}
        </div>
      </div>
    </div>
  );
}
