import type { ImageKey } from "@/components/ui/Picture";

export type Service = {
  slug: string;
  name: string;
  claim: string;
  image: ImageKey;
  intro: string;
  steps: { title: string; body: string }[];
  covers: string[];
  faqRef?: string;
};

export const services: Service[] = [
  {
    slug: "reafilado",
    name: "Reafilado y reacondicionado",
    claim: "Recupera el filo y la geometría original de tu herramienta.",
    image: "catalogo/fresas",
    intro:
      "Reafilamos herramienta de corte para madera y metal —también de otras marcas— desde 1994. Rectificamos solo el material imprescindible para devolver la arista viva y los ángulos de corte, y revisamos el estado del cuerpo, las plaquitas y las soldaduras.",
    steps: [
      {
        title: "Recepción y diagnóstico",
        body: "Revisamos cada herramienta: desgaste del filo, estado de plaquitas y cuerpo, y número de afilados restantes.",
      },
      {
        title: "Presupuesto por herramienta",
        body: "Te enviamos un presupuesto detallado según el estado de cada pieza, incluyendo reposición de plaquitas si hace falta.",
      },
      {
        title: "Afilado y control",
        body: "Afilamos en rectificadora CNC o, en PCD, por electroerosión y rectificado de diamante. Comprobamos geometría y equilibrado.",
      },
      {
        title: "Entrega",
        body: "Devolvemos la herramienta lista para montar, con el filo y la cota originales, y protegida para el transporte.",
      },
    ],
    covers: [
      "Fresas de mango y de eje (MD y HSS)",
      "Juegos de cuchillas y portacuchillas",
      "Sierras circulares de metal duro",
      "Herramienta con filos de diamante (PCD)",
      "Brocas y herramienta de metal duro",
    ],
  },
  {
    slug: "fabricacion-a-medida",
    name: "Fabricación a medida",
    claim: "La herramienta especial que tu perfil y tu máquina necesitan.",
    image: "catalogo/fabricacion",
    intro:
      "Es el servicio que ha definido a Sema-Dur desde 1976. Estudiamos el perfil, el material y la máquina para diseñar y fabricar la herramienta óptima: desde una fresa de eje hasta grupos de perfilado combinados. Trabajamos a partir de plano, archivo DXF o una muestra física de la pieza.",
    steps: [
      {
        title: "Consulta técnica",
        body: "Nos envías el plano, el DXF o la muestra, junto con el material a cortar y los datos de la máquina.",
      },
      {
        title: "Diseño de la herramienta",
        body: "Nuestro equipo define geometría, materiales de filo, número de dientes y sistema de sujeción.",
      },
      {
        title: "Presupuesto y plazo",
        body: "Recibes un presupuesto cerrado con el plazo de fabricación según la carga del taller.",
      },
      {
        title: "Fabricación y prueba",
        body: "Fabricamos en máquinas automáticas para garantizar la repetibilidad entre ejemplares y lotes.",
      },
    ],
    covers: [
      "Portacuchillas de perfilado",
      "Fresas de eje y de mango perfiladas",
      "Herramienta combinada y grupos de perfilar",
      "Herramienta de PCD para grandes series",
      "Utillaje especial para CNC",
    ],
  },
];

export const servicesBySlug: Record<string, Service> = Object.fromEntries(
  services.map((s) => [s.slug, s]),
);
