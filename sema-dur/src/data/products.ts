import type { ImageKey } from "@/components/ui/Picture";
import { categoriesBySlug } from "./categories";

export type Availability = "consultar" | "a-medida" | "bajo-pedido";

export type ProductVariantGroup = {
  /** e.g. "Diámetro", "Material", "Z (nº de dientes)" */
  label: string;
  options: string[];
};

export type Product = {
  id: string;
  slug: string;
  /** Internal Sema-Dur catalogue reference (organisational, not a manufacturer P/N). */
  ref: string;
  name: string;
  categorySlug: string;
  kind: "producto" | "servicio";
  sectors: string[];
  materials: ("madera" | "metal")[];
  summary: string;
  description: string;
  features: string[];
  /** Configurable parameters — this is made-to-order tooling, values are defined per order. */
  specs: { label: string; value: string }[];
  variants?: ProductVariantGroup[];
  availability: Availability;
  /** Image key; most products share their family photo (no invented product shots). */
  image?: ImageKey;
  imagePosition?: string;
  featured?: boolean;
  /** Optional supporting document (kept null until real datasheets are provided). */
  datasheet?: string | null;
};

/** Human labels for availability states. */
export const availabilityLabel: Record<Availability, string> = {
  consultar: "Consultar disponibilidad",
  "a-medida": "Fabricación a medida",
  "bajo-pedido": "Bajo pedido",
};

const P = (p: Product): Product => p;

export const products: Product[] = [
  // ─────────────────────────── Herramientas PCD ───────────────────────────
  P({
    id: "pcd-sierra-circular",
    slug: "sierra-circular-pcd",
    ref: "PCD-SC",
    name: "Sierra circular con dientes de diamante (PCD)",
    categorySlug: "herramientas-pcd",
    kind: "producto",
    sectors: ["mueble-tablero", "carpinteria-madera", "plasticos-composites"],
    materials: ["madera"],
    summary:
      "Disco de seccionado y escuadrado para tablero melaminado, laminado y aglomerado con vida de filo muy alta.",
    description:
      "Sierra circular con plaquitas de diamante policristalino para líneas de corte de tablero y seccionadoras. El PCD multiplica el número de metros lineales entre afilados frente al metal duro, reduciendo paradas de máquina en producciones de alto volumen.",
    features: [
      "Cuerpo de acero tensionado y equilibrado",
      "Dientes de PCD soldados por inducción",
      "Geometría de diente y ángulos definidos según material y máquina",
      "Reafilable en las instalaciones de Sema-Dur",
    ],
    specs: [
      { label: "Diámetro", value: "A definir según máquina" },
      { label: "Eje", value: "A definir" },
      { label: "Nº de dientes (Z)", value: "Según aplicación" },
      { label: "Filo", value: "Diamante policristalino (PCD)" },
      { label: "Fabricación", value: "A medida / bajo pedido" },
    ],
    variants: [
      { label: "Aplicación", options: ["Seccionado", "Escuadrado", "Corte de laminado"] },
    ],
    availability: "a-medida",
    image: "catalogo/pcd",
    featured: true,
    datasheet: null,
  }),
  P({
    id: "pcd-fresa-cnc",
    slug: "fresa-pcd-para-cnc",
    ref: "PCD-FR",
    name: "Fresa PCD para CNC",
    categorySlug: "herramientas-pcd",
    kind: "producto",
    sectors: ["mueble-tablero", "aluminio-pvc", "plasticos-composites"],
    materials: ["madera", "metal"],
    summary:
      "Fresa de diamante para mecanizado de tablero, compacto y aluminio en centros de control numérico.",
    description:
      "Fresa con filos de PCD para trabajos de contorneado, recorte y acabado en CNC sobre materiales abrasivos. Mantiene cota y calidad de canto durante toda la vida útil de la herramienta.",
    features: [
      "1, 2 o 3 filos de PCD según acabado y avance",
      "Mango cilíndrico para portapinzas",
      "Rompevirutas opcional para tableros gruesos",
      "Equilibrado para altas revoluciones",
    ],
    specs: [
      { label: "Diámetro de corte", value: "A definir" },
      { label: "Longitud de corte", value: "A definir" },
      { label: "Mango", value: "Cilíndrico, Ø a definir" },
      { label: "Filo", value: "PCD" },
      { label: "Fabricación", value: "A medida" },
    ],
    availability: "a-medida",
    image: "catalogo/pcd",
    featured: true,
  }),
  P({
    id: "pcd-plato-ranurar",
    slug: "plato-ranurador-pcd",
    ref: "PCD-PR",
    name: "Plato ranurador PCD",
    categorySlug: "herramientas-pcd",
    kind: "producto",
    sectors: ["mueble-tablero", "carpinteria-madera"],
    materials: ["madera"],
    summary:
      "Herramienta de ranurado de anchura fija o ajustable con filos de diamante.",
    description:
      "Plato para ejecutar ranuras de fondo de cajón, trasera de armario o encastres en tablero con canto limpio. Disponible en versión de anchura fija o con juego de arandelas para ajuste fino.",
    features: [
      "Anchura de ranura a especificar",
      "Filos de PCD para máxima durabilidad en melamina",
      "Versión fija o ajustable",
      "Cuerpo equilibrado",
    ],
    specs: [
      { label: "Anchura de ranura", value: "A definir" },
      { label: "Diámetro exterior", value: "A definir" },
      { label: "Eje", value: "A definir" },
      { label: "Filo", value: "PCD" },
    ],
    availability: "a-medida",
    image: "catalogo/pcd",
  }),
  P({
    id: "pcd-portacuchillas-diamante",
    slug: "portacuchillas-pcd",
    ref: "PCD-PC",
    name: "Portacuchillas con inserto de diamante",
    categorySlug: "herramientas-pcd",
    kind: "producto",
    sectors: ["mueble-tablero", "carpinteria-madera"],
    materials: ["madera"],
    summary:
      "Cabezal de perfilado con plaquitas de PCD para moldura y calibrado en grandes series.",
    description:
      "Portacuchillas de perfilado equipado con insertos de diamante para trabajos de calibrado y moldurado continuo en líneas de fabricación de mueble y puertas.",
    features: [
      "Cuerpo de aluminio de alta resistencia",
      "Insertos de PCD intercambiables",
      "Perfil mecanizado según plano del cliente",
      "Sistema antirretroceso",
    ],
    specs: [
      { label: "Diámetro de vuelo", value: "A definir" },
      { label: "Anchura útil", value: "A definir" },
      { label: "Eje", value: "A definir" },
      { label: "Perfil", value: "Según plano" },
    ],
    availability: "a-medida",
    image: "catalogo/cuchillas",
  }),

  // ───────────────────── Portacuchillas y cuchillas MD-HSS ─────────────────────
  P({
    id: "pc-aluminio-reversible",
    slug: "portacuchillas-aluminio-reversible",
    ref: "PC-AL",
    name: "Portacuchillas de aluminio con cuchilla reversible",
    categorySlug: "portacuchillas-cuchillas",
    kind: "producto",
    sectors: ["carpinteria-madera", "mueble-tablero"],
    materials: ["madera"],
    summary:
      "Cabezal de perfilado ligero para tupí y moldurera con cuchillas de metal duro reversibles.",
    description:
      "Portacuchillas de aluminio equilibrado que admite cuchillas reversibles de metal duro. Al agotarse un filo se gira la cuchilla, reduciendo el coste por metro y las paradas para afilado.",
    features: [
      "Cuerpo de aluminio equilibrado dinámicamente",
      "Cuchillas reversibles de MD",
      "Cambio de cuchilla sin desmontar el cabezal",
      "Limitador de profundidad de pasada",
    ],
    specs: [
      { label: "Diámetro", value: "A definir (habitual 120–140 mm)" },
      { label: "Anchura", value: "A definir" },
      { label: "Eje", value: "1 1/4\" u otro a definir" },
      { label: "Cuchillas", value: "Reversibles MD" },
    ],
    variants: [{ label: "Eje", options: ['30 mm', '1 1/4"', '40 mm'] }],
    availability: "consultar",
    image: "catalogo/cuchillas",
    featured: true,
  }),
  P({
    id: "pc-cuchillas-estandar-md",
    slug: "cuchillas-estandar-md",
    ref: "CU-MD-STD",
    name: "Juego de cuchillas estándar de metal duro",
    categorySlug: "portacuchillas-cuchillas",
    kind: "producto",
    sectors: ["carpinteria-madera", "mueble-tablero"],
    materials: ["madera"],
    summary:
      "Cuchillas rectas de MD para cepillado y regruesado, en medidas de catálogo.",
    description:
      "Cuchillas rectas de metal duro para cabezales de cepilladora y regruesadora. Formato estándar, listas para servir según medida.",
    features: [
      "Metal duro de grano fino",
      "Rectificado de precisión en toda la longitud",
      "Medidas normalizadas",
      "Filo simétrico para ambos sentidos",
    ],
    specs: [
      { label: "Longitud", value: "A elegir (260–640 mm habitual)" },
      { label: "Sección", value: "Estándar" },
      { label: "Material", value: "Metal duro (MD)" },
    ],
    variants: [
      { label: "Longitud", options: ["260 mm", "310 mm", "410 mm", "510 mm", "640 mm"] },
    ],
    availability: "consultar",
    image: "catalogo/cuchillas",
  }),
  P({
    id: "pc-cuchillas-perfiladas",
    slug: "cuchillas-perfiladas-a-medida",
    ref: "CU-PERF",
    name: "Cuchillas perfiladas a medida (MD / HSS)",
    categorySlug: "portacuchillas-cuchillas",
    kind: "producto",
    sectors: ["carpinteria-madera", "mueble-tablero"],
    materials: ["madera"],
    summary:
      "Cuchillas mecanizadas al perfil de tu moldura a partir de plano o muestra física.",
    description:
      "Fabricamos juegos de cuchillas con el contraperfil de tu molduración: rodapié, jamba, tapajuntas, pasamanos o perfiles de ventana. Trabajamos desde plano, DXF o una muestra de la pieza.",
    features: [
      "Metal duro o acero rápido (HSS) según serie",
      "Mecanizado por electroerosión de hilo",
      "Reproducción a partir de muestra física",
      "Juego equilibrado en peso",
    ],
    specs: [
      { label: "Perfil", value: "Según plano / muestra" },
      { label: "Material", value: "MD o HSS" },
      { label: "Espesor", value: "A definir" },
      { label: "Plazo", value: "Consultar según carga de taller" },
    ],
    variants: [{ label: "Material", options: ["Metal duro (MD)", "Acero rápido (HSS)"] }],
    availability: "a-medida",
    image: "catalogo/cuchillas",
    featured: true,
  }),
  P({
    id: "pc-limitador",
    slug: "portacuchillas-limitador-seguridad",
    ref: "PC-LIM",
    name: "Portacuchillas con limitador de seguridad",
    categorySlug: "portacuchillas-cuchillas",
    kind: "producto",
    sectors: ["carpinteria-madera"],
    materials: ["madera"],
    summary:
      "Cabezal de tupí con limitadores conforme a la norma de avance manual.",
    description:
      "Portacuchillas para trabajo con avance manual en tupí, con limitadores que restringen la profundidad de pasada según la normativa de seguridad de máquinas.",
    features: [
      "Limitadores integrados",
      "Apto para avance manual",
      "Cuchillas de MD intercambiables",
      "Marcado MAN",
    ],
    specs: [
      { label: "Diámetro", value: "A definir" },
      { label: "Eje", value: "A definir" },
      { label: "Norma", value: "Limitador de avance manual" },
    ],
    availability: "consultar",
    image: "catalogo/cuchillas",
  }),

  // ─────────────────────────── Fresas MD-HSS ───────────────────────────
  P({
    id: "fr-recta-md",
    slug: "fresa-recta-metal-duro",
    ref: "FR-REC-MD",
    name: "Fresa recta de metal duro con mango",
    categorySlug: "fresas-md-hss",
    kind: "producto",
    sectors: ["carpinteria-madera", "mueble-tablero"],
    materials: ["madera"],
    summary: "Fresa de ranurar y copiar para tupí de mesa y CNC.",
    description:
      "Fresa recta integral o con plaquitas soldadas de metal duro para ranurado, rebaje y copiado en madera maciza y tablero.",
    features: [
      "1 o 2 cortes",
      "Mango de 8, 12 o a definir",
      "Metal duro de grano fino",
      "Opción de rodamiento guía",
    ],
    specs: [
      { label: "Diámetro de corte", value: "A elegir" },
      { label: "Longitud de corte", value: "A elegir" },
      { label: "Mango", value: "8 / 12 mm" },
      { label: "Material", value: "MD" },
    ],
    variants: [{ label: "Mango", options: ["8 mm", "12 mm", "1/2\""] }],
    availability: "consultar",
    image: "catalogo/fresas",
    featured: true,
  }),
  P({
    id: "fr-perfilada-eje",
    slug: "fresa-perfilada-de-eje",
    ref: "FR-PERF",
    name: "Fresa perfilada de eje",
    categorySlug: "fresas-md-hss",
    kind: "producto",
    sectors: ["carpinteria-madera", "mueble-tablero"],
    materials: ["madera"],
    summary:
      "Fresa de eje con perfil mecanizado para moldura, junta o galce, perfilada en máquina automática.",
    description:
      "Fresa montada al eje de la tupí con el perfil de tu pieza. El perfilado se realiza en centro automático para asegurar que todos los ejemplares de un pedido sean idénticos.",
    features: [
      "Perfil según plano o muestra",
      "Cuerpo de acero con plaquitas de MD",
      "Perfilado automático de repetición",
      "Reafilable",
    ],
    specs: [
      { label: "Diámetro", value: "A definir" },
      { label: "Eje", value: "A definir" },
      { label: "Perfil", value: "Según plano" },
      { label: "Material del filo", value: "MD" },
    ],
    availability: "a-medida",
    image: "catalogo/fresas",
  }),
  P({
    id: "fr-hss-integral",
    slug: "fresa-hss-integral",
    ref: "FR-HSS",
    name: "Fresa integral de acero rápido (HSS)",
    categorySlug: "fresas-md-hss",
    kind: "producto",
    sectors: ["carpinteria-madera"],
    materials: ["madera"],
    summary:
      "Fresa HSS para maderas blandas y series cortas donde prima el acabado fino.",
    description:
      "Fresa enteriza de acero rápido, indicada para maderas blandas, contrachapados y trabajos de acabado donde el HSS ofrece un corte muy limpio a bajo coste.",
    features: [
      "Acero rápido de calidad",
      "Filo vivo para acabado fino",
      "Reafilado sencillo",
      "Geometría helicoidal opcional",
    ],
    specs: [
      { label: "Diámetro", value: "A elegir" },
      { label: "Mango", value: "A definir" },
      { label: "Material", value: "HSS" },
    ],
    availability: "consultar",
    image: "catalogo/fresas",
  }),
  P({
    id: "fr-compresion-cnc",
    slug: "fresa-compresion-cnc",
    ref: "FR-COMP",
    name: "Fresa de compresión para CNC",
    categorySlug: "fresas-md-hss",
    kind: "producto",
    sectors: ["mueble-tablero", "plasticos-composites"],
    materials: ["madera"],
    summary:
      "Corte helicoidal positivo-negativo para cantear tablero recubierto por ambas caras sin astillar.",
    description:
      "Fresa de metal duro con hélice de compresión para el nesting y el canteado de tablero melaminado o chapado: empuja la fibra hacia el interior por arriba y por abajo, dejando los dos cantos limpios.",
    features: [
      "Hélice de compresión",
      "Metal duro micrograno",
      "1+1 o 2+2 filos",
      "Mango para portapinzas",
    ],
    specs: [
      { label: "Diámetro", value: "A elegir" },
      { label: "Longitud de compresión", value: "Según espesor de tablero" },
      { label: "Mango", value: "A definir" },
      { label: "Material", value: "MD micrograno" },
    ],
    availability: "consultar",
    image: "catalogo/fresas",
    featured: true,
  }),

  // ──────────────────── Portaherramientas y accesorios CNC ────────────────────
  P({
    id: "cnc-cono-hsk",
    slug: "cono-hsk-portapinzas",
    ref: "CNC-HSK",
    name: "Cono HSK portapinzas",
    categorySlug: "portaherramientas-cnc",
    kind: "producto",
    sectors: ["mueble-tablero", "metal-cnc"],
    materials: ["madera", "metal"],
    summary:
      "Portaherramientas HSK-F63 / HSK-A63 para centros de mecanizado de madera y metal.",
    description:
      "Cono HSK equilibrado para el amarre de pinzas ER en centros de control numérico. Disponible en las tomas más habituales del sector.",
    features: [
      "Equilibrado G2.5 a alta revolución",
      "Rosca para pinza ER32 / ER40",
      "Refrigeración por el centro (opcional)",
      "Trazabilidad por grabado láser",
    ],
    specs: [
      { label: "Toma", value: "HSK-F63 / HSK-A63" },
      { label: "Pinza", value: "ER32 / ER40" },
      { label: "Equilibrado", value: "G2.5" },
    ],
    variants: [
      { label: "Toma", options: ["HSK-F63", "HSK-A63"] },
      { label: "Pinza", options: ["ER32", "ER40"] },
    ],
    availability: "bajo-pedido",
    image: "catalogo/herramientas-corte",
    imagePosition: "center 35%",
    featured: true,
  }),
  P({
    id: "cnc-cono-iso",
    slug: "cono-iso-30",
    ref: "CNC-ISO30",
    name: "Cono ISO 30 portapinzas",
    categorySlug: "portaherramientas-cnc",
    kind: "producto",
    sectors: ["mueble-tablero", "metal-cnc"],
    materials: ["madera", "metal"],
    summary: "Portaherramientas ISO 30 (SK / BT) con alojamiento para pinza ER.",
    description:
      "Cono ISO 30 para máquinas con cambiador automático que utilizan esta toma. Compatible con tirantes DIN estándar.",
    features: [
      "Toma ISO 30 (DIN 69871 / MAS BT)",
      "Alojamiento ER25 / ER32",
      "Tirante a elegir",
      "Equilibrado a petición",
    ],
    specs: [
      { label: "Toma", value: "ISO 30" },
      { label: "Pinza", value: "ER25 / ER32" },
      { label: "Tirante", value: "Según máquina" },
    ],
    variants: [{ label: "Norma", options: ["DIN 69871 (SK)", "MAS 403 (BT)"] }],
    availability: "bajo-pedido",
    image: "catalogo/herramientas-corte",
    imagePosition: "center 35%",
  }),
  P({
    id: "cnc-pinzas-er",
    slug: "pinzas-precision-er",
    ref: "CNC-ER",
    name: "Pinzas de precisión ER",
    categorySlug: "portaherramientas-cnc",
    kind: "producto",
    sectors: ["mueble-tablero", "metal-cnc", "aluminio-pvc"],
    materials: ["madera", "metal"],
    summary: "Pinzas ER de apriete concéntrico para portaherramientas de CNC.",
    description:
      "Juego de pinzas ER con concentricidad de precisión para el amarre de fresas de mango. Cubren rangos de sujeción en saltos de 1 mm.",
    features: [
      "Concentricidad ≤ 0,015 mm (según referencia)",
      "Ranurado para refrigeración",
      "Rango de apriete de 1 mm por pinza",
      "Acero templado y rectificado",
    ],
    specs: [
      { label: "Serie", value: "ER16 / ER20 / ER25 / ER32 / ER40" },
      { label: "Rango por pinza", value: "1 mm" },
      { label: "Concentricidad", value: "Clase de precisión a elegir" },
    ],
    variants: [{ label: "Serie", options: ["ER16", "ER20", "ER25", "ER32", "ER40"] }],
    availability: "consultar",
    image: "catalogo/herramientas-corte",
    imagePosition: "center 35%",
  }),
  P({
    id: "cnc-prolongador",
    slug: "prolongador-portapinzas",
    ref: "CNC-PROL",
    name: "Prolongador portapinzas",
    categorySlug: "portaherramientas-cnc",
    kind: "producto",
    sectors: ["mueble-tablero", "metal-cnc"],
    materials: ["madera", "metal"],
    summary: "Alargador de herramienta para acceder a rebajes y cajeados profundos.",
    description:
      "Prolongador con nariz portapinzas ER para ganar voladizo sin recurrir a fresas de longitud especial. Reduce el coste frente a herramienta enteriza larga.",
    features: [
      "Nariz ER a elegir",
      "Cuerpo templado",
      "Longitud de prolongación a definir",
      "Compatible con conos HSK e ISO",
    ],
    specs: [
      { label: "Nariz", value: "ER20 / ER25 / ER32" },
      { label: "Prolongación", value: "A definir" },
      { label: "Base", value: "Cilíndrica para portapinzas" },
    ],
    availability: "bajo-pedido",
    image: "catalogo/herramientas-corte",
    imagePosition: "center 35%",
  }),
  P({
    id: "cnc-tuercas",
    slug: "tuercas-pinza-er",
    ref: "CNC-TUE",
    name: "Tuercas de pinza ER y accesorios",
    categorySlug: "portaherramientas-cnc",
    kind: "producto",
    sectors: ["mueble-tablero", "metal-cnc"],
    materials: ["madera", "metal"],
    summary: "Tuercas de recambio, llaves y anillos para sistemas de portapinzas ER.",
    description:
      "Recambios de mantenimiento para portaherramientas de CNC: tuercas estándar y de alto par, anillos extractores y llaves específicas.",
    features: [
      "Tuerca estándar o balanceada",
      "Anillo extractor incluido",
      "Llave de gancho o frontal",
      "Series ER16 a ER40",
    ],
    specs: [
      { label: "Serie", value: "ER16 – ER40" },
      { label: "Tipo", value: "Estándar / alto par" },
    ],
    availability: "consultar",
    image: "catalogo/herramientas-corte",
    imagePosition: "center 35%",
  }),

  // ───────────────── Fresas y brocas de metal duro ─────────────────
  P({
    id: "md-broca-integral",
    slug: "broca-metal-duro-integral",
    ref: "MD-BR",
    name: "Broca enteriza de metal duro",
    categorySlug: "fresas-brocas-metal-duro",
    kind: "producto",
    sectors: ["metal-cnc", "aluminio-pvc"],
    materials: ["metal"],
    summary: "Broca integral de MD para taladrado de precisión en metal y aluminio.",
    description:
      "Broca enteriza de metal duro fabricada en línea robotizada, para taladrado de agujeros de tolerancia estrecha en acero, fundición y aleaciones ligeras.",
    features: [
      "Metal duro micrograno",
      "Geometría de punta según material",
      "Canales pulidos para evacuación de viruta",
      "Recubrimiento a elegir",
    ],
    specs: [
      { label: "Diámetro", value: "A definir" },
      { label: "Longitud útil", value: "3xD / 5xD / 8xD" },
      { label: "Recubrimiento", value: "Opcional (TiAlN u otro)" },
      { label: "Mango", value: "Cilíndrico h6" },
    ],
    availability: "bajo-pedido",
    image: "catalogo/fabricacion",
    featured: true,
  }),
  P({
    id: "md-fresa-enteriza",
    slug: "fresa-enteriza-metal-duro",
    ref: "MD-FE",
    name: "Fresa enteriza de metal duro",
    categorySlug: "fresas-brocas-metal-duro",
    kind: "producto",
    sectors: ["metal-cnc", "aluminio-pvc"],
    materials: ["metal"],
    summary:
      "Fresa de MD para contorneado, ranurado y acabado en metal, aluminio y composites.",
    description:
      "Fresa integral de metal duro fabricada de forma robotizada, con número de filos y hélice adaptados al material y a la operación (desbaste o acabado).",
    features: [
      "2, 3, 4 o más filos",
      "Hélice a elegir",
      "Ángulos de corte según material",
      "Recubrimiento opcional",
    ],
    specs: [
      { label: "Diámetro", value: "A definir" },
      { label: "Nº de filos (Z)", value: "Según operación" },
      { label: "Longitud de corte", value: "A definir" },
      { label: "Material", value: "MD micrograno" },
    ],
    availability: "bajo-pedido",
    image: "catalogo/fabricacion",
  }),
  P({
    id: "md-fresa-contornear-madera",
    slug: "fresa-contornear-mango-madera",
    ref: "MD-CT",
    name: "Fresa de contornear con mango para madera",
    categorySlug: "fresas-brocas-metal-duro",
    kind: "producto",
    sectors: ["mueble-tablero", "carpinteria-madera"],
    materials: ["madera"],
    summary: "Fresa de recorte con rodamiento para plantillas y copiado de piezas.",
    description:
      "Fresa de metal duro con mango y rodamiento guía, para recortar piezas siguiendo plantilla en fabricación de mueble y trabajos de serie.",
    features: [
      "Rodamiento superior o inferior",
      "1 o 2 filos de MD",
      "Mango a definir",
      "Ideal para plantilla y copiado",
    ],
    specs: [
      { label: "Diámetro", value: "A elegir" },
      { label: "Longitud de corte", value: "A elegir" },
      { label: "Guía", value: "Rodamiento" },
    ],
    availability: "consultar",
    image: "catalogo/fabricacion",
  }),
  P({
    id: "md-broca-vaciar-cerradura",
    slug: "broca-vaciar-cajeados",
    ref: "MD-BV",
    name: "Broca de vaciar para cajeados",
    categorySlug: "fresas-brocas-metal-duro",
    kind: "producto",
    sectors: ["carpinteria-madera"],
    materials: ["madera"],
    summary:
      "Broca-fresa para vaciado de cajeados de cerradura y bisagra en puertas y ventanas.",
    description:
      "Herramienta de metal duro que taladra y desplaza lateralmente para abrir el cajeado de cerraduras y herrajes embutidos en carpintería de madera.",
    features: [
      "Corte frontal y lateral",
      "Metal duro",
      "Mango cilíndrico",
      "Evacuación de viruta hacia arriba",
    ],
    specs: [
      { label: "Diámetro", value: "A elegir" },
      { label: "Longitud útil", value: "A elegir" },
      { label: "Mango", value: "A definir" },
    ],
    availability: "consultar",
    image: "catalogo/fabricacion",
  }),

  // ─────────────────────────── Servicios cotizables ───────────────────────────
  P({
    id: "srv-reafilado-pcd",
    slug: "reafilado-herramienta-pcd",
    ref: "SRV-RA-PCD",
    name: "Reafilado de herramienta PCD",
    categorySlug: "herramientas-pcd",
    kind: "servicio",
    sectors: ["mueble-tablero", "carpinteria-madera", "metal-cnc"],
    materials: ["madera", "metal"],
    summary:
      "Recuperación del filo de diamante mediante erosión y rectificado, respetando la geometría original.",
    description:
      "Servicio de reafilado de sierras, fresas y portacuchillas con filos de PCD. Se erosiona y rectifica el diamante para devolver el filo y los ángulos originales, prolongando varias veces la vida de la herramienta.",
    features: [
      "Erosión y rectificado de PCD",
      "Control de geometría y equilibrado",
      "Recogida y entrega concertada",
      "Presupuesto por herramienta según estado",
    ],
    specs: [
      { label: "Herramientas", value: "Sierras, fresas, portacuchillas PCD" },
      { label: "Plazo", value: "Consultar según carga de taller" },
      { label: "Presupuesto", value: "Por unidad, según desgaste" },
    ],
    availability: "consultar",
    image: "catalogo/pcd",
    featured: true,
  }),
  P({
    id: "srv-reafilado-md-hss",
    slug: "reafilado-herramienta-md-hss",
    ref: "SRV-RA-MD",
    name: "Reafilado de herramienta MD / HSS",
    categorySlug: "fresas-md-hss",
    kind: "servicio",
    sectors: ["carpinteria-madera", "mueble-tablero"],
    materials: ["madera"],
    summary:
      "Afilado de fresas, cuchillas y portaherramientas de metal duro y acero rápido.",
    description:
      "Servicio de afilado de herramienta de corte para madera: fresas de mango y de eje, juegos de cuchillas, portacuchillas y sierras de MD. Incluye revisión de soldaduras y estado del cuerpo.",
    features: [
      "Afilado en rectificadora CNC",
      "Revisión de plaquitas y soldadura",
      "Reposición de plaquitas si procede",
      "Marcado del número de afilados",
    ],
    specs: [
      { label: "Herramientas", value: "Fresas, cuchillas, sierras MD/HSS" },
      { label: "Servicio adicional", value: "Reposición de plaquitas" },
      { label: "Plazo", value: "Consultar" },
    ],
    availability: "consultar",
    image: "catalogo/fresas",
  }),
  P({
    id: "srv-fabricacion-plano",
    slug: "fabricacion-herramienta-segun-plano",
    ref: "SRV-FAB",
    name: "Fabricación de herramienta especial según plano",
    categorySlug: "portacuchillas-cuchillas",
    kind: "servicio",
    sectors: [
      "carpinteria-madera",
      "mueble-tablero",
      "aluminio-pvc",
      "metal-cnc",
      "plasticos-composites",
    ],
    materials: ["madera", "metal"],
    summary:
      "Diseño y fabricación de herramienta a medida a partir de plano, DXF o muestra de la pieza a mecanizar.",
    description:
      "Nuestro equipo técnico estudia el perfil, el material y la máquina para diseñar y fabricar la herramienta óptima: portacuchillas, fresas de eje, grupos de perfilado o utillaje combinado. Es el servicio que ha definido a Sema-Dur desde 1976.",
    features: [
      "Estudio técnico del requerimiento",
      "Partimos de plano, DXF o muestra física",
      "Herramienta simple o grupos combinados",
      "Documentación de la herramienta entregada",
    ],
    specs: [
      { label: "Entrada", value: "Plano / DXF / muestra" },
      { label: "Tipos", value: "Portacuchillas, fresas, grupos de perfilar" },
      { label: "Plazo", value: "Según proyecto" },
    ],
    availability: "a-medida",
    image: "catalogo/fabricacion",
    featured: true,
  }),
];

// ── Derived helpers ────────────────────────────────────────────────────────

export const productsBySlug: Record<string, Product> = Object.fromEntries(
  products.map((p) => [p.slug, p]),
);

export function getProduct(slug: string): Product | undefined {
  return productsBySlug[slug];
}

export function productsInCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function featuredProducts(limit = 6): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function relatedProducts(product: Product, limit = 3): Product[] {
  return products
    .filter(
      (p) => p.id !== product.id && p.categorySlug === product.categorySlug,
    )
    .concat(
      products.filter(
        (p) =>
          p.id !== product.id &&
          p.categorySlug !== product.categorySlug &&
          p.sectors.some((s) => product.sectors.includes(s)),
      ),
    )
    .slice(0, limit);
}

export function categoryName(slug: string): string {
  return categoriesBySlug[slug]?.shortName ?? slug;
}
