import { BusinessConfig } from "@/lib/types";

export const lolita: BusinessConfig = {
  slug: "lolita",
  businessName: "Lolita",
  businessType: "cocktail-bar",
  theme: "nightlife",
  tagline: "Cócteles de autor hasta tarde.",
  logoInitial: "L",
  favicon: "🍸",
  nav: [
    { label: "Carta", href: "#menu" },
    { label: "Experiencia", href: "#about" },
    { label: "Galería", href: "#gallery" },
    { label: "Reservar", href: "#booking" },
  ],
  sections: ["hero", "about", "menu", "gallery", "booking", "location", "contact"],
  hero: {
    type: "fullscreen",
    eyebrow: "Cocktail bar · Madrid",
    title: "La noche empieza en Lolita",
    subtitle: "Cócteles de autor, música que sube con las horas, hasta las 3am.",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1800&q=80",
    ctaPrimary: { label: "Reservar mesa", href: "#booking" },
    ctaSecondary: { label: "Ver carta", href: "#menu" },
  },
  about: {
    eyebrow: "La experiencia",
    title: "Coctelería seria, ambiente sin pretensiones",
    body:
      "Lolita empezó como un experimento de dos bartenders obsesionados con el balance perfecto. Hoy es un sitio para llegar temprano a tomar algo tranquilo o quedarte hasta que cierran las luces. Barra abierta, buena música, cero postureo.",
    image: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200&q=80",
  },
  menu: {
    eyebrow: "La carta",
    title: "Cócteles de la casa",
    categories: [
      {
        name: "Clásicos con firma",
        items: [
          { name: "Lolita Sour", description: "Whisky, limón, clara, un toque de vainilla", price: "11€" },
          { name: "Negroni de la casa", description: "Ginebra infusionada, vermut rojo, campari", price: "10€" },
          { name: "Espresso Martini", description: "Vodka, café de especialidad, licor de cacao", price: "12€" },
        ],
      },
      {
        name: "De autor",
        items: [
          { name: "Humo y Sal", description: "Mezcal ahumado, mango, chile, sal de gusano", price: "13€" },
          { name: "Jardín Nocturno", description: "Ginebra, pepino, albahaca, cordial de flor de saúco", price: "12€" },
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Galería",
    title: "Barra, luces y buena compañía",
    images: [
      { src: "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=1200&q=80", alt: "Barra iluminada" },
      { src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=900&q=80", alt: "Brindis en grupo" },
      { src: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80", alt: "Cóctel servido" },
    ],
  },
  booking: {
    eyebrow: "Reservas",
    title: "Resérvate una zona",
    subtitle: "Fecha, hora y zona. Te confirmamos por WhatsApp.",
    flow: ["people", "table", "date", "time", "customer"],
    showTableMap: true,
  },
  location: {
    address: "Calle de la Palma 22, 28004 Madrid",
    mapsEmbedSrc: "https://www.google.com/maps?q=Calle+de+la+Palma+22+Madrid&output=embed",
    hours: [
      { day: "Miércoles – Jueves", hours: "19:00 – 02:00" },
      { day: "Viernes – Sábado", hours: "19:00 – 03:00" },
      { day: "Domingo – Martes", hours: "Cerrado" },
    ],
  },
  contact: {
    phone: "+34 911 11 11 11",
    whatsapp: "https://wa.me/34911111111",
    email: "hola@lolitabar.es",
    instagram: "https://instagram.com",
  },
};
