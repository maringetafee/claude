import type { Permit } from "@/lib/site-config";

export type Testimonial = {
  quote: string;
  author: string;
  center: string;
  permit: Permit;
};

/**
 * RESEÑAS DE EJEMPLO — textos redactados para maquetar la sección. NO son
 * reseñas reales ni citas de Google: recogen los temas que más se repiten en
 * las reseñas públicas de Rosangel (ver reviewTopics), pero textos y nombres
 * son inventados.
 *
 * TODO CRÍTICO antes de publicar: sustituir por reseñas reales con permiso
 * del autor, o quitar las tarjetas. Publicar opiniones inventadas como si
 * fueran de alumnos reales es una práctica comercial desleal. Ver
 * CONTENT_NEEDED.md.
 */
export const testimonialsAreExamples = true;

export const testimonials: Testimonial[] = [
  {
    quote:
      "Llegué con muchísimo miedo al coche y mi profesor tuvo una paciencia infinita. Aprobé el práctico a la primera.",
    author: "Laura M.",
    center: "Getafe Centro",
    permit: "B",
  },
  {
    quote:
      "Las clases teóricas se entienden muy bien. Fui al examen tranquilo porque sabía que lo llevaba preparado.",
    author: "Andrés P.",
    center: "Getafe Norte",
    permit: "B",
  },
  {
    quote:
      "Me saqué el A2 compaginándolo con el trabajo. Me adaptaron las prácticas a mis horarios sin ningún problema.",
    author: "Sergio R.",
    center: "Juan de la Cierva",
    permit: "A2",
  },
  {
    quote:
      "Trato cercano de principio a fin. En la oficina siempre te resuelven las dudas y te explican cada paso.",
    author: "Nerea G.",
    center: "Los Molinos",
    permit: "B",
  },
];

// Temas que Google Maps destaca en las reseñas reales del centro de Manzana
// (consultado en septiembre de 2026). Dato real, no de ejemplo.
export const reviewTopics = ["Paciencia", "Clases teóricas", "Confianza", "Examen"];
