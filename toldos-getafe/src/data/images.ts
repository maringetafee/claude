export type SiteImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const logo = {
  header: {
    src: "/images/logo/logo-header.webp",
    width: 842,
    height: 259,
    alt: "Toldos Getafe",
  } satisfies SiteImage,
};

export const toldos = {
  heroLifestyle: {
    src: "/images/toldos/hero-toldos-getafe.webp",
    width: 675,
    height: 813,
    alt: "Toldo instalado en terraza",
  },
  overviewHero: {
    src: "/images/toldos/toldos-hero-overview.webp",
    width: 641,
    height: 700,
    alt: "Toldos a medida",
  },
  cofreTile: {
    src: "/images/toldos/toldo-cofre-tile.webp",
    width: 705,
    height: 591,
    alt: "Toldo cofre",
  },
  cofreHero: {
    src: "/images/toldos/toldo-cofre-hero.webp",
    width: 705,
    height: 591,
    alt: "Toldo con cofre",
  },
  extensible: {
    src: "/images/toldos/toldo-extensible.webp",
    width: 705,
    height: 591,
    alt: "Toldo extensible de brazos articulados",
  },
  portadaTile: {
    src: "/images/toldos/toldo-portada.webp",
    width: 705,
    height: 591,
    alt: "Toldo portada",
  },
  portadaHero: {
    src: "/images/toldos/toldo-portada-hero.webp",
    width: 945,
    height: 945,
    alt: "Toldo portada o de punto recto",
  },
  vertical: {
    src: "/images/toldos/toldo-vertical.webp",
    width: 705,
    height: 591,
    alt: "Toldo vertical",
  },
  balcon: {
    src: "/images/toldos/toldo-balcon.webp",
    width: 705,
    height: 591,
    alt: "Toldo para balcón",
  },
  capota: {
    src: "/images/toldos/capota.webp",
    width: 700,
    height: 558,
    alt: "Capota",
  },
} satisfies Record<string, SiteImage>;

export const pergolas = {
  lona: {
    src: "/images/pergolas/pergola-lona.webp",
    width: 675,
    height: 863,
    alt: "Pérgola con lona",
  },
  bioclimatica1: {
    src: "/images/pergolas/pergola-bioclimatica-1.webp",
    width: 675,
    height: 863,
    alt: "Pérgola bioclimática",
  },
  bioclimatica2: {
    src: "/images/pergolas/pergola-bioclimatica-2.webp",
    width: 2144,
    height: 1984,
    alt: "Pérgola bioclimática sobre terraza",
  },
} satisfies Record<string, SiteImage>;

export const cerramientos = {
  hero: {
    src: "/images/cerramientos/cerramientos-lona.webp",
    width: 800,
    height: 800,
    alt: "Cerramiento de lona",
  },
  transparente: {
    src: "/images/cerramientos/lona-transparente.webp",
    width: 705,
    height: 591,
    alt: "Cerramiento de lona transparente",
  },
  acrilicaPvc: {
    src: "/images/cerramientos/lona-acrilica-pvc.webp",
    width: 705,
    height: 591,
    alt: "Cerramiento de lona acrílica y PVC",
  },
} satisfies Record<string, SiteImage>;

export const fabrica = {
  profesionalesHero: {
    src: "/images/fabrica/fabrica-profesionales-hero.webp",
    width: 1236,
    height: 1056,
    alt: "Fábrica de toldos y pérgolas para el profesional",
  },
  hero: {
    src: "/images/fabrica/fabrica-hero.webp",
    width: 940,
    height: 788,
    alt: "Fábrica de toldos en Madrid",
  },
  taller: [
    {
      src: "/images/fabrica/aluminio-toldos-pergolas.webp",
      width: 705,
      height: 591,
      alt: "Perfiles de aluminio para toldos y pérgolas",
    },
    {
      src: "/images/fabrica/aluminio-toldos.webp",
      width: 705,
      height: 591,
      alt: "Aluminio para fabricación de toldos",
    },
    {
      src: "/images/fabrica/costura-toldos.webp",
      width: 705,
      height: 591,
      alt: "Costura de lonas para toldos",
    },
    {
      src: "/images/fabrica/fabrica-toldos-madrid.webp",
      width: 705,
      height: 591,
      alt: "Nave de fabricación de toldos en Madrid",
    },
    {
      src: "/images/fabrica/fabrica-toldos-pergolas.webp",
      width: 705,
      height: 591,
      alt: "Fabricación de toldos y pérgolas",
    },
    {
      src: "/images/fabrica/fabricacion-toldos.webp",
      width: 705,
      height: 591,
      alt: "Proceso de fabricación de toldos",
    },
    {
      src: "/images/fabrica/lonas-toldos-madrid.webp",
      width: 705,
      height: 591,
      alt: "Lonas para toldos en Madrid",
    },
    {
      src: "/images/fabrica/taller-toldos.webp",
      width: 705,
      height: 591,
      alt: "Taller de toldos",
    },
  ] satisfies SiteImage[],
};

export const soluciones = {
  viviendas: {
    src: "/images/soluciones/viviendas.webp",
    width: 1600,
    height: 1065,
    alt: "Toldo en fachada de vivienda",
  },
  terrazas: {
    src: "/images/soluciones/terrazas.webp",
    width: 1600,
    height: 1067,
    alt: "Terraza con pérgola al atardecer",
  },
  jardines: {
    src: "/images/soluciones/jardines.webp",
    width: 1600,
    height: 1068,
    alt: "Pérgola moderna en jardín",
  },
  ventanas: {
    src: "/images/soluciones/ventanas.webp",
    width: 1600,
    height: 1067,
    alt: "Toldo vertical en ventana",
  },
  restaurantes: {
    src: "/images/soluciones/restaurantes.webp",
    width: 1600,
    height: 1067,
    alt: "Terraza de restaurante con toldo",
  },
  espaciosComerciales: {
    src: "/images/soluciones/espacios-comerciales.webp",
    width: 1600,
    height: 1067,
    alt: "Fachada de espacio comercial con protección solar",
  },
} satisfies Record<string, SiteImage>;

export type Proyecto = {
  /** Municipio donde se hizo la instalación (se muestra sobre la foto). */
  municipio: string;
  tipo: string;
  /** Foto del proyecto terminado. */
  imagen: SiteImage;
  /**
   * Opcional: foto del MISMO encuadre antes de la instalación. Si se
   * rellena, la tarjeta pasa a mostrar el comparador antes/después.
   */
  antes?: SiteImage;
};

/**
 * Proyectos reales para la galería de la portada.
 *
 * TODO (cliente):
 *  - `municipio` y `tipo` de cada foto son provisionales: ajústalos a la
 *    instalación real que aparece en la imagen.
 *  - Para activar el "antes / después", añade en `antes` una foto del
 *    mismo encuadre previo a la obra (guárdala en /public/images/proyectos/).
 */
export const proyectos: Proyecto[] = [
  {
    municipio: "Madrid Sur",
    tipo: "Pérgola para terraza de restaurante",
    imagen: {
      src: "/images/carrusel/terraza-restaurante-madrid.webp",
      width: 768,
      height: 576,
      alt: "Terraza de restaurante con pérgola instalada por Toldos Getafe",
    },
  },
  {
    municipio: "Madrid Sur",
    tipo: "Pérgola bioclimática en vivienda",
    imagen: {
      src: "/images/pergolas/pergola-bioclimatica-2.webp",
      width: 2144,
      height: 1984,
      alt: "Pérgola bioclimática sobre una terraza",
    },
  },
  {
    municipio: "Madrid Sur",
    tipo: "Toldo cofre en fachada",
    imagen: {
      src: "/images/toldos/toldo-cofre-hero.webp",
      width: 705,
      height: 591,
      alt: "Toldo cofre motorizado instalado en una fachada",
    },
  },
  {
    municipio: "Madrid Sur",
    tipo: "Pérgola en jardín",
    imagen: {
      src: "/images/soluciones/jardines.webp",
      width: 1600,
      height: 1068,
      alt: "Pérgola moderna instalada en un jardín",
    },
  },
  {
    municipio: "Madrid Sur",
    tipo: "Toldo en vivienda unifamiliar",
    imagen: {
      src: "/images/soluciones/viviendas.webp",
      width: 1600,
      height: 1065,
      alt: "Toldo instalado en la fachada de una vivienda",
    },
  },
  {
    municipio: "Madrid Sur",
    tipo: "Toldos para local comercial",
    imagen: {
      src: "/images/soluciones/espacios-comerciales.webp",
      width: 1600,
      height: 1067,
      alt: "Protección solar instalada en la fachada de un local comercial",
    },
  },
];

export const carrusel: SiteImage[] = [
  {
    src: "/images/carrusel/pergola-restauracion.webp",
    width: 768,
    height: 576,
    alt: "Pérgola en terraza de restauración",
  },
  {
    src: "/images/carrusel/terraza-restaurante-madrid.webp",
    width: 768,
    height: 576,
    alt: "Terraza de restaurante en Madrid con pérgola",
  },
  {
    src: "/images/carrusel/terraza-pergola-restaurante.webp",
    width: 768,
    height: 576,
    alt: "Terraza de restaurante con pérgola instalada",
  },
  {
    src: "/images/carrusel/terraza-con-pergolas-madrid.webp",
    width: 768,
    height: 576,
    alt: "Terraza en Madrid con pérgolas",
  },
  {
    src: "/images/carrusel/pergolas-decoracion.webp",
    width: 768,
    height: 576,
    alt: "Pérgola con decoración de terraza",
  },
  {
    src: "/images/carrusel/pergolas-a-medida-madrid.webp",
    width: 768,
    height: 576,
    alt: "Pérgola a medida en Madrid",
  },
];
