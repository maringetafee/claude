// Textos y fotos de la portada editables desde el panel. Los valores por defecto
// son exactamente los de la plantilla original: sin fila en la base de datos,
// la web se ve igual que la demo.

export type ServiceCard = { title: string; text: string; metaLeft: string; metaRight: string; image: string; alt: string };
export type StatItem = { value: number; label: string };
export type ReviewItem = { text: string; author: string };
export type GalleryItem = { image: string; alt: string; title: string; caption: string };

export type SiteContent = {
  hero: { kicker: string; line1: string; line2: string; line3: string; copy: string; image: string; imageAlt: string };
  services: ServiceCard[];
  stats: StatItem[];
  reviews: { score: string; count: string; intro: string; items: ReviewItem[] };
  gallery: GalleryItem[];
  contact: {
    address: string;
    hours: string;
    phone: string;
    email: string;
    instagram: string;
    whatsapp: string;
    area: string;
  };
  footer: { tagline: string; ordersNote: string };
};

const U = (id: string, w = 800, q = 78) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

export const DEFAULT_CONTENT: SiteContent = {
  hero: {
    kicker: "Alcorcón",
    line1: "Flores que",
    line2: "cuentan",
    line3: "tu historia.",
    copy: "Ramos de temporada, flor fresca a diario y diseño floral a medida para bodas, eventos y ese detalle que quieres hacer bien.",
    image: U("photo-1487070183336-b863922373d4", 1600, 80),
    imageAlt: "Escaparate de floristería con cubos de flores frescas",
  },
  services: [
    { title: "Ramos de temporada", text: "Composiciones frescas con la flor de cada época del año.", metaLeft: "Desde 25€", metaRight: "Recogida o entrega", image: U("photo-1518895949257-7621c3c786d7"), alt: "Rosa rosa en jarrón de cristal" },
    { title: "Bodas & eventos", text: "Ramo de novia, centros de mesa y decoración floral completa.", metaLeft: "Consulta previa", metaRight: "Proyecto a medida", image: U("photo-1487530811176-3780de880c2d"), alt: "Ramo de novia frondoso con rosas y follaje" },
    { title: "Plantas & decoración", text: "Plantas de interior y arreglos para dar vida a tu espacio.", metaLeft: "Desde 18€", metaRight: "Asesoramiento incluido", image: U("photo-1462530260150-162092dbf011"), alt: "Jarrón blanco con tulipanes sobre mesa de madera" },
    { title: "Suscripción floral", text: "Un ramo nuevo cada semana o cada mes, sin tener que pensarlo.", metaLeft: "Desde 20€/mes", metaRight: "Cancela cuando quieras", image: U("photo-1495231916356-a86217efff12"), alt: "Rosa blanca en primer plano" },
  ],
  stats: [
    { value: 1200, label: "Ramos entregados al año" },
    { value: 8, label: "Años de experiencia" },
    { value: 300, label: "Bodas vestidas de flor" },
    { value: 98, label: "% de pedidos a tiempo" },
  ],
  reviews: {
    score: "5,0",
    count: "Más de 50 reseñas",
    intro: "Una nota muy alta para un taller de barrio con una forma de trabajar la flor muy propia.",
    items: [
      { text: "El ramo de mi boda superó todo lo que había imaginado. Flor fresquísima y un gusto exquisito.", author: "Cliente verificado" },
      { text: "Pedí la suscripción semanal y cada ramo es distinto y precioso. Ya no sé vivir sin ella.", author: "Cliente verificado" },
      { text: "Entrega rapidísima y el detalle floral perfecto para el evento de la empresa.", author: "Cliente verificado" },
      { text: "Trato cercano y una selección de flor que no encuentras en cualquier sitio.", author: "Cliente verificado" },
    ],
  },
  gallery: [
    { image: U("photo-1490750967868-88aa4486c946", 700), alt: "Amapolas naranjas en flor", title: "Campo en flor", caption: "Amapolas de temporada recién cortadas." },
    { image: U("photo-1508610048659-a06b669e3321", 700), alt: "Ramo de rosas multicolor", title: "Ramo arcoíris", caption: "Un capricho de color para regalar alegría." },
    { image: U("photo-1526047932273-341f2a7631f9", 700), alt: "Composición floral en forma de corazón sostenida con las manos", title: "Detalle con cariño", caption: "Piezas pequeñas para ocasiones especiales." },
    { image: U("photo-1465146344425-f00d5f5c8f07", 700), alt: "Amapolas en campo de trigo", title: "Silvestre", caption: "Composiciones de aire natural y libre." },
    { image: U("photo-1518895949257-7621c3c786d7", 700), alt: "Rosa rosa en jarrón", title: "Rosa clásica", caption: "Elegancia simple para cualquier mesa." },
    { image: U("photo-1462530260150-162092dbf011", 700), alt: "Tulipanes blancos en jarrón sobre mesa de madera", title: "Tulipanes blancos", caption: "Frescura y luz para el salón." },
    { image: U("photo-1502977249166-824b3a8a4d6d", 700), alt: "Lirio rosa en jarrón de cristal", title: "Lirio en detalle", caption: "Pétalos amplios y aroma intenso." },
    { image: U("photo-1495231916356-a86217efff12", 700), alt: "Rosa blanca en primer plano", title: "Blanco puro", caption: "La opción segura que nunca falla." },
  ],
  contact: {
    address: "C. Múnich, Pl. de Ondarreta, 6, Local 43, 28923 Alcorcón, Madrid, España",
    hours: "Lunes a sábado, 10:00 – 20:00",
    phone: "+34 636 55 65 56",
    email: "",
    instagram: "",
    whatsapp: "",
    area: "Alcorcón",
  },
  footer: {
    tagline: "Coronas y Flores · Alcorcón. Flor fresca y diseño floral hecho a mano.",
    ordersNote: "Pedidos con 24h de antelación para garantizar disponibilidad.",
  },
};

function pickArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) && value.length ? (value as T[]) : fallback;
}

export function mergeContent(stored: unknown): SiteContent {
  const s = (stored && typeof stored === "object" ? stored : {}) as Partial<SiteContent>;
  const d = DEFAULT_CONTENT;
  return {
    hero: { ...d.hero, ...(s.hero ?? {}) },
    services: pickArray(s.services, d.services),
    stats: pickArray(s.stats, d.stats),
    reviews: { ...d.reviews, ...(s.reviews ?? {}), items: pickArray(s.reviews?.items, d.reviews.items) },
    gallery: pickArray(s.gallery, d.gallery),
    contact: { ...d.contact, ...(s.contact ?? {}) },
    footer: { ...d.footer, ...(s.footer ?? {}) },
  };
}

export function telHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export function whatsappHref(phone: string): string {
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 9) digits = `34${digits}`;
  return `https://wa.me/${digits}`;
}
