import { BusinessConfig } from "@/lib/types";
import { Lead } from "@/data/leads/types";
import { casaManolo } from "@/data/sites/casa-manolo";
import { lumina } from "@/data/sites/lumina";
import { studioX } from "@/data/sites/studio-x";

// Tipo de negocio (tal y como aparece en las CSV de leads) -> config base
// cuya arquitectura/tema se reutiliza para generar la demo personalizada.
// Nota: "Lolita" (nightlife) es una coctelería, no un bar de barrio — los
// leads de tipo "Bar" (cervecerías, bares de toda la vida) usan Casa Manolo.
export const BASE_CONFIG_BY_TIPO: Record<string, BusinessConfig> = {
  Bar: casaManolo,
  Restaurante: lumina,
  Peluqueria: studioX,
};

function personalize(text: string, from: string, to: string): string {
  return text.split(from).join(to);
}

function digitsOnly(phone: string): string {
  return phone.replace(/\D/g, "");
}

/** Genera la config de una demo personalizada a partir de un lead real,
 * reutilizando la arquitectura/tema de la plantilla maestra de su tipo.
 * Solo sustituye datos que vienen de verdad del lead (nombre, direccion,
 * telefono, foto) — el resto (carta, galeria, reserva) se queda con el
 * contenido generico de la plantilla maestra, igual que hacian las
 * plantillas Jinja anteriores. */
export function buildLeadConfig(lead: Lead): BusinessConfig {
  const base = BASE_CONFIG_BY_TIPO[lead.tipo];
  if (!base) {
    throw new Error(`Sin plantilla maestra para el tipo "${lead.tipo}"`);
  }

  const config: BusinessConfig = JSON.parse(JSON.stringify(base));

  config.slug = lead.slug;
  config.businessName = lead.businessName;
  config.logoInitial = lead.businessName.trim().charAt(0).toUpperCase() || base.logoInitial;

  config.hero.eyebrow = `${lead.tipo} · ${lead.city}`;
  config.hero.title = personalize(config.hero.title, base.businessName, lead.businessName);
  if (lead.hasPhoto) {
    config.hero.image = `/img/${lead.slug}.jpg`;
  }

  if (config.about) {
    config.about.title = personalize(config.about.title, base.businessName, lead.businessName);
    config.about.body = personalize(config.about.body, base.businessName, lead.businessName);
  }

  if (lead.address) {
    config.location.address = lead.address;
    config.location.mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(lead.address)}&output=embed`;
  }

  if (lead.phone) {
    config.contact.phone = lead.phone;
    config.contact.whatsapp = `https://wa.me/${digitsOnly(lead.phone)}`;
  }
  // Sin email/instagram reales del lead — se omiten en vez de inventarlos.
  config.contact.email = undefined;
  config.contact.instagram = undefined;

  return config;
}
