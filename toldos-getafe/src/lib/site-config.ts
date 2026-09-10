export const siteConfig = {
  name: "Toldos Getafe",
  legalName: "Toldos Getafe, S.L.",
  phone: { display: "91 696 37 34", href: "tel:+34916963734" },
  mobile: { display: "609 63 87 47", href: "tel:+34609638747" },
  // WhatsApp: número en formato internacional sin signos ni espacios.
  // TODO: confirmar que esta línea tiene WhatsApp activo.
  whatsapp: { number: "34609638747", display: "609 63 87 47" },
  email: "comercial@toldosgetafe.es",
  address: {
    line: "C. del Tomillo, 18, 28946 Fuenlabrada, Madrid",
    street: "C. del Tomillo, 18",
    postalCode: "28946",
    city: "Fuenlabrada",
    region: "Madrid",
  },
  geo: { lat: 40.2756124, lng: -3.7531572 },
  // Perfil de Google Business y valoración media (leídos del perfil público).
  // TODO: actualizar rating/reviewCount periódicamente.
  google: {
    profileUrl: "https://maps.app.goo.gl/VHyPSqtYiTodDxAe6",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Toldos%20Getafe%20S.L.%2C%20C.%20del%20Tomillo%2018%2C%2028946%20Fuenlabrada%2C%20Madrid&t=&z=13&ie=UTF8&iwloc=&output=embed",
    rating: 4.1,
    reviewCount: 228,
  },
  // Datos de empresa citados en su material comercial. TODO: confirmar con el cliente.
  stats: {
    yearsExperience: 35,
    factoryAreaM2: 1000,
  },
  social: {
    facebook: "https://www.facebook.com/ToldosGetafe",
    instagram: "https://www.instagram.com/toldos_getafe/",
  },
  tagline: "Fábrica de toldos y pérgolas a medida en Madrid.",
} as const;

/**
 * Municipios donde se instala. Lista de partida para Madrid Sur —
 * TODO: el cliente confirma / recorta / amplía.
 */
export const serviceAreas: string[] = [
  "Getafe",
  "Fuenlabrada",
  "Móstoles",
  "Leganés",
  "Alcorcón",
  "Parla",
  "Pinto",
  "Humanes de Madrid",
  "Griñón",
  "Valdemoro",
  "Torrejón de la Calzada",
  "Torrejón de Velasco",
  "Ciempozuelos",
  "Arroyomolinos",
  "Madrid capital",
];

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const primaryNav: NavItem[] = [
  {
    label: "Toldos",
    href: "/toldos",
    children: [
      { label: "Extensibles", href: "/toldos/extensibles" },
      { label: "Cofre", href: "/toldos/cofres" },
      { label: "Portada", href: "/toldos/portada" },
    ],
  },
  { label: "Pérgolas", href: "/pergolas" },
  { label: "Cerramientos", href: "/cerramientos" },
  { label: "Profesionales", href: "/profesionales" },
  { label: "Zona", href: "/zona-de-actuacion" },
  { label: "FAQ", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

export const footerLinks = [
  { label: "Toldos", href: "/toldos" },
  { label: "Pérgolas", href: "/pergolas" },
  { label: "Cerramientos", href: "/cerramientos" },
  { label: "Profesionales", href: "/profesionales" },
  { label: "Zona de actuación", href: "/zona-de-actuacion" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
];

export const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];
