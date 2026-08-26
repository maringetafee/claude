/**
 * Single source of truth for all restaurant content.
 * Every field is sourced from a public listing verified in /RESEARCH.md.
 * Do not invent prices, dishes, hours, or reviews — update this file
 * (and RESEARCH.md) only when a new fact has been independently confirmed.
 */

export type DayHours = {
  day: string
  /** 0 = Monday ... 6 = Sunday (Europe/Madrid week) */
  index: number
  open: string
  close: string
} | {
  day: string
  index: number
  closed: true
}

export const restaurant = {
  name: 'Sabor Imperial RestoBar',
  cuisine: 'Cocina peruana',
  priceRange: '10-20 € por persona',
  tagline: 'Cocina peruana de barrio, en el corazón de Getafe',
  address: {
    line1: 'C. Capellanes, 3',
    postalCode: '28902',
    city: 'Getafe',
    region: 'Madrid',
    country: 'ES',
    plusCode: '875F+M2 Getafe',
  },
  phone: '915 39 36 67',
  phoneHref: 'tel:+34915393667',
  googleMapsUrl:
    'https://www.google.com/maps/place/Sabor+Imperial+RestoBar/@40.309338,-3.7298792,18.25z/data=!4m10!1m2!2m1!1sRestaurantes!3m6!1s0xd4221610e19ea5b:0x5e3673c75f19c07d!8m2!3d40.3091667!4d-3.7275',
  theForkUrl: 'https://www.thefork.es/restaurante/sabor-imperial-restobar-r861438',
  coordinates: { lat: 40.3091667, lng: -3.7275 },
  rating: { value: 4.6, count: 79, source: 'Google' },
  services: ['Consumo en el lugar', 'Para llevar', 'Entrega a domicilio'],
  hours: [
    { day: 'Lunes', index: 0, open: '10:00', close: '17:00' },
    { day: 'Martes', index: 1, open: '10:00', close: '17:00' },
    { day: 'Miércoles', index: 2, open: '10:00', close: '23:00' },
    { day: 'Jueves', index: 3, open: '10:00', close: '23:00' },
    { day: 'Viernes', index: 4, open: '10:00', close: '23:00' },
    { day: 'Sábado', index: 5, open: '10:00', close: '23:00' },
    { day: 'Domingo', index: 6, open: '10:00', close: '17:00' },
  ] satisfies DayHours[],
} as const

export type MenuItem = {
  name: string
  description?: string
  /** Only set when an individual price was independently verified. */
  price?: string
}

export type MenuCategory = {
  id: string
  title: string
  priceRange: string
  items?: MenuItem[]
}

/**
 * Entrantes / Delicias del mar / Tradición criolla: transcribed directly
 * from a photograph of the restaurant's own current physical menu, supplied
 * and confirmed accurate by the site owner (see RESEARCH.md §4).
 * Para picar / Bocadillos: transcribed from a different, older-looking
 * photographed menu found in the "Carta" section of the restaurant's Google
 * Business Profile, printed under a different brand name — kept as a
 * secondary source pending confirmation (see RESEARCH.md §4 and §8).
 * Pollo a la brasa / Postres / Bebidas / Coctelería: no item-level photo was
 * found for these sections, so they keep the category price range verified
 * via TheFork (thefork.es) instead of an invented line-item list.
 */
export const menu: MenuCategory[] = [
  {
    id: 'entrantes',
    title: 'Entrantes',
    priceRange: '6,99 € – 14,99 €',
    items: [
      { name: 'Papa a la huancaína', price: '6,99 €' },
      { name: 'Tamal criollo', price: '6,99 €' },
      { name: 'Yuquitas doradas', price: '7,99 €' },
      { name: 'Salchipapa Imperial', price: '8,99 €' },
      { name: 'Alitas acevichadas', price: '9,99 €' },
      { name: 'Causa limeña', price: '9,99 €' },
      { name: 'Leche de tigre', price: '10,99 €' },
      { name: 'Causa acevichada', price: '14,99 €' },
      { name: 'Anticuchos', price: '14,99 €' },
    ],
  },
  {
    id: 'delicias-del-mar',
    title: 'Delicias del mar',
    priceRange: '14,99 € – 22,99 €',
    items: [
      { name: 'Ceviche clásico', price: '14,99 €' },
      { name: 'Ceviche mixto', price: '16,99 €' },
      { name: 'Ceviche criollo', price: '16,99 €' },
      { name: 'Sudado de pescado', price: '16,99 €' },
      { name: 'Arroz con mariscos', price: '16,99 €' },
      { name: 'Tiradito', price: '17,99 €' },
      { name: 'Jalea mixta', price: '17,99 €' },
      { name: 'Dúo marino', price: '22,99 €' },
    ],
  },
  {
    id: 'criolla',
    title: 'Tradición criolla',
    priceRange: '11,99 € – 14,99 €',
    items: [
      { name: 'Broaster', price: '11,99 €' },
      { name: 'Pollo a lo macho', price: '11,99 €' },
      { name: 'Arroz chaufa', price: '12,99 €' },
      { name: 'Chaufa Imperial', price: '12,99 €' },
      { name: 'Bistec a lo pobre', price: '13,99 €' },
      { name: 'Lomo saltado', price: '14,99 €' },
      { name: 'Chaufa mixto', price: '14,99 €' },
      { name: 'Tallarines a la huancaína con lomo', price: '14,99 €' },
    ],
  },
  {
    id: 'para-picar',
    title: 'Para picar',
    priceRange: '7,00 € – 14,00 €',
    items: [
      { name: 'Yuquitas doradas', price: '7,00 €' },
      { name: 'Tequeños', price: '8,00 €' },
      { name: 'Salchipapa', price: '8,00 €' },
      { name: 'Salchipapa La Trampa', price: '13,00 €' },
      { name: 'Patatas bravas', price: '8,00 €' },
      { name: 'Alitas acevichadas con patatas fritas', price: '14,00 €' },
    ],
  },
  {
    id: 'bocadillos',
    title: 'Bocadillos y sándwiches',
    priceRange: '1,00 € – 5,00 €',
    items: [
      { name: 'Pan con chicharrón (cerdo) + café o cebada' },
      { name: 'Pan con lomo saltado + café o cebada' },
      { name: 'Pan con aguacate' },
      { name: 'Pan con tamal + café o cebada' },
      { name: 'Pan con pechuga de pollo a la plancha + café o cebada' },
      { name: 'Pan con pollo' },
      { name: 'Sándwich mixto', price: '3,00 €' },
      { name: 'Sándwich mixto con huevo', price: '3,50 €' },
      { name: 'Bocadillo de pollo a la plancha', price: '5,00 €' },
      { name: 'Bocadillo de bacon con queso', price: '4,00 €' },
      { name: 'Bocadillo de tortilla de patata', price: '4,00 €' },
      { name: 'Bocadillo de tortilla francesa', price: '4,00 €' },
      { name: 'Bocadillo de panceta', price: '5,00 €' },
      { name: 'Bocadillo de lomo', price: '5,00 €' },
      { name: 'Pincho de tortilla', price: '5,00 €' },
      { name: 'Tostada de pan de molde (mantequilla, mermelada o tomate)', price: '1,00 €' },
    ],
  },
  {
    id: 'brasa',
    title: 'Pollo a la brasa',
    priceRange: '9,99 € – 35,99 €',
  },
  {
    id: 'postres',
    title: 'Postres',
    priceRange: '4 € – 5 €',
  },
  {
    id: 'bebidas',
    title: 'Bebidas',
    priceRange: '1,50 € – 12 €',
  },
  {
    id: 'coctelena',
    title: 'Coctelería',
    priceRange: '2 € – 22 €',
    items: [
      { name: 'Pisco sour', description: 'Citado como favorito en varias reseñas de clientes.' },
    ],
  },
]

export type Review = {
  quote: string
  author: string
  source: 'Google'
}

/** Verbatim excerpts from public Google reviews — see RESEARCH.md §5. */
export const reviews: Review[] = [
  {
    quote: 'Muy buena comida peruana a muy buen precio. El ambiente está muy bien, los fines de semana cantan en directo. El restaurante está muy limpio y acogedor y el personal es muy amable.',
    author: 'Juan Alberto López Jiménez',
    source: 'Google',
  },
  {
    quote: 'Fui por la tarde y destaco la atención, súper amable y atenta. Pedimos un dúo marino y unos tallarines a la huancaina con lomo y estaba 1000/10.',
    author: 'Mariapaz Romero',
    source: 'Google',
  },
  {
    quote: 'Muy buena comida, todo demasiado bueno, definitivamente un lugar a donde volveríamos.',
    author: 'Camila Vargas',
    source: 'Google',
  },
  {
    quote: 'Raciones generosas y buena cocina.',
    author: 'Reseña de Google',
    source: 'Google',
  },
]

export const gallery = [
  { id: 'salon', label: 'Salón', alt: 'Salón principal de Sabor Imperial RestoBar' },
  { id: 'barra', label: 'Barra', alt: 'Barra del restobar' },
  { id: 'huancaina', label: 'Tallarines a la huancaina', alt: 'Tallarines a la huancaina con lomo' },
  { id: 'lomo-saltado', label: 'Lomo saltado', alt: 'Lomo saltado con arroz chaufa' },
  { id: 'causa-limena', label: 'Causa limeña', alt: 'Causa limeña de pollo y aguacate' },
  { id: 'arroz-mariscos', label: 'Arroz con mariscos', alt: 'Arroz con mariscos' },
  { id: 'tallarin-saltado', label: 'Tallarín saltado', alt: 'Tallarín saltado con carne' },
  { id: 'tamal', label: 'Tamal peruano', alt: 'Tamal peruano' },
] as const

/** Photographed on real plates served in the restaurant — see ASSET_SOURCES.md. */
export const specialties = [
  {
    id: 'huancaina',
    name: 'Tallarines a la huancaina con lomo',
    description: 'La combinación más elogiada en las reseñas de clientes.',
  },
  {
    id: 'lomo-saltado',
    name: 'Lomo saltado con arroz chaufa',
    description: 'Clásico peruano de tiras de res salteadas, servido con arroz chaufa y patatas fritas.',
  },
  {
    id: 'causa-limena',
    name: 'Causa limeña',
    description: 'Patata amasada con ají amarillo, relleno de pollo y aguacate. 9,99 € en la carta.',
  },
  {
    id: 'arroz-mariscos',
    name: 'Arroz con mariscos',
    description: 'Arroz meloso con una generosa mezcla de mariscos.',
  },
] as const
