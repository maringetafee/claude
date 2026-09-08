import type { ImageKey } from "@/components/ui/Picture";

/** Company facts — all taken verbatim in substance from sema-dur.com. */

export const milestones: { year: string; title: string; body: string }[] = [
  {
    year: "1976",
    title: "Nace Talleres Sema-Dur",
    body: "La empresa comienza su andadura fabricando herramienta para la industria de la madera.",
  },
  {
    year: "1994",
    title: "Reafilado y diamante (PCD)",
    body: "Se pone en marcha el servicio de reafilado y la fabricación de herramientas de diamante policristalino, una de las primeras aplicaciones del PCD al corte de la madera en España.",
  },
  {
    year: "Hoy",
    title: "Presencia internacional",
    body: "Además de España, las herramientas de Sema-Dur se distribuyen en países como Portugal, Colombia, Venezuela o Guinea.",
  },
];

export const figures: { value: string; label: string }[] = [
  { value: "1976", label: "Año de fundación" },
  { value: "+45", label: "Años fabricando herramienta de corte" },
  { value: "PCD", label: "Tecnología de diamante desde 1994" },
  { value: "2", label: "Distribuciones oficiales: Freud y Ceratizit" },
];

export const values: { title: string; body: string }[] = [
  {
    title: "Diseño y fabricación propios",
    body: "Analizamos el perfil, el material y la máquina para construir la herramienta que resuelve cada trabajo, no la que hay en catálogo.",
  },
  {
    title: "Maquinaria y personal cualificado",
    body: "Contamos con maquinaria automática de última generación y un equipo técnico que estudia los requerimientos más especiales.",
  },
  {
    title: "Vida útil, no solo compra",
    body: "El servicio de reafilado desde 1994 permite recuperar el filo original de la herramienta varias veces antes de reponerla.",
  },
];

export const suppliers: {
  name: string;
  url: string;
  logo: ImageKey;
  body: string;
}[] = [
  {
    name: "Freud",
    url: "https://freud-espana.com/",
    logo: "logos/freud",
    body: "Fundada en 1962 en el noroeste de Italia y parte del grupo Bosch desde 2009. Su sede alberga uno de los centros de I+D de herramienta de corte más avanzados de Europa.",
  },
  {
    name: "Ceratizit",
    url: "https://www.ceratizit.com/",
    logo: "logos/ceratizit",
    body: "Más de 100 años desarrollando soluciones de corte en metal duro. Grupo de ingeniería de alta tecnología especializado en herramienta y aplicaciones de metal duro.",
  },
];

export const companyIntro =
  "En Talleres Sema-Dur diseñamos, fabricamos y reafilamos herramientas de corte a medida para madera y metal. Empezamos en 1976 con la industria de la madera y en 1994 incorporamos el reafilado y el diamante policristalino (PCD), tecnología en la que fuimos pioneros en el mercado nacional.";

export const philosophyQuote =
  "Diseñar y construir herramientas que garanticen unos resultados y unas prestaciones de primera calidad.";
