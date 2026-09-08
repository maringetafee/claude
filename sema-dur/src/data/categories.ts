import type { ImageKey } from "@/components/ui/Picture";

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  /** One-line claim, drawn from the current sema-dur.com copy. */
  claim: string;
  /** 2–3 sentence description shown on the category page. */
  intro: string;
  image: ImageKey;
  imagePosition?: string;
  order: number;
};

/**
 * The five real product families described on
 * sema-dur.com/tipos-de-herramientas-de-corte. No families invented.
 */
export const categories: Category[] = [
  {
    slug: "herramientas-pcd",
    name: "Herramientas de diamante (PCD)",
    shortName: "Herramientas PCD",
    claim: "Producción de alto volumen con la máxima precisión y duración de filo.",
    intro:
      "Herramienta de corte con plaquitas de diamante policristalino para el mecanizado de tableros, aglomerados, laminados, aluminio y materiales abrasivos. Sema-Dur fue una de las primeras empresas en España en aplicar el PCD a los procesos de corte de la madera, en 1994.",
    image: "catalogo/pcd",
    order: 1,
  },
  {
    slug: "portacuchillas-cuchillas",
    name: "Portacuchillas, cuchillas estándar y especiales MD-HSS",
    shortName: "Portacuchillas y cuchillas",
    claim: "Sistemas de perfilado con cuchilla reversible para grandes tiradas.",
    intro:
      "Portacuchillas de aluminio equilibrado y juegos de cuchillas MD (metal duro) y HSS, estándar o mecanizadas a perfil. Pensados para moldurado, ranurado y perfilado en carpintería y fabricación de mueble.",
    image: "catalogo/cuchillas",
    order: 2,
  },
  {
    slug: "fresas-md-hss",
    name: "Fresas MD-HSS",
    shortName: "Fresas MD-HSS",
    claim: "Fresas perfiladas en máquinas automáticas para un filo repetible.",
    intro:
      "Fresas con mango y de eje para tupí y CNC, en metal duro o acero rápido, con perfil recto o mecanizado. Se fabrican y afilan en centros automáticos para garantizar la constancia del perfil entre lotes.",
    image: "catalogo/fresas",
    order: 3,
  },
  {
    slug: "portaherramientas-cnc",
    name: "Portaherramientas y accesorios para CNC",
    shortName: "Portaherramientas CNC",
    claim: "Conos, pinzas y adaptadores para centros de mecanizado.",
    intro:
      "Línea de sujeción y adaptación para quienes trabajan con centros de control numérico: conos HSK y ISO, portapinzas, pinzas de precisión, tuercas y prolongadores. Una línea para necesidades más específicas.",
    image: "catalogo/herramientas-corte",
    imagePosition: "center 40%",
    order: 4,
  },
  {
    slug: "fresas-brocas-metal-duro",
    name: "Fresas y brocas de metal duro para taladrar y contornear",
    shortName: "Fresas y brocas de metal duro",
    claim: "Línea robotizada de fresas enterizas para taladrar y contornear.",
    intro:
      "Brocas y fresas enterizas de metal duro para taladrado, contorneado y acabado. Fabricación robotizada que permite geometrías consistentes y afilados de repetición.",
    image: "catalogo/fabricacion",
    order: 5,
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const categoriesBySlug: Record<string, Category> = Object.fromEntries(
  categories.map((c) => [c.slug, c]),
);
