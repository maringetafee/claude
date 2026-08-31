export type OperationType = "venta" | "alquiler";

export interface SiteIdentity {
  name: string;
  claim: string;
  description: string;
  city: string;
  phone: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  instagramHandle: string;
  ogImage: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface PropertyImage {
  src: string;
  alt: string;
}

export interface Property {
  id: string;
  reference?: string;
  slug: string;
  title: string;
  operation: OperationType;
  category: string;
  zone: string;
  city: string;
  address?: string;
  postalCode?: string;
  price: number;
  priceSuffix?: string;
  beds: number;
  baths: number;
  floor?: string;
  year?: number;
  state?: string;
  area: number;
  latitude?: number;
  longitude?: number;
  cover: PropertyImage;
  showcaseCover?: PropertyImage;
  gallery: PropertyImage[];
  description: string;
  features: string[];
  featured?: boolean;
  showcase?: boolean;
  published?: boolean;
}

export interface PropertyImageRow {
  id: string;
  url: string;
  alt: string;
  position: number;
  isCover: boolean;
}

export interface PropertyFilters {
  operacion?: string;
  tipo?: string;
  zona?: string;
  min?: string;
  max?: string;
  habitaciones?: string;
  limit?: number;
}

export interface ServiceItem {
  number: string;
  title: string;
  description: string;
  image: PropertyImage;
  href: string;
}

export interface Zone {
  slug: string;
  name: string;
  description: string;
  propertiesCount: number;
  image: PropertyImage;
}

export interface Testimonial {
  quote: string;
  name: string;
  operation: string;
  zone: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}
