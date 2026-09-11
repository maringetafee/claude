export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const generalProcess: ProcessStep[] = [
  {
    number: "01",
    title: "Infórmate",
    description: "Nos cuentas qué carnet quieres sacarte y resolvemos tus dudas, sin compromiso.",
  },
  {
    number: "02",
    title: "Matrícula",
    description: "Te damos de alta y tramitamos tu expediente con la DGT.",
  },
  {
    number: "03",
    title: "Teórico",
    description: "Preparas el test con nosotros hasta que lo apruebes.",
  },
  {
    number: "04",
    title: "Prácticas",
    description: "Empiezas las clases de conducción, a tu ritmo.",
  },
  {
    number: "05",
    title: "Examen práctico",
    description: "Te presentas al examen cuando tú y tu profesor veáis que estás preparado/a.",
  },
  {
    number: "06",
    title: "Carnet conseguido",
    description: "Recibes tu autorización para conducir y, después, el permiso físico.",
  },
];
