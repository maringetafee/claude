/**
 * Estos puntos NO son afirmaciones inventadas: son patrones repetidos de
 * forma consistente en varias fuentes públicas independientes (reseñas y
 * perfiles de negocio) al describir Rosangel. Se presentan como rasgos
 * reconocidos por sus alumnos, no como reseñas literales.
 */
export type Differentiator = {
  title: string;
  description: string;
};

export const differentiators: Differentiator[] = [
  {
    title: "Trato cercano, de barrio",
    description:
      "Alumnos y familias describen un trato personal y cercano, del estilo de un negocio de toda la vida de Getafe.",
  },
  {
    title: "Profesores con paciencia",
    description:
      "Uno de los comentarios que más se repite: profesores pacientes, que explican bien y se adaptan al ritmo de cada alumno.",
  },
  {
    title: "Flexibilidad de horarios",
    description:
      "Las clases prácticas se organizan intentando ajustarse a la disponibilidad de cada alumno, algo muy valorado por quienes compaginan estudios o trabajo.",
  },
  {
    title: "Cuatro centros en Getafe",
    description:
      "Centro, Juan de la Cierva, Norte y Los Molinos: puedes elegir el centro que te quede más cerca de casa o del trabajo.",
  },
  {
    title: "Más de dos décadas en Getafe",
    description:
      "El centro de Titulcia opera desde hace más de veinte años en la ciudad, bajo distintos nombres a lo largo del tiempo.",
  },
];
