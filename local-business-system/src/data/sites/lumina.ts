import { BusinessConfig } from "@/lib/types";

export const lumina: BusinessConfig = {
  slug: "lumina",
  businessName: "LÚMINA",
  businessType: "restaurant",
  theme: "luxury-editorial",
  tagline: "Cocina de mercado, temporada tras temporada.",
  logoInitial: "L",
  favicon: "🕯️",
  nav: [
    { label: "Carta", href: "#menu" },
    { label: "Nosotros", href: "#about" },
    { label: "Galería", href: "#gallery" },
    { label: "Reservas", href: "#booking" },
  ],
  sections: ["hero", "about", "menu", "gallery", "booking", "location", "contact"],
  hero: {
    type: "editorial",
    eyebrow: "Restaurante · Madrid",
    title: "Cocina de temporada, servida con calma",
    subtitle: "Un espacio íntimo donde el producto de mercado marca cada plato del día.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80",
    ctaPrimary: { label: "Reservar mesa", href: "#booking" },
    ctaSecondary: { label: "Ver la carta", href: "#menu" },
  },
  about: {
    eyebrow: "Nosotros",
    title: "Una mesa que cambia con las estaciones",
    body:
      "LÚMINA nació de la idea de que un buen restaurante no necesita gritar — solo escuchar al mercado. Cada semana revisamos lo que llega fresco y construimos la carta alrededor de eso, no al revés. Sala pequeña, servicio cercano, y una cocina que no tiene prisa.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80",
  },
  menu: {
    eyebrow: "La carta",
    title: "Temporada actual",
    categories: [
      {
        name: "Para empezar",
        items: [
          { name: "Tartar de tomate y albahaca", description: "Tomate de temporada, aceite de albahaca, pan tostado", price: "12€" },
          { name: "Croquetas de jamón ibérico", description: "Bechamel cremosa, receta de siempre", price: "10€" },
          { name: "Ensalada de burrata", description: "Burrata cremosa, tomate reliquia, pesto de piñones", price: "14€" },
        ],
      },
      {
        name: "Principales",
        items: [
          { name: "Merluza a la brasa", description: "Puré de patata trufado, jugo de pescado", price: "22€" },
          { name: "Carrillera de ternera", description: "Guiso lento, puré de apionabo", price: "19€" },
          { name: "Risotto de setas de temporada", description: "Parmesano curado, aceite de trufa", price: "17€" },
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Galería",
    title: "La sala, la cocina, la mesa",
    images: [
      { src: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80", alt: "Plato principal servido" },
      { src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=900&q=80", alt: "Postre de la casa" },
      { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900&q=80", alt: "Interior del restaurante" },
      { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80", alt: "Ambiente de sala" },
    ],
  },
  booking: {
    eyebrow: "Reservas",
    title: "Reserva tu mesa",
    subtitle: "Elige fecha, hora y mesa. Confirmamos por teléfono en menos de una hora.",
    flow: ["people", "table", "date", "time", "customer"],
    showTableMap: true,
  },
  location: {
    address: "Calle del Almendro 14, 28005 Madrid",
    mapsEmbedSrc: "https://www.google.com/maps?q=Calle+del+Almendro+14+Madrid&output=embed",
    hours: [
      { day: "Martes – Viernes", hours: "13:30 – 16:00 · 20:30 – 23:30" },
      { day: "Sábado", hours: "13:30 – 16:30 · 20:30 – 00:00" },
      { day: "Domingo", hours: "13:30 – 16:30" },
      { day: "Lunes", hours: "Cerrado" },
    ],
  },
  contact: {
    phone: "+34 910 00 00 00",
    whatsapp: "https://wa.me/34910000000",
    email: "hola@lumina-restaurante.es",
    instagram: "https://instagram.com",
  },
};
