export type BusinessType =
  | "restaurant"
  | "bar"
  | "cafe"
  | "cocktail-bar"
  | "hair-salon"
  | "barbershop"
  | "beauty"
  | "bakery";

export type ThemeId = "luxury-editorial" | "nightlife" | "fashion-minimal" | "tavern-warm";

export type HeroType = "fullscreen" | "editorial" | "split";

export type SectionId =
  | "hero"
  | "about"
  | "menu"
  | "services"
  | "team"
  | "gallery"
  | "booking"
  | "location"
  | "contact";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroConfig {
  type: HeroType;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
}

export interface AboutConfig {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
}

export interface MenuItemConfig {
  name: string;
  description: string;
  price: string;
}

export interface MenuCategoryConfig {
  name: string;
  items: MenuItemConfig[];
}

export interface MenuConfig {
  eyebrow: string;
  title: string;
  categories: MenuCategoryConfig[];
}

export interface ServiceItemConfig {
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface ServiceCategoryConfig {
  name: string;
  items: ServiceItemConfig[];
}

export interface ServicesConfig {
  eyebrow: string;
  title: string;
  categories: ServiceCategoryConfig[];
}

export interface TeamMemberConfig {
  name: string;
  role: string;
  image: string;
}

export interface TeamConfig {
  eyebrow: string;
  title: string;
  members: TeamMemberConfig[];
}

export interface GalleryConfig {
  eyebrow: string;
  title: string;
  images: { src: string; alt: string }[];
}

export type BookingFlowStep =
  | "service"
  | "professional"
  | "table"
  | "date"
  | "time"
  | "people"
  | "customer";

export interface BookingConfig {
  eyebrow: string;
  title: string;
  subtitle: string;
  flow: BookingFlowStep[];
  services?: string[];
  professionals?: string[];
  showTableMap?: boolean;
}

export interface LocationConfig {
  address: string;
  mapsEmbedSrc: string;
  hours: { day: string; hours: string }[];
}

export interface ContactConfig {
  phone: string;
  whatsapp: string;
  email?: string;
  instagram?: string;
}

export interface BusinessConfig {
  slug: string;
  businessName: string;
  businessType: BusinessType;
  theme: ThemeId;
  tagline: string;
  logoInitial: string;
  favicon: string;
  nav: NavLink[];
  sections: SectionId[];
  hero: HeroConfig;
  about?: AboutConfig;
  menu?: MenuConfig;
  services?: ServicesConfig;
  team?: TeamConfig;
  gallery?: GalleryConfig;
  booking?: BookingConfig;
  location: LocationConfig;
  contact: ContactConfig;
}
