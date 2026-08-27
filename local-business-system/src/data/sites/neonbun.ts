import { BusinessConfig } from "@/lib/types";

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
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1800&q=80",
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
        image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=1200&q=80",
        items: [
          { name: "La Original", description: "Doble smash, queso cheddar, cebolla caramelizada, salsa de la casa", price: "9,50€" },
          { name: "La Ahumada", description: "Smash de vaca madurada, bacon crujiente, queso azul, mayo ahumada", price: "11€" },
          { name: "La Picante", description: "Doble smash, jalapeños, queso pepper jack, salsa spicy", price: "10,50€" },
        ],
      },
      {
        name: "Para Compartir",
        image: "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?w=1200&q=80",
        items: [
          { name: "Patatas Cargadas", description: "Patatas fritas, salsa cheddar cremosa, bacon crujiente, cebollino", price: "6,50€" },
          { name: "Aros de Cebolla Crujientes", description: "Rebozado casero, salsa barbacoa de la casa", price: "5€" },
          { name: "Alitas Picantes", description: "8 unidades, salsa a elegir", price: "8€" },
        ],
      },
      {
        name: "Postres",
        image: "https://images.unsplash.com/photo-1702925614886-50ad13c88d3f?w=1200&q=80",
        items: [
          { name: "Tarta de Queso", description: "Base de galleta, coulis de frutos rojos", price: "5€" },
          { name: "Brownie con Helado", description: "Brownie templado, bola de vainilla", price: "5,50€" },
        ],
      },
    ],
  },
  showcase: {
    eyebrow: "Especialidad de la casa",
    title: "PATATAS\nCARGADAS",
    subtitle: "Crujientes, bañadas en salsa cheddar cremosa y bacon por encima. El acompañante que todo el mundo acaba pidiendo de más.",
    image: "https://images.unsplash.com/photo-1639744210631-209fce3e256c?w=1600&q=80",
    cta: { label: "Ver la carta completa", href: "#menu" },
  },
  about: {
    eyebrow: "Nosotros",
    title: "Hamburguesas con\nactitud urbana",
    body:
      "NEONBUN nació de una idea simple: la smash burger perfecta no necesita complicarse. Carne de calidad, pan brioche tostado en plancha y salsas propias, servidas rápido y sin postureo. Un local pequeño, luces de neón y buena música — así nos gusta recibir a quien viene a comer.",
    image: "https://images.unsplash.com/photo-1740957452643-24c36e417732?w=1200&q=80",
  },
  gallery: {
    eyebrow: "Galería",
    title: "Lo que sale de la plancha",
    images: [
      { src: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=1200&q=80", alt: "Hamburguesa doble con queso" },
      { src: "https://images.unsplash.com/photo-1609530127564-bee93ebe1c9e?w=900&q=80", alt: "Patatas fritas en plato de cerámica negra" },
      { src: "https://images.unsplash.com/photo-1637273484026-11d51fb64024?w=900&q=80", alt: "Alitas de pollo fritas" },
      { src: "https://images.unsplash.com/photo-1740957442467-69296c3e0c04?w=900&q=80", alt: "Ventana del local con letrero de neón" },
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
    rating: "4.7",
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
    image: "https://images.unsplash.com/photo-1609530127564-bee93ebe1c9e?w=1600&q=80",
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
