/**
 * Application sectors used as a catalogue filter. Derived from the sectors the
 * current site names ("reformas, construcción, carpintería de madera y aluminio")
 * plus the materials Sema-Dur states it cuts (madera y metal).
 */
export type Sector = {
  slug: string;
  name: string;
};

export const sectors: Sector[] = [
  { slug: "carpinteria-madera", name: "Carpintería de madera" },
  { slug: "mueble-tablero", name: "Mueble y tablero" },
  { slug: "aluminio-pvc", name: "Carpintería de aluminio y PVC" },
  { slug: "metal-cnc", name: "Metal y mecanizado CNC" },
  { slug: "plasticos-composites", name: "Plásticos y composites" },
];

export const sectorsBySlug: Record<string, Sector> = Object.fromEntries(
  sectors.map((s) => [s.slug, s]),
);

/** Material axis — a simple secondary filter. */
export const materials = [
  { slug: "madera", name: "Madera y derivados" },
  { slug: "metal", name: "Metal" },
] as const;
