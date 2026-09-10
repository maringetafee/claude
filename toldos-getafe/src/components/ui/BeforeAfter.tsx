"use client";

import { useId, useState } from "react";
import Image from "next/image";
import type { SiteImage } from "@/data/images";

type BeforeAfterProps = {
  antes: SiteImage;
  despues: SiteImage;
  /** Etiqueta que se muestra arriba a la izquierda (p. ej. el municipio). */
  municipio?: string;
  tipo?: string;
  className?: string;
};

/**
 * Comparador antes / después: imagen "después" de fondo y la "antes"
 * recortada por la izquierda según la posición del control.
 *
 * El control es un <input type="range"> real, así que funciona con
 * teclado (flechas) y lectores de pantalla; el pointer lo arrastra
 * de forma nativa.
 */
export default function BeforeAfter({
  antes,
  despues,
  municipio,
  tipo,
  className = "",
}: BeforeAfterProps) {
  const [pos, setPos] = useState(50);
  const labelId = useId();

  return (
    <figure
      className={`group relative isolate select-none overflow-hidden rounded-2xl bg-ink/40 ${className}`}
    >
      {/* Capa base: después */}
      <Image
        src={despues.src}
        alt={despues.alt}
        width={despues.width}
        height={despues.height}
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="h-full w-full object-cover"
      />

      {/* Capa superior: antes, recortada por la derecha */}
      <div
        className="absolute inset-0 h-full w-full"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image
          src={antes.src}
          alt={antes.alt}
          width={antes.width}
          height={antes.height}
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Etiquetas */}
      <figcaption className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
        {municipio ? (
          <span className="rounded-full bg-ink/70 px-3 py-1 text-xs font-medium text-paper backdrop-blur-sm">
            {municipio}
            {tipo ? ` · ${tipo}` : ""}
          </span>
        ) : (
          <span />
        )}
      </figcaption>
      <span className="pointer-events-none absolute bottom-3 left-3 rounded bg-ink/60 px-2 py-0.5 text-[11px] uppercase tracking-wide text-paper/90 backdrop-blur-sm">
        Antes
      </span>
      <span className="pointer-events-none absolute bottom-3 right-3 rounded bg-ink/60 px-2 py-0.5 text-[11px] uppercase tracking-wide text-paper/90 backdrop-blur-sm">
        Después
      </span>

      {/* Línea divisoria + tirador */}
      <div
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-paper/90 shadow-[0_0_0_1px_rgba(0,0,0,0.25)]"
        style={{ left: `${pos}%` }}
      >
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-paper/80 bg-ink/70 text-paper backdrop-blur-sm">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M9 6l-4 6 4 6M15 6l4 6-4 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      <label id={labelId} className="sr-only">
        Comparar antes y después{municipio ? ` en ${municipio}` : ""}
      </label>
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        aria-labelledby={labelId}
        aria-valuetext={`${pos}% después`}
        onChange={(e) => setPos(Number(e.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize appearance-none bg-transparent opacity-0 focus-visible:opacity-100 [&::-webkit-slider-thumb]:h-full [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-ew-resize [&::-moz-range-thumb]:h-full [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:cursor-ew-resize [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent"
      />
    </figure>
  );
}
