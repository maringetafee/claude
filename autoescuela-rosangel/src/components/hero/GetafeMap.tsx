import { centers } from "@/lib/site-config";

// Encuadre del mapa: debe coincidir con scripts/build-getafe-map.mjs, que
// genera public/images/getafe-map.svg (calles reales de OpenStreetMap) con
// estas mismas constantes.
const VIEW = { width: 400, height: 500 };
const ORIGIN = { lat: 40.31555, lng: -3.71575 };
const UNITS_PER_DEG_LAT = 14137;
const UNITS_PER_DEG_LNG = UNITS_PER_DEG_LAT * Math.cos((ORIGIN.lat * Math.PI) / 180);

function project({ lat, lng }: { lat: number; lng: number }) {
  return {
    x: VIEW.width / 2 + (lng - ORIGIN.lng) * UNITS_PER_DEG_LNG,
    y: VIEW.height / 2 + (ORIGIN.lat - lat) * UNITS_PER_DEG_LAT,
  };
}

// Por defecto la etiqueta va a la derecha del punto; Los Molinos queda
// cerca del borde derecho, así que la suya va debajo.
const labelBelow = new Set(["los-molinos"]);

/**
 * Mapa real de Getafe con los centros de Rosangel en su ubicación exacta.
 * Todo el contenido queda entre y≈120 e y≈400 del viewBox, que es la franja
 * visible en sm (el SVG usa slice y la caja pasa a aspect 5/4).
 */
export default function GetafeMap() {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-line bg-ink sm:aspect-[5/4] lg:aspect-[4/5]">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={`Mapa de Getafe con los ${centers.length} centros de Autoescuela Rosangel`}
      >
        <rect width={VIEW.width} height={VIEW.height} fill="var(--color-ink)" />
        <image href="/images/getafe-map.svg" width={VIEW.width} height={VIEW.height} />

        {centers.map((center) => {
          if (!center.geo) return null;
          const { x, y } = project(center.geo);
          const below = labelBelow.has(center.slug);
          return (
            <g key={center.slug}>
              <circle cx={x} cy={y} r="15" fill="var(--color-signal)" opacity="0.2" />
              <circle
                cx={x}
                cy={y}
                r="6.5"
                fill="var(--color-signal)"
                stroke="var(--color-ink)"
                strokeWidth="2.5"
              />
              <text
                x={below ? x : x + 14}
                y={below ? y + 27 : y + 4.5}
                textAnchor={below ? "middle" : "start"}
                fill="rgba(246,244,240,0.92)"
                stroke="var(--color-ink)"
                strokeWidth="4"
                strokeLinejoin="round"
                paintOrder="stroke"
                fontSize="13"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                {center.zoneLabel}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-[3px] border-2 border-paper/70 font-display text-sm font-bold text-paper/70"
        aria-hidden="true"
      >
        L
      </div>
      <a
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
        className="absolute bottom-2 right-3 text-[10px] text-paper/40 transition-colors hover:text-paper/70"
      >
        © OpenStreetMap
      </a>
    </div>
  );
}
