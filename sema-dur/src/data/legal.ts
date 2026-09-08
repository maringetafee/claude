import { siteConfig } from "@/lib/site-config";

export type LegalDoc = {
  slug: string;
  title: string;
  description: string;
  /** Section headings the definitive text should cover. */
  outline: string[];
  /** Factual data we can state today (company identification, contact…). */
  facts?: { label: string; value: string }[];
};

const identity = [
  { label: "Titular", value: siteConfig.legalName },
  { label: "Marca comercial", value: siteConfig.brand },
  { label: "Domicilio", value: siteConfig.address.full },
  { label: "Teléfono", value: siteConfig.phone.display },
  { label: "Email", value: siteConfig.email },
];

export const legalDocs: LegalDoc[] = [
  {
    slug: "aviso-legal",
    title: "Aviso legal",
    description:
      "Información general sobre el titular del sitio web sema-dur.com y las condiciones de uso.",
    facts: identity,
    outline: [
      "Datos identificativos del titular",
      "Objeto y ámbito de aplicación",
      "Condiciones de acceso y uso del sitio",
      "Propiedad intelectual e industrial",
      "Responsabilidad sobre contenidos y enlaces",
      "Legislación aplicable y jurisdicción",
    ],
  },
  {
    slug: "politica-de-privacidad",
    title: "Política de privacidad",
    description:
      "Cómo Talleres Sema-Dur trata los datos personales que recibe a través del sitio web.",
    facts: identity,
    outline: [
      "Responsable del tratamiento",
      "Datos que se recogen y finalidad (contacto, presupuestos, pedidos)",
      "Base jurídica del tratamiento",
      "Plazos de conservación",
      "Destinatarios y encargados de tratamiento",
      "Derechos de las personas usuarias (acceso, rectificación, supresión…)",
      "Medidas de seguridad",
    ],
  },
  {
    slug: "politica-de-cookies",
    title: "Política de cookies",
    description:
      "Información sobre las cookies y tecnologías similares utilizadas en sema-dur.com.",
    outline: [
      "Qué son las cookies",
      "Tipos de cookies utilizadas (técnicas, analíticas, de terceros)",
      "Finalidad de cada cookie",
      "Cómo configurar o rechazar las cookies",
      "Cookies de servicios de terceros (mapas, vídeo, analítica)",
    ],
  },
  {
    slug: "condiciones-de-compra",
    title: "Condiciones de compra",
    description:
      "Condiciones aplicables a los pedidos y solicitudes de presupuesto realizados a través de la web.",
    outline: [
      "Proceso de solicitud de presupuesto y confirmación de pedido",
      "Precios, impuestos (IVA) y validez de los presupuestos",
      "Formas de pago",
      "Plazos de fabricación y entrega",
      "Herramienta a medida: particularidades",
      "Garantía de producto y servicio de reafilado",
    ],
  },
  {
    slug: "envios-y-devoluciones",
    title: "Envíos y devoluciones",
    description:
      "Condiciones de envío, plazos y política de devoluciones de los pedidos.",
    outline: [
      "Zonas de envío (España, Portugal y exportación)",
      "Gastos de envío y cálculo",
      "Plazos de entrega estimados",
      "Comprobación de la mercancía a la recepción",
      "Devoluciones y desistimiento (producto estándar frente a producto a medida)",
      "Incidencias y transporte",
    ],
  },
];

export const legalBySlug: Record<string, LegalDoc> = Object.fromEntries(
  legalDocs.map((d) => [d.slug, d]),
);
