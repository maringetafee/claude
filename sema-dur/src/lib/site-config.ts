/**
 * Central configuration: real company data taken from sema-dur.com,
 * navigation model and legal links. No invented values.
 */

export const siteConfig = {
  name: "Sema-Dur",
  brand: "Diacort",
  legalName: "Talleres Sema-Dur, S.L.",
  domain: "https://www.sema-dur.com",
  founded: 1976,
  tagline:
    "Fabricantes de herramientas de corte para madera y metal. Tecnología PCD desde 1994.",
  description:
    "Talleres Sema-Dur (marca Diacort) diseña, fabrica y reafila herramientas de corte a medida para madera y metal desde 1976. Distribuidor oficial de Freud y Ceratizit.",

  phone: { display: "91 615 05 48", href: "tel:+34916150548" },
  mobile: { display: "635 942 064", href: "tel:+34635942064" },
  whatsapp: {
    display: "635 942 064",
    href: "https://wa.me/34635942064",
  },
  email: "administracion@sema-dur.com",

  address: {
    street: "Av. de las Flores, 7",
    postalCode: "28970",
    city: "Humanes de Madrid",
    region: "Madrid",
    country: "ES",
    full: "Av. de las Flores, 7, 28970 Humanes de Madrid, Madrid",
    mapsUrl: "https://www.google.com/maps/place/Talleres+Sema+Dur+SL",
    geo: { lat: 40.26823, lng: -3.83571 },
  },

  hours: "Lunes a viernes, 8:00–17:00",

  social: {
    facebook: "https://www.facebook.com/semadursl",
    instagram: "https://www.instagram.com/talleres_semadur/",
  },

  suppliers: [
    { name: "Freud", url: "https://freud-espana.com/" },
    { name: "Ceratizit", url: "https://www.ceratizit.com/" },
  ],

  /** Public funding disclosure — must stay in the footer (legal obligation). */
  fundingNotice:
    "Se ha recibido apoyo financiero mediante la concesión de un préstamo de Reindustrialización (Convocatoria 2019) por parte de la Dirección General de Industria y de la Pequeña y Mediana Empresa (Ministerio de Industria, Comercio y Turismo), por importe de principal de 324.363,00 €, para el desarrollo del proyecto «Modernización tecnológica línea producción» (Talleres Sema Dur SL).",

  /** VAT rate used for informational breakdowns in the quote request. */
  vatRate: 0.21,
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export const primaryNav: NavItem[] = [
  {
    label: "Productos",
    href: "/productos",
    children: [
      {
        label: "Herramientas de diamante (PCD)",
        href: "/productos/herramientas-pcd",
        description: "Alto volumen de producción y máxima precisión.",
      },
      {
        label: "Portacuchillas y cuchillas MD-HSS",
        href: "/productos/portacuchillas-cuchillas",
        description: "Cuchillas estándar y especiales para perfilado.",
      },
      {
        label: "Fresas MD-HSS",
        href: "/productos/fresas-md-hss",
        description: "Fresas perfiladas en máquinas automáticas.",
      },
      {
        label: "Portaherramientas y accesorios CNC",
        href: "/productos/portaherramientas-cnc",
        description: "Conos, pinzas y adaptadores para centros de mecanizado.",
      },
      {
        label: "Fresas y brocas de metal duro",
        href: "/productos/fresas-brocas-metal-duro",
        description: "Línea robotizada de fresas enterizas para taladrar y contornear.",
      },
    ],
  },
  {
    label: "Servicios",
    href: "/servicios",
    children: [
      {
        label: "Reafilado y reacondicionado",
        href: "/servicios/reafilado",
        description: "Recuperación del filo y geometría original de la herramienta.",
      },
      {
        label: "Fabricación a medida",
        href: "/servicios/fabricacion-a-medida",
        description: "Herramienta especial diseñada para tu aplicación.",
      },
    ],
  },
  { label: "Empresa", href: "/empresa" },
  { label: "Distribuidores", href: "/distribuidores" },
  { label: "Blog", href: "/blog" },
  { label: "Contacto", href: "/contacto" },
];

export const footerColumns = [
  {
    title: "Catálogo",
    links: [
      { label: "Herramientas PCD", href: "/productos/herramientas-pcd" },
      {
        label: "Portacuchillas y cuchillas",
        href: "/productos/portacuchillas-cuchillas",
      },
      { label: "Fresas MD-HSS", href: "/productos/fresas-md-hss" },
      { label: "Portaherramientas CNC", href: "/productos/portaherramientas-cnc" },
      {
        label: "Fresas y brocas de metal duro",
        href: "/productos/fresas-brocas-metal-duro",
      },
      { label: "Ver todo el catálogo", href: "/productos" },
    ],
  },
  {
    title: "Servicios",
    links: [
      { label: "Reafilado", href: "/servicios/reafilado" },
      { label: "Fabricación a medida", href: "/servicios/fabricacion-a-medida" },
      { label: "Realiza tu pedido", href: "/realiza-tu-pedido" },
      { label: "Solicitar presupuesto", href: "/checkout" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Conócenos", href: "/empresa" },
      { label: "Distribuidores oficiales", href: "/distribuidores" },
      { label: "Blog", href: "/blog" },
      { label: "Trabaja con nosotros", href: "/trabaja-con-nosotros" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

export const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
  { label: "Condiciones de compra", href: "/condiciones-de-compra" },
  { label: "Envíos y devoluciones", href: "/envios-y-devoluciones" },
];

export const accountNav = [
  { label: "Mis solicitudes", href: "/cuenta/solicitudes" },
  { label: "Mis datos", href: "/cuenta/datos" },
  { label: "Direcciones", href: "/cuenta/direcciones" },
];
