import type {
  NavLink,
  ServiceItem,
  SiteIdentity,
  Stat,
  Testimonial,
  Zone,
} from "./types";

const unsplash = (id: string, params = "auto=format&fit=crop&q=80") =>
  `https://images.unsplash.com/${id}?${params}`;

export const siteConfig: SiteIdentity = {
  name: "Inmo Retail",
  claim: "Inmobiliaria boutique en Madrid Sur",
  description:
    "Inmo Retail es una inmobiliaria boutique especializada en la compra, venta y alquiler de propiedades en Madrid, con foco en Madrid Sur: Getafe, Leganés, Alcorcón y Carabanchel.",
  city: "Getafe",
  phone: "+34686005227",
  phoneDisplay: "686 00 52 27",
  whatsapp: "+34686005227",
  email: "javiersuarez@inmoretail.es",
  address: "Calle Islas Antípodas 49, 28905 Getafe (Madrid)",
  instagram: "https://instagram.com/inmoretail",
  instagramHandle: "@inmoretail",
  ogImage: "/hero-cover.jpg",
};

export const navLinks: NavLink[] = [
  { label: "Propiedades", href: "/propiedades" },
  { label: "Vender", href: "/#servicios" },
  { label: "Alquilar", href: "/propiedades?operacion=alquiler" },
  { label: "La agencia", href: "/#agencia" },
  { label: "Favoritos", href: "/favoritos" },
  { label: "Contacto", href: "/#contacto" },
];

export const services: ServiceItem[] = [
  {
    number: "01",
    title: "Comprar",
    description:
      "Acceso a propiedades seleccionadas, muchas antes de salir al mercado abierto. Te acompañamos desde la primera visita hasta la firma.",
    image: { src: unsplash("photo-1613977257592-4871e5fcd7c4"), alt: "Villa con piscina" },
    href: "/propiedades?operacion=venta",
  },
  {
    number: "02",
    title: "Vender",
    description:
      "Valoración precisa, fotografía profesional y una estrategia de comercialización pensada para tu propiedad, no para cualquier propiedad.",
    image: { src: unsplash("photo-1664463760781-f159dfe3af30"), alt: "Firma de documentos en el escritorio" },
    href: "/#contacto",
  },
  {
    number: "03",
    title: "Alquilar",
    description:
      "Gestionamos el proceso completo de alquiler, desde la selección de inquilinos hasta la firma del contrato, con la misma exigencia que en una venta.",
    image: { src: unsplash("photo-1724582586529-62622e50c0b3"), alt: "Salón moderno con ventanal" },
    href: "/propiedades?operacion=alquiler",
  },
  {
    number: "04",
    title: "Inversión",
    description:
      "Análisis de rentabilidad, zonas con mayor recorrido y acompañamiento en cada operación, pensado para quien invierte con criterio a largo plazo.",
    image: { src: unsplash("photo-1543785734-4b6e564642f8"), alt: "Gran Vía, Madrid" },
    href: "/#contacto",
  },
  {
    number: "05",
    title: "Gestión de propiedades",
    description:
      "Administración integral de tu inmueble: mantenimiento, incidencias y relación con inquilinos, para que la propiedad trabaje sin darte trabajo.",
    image: { src: unsplash("photo-1776363284806-873eeef565a7"), alt: "Terraza de un ático" },
    href: "/#contacto",
  },
];

export const zones: Zone[] = [
  {
    slug: "getafe",
    name: "Getafe",
    description:
      "Nuestra base. Desarrollos recientes, buena conexión con el centro y una relación calidad-precio que cada vez más madrileños descubren.",
    propertiesCount: 16,
    image: { src: unsplash("photo-1558370781-d6196949e317"), alt: "Calle residencial arbolada" },
  },
  {
    slug: "alcorcon",
    name: "Alcorcón",
    description:
      "Zonas residenciales consolidadas como Parque Oeste, con chalets adosados, colegios cercanos y una vida de barrio tranquila.",
    propertiesCount: 13,
    image: { src: unsplash("photo-1570135460230-1407222b82a2"), alt: "Zona residencial de Alcorcón" },
  },
  {
    slug: "leganes",
    name: "Leganés",
    description:
      "Parques, universidad y un casco histórico que convive con desarrollos nuevos. Muy buena opción para familias.",
    propertiesCount: 12,
    image: { src: unsplash("photo-1509845350455-fb0c36048db1"), alt: "Calle residencial de Leganés" },
  },
  {
    slug: "carabanchel",
    name: "Carabanchel",
    description:
      "El distrito que más rápido se transforma en Madrid: lofts, cerca de Madrid Río y con el centro a un paso en metro.",
    propertiesCount: 10,
    image: { src: unsplash("photo-1543785734-4b6e564642f8"), alt: "Calle de Carabanchel, Madrid" },
  },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "El proceso fue sencillo, transparente y mucho más rápido de lo que esperábamos. Nos sentimos acompañados en cada paso, sin presión.",
    name: "Marta e Ignacio",
    operation: "Compra de vivienda",
    zone: "Getafe, Madrid",
  },
  {
    quote:
      "Vendimos por encima de lo que pensábamos y en menos de un mes. La forma de presentar la propiedad marcó la diferencia.",
    name: "Carlos Duarte",
    operation: "Venta de vivienda",
    zone: "Alcorcón, Madrid",
  },
  {
    quote:
      "Buscábamos algo muy concreto y nos lo pusieron delante antes de que saliera al mercado. Ese tipo de acceso no se encuentra en cualquier sitio.",
    name: "Elena Vidal",
    operation: "Compra de inversión",
    zone: "Carabanchel, Madrid",
  },
  {
    quote:
      "Gestionan nuestro alquiler desde hace tres años sin un solo sobresalto. Se nota que conocen cada detalle de la propiedad.",
    name: "Familia Ortega",
    operation: "Gestión de alquiler",
    zone: "Leganés, Madrid",
  },
];

export const stats: Stat[] = [
  { value: 500, suffix: "+", label: "Propiedades gestionadas" },
  { value: 12, suffix: "", label: "Años de experiencia" },
  { value: 300, suffix: "+", label: "Clientes satisfechos" },
  { value: 20, suffix: "+", label: "Zonas en Madrid Sur" },
];
