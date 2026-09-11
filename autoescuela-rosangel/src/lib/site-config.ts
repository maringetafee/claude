/**
 * Todo el contenido "de negocio" vive aquí y en src/data/*.ts — nunca
 * hardcodeado en componentes. Los datos de contacto proceden de directorios
 * públicos (Google, guías locales, redes sociales); varias fuentes se
 * contradicen entre sí en números de teléfono y horarios exactos, así que
 * cada TODO marca algo que el cliente debe confirmar antes de publicar.
 * Ver CONTENT_NEEDED.md para el listado completo y priorizado.
 */

export const siteConfig = {
  name: "Autoescuela Rosangel",
  shortName: "Rosangel",
  legalName: "Autoescuela Rosangel", // TODO: confirmar razón social exacta (S.L. / autónomo) para el aviso legal.
  dgtCode: "M-1711",
  tagline: "Autoescuela en Getafe con cuatro centros y más de dos décadas dando clases.",

  // Centro con más presencia en directorios / número más citado. Se usa como
  // contacto "general" en el header y el footer.
  phone: { display: "916 82 48 51", href: "tel:+34916824851" },

  // TODO CRÍTICO: hay varios números distintos asociados a Rosangel en
  // directorios (916824851, 660367199, 685659563, 605046363, 640274038).
  // Confirmar con el cliente cuál es el WhatsApp Business oficial antes de
  // publicar — de momento se usa el número del centro de Manzana (formato
  // móvil, es el que más aparece descrito como "WhatsApp" en fuentes públicas).
  whatsapp: { number: "34640274038", display: "640 27 40 38" },

  email: "", // No se ha encontrado un email público de contacto. TODO: pedir uno al cliente o dejar solo formulario/WhatsApp.

  instagram: "https://www.instagram.com/autoescuelarosangel/",
  facebook: "https://www.facebook.com/AutoescuelaRoSangel/",

  // Valoración media en Google Maps: 4,8 en tres fichas y 5,0 (6 reseñas) en
  // Los Molinos, media ponderada 4,8. El número total de reseñas se suma
  // desde centers[].googleRating.
  rating: { value: 4.8, source: "Google Maps", checkedAt: "septiembre de 2026" },

  google: {
    // Búsqueda en Google Maps: muestra las fichas de todos los centros con sus reseñas.
    profileSearchUrl: "https://www.google.com/maps/search/Autoescuela+Rosangel+Getafe",
  },
} as const;

export type Permit = "B" | "A2";

export type Center = {
  slug: string;
  shortName: string;
  fullName: string;
  zoneLabel: string;
  street: string;
  postalCode: string;
  city: string;
  addressLine: string;
  phone: { display: string; href: string };
  whatsapp: { number: string; display: string };
  // Horario orientativo: dos fuentes públicas coinciden en este patrón para
  // el centro de Manzana; se aplica al resto como referencia hasta que el
  // cliente confirme horario por centro. TODO: confirmar horario real de
  // cada centro (puede variar).
  hours: { label: string; value: string }[];
  // Valoración de la ficha de Google Maps de cada centro (septiembre de 2026).
  googleRating: { value: number; count: number };
  mapsQuery: string;
  mapEmbedUrl: string;
  geo: { lat: number; lng: number } | null;
  verified: boolean;
  note?: string;
};

export const centers: Center[] = [
  {
    slug: "manzana",
    shortName: "Centro",
    fullName: "Rosangel Centro",
    zoneLabel: "Getafe Centro",
    street: "C. Manzana, 14",
    postalCode: "28901",
    city: "Getafe",
    addressLine: "C. Manzana, 14, 28901 Getafe, Madrid",
    phone: { display: "640 27 40 38", href: "tel:+34640274038" },
    whatsapp: { number: "34640274038", display: "640 27 40 38" },
    hours: [
      { label: "Lunes a jueves", value: "10:00–13:30 y 17:00–21:00" },
      { label: "Viernes", value: "10:00–13:30 y 17:00–20:00" },
      { label: "Sábado y domingo", value: "Cerrado" },
    ],
    googleRating: { value: 4.8, count: 211 },
    mapsQuery: "Autoescuela Rosangel, Calle Manzana 14, 28901 Getafe",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Calle%20Manzana%2014%2C%2028901%20Getafe%2C%20Madrid&t=&z=15&ie=UTF8&iwloc=&output=embed",
    geo: { lat: 40.3082344, lng: -3.7276747 },
    verified: true,
    note: "Dirección, teléfono y horario confirmados por dos fuentes públicas independientes.",
  },
  {
    slug: "titulcia",
    shortName: "Juan de la Cierva",
    fullName: "Rosangel Juan de la Cierva",
    zoneLabel: "Juan de la Cierva",
    street: "C. Titulcia, 23",
    postalCode: "28903",
    city: "Getafe",
    addressLine: "C. Titulcia, 23, 28903 Getafe, Madrid",
    phone: { display: "916 82 48 51", href: "tel:+34916824851" },
    whatsapp: { number: "34916824851", display: "916 82 48 51" },
    hours: [
      { label: "Lunes a jueves", value: "10:00–13:30 y 17:00–21:00" },
      { label: "Viernes", value: "10:00–13:30 y 17:00–20:00" },
      { label: "Sábado y domingo", value: "Cerrado" },
    ],
    googleRating: { value: 4.8, count: 141 },
    mapsQuery: "Autoescuela Rosangel, Calle Titulcia 23, 28903 Getafe",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Calle%20Titulcia%2023%2C%2028903%20Getafe%2C%20Madrid&t=&z=15&ie=UTF8&iwloc=&output=embed",
    geo: { lat: 40.3126573, lng: -3.7236126 },
    verified: true,
    note: "Dirección y teléfono confirmados por varias fuentes públicas independientes.",
  },
  {
    slug: "rigoberta-menchu",
    shortName: "Norte",
    fullName: "Rosangel Norte",
    zoneLabel: "Getafe Norte",
    street: "Av. Rigoberta Menchú, 19",
    postalCode: "28903",
    city: "Getafe",
    addressLine: "Av. Rigoberta Menchú, 19, 28903 Getafe, Madrid",
    phone: { display: "685 65 95 63", href: "tel:+34685659563" },
    whatsapp: { number: "34916824851", display: "916 82 48 51" },
    hours: [
      { label: "Lunes a jueves", value: "10:00–13:30 y 17:00–21:00" },
      { label: "Viernes", value: "10:00–13:30 y 17:00–20:00" },
      { label: "Sábado y domingo", value: "Cerrado" },
    ],
    googleRating: { value: 4.8, count: 186 },
    mapsQuery: "Autoescuela Rosangel Norte, Avenida Rigoberta Menchú 19, 28903 Getafe",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Avenida%20Rigoberta%20Menchu%2019%2C%2028903%20Getafe%2C%20Madrid&t=&z=15&ie=UTF8&iwloc=&output=embed",
    geo: { lat: 40.3228738, lng: -3.715331 },
    verified: true,
    note: "El propio negocio identifica este centro como \"Rosangel Norte\" en directorios locales. Teléfono tomado de su ficha de Google Maps (septiembre de 2026).",
  },
  {
    slug: "los-molinos",
    shortName: "Los Molinos",
    fullName: "Rosangel Los Molinos",
    zoneLabel: "Los Molinos",
    street: "Av. del Ingenioso Hidalgo, 7",
    postalCode: "28906",
    city: "Getafe",
    addressLine: "Av. del Ingenioso Hidalgo, 7, 28906 Getafe, Madrid",
    phone: { display: "665 89 27 39", href: "tel:+34665892739" },
    // Sin WhatsApp propio confirmado: se usa el WhatsApp general.
    whatsapp: siteConfig.whatsapp,
    hours: [
      { label: "Lunes a jueves", value: "10:00–13:30 y 17:00–21:00" },
      { label: "Viernes", value: "10:00–13:30 y 17:00–20:00" },
      { label: "Sábado y domingo", value: "Cerrado" },
    ],
    googleRating: { value: 5.0, count: 6 },
    mapsQuery: "Autoescuela Rosangel, Avenida del Ingenioso Hidalgo 7, 28906 Getafe",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Avenida%20del%20Ingenioso%20Hidalgo%207%2C%2028906%20Getafe%2C%20Madrid&t=&z=15&ie=UTF8&iwloc=&output=embed",
    geo: { lat: 40.3180203, lng: -3.7037502 },
    verified: true,
    note: "Ficha propia de Autoescuela Rosangel en Google Maps (septiembre de 2026). Añadido a petición del equipo.",
  },
];

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Permisos", href: "/#permisos" },
  { label: "Cómo funciona", href: "/#proceso" },
  { label: "Centros", href: "/centros/" },
  { label: "Opiniones", href: "/#opiniones" },
  { label: "FAQ", href: "/preguntas-frecuentes/" },
];

export const footerLinks = [
  { label: "Permiso B", href: "/permisos/permiso-b/" },
  { label: "Permiso A2", href: "/permisos/permiso-a2/" },
  { label: "Centros en Getafe", href: "/centros/" },
  { label: "Preguntas frecuentes", href: "/preguntas-frecuentes/" },
  { label: "Contacto", href: "/contacto/" },
];

export const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal/" },
  { label: "Política de privacidad", href: "/politica-de-privacidad/" },
  { label: "Política de cookies", href: "/politica-de-cookies/" },
];

export function whatsappHref(message: string, number: string = siteConfig.whatsapp.number) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export const whatsappMessages = {
  general:
    "Hola, me gustaría información sobre Autoescuela Rosangel.",
  permitB:
    "Hola, estoy interesado/a en sacarme el permiso B en Autoescuela Rosangel. Me gustaría recibir información.",
  permitA2:
    "Hola, estoy interesado/a en el permiso A2 en Autoescuela Rosangel. Me gustaría recibir información.",
  centerPrefix: (centerName: string) =>
    `Hola, me gustaría información sobre el centro de Rosangel en ${centerName}.`,
};
