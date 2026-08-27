import { BusinessConfig } from "@/lib/types";

export const studioX: BusinessConfig = {
  slug: "studio-x",
  businessName: "Studio X",
  businessType: "hair-salon",
  theme: "fashion-minimal",
  tagline: "Peluquería editorial en el centro.",
  logoInitial: "X",
  favicon: "✂️",
  nav: [
    { label: "Servicios", href: "#services" },
    { label: "Nosotros", href: "#about" },
    { label: "Equipo", href: "#team" },
    { label: "Reservar", href: "#booking" },
  ],
  sections: ["hero", "services", "gallery", "team", "about", "booking", "location", "contact"],
  hero: {
    type: "split",
    eyebrow: "Peluquería · Barcelona",
    title: "Corte, color y actitud",
    subtitle: "Un estudio pequeño con estándar de editorial de moda.",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1400&q=80",
    ctaPrimary: { label: "Reservar cita", href: "#booking" },
    ctaSecondary: { label: "Ver servicios", href: "#services" },
  },
  about: {
    eyebrow: "Nosotros",
    title: "Menos ruido, más técnica",
    body:
      "Studio X es un espacio pensado para una cosa: que salgas mejor de lo que entraste. Sin cartas interminables ni upselling — un equipo pequeño, técnica cuidada, y citas que no se retrasan media hora.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80",
  },
  services: {
    eyebrow: "Servicios",
    title: "Qué hacemos",
    categories: [
      {
        name: "Corte",
        items: [
          { name: "Corte mujer", description: "Lavado, corte y secado", price: "38€", duration: "45 min" },
          { name: "Corte hombre", description: "Lavado, corte a tijera o máquina", price: "24€", duration: "30 min" },
        ],
      },
      {
        name: "Color",
        items: [
          { name: "Color raíz", description: "Retoque de raíz, un solo tono", price: "45€", duration: "1h" },
          { name: "Balayage", description: "Técnica a mano alzada, degradado natural", price: "85€", duration: "2h 30min" },
          { name: "Tratamiento reparador", description: "Después de color o decoloración", price: "20€", duration: "20 min" },
        ],
      },
    ],
  },
  team: {
    eyebrow: "Equipo",
    title: "Quién te va a atender",
    members: [
      { name: "Nora Camps", role: "Directora creativa", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&q=80" },
      { name: "Adrián Mora", role: "Colorista", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80" },
      { name: "Kai Duarte", role: "Estilista", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=600&q=80" },
    ],
  },
  gallery: {
    eyebrow: "Galería",
    title: "Trabajo del estudio",
    images: [
      { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80", alt: "Detalle de color" },
      { src: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=900&q=80", alt: "Interior del salón" },
    ],
  },
  booking: {
    eyebrow: "Reservas",
    title: "Pide tu cita",
    subtitle: "Elige servicio y profesional. Te confirmamos por WhatsApp.",
    flow: ["service", "professional", "date", "time", "customer"],
    services: ["Corte", "Color", "Balayage", "Tratamiento"],
    professionals: ["Cualquiera", "Nora", "Adrián", "Kai"],
  },
  location: {
    address: "Carrer de Balmes 88, 08008 Barcelona",
    mapsEmbedSrc: "https://www.google.com/maps?q=Carrer+de+Balmes+88+Barcelona&output=embed",
    hours: [
      { day: "Martes – Viernes", hours: "10:00 – 20:00" },
      { day: "Sábado", hours: "10:00 – 18:00" },
      { day: "Domingo – Lunes", hours: "Cerrado" },
    ],
  },
  contact: {
    phone: "+34 933 00 00 00",
    whatsapp: "https://wa.me/34933000000",
    email: "hola@studiox.es",
    instagram: "https://instagram.com",
  },
};
