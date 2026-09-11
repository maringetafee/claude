/**
 * Contenido regulatorio general (edad mínima, qué permite conducir cada
 * permiso, estructura del examen) proviene de normativa pública de la DGT,
 * no de material comercial de Rosangel — es seguro incluirlo como
 * información factual. Lo que SÍ es específico de Rosangel (nº de clases,
 * precios, disponibilidad de motos) se deja fuera o con CTA a "consúltanos".
 */

export type PermitStep = {
  title: string;
  description: string;
};

export type Permit = {
  slug: "permiso-b" | "permiso-a2";
  code: "B" | "A2";
  name: string;
  title: string;
  subtitle: string;
  // Fotos genéricas de Unsplash (licencia gratuita para uso comercial, sin
  // atribución obligatoria). No son de Rosangel: sustituir por fotos reales
  // de sus vehículos en cuanto las haya.
  image: { src: string; alt: string; credit: string };
  minAge: string;
  canDrive: string[];
  requirements: string[];
  process: PermitStep[];
  examInfo: string[];
  seoKeywords: string[];
};

export const permits: Permit[] = [
  {
    slug: "permiso-b",
    code: "B",
    name: "Permiso B",
    title: "Carnet de coche — Permiso B",
    subtitle: "El permiso más solicitado: te permite conducir turismos y furgonetas.",
    image: {
      src: "/images/permits/permiso-b.jpg",
      alt: "Profesor de autoescuela explicando la prueba práctica a un alumno junto al coche",
      credit: "https://unsplash.com/photos/tyhpK_QelPo",
    },
    minAge: "18 años cumplidos (puedes empezar la teórica antes de cumplirlos).",
    canDrive: [
      "Automóviles de hasta 3.500 kg de masa máxima autorizada.",
      "Vehículos con un máximo de 9 plazas, incluido el conductor.",
      "Puede incluir un remolque ligero (hasta 750 kg) sin trámite adicional.",
    ],
    requirements: [
      "Tener 18 años cumplidos para examinarte (puedes matricularte y estudiar la teórica antes).",
      "Certificado psicotécnico de aptitud, vigente en el momento del examen.",
      "No tener una sanción vigente que impida obtener el permiso.",
    ],
    process: [
      {
        title: "Matrícula y expediente",
        description: "Te damos de alta en el centro y tramitamos tu expediente con la DGT.",
      },
      {
        title: "Clases teóricas",
        description: "Preparación del test teórico: normativa, señalización y mecánica básica.",
      },
      {
        title: "Examen teórico",
        description: "Test tipo test en el centro de examen. Una vez aprobado, empiezas las prácticas.",
      },
      {
        title: "Clases prácticas",
        description: "Clases de conducción en circuito abierto con profesor, adaptadas a tu nivel.",
      },
      {
        title: "Examen práctico",
        description: "Prueba de circulación con un examinador de la DGT y tu profesor.",
      },
      {
        title: "Carnet B conseguido",
        description: "Recibes tu autorización y, después, el permiso físico por correo.",
      },
    ],
    examInfo: [
      "El examen teórico consta de preguntas tipo test sobre normativa de circulación.",
      "El examen práctico se realiza en circulación real, evaluando maniobras y toma de decisiones.",
      "Los exámenes de Rosangel se realizan en el centro de examen de la DGT en Móstoles.",
    ],
    seoKeywords: [
      "carnet B Getafe",
      "permiso B Getafe",
      "carnet de conducir Getafe",
      "autoescuela Getafe carnet B",
    ],
  },
  {
    slug: "permiso-a2",
    code: "A2",
    name: "Permiso A2",
    title: "Carnet de moto — Permiso A2",
    subtitle: "Para motos de potencia media: el paso natural para quien ya sabe lo que quiere.",
    image: {
      src: "/images/permits/permiso-a2.jpg",
      alt: "Motorista con casco circulando por una carretera de curvas",
      credit: "https://unsplash.com/photos/LZVkAbIw74Q",
    },
    minAge: "18 años cumplidos.",
    canDrive: [
      "Motocicletas de hasta 35 kW de potencia.",
      "Relación potencia/peso no superior a 0,2 kW/kg.",
      "Motos que no procedan de una moto de más del doble de esa potencia.",
    ],
    requirements: [
      "Tener 18 años cumplidos para examinarte.",
      "Certificado psicotécnico de aptitud, vigente en el momento del examen.",
      "No es necesario tener el permiso B ni el A1 previamente para sacarte el A2 directamente.",
    ],
    process: [
      {
        title: "Matrícula y expediente",
        description: "Te damos de alta en el centro y tramitamos tu expediente con la DGT.",
      },
      {
        title: "Clases teóricas",
        description: "Preparación del test teórico común, con foco en la normativa específica de moto.",
      },
      {
        title: "Examen teórico",
        description: "Test tipo test en el centro de examen.",
      },
      {
        title: "Prácticas en circuito cerrado",
        description: "Primero se practican las maniobras obligatorias en un circuito cerrado homologado.",
      },
      {
        title: "Prácticas en circulación",
        description: "Después, clases en circulación real hasta dominar el tráfico urbano e interurbano.",
      },
      {
        title: "Examen práctico",
        description: "Maniobras en circuito cerrado y prueba de circulación con un examinador de la DGT.",
      },
    ],
    examInfo: [
      "El examen práctico de moto se divide en dos partes: maniobras en circuito cerrado y circulación en vía real.",
      "Con el A2, después de 2 años de experiencia puedes ampliar al permiso A (sin límite de potencia) mediante un curso o examen, según la normativa vigente en ese momento.",
    ],
    seoKeywords: [
      "carnet A2 Getafe",
      "permiso A2 Getafe",
      "autoescuela moto Getafe",
      "carnet de moto Getafe",
    ],
  },
];

export function getPermit(slug: string) {
  return permits.find((p) => p.slug === slug);
}
