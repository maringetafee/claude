import { centers } from "@/lib/site-config";

/**
 * Composición gráfica editorial: una ruta estilizada que conecta los tres
 * centros de Rosangel en Getafe. Sustituye a una fotografía de stock —
 * comunica "Getafe" y "movimiento" sin recurrir a imágenes genéricas de
 * coches/carreteras que no son reales de la autoescuela.
 */
export default function RouteGraphic() {
  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-line bg-ink sm:aspect-[5/4] lg:aspect-[4/5]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 400 500"
        className="h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="400" height="500" fill="var(--color-ink)" />
        {/* líneas de asfalto sutiles */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={i}
            x1={-50}
            y1={i * 55}
            x2={450}
            y2={i * 55 - 120}
            stroke="rgba(246,244,240,0.04)"
            strokeWidth="1"
          />
        ))}

        {/* ruta discontinua conectando los 3 centros */}
        <path
          d="M 60 430 C 120 360, 40 280, 130 230 C 220 180, 180 120, 280 70"
          fill="none"
          stroke="rgba(246,244,240,0.35)"
          strokeWidth="3"
          strokeDasharray="2 18"
          strokeLinecap="round"
        />

        {/* marcadores de centro */}
        <g>
          <circle cx="60" cy="430" r="7" fill="var(--color-signal)" />
          <circle cx="130" cy="230" r="7" fill="var(--color-amber)" />
          <circle cx="280" cy="70" r="7" fill="var(--color-signal)" />
        </g>

        <text x="80" y="435" fill="rgba(246,244,240,0.7)" fontSize="13" fontFamily="var(--font-sans)">
          {centers[0]?.zoneLabel}
        </text>
        <text x="150" y="235" fill="rgba(246,244,240,0.7)" fontSize="13" fontFamily="var(--font-sans)">
          {centers[1]?.zoneLabel}
        </text>
        <text x="300" y="75" fill="rgba(246,244,240,0.7)" fontSize="13" fontFamily="var(--font-sans)">
          {centers[2]?.zoneLabel}
        </text>

        <text
          x="200"
          y="500"
          textAnchor="middle"
          fill="rgba(246,244,240,0.08)"
          fontSize="120"
          fontWeight="800"
          fontFamily="var(--font-display)"
          dy="-8"
        >
          GETAFE
        </text>
      </svg>

      <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-[3px] border-2 border-paper/70 font-display text-sm font-bold text-paper/70">
        L
      </div>
    </div>
  );
}
