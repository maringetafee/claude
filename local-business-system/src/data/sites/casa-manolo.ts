import { BusinessConfig } from "@/lib/types";

export const casaManolo: BusinessConfig = {
  slug: "casa-manolo",
  businessName: "Casa Manolo",
  businessType: "bar",
  theme: "tavern-warm",
  tagline: "Producto de mercado, buena barra y un espacio pensado para compartir. Madrid.",
  logoInitial: "M",
  favicon: "🍷",
  nav: [
    { label: "Carta", href: "#menu" },
    { label: "Experiencia", href: "#features" },
    { label: "Galería", href: "#gallery" },
    { label: "Reservas", href: "#booking" },
    { label: "Contacto", href: "#contact" },
  ],
  sections: ["hero", "about", "features", "menu", "showcase", "gallery", "booking", "location", "contact", "cta"],
  hero: {
    type: "fullscreen",
    eyebrow: "Bar · Madrid",
    title: "UNA BARRA.\nBUEN PRODUCTO.\nMEJORES MOMENTOS.",
    subtitle: "Producto de mercado, barra de madera y la calma de un sitio que no tiene prisa.",
    image: "https://images.unsplash.com/photo-1681912406153-3c182eb94426?w=1800&q=80",
    ctaPrimary: { label: "Reservar mesa", href: "#booking" },
    ctaSecondary: { label: "Ver la carta", href: "#menu" },
  },
  about: {
    eyebrow: "La casa",
    title: "UNA CASA.\nUNA BARRA.\nUNA HISTORIA.",
    body: "Una experiencia gastronómica que combina producto, tradición y un espacio pensado para compartir.",
    image: "https://images.unsplash.com/photo-1775955849483-5992deefbed3?w=1200&q=80",
  },
  features: {
    eyebrow: "La experiencia",
    title: "Lo que nos define",
    items: [
      {
        title: "La barra",
        body: "Barra de madera y producto de mercado. El sitio para un vermut, una caña bien tirada o esa copa de vino que se alarga.",
        image: "https://images.unsplash.com/photo-1779372178719-9476cc86a53d?w=1200&q=80",
      },
      {
        title: "La carta",
        body: "Tapas caseras pensadas para compartir. Tradición sin fórmulas, hechas con el mismo mimo de siempre.",
        image: "https://images.unsplash.com/photo-1565599837634-134bc3aadce8?w=1200&q=80",
      },
      {
        title: "El ambiente",
        body: "Un lugar para el aperitivo, una comida larga o esa última copa que nunca fue la última.",
        image: "https://images.unsplash.com/photo-1772645521066-fc021da69250?w=1200&q=80",
      },
    ],
  },
  menu: {
    eyebrow: "La carta",
    title: "La carta",
    subtitle: "Producto, tradición y ganas de compartir.",
    categories: [
      {
        name: "Para compartir",
        image: "https://images.unsplash.com/photo-1746716447103-e1618bbd0669?w=1000&q=80",
        items: [
          { name: "Patatas bravas", description: "Crujientes, con nuestra salsa de la casa.", price: "6€" },
          { name: "Croquetas de jamón", description: "Seis unidades, receta de siempre.", price: "7€" },
          { name: "Tortilla española", description: "Jugosa, con o sin cebolla.", price: "6,50€" },
        ],
      },
      {
        name: "De la barra",
        image: "https://images.unsplash.com/photo-1783701481560-d5456a47189e?w=1000&q=80",
        items: [
          { name: "Caña", description: "Bien tirada.", price: "2€" },
          { name: "Vermut de grifo", description: "Con su toque de naranja y aceituna.", price: "3€" },
          { name: "Vino de la casa", description: "Copa de tinto o blanco.", price: "2,50€" },
        ],
      },
    ],
  },
  showcase: {
    eyebrow: "De la cocina",
    title: "PRODUCTO.\nFUEGO.\nTIEMPO.",
    subtitle: "Cada plato sale de una cocina que no tiene prisa.",
    image: "https://images.unsplash.com/photo-1614119068601-483274e9dcb7?w=1800&q=80",
    cta: { label: "Ver la carta", href: "#menu" },
  },
  gallery: {
    eyebrow: "Galería",
    title: "La barra, la mesa y el ambiente",
    images: [
      { src: "https://images.unsplash.com/photo-1779372178902-5d355e0dfe06?w=1400&q=80", alt: "Barra tradicional con grifos de latón" },
      { src: "https://images.unsplash.com/photo-1508615263227-c5d58c1e5821?w=1000&q=80", alt: "Detalle de cocina a la parrilla" },
      { src: "https://images.unsplash.com/photo-1759866614069-e5b93d17e663?w=1000&q=80", alt: "Terraza con luces por la noche" },
      { src: "https://images.unsplash.com/photo-1779221596208-94d03c53ff85?w=1000&q=80", alt: "Selección de vinos en la estantería" },
      { src: "https://images.unsplash.com/photo-1712645376049-a8d414d4a364?w=900&q=80", alt: "Copa de vino en la barra" },
    ],
  },
  booking: {
    eyebrow: "Reservas",
    title: "TU MESA\nTE ESPERA.",
    subtitle: "Reserva tu próxima visita. Para grupos grandes o si venís con peques, os confirmamos por WhatsApp.",
    flow: ["people", "date", "time", "customer"],
    showTableMap: false,
  },
  location: {
    address: "Calle del Olmo 14, 28012 Madrid",
    mapsEmbedSrc: "https://www.google.com/maps?q=Calle+del+Olmo+14+Madrid&output=embed",
    hours: [
      { day: "Lunes – Sábado", hours: "08:00 – 00:00" },
      { day: "Domingo", hours: "10:00 – 16:00" },
    ],
  },
  contact: {
    phone: "+34 915 22 22 22",
    whatsapp: "https://wa.me/34915222222",
    email: "hola@casamanolo.es",
    instagram: "https://instagram.com",
  },
  cta: {
    title: "NOS VEMOS\nEN LA BARRA.",
    subtitle: "Resérvate un sitio para tu próxima visita.",
    image: "https://images.unsplash.com/photo-1771330683798-06d3bccb25dd?w=1800&q=80",
    cta: { label: "Reservar mesa", href: "#booking" },
  },
};
