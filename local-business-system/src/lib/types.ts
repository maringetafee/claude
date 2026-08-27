export type BusinessType =
  | "restaurant"
  | "bar"
  | "cafe"
  | "cocktail-bar"
  | "hair-salon"
  | "barbershop"
  | "beauty"
  | "bakery";

export type ThemeId = "luxury-editorial" | "nightlife" | "fashion-minimal" | "tavern-warm" | "street-neon";

export type HeroType = "fullscreen" | "editorial" | "split";

export type SectionId =
  | "hero"
  | "about"
  | "features"
  | "menu"
  | "services"
  | "showcase"
  | "team"
  | "gallery"
  | "testimonials"
  | "booking"
  | "location"
  | "contact"
  | "cta";

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
  /** Video de fondo opcional (solo variante "fullscreen") — si esta presente
   * sustituye a la imagen estatica, que se sigue usando como poster/fallback
   * y como og:image. Autoplay/loop/muted, se ignora en reduced-motion. */
  video?: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  /** Franja de texto en bucle infinito sobre el borde del hero (solo variante
   * "fullscreen"). Opcional — temas sin vocacion "urbana" simplemente no la
   * definen y el Hero se comporta como siempre. */
  marquee?: string[];
}

export interface AboutConfig {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  /** Insignia flotante sobre la imagen (ej. valoracion media). Opcional. */
  stat?: { value: string; label: string };
}

export interface MenuItemConfig {
  name: string;
  description: string;
  price: string;
  /** Imagen propia del plato — si esta presente, pasar el raton sobre esta
   * fila sustituye momentaneamente la imagen de la categoria por esta. */
  image?: string;
}

export interface MenuCategoryConfig {
  name: string;
  items: MenuItemConfig[];
  /** Imagen mostrada al pasar el raton sobre esta categoria (panel editorial). */
  image?: string;
}

export interface MenuConfig {
  eyebrow: string;
  title: string;
  subtitle?: string;
  categories: MenuCategoryConfig[];
}

export interface FeatureItemConfig {
  title: string;
  body: string;
  image: string;
}

export interface FeaturesConfig {
  eyebrow: string;
  title: string;
  items: FeatureItemConfig[];
}

export interface ShowcaseConfig {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: string;
  cta: { label: string; href: string };
  /** Fila de datos destacados (ej. "180g · Carne · 100% vacuno"). Opcional. */
  stats?: { value: string; label: string }[];
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
  /** Imagen mostrada al pasar el raton sobre esta categoria (panel editorial). */
  image?: string;
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

export interface TestimonialItemConfig {
  author: string;
  timeAgo: string;
  stars: number;
  quote: string;
}

export interface TestimonialsConfig {
  eyebrow: string;
  title: string;
  rating: string;
  ratingCount: string;
  source: string;
  sourceHref?: string;
  items: TestimonialItemConfig[];
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

export interface CTAConfig {
  title: string;
  subtitle?: string;
  image: string;
  cta: { label: string; href: string };
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
  features?: FeaturesConfig;
  menu?: MenuConfig;
  services?: ServicesConfig;
  showcase?: ShowcaseConfig;
  team?: TeamConfig;
  gallery?: GalleryConfig;
  testimonials?: TestimonialsConfig;
  booking?: BookingConfig;
  location: LocationConfig;
  contact: ContactConfig;
  cta?: CTAConfig;
}
