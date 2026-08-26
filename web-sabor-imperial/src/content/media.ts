/**
 * Single point of edit for every photo used on the site.
 *
 * Every photo below is a real customer-submitted photograph from the
 * restaurant's Google Business Profile (see RESEARCH.md §8 and
 * ASSET_SOURCES.md for attribution, source, and the rights caveat that
 * applies to customer-contributed photos). To replace one with photography
 * supplied directly by the owner: drop the new file in /public/images,
 * generate a 800w WebP alongside the full-size one (see
 * ASSET_SOURCES.md → "Cómo generar las variantes WebP"), and update the
 * matching entry below — this is the only file that needs touching.
 */

export type PhotoSlot = {
  src: string
  /** Responsive srcSet, e.g. "/images/foo-800.webp 800w, /images/foo.webp 1600w" */
  srcSet?: string
  alt: string
  /** object-position tuned per image so faces/plates aren't cropped badly */
  focus?: string
}

function photo(name: string, alt: string, focus = 'center'): PhotoSlot {
  return {
    src: `/images/${name}.webp`,
    srcSet: `/images/${name}-800.webp 800w, /images/${name}.webp 1600w`,
    alt,
    focus,
  }
}

export const heroSlides: PhotoSlot[] = [
  photo('salon', 'Salón de Sabor Imperial RestoBar, con paredes de ladrillo visto'),
  photo('lomo-saltado', 'Lomo saltado con arroz chaufa servido en el restaurante'),
  photo('barra', 'Barra del restobar con arcos de ladrillo'),
  photo('huancaina', 'Tallarines a la huancaina con lomo'),
]

export const photosById: Record<string, PhotoSlot> = {
  salon: photo('salon', 'Salón principal de Sabor Imperial RestoBar'),
  barra: photo('barra', 'Barra del restobar'),
  huancaina: photo('huancaina', 'Tallarines a la huancaina con lomo', '50% 30%'),
  'lomo-saltado': photo('lomo-saltado', 'Lomo saltado con arroz chaufa', '50% 35%'),
  'causa-limena': photo('causa-limena', 'Causa limeña de pollo y aguacate', '50% 40%'),
  'arroz-mariscos': photo('arroz-mariscos', 'Arroz con mariscos', '50% 35%'),
  'tallarin-saltado': photo('tallarin-saltado', 'Tallarín saltado con carne', '50% 30%'),
  tamal: photo('tamal', 'Tamal peruano'),
}

export const ogCover = '/images/lomo-saltado.webp'
