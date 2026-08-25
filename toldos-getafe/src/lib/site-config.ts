export const siteConfig = {
  name: "Toldos Getafe",
  legalName: "Toldos Getafe, S.L.",
  phone: { display: "91 696 37 34", href: "tel:+34916963734" },
  mobile: { display: "609 63 87 47", href: "tel:+34609638747" },
  email: "comercial@toldosgetafe.es",
  address: {
    line: "C. del Tomillo, 18, 28946 Fuenlabrada, Madrid",
    city: "Fuenlabrada, Madrid",
  },
  social: {
    facebook: "https://www.facebook.com/ToldosGetafe",
    instagram: "https://www.instagram.com/toldos_getafe/",
  },
  tagline: "Fábrica de toldos y pérgolas a medida en Madrid.",
} as const;

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};

export const primaryNav: NavItem[] = [
  {
    label: "Toldos",
    href: "/toldos",
    children: [
      { label: "Extensibles", href: "/toldos/extensibles" },
      { label: "Cofre", href: "/toldos/cofres" },
      { label: "Portada", href: "/toldos/portada" },
    ],
  },
  { label: "Pérgolas", href: "/pergolas" },
  { label: "Cerramientos", href: "/cerramientos" },
  { label: "Profesionales", href: "/profesionales" },
  { label: "Nosotros", href: "/#fabricacion" },
  { label: "Contacto", href: "/contacto" },
];

export const footerLinks = [
  { label: "Toldos", href: "/toldos" },
  { label: "Pérgolas", href: "/pergolas" },
  { label: "Cerramientos", href: "/cerramientos" },
  { label: "Profesionales", href: "/profesionales" },
  { label: "Contacto", href: "/contacto" },
];

export const legalLinks = [
  { label: "Aviso legal", href: "/aviso-legal" },
  { label: "Política de privacidad", href: "/politica-de-privacidad" },
  { label: "Política de cookies", href: "/politica-de-cookies" },
];
