"use client";

import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import { useRef, useState, useSyncExternalStore } from "react";
import type { Property } from "@/lib/types";
import { PropertyListRow } from "@/components/PropertyListRow";
import { Button } from "@/components/ui/Button";
import type { PropertiesMapHandle } from "@/components/map/PropertiesMap";

const PropertiesMap = dynamic(
  () => import("@/components/map/PropertiesMap").then((m) => m.PropertiesMap),
  { ssr: false, loading: () => <div className="h-full w-full animate-pulse bg-paper-dim" /> }
);

function subscribeDesktop(callback: () => void) {
  const mql = window.matchMedia("(min-width: 1024px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}
function getDesktopSnapshot() {
  return window.matchMedia("(min-width: 1024px)").matches;
}
function getDesktopServerSnapshot() {
  return false;
}

export function PropertyMapView({ properties }: { properties: Property[] }) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mobileMapOpen, setMobileMapOpen] = useState(false);
  const mapRef = useRef<PropertiesMapHandle>(null);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );

  function handleSelect(id: string) {
    setActiveId(id);
    mapRef.current?.flyTo(id);
  }

  return (
    <div className="lg:grid lg:grid-cols-[45fr_55fr] lg:items-start lg:gap-10">
      <div className="lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-2">
        {properties.length === 0 ? (
          <div className="border border-line py-24 text-center">
            <p className="font-serif text-2xl font-light text-ink">
              No hay propiedades que coincidan con tu búsqueda
            </p>
            <p className="mt-3 text-[0.95rem] text-stone">
              Prueba a ampliar los filtros o hablar con un asesor para acceder
              a propiedades fuera de mercado.
            </p>
          </div>
        ) : (
          properties.map((property) => (
            <PropertyListRow
              key={property.id}
              property={property}
              active={property.id === activeId || property.id === hoveredId}
              onHover={setHoveredId}
              onSelect={handleSelect}
            />
          ))
        )}
      </div>

      {isDesktop && (
        <div className="mt-10 h-[calc(100vh-220px)] border border-line lg:sticky lg:top-28 lg:mt-0">
          <PropertiesMap
            ref={mapRef}
            properties={properties}
            hoveredId={hoveredId}
            activeId={activeId}
            onMarkerHover={setHoveredId}
            onMarkerClick={handleSelect}
          />
        </div>
      )}

      {!isDesktop && properties.length > 0 && (
        <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center">
          <Button variant="primary" onClick={() => setMobileMapOpen(true)}>
            Ver mapa
          </Button>
        </div>
      )}

      {mounted &&
        mobileMapOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 flex flex-col bg-paper">
            <div className="flex items-center justify-between border-b border-line px-[var(--section-x)] py-5">
              <span className="font-serif text-lg font-light text-ink">Mapa</span>
              <button
                aria-label="Cerrar mapa"
                onClick={() => setMobileMapOpen(false)}
                className="flex h-8 w-8 items-center justify-center"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M1 1L17 17M17 1L1 17" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
            <div className="flex-1">
              <PropertiesMap
                properties={properties}
                hoveredId={hoveredId}
                activeId={activeId}
                onMarkerClick={setActiveId}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
