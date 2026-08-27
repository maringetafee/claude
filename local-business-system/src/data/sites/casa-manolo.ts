import { BusinessConfig } from "@/lib/types";

export const casaManolo: BusinessConfig = {
  slug: "casa-manolo",
  businessName: "Casa Manolo",
  businessType: "bar",
  theme: "tavern-warm",
  tagline: "El bar de siempre, con cañas bien tiradas y tapas caseras.",
  logoInitial: "M",
  favicon: "🍺",
  nav: [
    { label: "Carta", href: "#menu" },
    { label: "Nosotros", href: "#about" },
    { label: "Galería", href: "#gallery" },
    { label: "Reservar", href: "#booking" },
  ],
  sections: ["hero", "about", "menu", "gallery", "booking", "location", "contact"],
  hero: {
    type: "fullscreen",
    eyebrow: "Bar de toda la vida · Madrid",
    title: "Aquí siempre hay sitio en la barra",
    subtitle: "Cañas bien frías, tapas de siempre y buena conversación. El bar del barrio, sin postureo.",
    image: "https://images.unsplash.com/photo-1546622891-02c72c1537b6?w=1800&q=80",
    ctaPrimary: { label: "Reservar mesa", href: "#booking" },
    ctaSecondary: { label: "Ver la carta", href: "#menu" },
  },
  about: {
    eyebrow: "Nosotros",
    title: "El bar de siempre, sin postureo",
    body:
      "Casa Manolo lleva toda la vida en el barrio. Barra de madera, tapas caseras y las cañas justas de frías. Aquí se viene a tomar algo con calma, ver el partido o quedar con los de siempre — sin cartas de diseño ni horarios raros.",
    image: "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=1200&q=80",
  },
  menu: {
    eyebrow: "La carta",
    title: "Para picar y para beber",
    categories: [
      {
        name: "Para picar",
        items: [
          { name: "Patatas bravas", description: "Con nuestra salsa de la casa", price: "6€" },
          { name: "Croquetas de jamón", description: "Seis unidades, receta de siempre", price: "7€" },
          { name: "Tortilla española", description: "Jugosa, con o sin cebolla", price: "6,50€" },
        ],
      },
      {
        name: "De la barra",
        items: [
          { name: "Caña", description: "Bien tirada", price: "2€" },
          { name: "Vermut de grifo", description: "Con su toque de naranja y aceituna", price: "3€" },
          { name: "Vino de la casa", description: "Copa de tinto o blanco", price: "2,50€" },
        ],
      },
    ],
  },
  gallery: {
    eyebrow: "Galería",
    title: "La barra, la terraza y las tapas",
    images: [
      { src: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80", alt: "Compartiendo en la terraza" },
      { src: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=900&q=80", alt: "Variedad de cañas" },
    ],
  },
  booking: {
    eyebrow: "Reservas",
    title: "Resérvate una mesa en la terraza",
    subtitle: "Para grupos grandes o si venís con peques. Os confirmamos por WhatsApp.",
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
};
