import { BusinessConfig } from "@/lib/types";

// Los assets propios de esta plantilla (fotos + video del hero) viven en
// public/img/neonbun y public/video — como este mismo config se reutiliza
// para el build de plantillas (basePath "/plantillas") y para el build
// plano de leads reales (basePath ""), el prefijo se resuelve en build time
// igual que en next.config.ts, para que la ruta sea correcta en los dos.
const BASE = process.env.STATIC_EXPORT_BASE_PATH || "";
const img = (name: string) => `${BASE}/img/neonbun/${name}`;

export const neonbun: BusinessConfig = {
  slug: "neonbun",
  businessName: "NEONBUN",
  businessType: "restaurant",
  theme: "street-neon",
  tagline: "Smash burgers con actitud, en el centro de la ciudad.",
  logoInitial: "N",
  favicon: "🍔",
  nav: [
    { label: "Carta", href: "#menu" },
    { label: "Nosotros", href: "#about" },
    { label: "Galería", href: "#gallery" },
    { label: "Reservas", href: "#booking" },
  ],
  sections: ["hero", "menu", "showcase", "about", "gallery", "testimonials", "booking", "cta", "location", "contact"],
  hero: {
    type: "fullscreen",
    eyebrow: "Hamburguesería · Ciudad",
    title: "SMASH BURGERS\nSIN POSTUREO",
    subtitle: "Carne de calidad, pan brioche a la plancha y salsas propias. Rápido, honesto, sin complicarse.",
    image: img("burger1.png"),
    video: `${BASE}/video/neonbun-intro.mp4`,
    ctaPrimary: { label: "Reservar mesa", href: "#booking" },
    ctaSecondary: { label: "Ver la carta", href: "#menu" },
    marquee: [
      "SMASH BURGERS",
      "INGREDIENTES FRESCOS",
      "PAN BRIOCHE ARTESANO",
      "AMBIENTE URBANO",
      "REPARTO A DOMICILIO",
    ],
  },
  menu: {
    eyebrow: "La carta",
    title: "Elige tu smash",
    subtitle: "Cocina en directo, raciones para compartir y algo dulce para cerrar.",
    categories: [
      {
        name: "Smash Burgers",
        image: img("burger2.png"),
        items: [
          {
            name: "La Original",
            description: "Doble smash, queso cheddar, cebolla caramelizada, salsa de la casa",
            price: "9,50€",
            image: img("burger1.png"),
          },
          {
            name: "La Ahumada",
            description: "Smash de vaca madurada, bacon crujiente, queso azul, mayo ahumada",
            price: "11€",
            image: img("smash.png"),
          },
          {
            name: "La Picante",
            description: "Doble smash, jalapeños, queso pepper jack, salsa spicy",
            price: "10,50€",
            image: img("burger2.png"),
          },
        ],
      },
      {
        name: "Para Compartir",
        image: img("papas.png"),
        items: [
          { name: "Patatas Cargadas", description: "Patatas fritas, salsa cheddar cremosa, bacon crujiente, cebollino", price: "6,50€", image: img("papas.png") },
          {
            name: "Aros de Cebolla Crujientes",
            description: "Rebozado casero, salsa barbacoa de la casa",
            price: "5€",
            image: img("crispy.png"),
          },
          {
            name: "Alitas Picantes",
            description: "8 unidades, salsa a elegir",
            price: "8€",
            image: img("wings.png"),
          },
          {
            name: "Nachos Cargados",
            description: "Nachos, queso fundido, guacamole, pico de gallo",
            price: "7€",
            image: img("nachos.png"),
          },
        ],
      },
      {
        name: "Postres",
        image: img("brownie.png"),
        items: [
          { name: "Flan Casero", description: "Receta de la abuela, caramelo tostado", price: "4,50€", image: img("flan.png") },
          {
            name: "Brownie con Helado",
            description: "Brownie templado, bola de vainilla",
            price: "5,50€",
            image: img("brownie.png"),
          },
        ],
      },
    ],
  },
  showcase: {
    eyebrow: "Especialidad de la casa",
    title: "PATATAS\nCARGADAS",
    subtitle: "Crujientes, bañadas en salsa cheddar cremosa y bacon por encima. El acompañante que todo el mundo acaba pidiendo de más.",
    image: img("papas.png"),
    cta: { label: "Ver la carta completa", href: "#menu" },
    stats: [
      { value: "220g", label: "Patata fresca" },
      { value: "3", label: "Salsas caseras" },
      { value: "100%", label: "Fritas al momento" },
    ],
  },
  about: {
    eyebrow: "Nosotros",
    title: "Hamburguesas con\nactitud urbana",
    body:
      "NEONBUN nació de una idea simple: la smash burger perfecta no necesita complicarse. Carne de calidad, pan brioche tostado en plancha y salsas propias, servidas rápido y sin postureo. Un local pequeño, luces de neón y buena música — así nos gusta recibir a quien viene a comer.",
    image: img("about.png"),
    stat: { value: "★ 4.8", label: "Valoración media" },
  },
  gallery: {
    eyebrow: "Galería",
    title: "Lo que sale de la plancha",
    images: [
      { src: img("burger1.png"), alt: "Smash burger doble con queso" },
      { src: img("tenders.png"), alt: "Chicken tenders crujientes" },
      { src: img("croquetas.png"), alt: "Croquetas caseras" },
      { src: img("rollitos.png"), alt: "Rollitos crujientes" },
      { src: img("wings.png"), alt: "Alitas de pollo picantes" },
      { src: img("nachos.png"), alt: "Nachos cargados con guacamole" },
    ],
  },
  booking: {
    eyebrow: "Reservas",
    title: "Resérvate una mesa",
    subtitle: "Elige personas, mesa, fecha y hora. Confirmamos por teléfono en menos de una hora.",
    flow: ["people", "table", "date", "time", "customer"],
    showTableMap: true,
  },
  testimonials: {
    eyebrow: "Lo que dicen de nosotros",
    title: "RESEÑAS DE\nGOOGLE",
    rating: "4.8",
    ratingCount: "+150 reseñas",
    source: "Google Reviews",
    sourceHref: "https://www.google.com/maps",
    items: [
      { author: "Marta G.", timeAgo: "Hace 2 semanas", stars: 5, quote: "La Ahumada está brutal, y las patatas cargadas para compartir son un acierto seguro. Volveremos seguro." },
      { author: "Javier R.", timeAgo: "Hace 1 mes", stars: 5, quote: "Local pequeño pero con muy buen ambiente. La carne se nota de calidad y el pan brioche está perfecto de punto." },
      { author: "Elena P.", timeAgo: "Hace 3 semanas", stars: 4, quote: "Muy buena relación calidad-precio. Pedimos alitas de entrante y no llegaron ni a la mesa de lo rápido que volaron." },
      { author: "Carlos M.", timeAgo: "Hace 2 meses", stars: 5, quote: "La mejor smash burger de la zona sin ninguna duda. El punto picante de La Picante es justo el que a mí me gusta." },
    ],
  },
  cta: {
    title: "DIRECTO A\nTU CASA",
    subtitle: "Si no puedes venir, te lo llevamos. Pedido fácil, entrega rápida.",
    image: img("smash.png"),
    cta: { label: "Ver la carta", href: "#menu" },
  },
  location: {
    address: "Calle Mayor 22, 28901 Getafe, Madrid",
    mapsEmbedSrc: "https://www.google.com/maps?q=Calle+Mayor+22+Getafe+Madrid&output=embed",
    hours: [
      { day: "Martes – Jueves", hours: "13:00 – 16:00 · 20:00 – 23:30" },
      { day: "Viernes – Sábado", hours: "13:00 – 16:30 · 20:00 – 00:30" },
      { day: "Domingo", hours: "13:00 – 16:30" },
      { day: "Lunes", hours: "Cerrado" },
    ],
  },
  contact: {
    phone: "+34 910 00 00 00",
    whatsapp: "https://wa.me/34910000000",
    email: "hola@neonbun.es",
    instagram: "https://instagram.com",
  },
};
