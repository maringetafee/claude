export type Review = {
  author: string;
  /** Contexto corto: "Cliente en Getafe", "Restaurante en Madrid"… */
  context: string;
  text: string;
  rating: 5 | 4;
};

/**
 * Selección de opiniones reales publicadas en el perfil de Google de
 * Toldos Getafe (4,1 ★ · 228 reseñas).
 *
 * TODO (cliente): revisa esta selección y quédate con tus 3-4 favoritas,
 * copiando el texto y el nombre tal cual aparecen en Google.
 */
export const reviews: Review[] = [
  {
    author: "Jose Luis Lago Fernández",
    context: "Toldo instalado en vivienda",
    text: "Muy contento con el trabajo realizado por Toldos Getafe. Me han instalado el toldo en casa y el resultado ha sido excelente. Desde el primer momento el trato fue muy profesional, me asesoraron en todo y cumplieron con los plazos acordados.",
    rating: 5,
  },
  {
    author: "C. Mas",
    context: "Toldos para restaurante",
    text: "Contactamos con ellos para cambiar los toldos de nuestro restaurante y el trato tanto con los dueños como con los montadores ha sido excepcional. Estamos muy contentos con el trabajo y la rapidez, además cumplieron con los plazos que habíamos acordado.",
    rating: 5,
  },
  {
    author: "Opinión en Google",
    context: "Reseña verificada en el perfil",
    text: "Un trabajo excelente a unos precios inmejorables. Muy buena atención comercial e igualmente por parte de los técnicos. Recomendables al 100%.",
    rating: 5,
  },
  {
    author: "Opinión en Google",
    context: "Reseña verificada en el perfil",
    text: "Grandes profesionales, rápidos y eficientes, buena relación calidad-precio.",
    rating: 5,
  },
];
