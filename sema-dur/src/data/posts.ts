import type { ImageKey } from "@/components/ui/Picture";

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  readingMinutes: number;
  excerpt: string;
  image: ImageKey;
  /** Body as an ordered list of blocks. Neutral technical guidance — no company claims. */
  body: { type: "p" | "h2" | "ul"; text?: string; items?: string[] }[];
};

/**
 * Evergreen technical articles on the same topics the current sema-dur.com blog
 * covers (PCD, reafilado, fabricación a medida, corte en tablero). Written as
 * general guidance, not as claims about the company.
 */
export const posts: Post[] = [
  {
    slug: "cuando-conviene-una-herramienta-de-diamante-pcd",
    title: "Cuándo conviene una herramienta de diamante (PCD)",
    date: "2026-06-18",
    readingMinutes: 4,
    excerpt:
      "El diamante policristalino multiplica la vida del filo, pero no en todos los trabajos. Estas son las señales de que tu proceso pide PCD.",
    image: "catalogo/pcd",
    body: [
      {
        type: "p",
        text: "El diamante policristalino (PCD) es hoy el material de filo más duradero para el corte de la madera y de muchos materiales no férricos. Frente al metal duro, una herramienta de PCD puede recorrer entre 20 y 100 veces más metros lineales antes de necesitar reafilado, según el material. Esa diferencia solo compensa cuando el proceso reúne ciertas condiciones.",
      },
      { type: "h2", text: "Señales de que tu proceso pide PCD" },
      {
        type: "ul",
        items: [
          "Cortas materiales abrasivos: tablero aglomerado, MDF, melamina, HPL, fibra o composites.",
          "Trabajas en serie y cada cambio de herramienta detiene una línea.",
          "Necesitas mantener la cota y la calidad de canto constantes durante toda la tirada.",
          "El coste de las paradas de máquina para afilar supera el sobrecoste de la herramienta.",
        ],
      },
      { type: "h2", text: "Cuándo no merece la pena" },
      {
        type: "p",
        text: "En series cortas, en madera maciza blanda o cuando la herramienta cambia de perfil con frecuencia, el metal duro suele ofrecer mejor relación coste-resultado. El PCD tampoco tolera bien los impactos: si hay riesgo de clavos, grapas o inclusiones, conviene valorarlo.",
      },
      { type: "h2", text: "Antes de decidir" },
      {
        type: "p",
        text: "La elección depende del material, de la máquina y del volumen. Un cálculo sencillo de coste por metro cortado —incluyendo herramienta, afilados y tiempo de parada— casi siempre despeja la duda. Si quieres, lo revisamos contigo a partir de tu caso concreto.",
      },
    ],
  },
  {
    slug: "reafilado-cuantas-vidas-tiene-una-herramienta-de-corte",
    title: "Reafilado: cuántas vidas tiene una herramienta de corte",
    date: "2026-04-30",
    readingMinutes: 5,
    excerpt:
      "Una herramienta de corte no se tira cuando pierde el filo. Cómo funciona el reafilado y qué se puede recuperar.",
    image: "catalogo/fresas",
    body: [
      {
        type: "p",
        text: "El filo de una fresa, una cuchilla o una sierra se desgasta con el uso: el radio del filo aumenta, el corte pierde limpieza y la máquina necesita más potencia. Antes de reponer la herramienta, en la mayoría de los casos se puede reafilar.",
      },
      { type: "h2", text: "Qué hace el reafilado" },
      {
        type: "p",
        text: "El reafilado rectifica el material de filo hasta recuperar la arista viva y los ángulos de corte originales. En herramienta de metal duro se hace en rectificadora CNC; en PCD, por electroerosión y rectificado de diamante. En ambos casos se retira solo el material imprescindible.",
      },
      { type: "h2", text: "Cuántas veces se puede reafilar" },
      {
        type: "ul",
        items: [
          "Fresas y sierras de metal duro: varios afilados hasta agotar la plaquita o la altura útil del diente.",
          "Herramienta de PCD: normalmente entre 5 y 10 afilados, según el espesor de la capa de diamante.",
          "Juegos de cuchillas: hasta llegar a la cota mínima de seguridad del portacuchillas.",
        ],
      },
      { type: "h2", text: "Buenas prácticas" },
      {
        type: "ul",
        items: [
          "Retira la herramienta antes de que el filo colapse: un desgaste moderado se recupera con menos material.",
          "Protege los filos durante el transporte y el almacenaje.",
          "Lleva un control del número de afilados de cada herramienta.",
          "Reafila juegos completos a la vez para mantenerlos equilibrados.",
        ],
      },
      {
        type: "p",
        text: "El presupuesto de reafilado se hace por herramienta, en función de su estado. Si nos indicas qué tienes y en qué condiciones, te damos una estimación.",
      },
    ],
  },
  {
    slug: "fabricacion-a-medida-como-preparar-tu-consulta",
    title: "Fabricación a medida: cómo preparar tu consulta",
    date: "2026-05-14",
    readingMinutes: 4,
    excerpt:
      "Una herramienta especial se diseña a partir de datos. Qué información acelera el presupuesto y evita idas y vueltas.",
    image: "catalogo/fabricacion",
    body: [
      {
        type: "p",
        text: "Cuando el catálogo no cubre un trabajo, la herramienta se diseña a medida. Cuanta más información aportes al principio, más rápido y más ajustado será el presupuesto.",
      },
      { type: "h2", text: "Datos del perfil o la operación" },
      {
        type: "ul",
        items: [
          "Plano acotado, archivo DXF o una muestra física de la pieza a mecanizar.",
          "Material a cortar y, si lo conoces, su dureza o densidad.",
          "Operación: perfilar, ranurar, calibrar, taladrar, contornear…",
          "Acabado exigido y tolerancias.",
        ],
      },
      { type: "h2", text: "Datos de la máquina" },
      {
        type: "ul",
        items: [
          "Tipo de máquina: tupí, moldurera, CNC, seccionadora…",
          "Diámetro de eje o tipo de cono (HSK, ISO) y sentido de giro.",
          "Rango de revoluciones y de avance.",
          "Restricciones de diámetro máximo o de voladizo.",
        ],
      },
      { type: "h2", text: "Volumen y plazo" },
      {
        type: "p",
        text: "Indica la cantidad estimada y si es una serie repetitiva o un encargo puntual. El plazo depende de la carga del taller en cada momento; lo confirmamos con el presupuesto.",
      },
    ],
  },
  {
    slug: "como-mantener-un-corte-limpio-en-tableros-recubiertos",
    title: "Cómo mantener un corte limpio en tableros recubiertos",
    date: "2026-02-20",
    readingMinutes: 4,
    excerpt:
      "Astillado en melamina y laminado: por qué aparece y qué ajustes de herramienta y máquina lo corrigen.",
    image: "catalogo/herramientas-corte",
    body: [
      {
        type: "p",
        text: "El astillado del recubrimiento al cortar tablero melaminado o laminado casi siempre tiene que ver con la geometría de la herramienta, su estado de filo o los parámetros de corte. Repasando estos puntos se resuelve la mayoría de los casos.",
      },
      { type: "h2", text: "Herramienta" },
      {
        type: "ul",
        items: [
          "Filo en buen estado: un filo redondeado arrastra y arranca el recubrimiento.",
          "Geometría adecuada: para canteado, la fresa de compresión deja limpios los dos cantos del tablero.",
          "Número de dientes suficiente para el avance de trabajo.",
          "En seccionadora, incisor bien reglado respecto a la hoja principal.",
        ],
      },
      { type: "h2", text: "Máquina y parámetros" },
      {
        type: "ul",
        items: [
          "Avance por diente dentro del rango recomendado: ni tan alto que astille, ni tan bajo que queme.",
          "Revoluciones acordes al diámetro de la herramienta.",
          "Sujeción firme de la pieza y apoyo cerca de la línea de corte.",
          "Extracción de viruta eficaz para que no se recorte dos veces.",
        ],
      },
      {
        type: "p",
        text: "Si tras revisar estos puntos el problema persiste, suele ser cuestión de adaptar la herramienta al material concreto. Es un ajuste habitual en la fabricación a medida.",
      },
    ],
  },
];

export const postsBySlug: Record<string, Post> = Object.fromEntries(
  posts.map((p) => [p.slug, p]),
);
