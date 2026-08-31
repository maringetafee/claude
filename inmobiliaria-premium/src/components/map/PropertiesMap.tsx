"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Image from "next/image";
import Link from "next/link";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/format";

export interface PropertiesMapHandle {
  flyTo: (id: string) => void;
}

interface PropertiesMapProps {
  properties: Property[];
  hoveredId?: string | null;
  activeId?: string | null;
  onMarkerHover?: (id: string | null) => void;
  onMarkerClick?: (id: string) => void;
  className?: string;
}

function pinIcon(active: boolean) {
  const size = active ? 38 : 28;
  const height = active ? 48 : 36;
  return L.divIcon({
    className: "ir-marker",
    html: `<svg width="${size}" height="${height}" viewBox="0 0 30 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.7 0 0 6.7 0 15c0 10.5 15 23 15 23s15-12.5 15-23C30 6.7 23.3 0 15 0z" fill="#b3134f"/>
      <circle cx="15" cy="15" r="5.5" fill="#f7f4ee"/>
    </svg>`,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height + 6],
  });
}

function MapController({ onReady }: { onReady: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady(map);
  }, [map, onReady]);
  return null;
}

export const PropertiesMap = forwardRef<PropertiesMapHandle, PropertiesMapProps>(
  function PropertiesMap(
    { properties, hoveredId, activeId, onMarkerHover, onMarkerClick, className },
    ref
  ) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRefs = useRef<Map<string, L.Marker>>(new Map());

    const located = useMemo(
      () => properties.filter((p) => typeof p.latitude === "number" && typeof p.longitude === "number"),
      [properties]
    );

    const center = useMemo<[number, number]>(() => {
      if (located.length === 0) return [40.3057, -3.7327];
      const lat = located.reduce((sum, p) => sum + (p.latitude ?? 0), 0) / located.length;
      const lng = located.reduce((sum, p) => sum + (p.longitude ?? 0), 0) / located.length;
      return [lat, lng];
    }, [located]);

    useImperativeHandle(ref, () => ({
      flyTo(id: string) {
        const property = located.find((p) => p.id === id);
        const map = mapRef.current;
        if (!property || !map) return;
        map.flyTo([property.latitude!, property.longitude!], 14, { duration: 0.8 });
        window.setTimeout(() => {
          markerRefs.current.get(id)?.openPopup();
        }, 400);
      },
    }));

    return (
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className={className}
        style={{ height: "100%", width: "100%" }}
      >
        <MapController onReady={(map) => (mapRef.current = map)} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {located.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude!, property.longitude!]}
            icon={pinIcon(property.id === hoveredId || property.id === activeId)}
            ref={(marker) => {
              if (marker) markerRefs.current.set(property.id, marker);
              else markerRefs.current.delete(property.id);
            }}
            eventHandlers={{
              mouseover: () => onMarkerHover?.(property.id),
              mouseout: () => onMarkerHover?.(null),
              click: () => onMarkerClick?.(property.id),
            }}
          >
            <Popup className="ir-popup" minWidth={240}>
              <div className="w-56">
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={property.cover.src}
                    alt={property.cover.alt}
                    fill
                    sizes="224px"
                    className="object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[0.62rem] font-medium uppercase tracking-[0.14em] text-stone">
                    {property.zone}, {property.city}
                  </p>
                  <p className="mt-1 font-serif text-base font-light leading-tight text-ink">
                    {property.title}
                  </p>
                  <p className="mt-1.5 text-[0.9rem] font-medium text-ink">
                    {formatPrice(property.price, property.priceSuffix)}
                  </p>
                  <p className="mt-1 text-[0.72rem] text-stone">
                    {property.beds} hab. · {property.baths} baños · {formatArea(property.area)}
                  </p>
                  <Link
                    href={`/propiedades/${property.slug}`}
                    className="mt-3 inline-block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
                  >
                    Ver propiedad
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    );
  }
);
