// Contenido real de S.B.S Telecomunicaciones S.L., extraído de sbstelec.com (auditoría 2026-08-24).
// No se ha inventado ningún dato de empresa: direcciones, teléfonos, cifras y certificaciones
// proceden literalmente de la web original.

export const company = {
  legalName: "S.B.S Telecomunicaciones S.L.",
  shortName: "S.B.S",
  claim: "Especialistas en telecomunicaciones e infraestructura de edificios",
  foundedYears: 50,
  vehicles: 16,
  phone: "914 718 938",
  phoneHref: "tel:+34914718938",
  email: "sbs@sbstelec.es",
  emailHref: "mailto:sbs@sbstelec.es",
  address: {
    street: "Calle Juan Francisco 3",
    postalCode: "28025",
    city: "Madrid",
    province: "Madrid",
    country: "España",
  },
  emergency: {
    day: "Domingos",
    hours: "09:00 — 14:00",
    scope: "Averías generales",
  },
  certifications: [
    "Certificación de Sistema de Gestión de Calidad (ISO 9002)",
  ],
  memberships: [
    {
      name: "Asociación Madrileña de Industrias Instaladoras de Telecomunicación",
      detail: "Agrupa a más de 100 empresas de telecomunicaciones de la Comunidad de Madrid.",
    },
    {
      name: "Federación Nacional de Instaladores de Telecomunicación",
      detail: "Representación a nivel nacional del sector de instalación de telecomunicaciones.",
    },
    {
      name: "Grupo Europeo de Negocios de Telecomunicaciones (GENT Soc. Coop.)",
      detail: "Cooperativa que agrupa a las empresas punteras del sector en Europa.",
    },
  ],
} as const;

export type Service = {
  code: string;
  slug: string;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    code: "01",
    slug: "porteros-automaticos",
    title: "Porteros automáticos",
    short: "Instalación, reparación y mantenimiento.",
    description:
      "Diseñamos, instalamos y mantenemos porteros automáticos para comunidades y negocios en toda la Comunidad de Madrid, con modelos antivandálicos y de alta durabilidad.",
    bullets: [
      "Teclados codificados y mandos a distancia",
      "Sistemas de apertura para varias puertas",
      "Modelos antivandálicos de máxima seguridad",
      "Contratos de mantenimiento y conservación",
    ],
    image: "/images/portero-automatico.jpg",
    imageAlt: "Técnico de S.B.S Telecomunicaciones instalando un portero automático en un portal de Madrid",
  },
  {
    code: "02",
    slug: "videoporteros",
    title: "Videoporteros",
    short: "Seguridad visual para tu comunidad.",
    description:
      "Sistemas de videoportero con manos libres y estudio de presupuesto sin compromiso, para que identifique con claridad a cualquier visitante antes de abrir la puerta.",
    bullets: [
      "Imagen nítida en cualquier condición de luz",
      "Función manos libres",
      "Financiación hasta en 12 meses",
      "Contrato de mantenimiento incluido",
    ],
    image: "/images/tecnico-instalacion.jpg",
    imageAlt: "Técnico de S.B.S Telecomunicaciones trabajando en una instalación en azotea en Madrid",
  },
  {
    code: "03",
    slug: "antenas-colectivas",
    title: "Antenas colectivas",
    short: "TDT y señal terrestre digital.",
    description:
      "Instalación y adaptación de antenas colectivas a la Televisión Digital Terrestre, integrando la señal terrestre con la de satélite en edificios y urbanizaciones.",
    bullets: [
      "Adaptación de instalaciones a TDT",
      "Integración de señal terrestre y satélite",
      "Mantenimiento preventivo y correctivo",
      "Servicio para comunidades y particulares",
    ],
    image: "/images/madrid-torre.jpg",
    imageAlt: "Antena de telecomunicaciones sobre un edificio residencial de Madrid",
  },
  {
    code: "04",
    slug: "antenas-parabolicas",
    title: "Antenas parabólicas",
    short: "TV vía satélite, individual y colectiva.",
    description:
      "Instalaciones de frecuencia intermedia para recibir la totalidad de canales vía satélite (Astra, Eutelsat y otros), con asesoramiento técnico individualizado.",
    bullets: [
      "Instalaciones R.F. banda / TV",
      "Conexión individual o para todo el inmueble",
      "Asesoramiento técnico en cada caso",
      "Más de 50 años de experiencia en el sector",
    ],
    image: "/images/antenas-detalle-1.jpg",
    imageAlt: "Detalle de antenas parabólicas instaladas en una azotea",
  },
  {
    code: "05",
    slug: "videovigilancia",
    title: "Videovigilancia",
    short: "Circuito cerrado de televisión (CCTV).",
    description:
      "Sistemas y cámaras de videovigilancia para portales, comunidades y negocios, diseñados como parte de una instalación de seguridad integral.",
    bullets: [
      "Circuito cerrado de televisión (CCTV)",
      "Diseño a medida del inmueble",
      "Mantenimiento periódico",
      "Integración con el resto de la instalación",
    ],
    image: "/images/antenas-detalle-2.jpg",
    imageAlt: "Detalle técnico de instalación de antenas y equipos en azotea",
  },
  {
    code: "06",
    slug: "electricidad",
    title: "Electricidad",
    short: "Instalaciones y mantenimiento eléctrico.",
    description:
      "Mantenimiento y reparación de instalaciones eléctricas asociadas a la infraestructura de comunicaciones y accesos de su comunidad o negocio.",
    bullets: [
      "Diagnóstico y reparación de averías",
      "Mantenimiento preventivo",
      "Adaptación normativa de instalaciones",
      "Atención de urgencias los domingos",
    ],
    image: "/images/antenas-detalle-3.jpg",
    imageAlt: "Instalación técnica de equipos de telecomunicaciones en azotea de edificio",
  },
  {
    code: "07",
    slug: "cerrajeria",
    title: "Cerrajería de portal",
    short: "Diseño y adaptación de accesos.",
    description:
      "Nuevo diseño o adaptación de la cerrajería de portal existente: cerraduras normalizadas, muelles, ajustes de puertas, microllaves y temporizadores.",
    bullets: [
      "Cerraduras normalizadas en portales",
      "Muelles y ajustes de puertas",
      "Microllaves y control de codificación",
      "Temporizadores y mantenimiento",
    ],
    image: "/images/atencion-cliente.jpg",
    imageAlt: "Atención personalizada a clientes en las oficinas de S.B.S Telecomunicaciones",
  },
  {
    code: "08",
    slug: "telecomunicaciones",
    title: "Telecomunicaciones",
    short: "Servicio integral y contratos de conservación.",
    description:
      "Servicio integral de telecomunicaciones para comunidades de propietarios, con contratos de conservación y mantenimiento en condiciones ventajosas.",
    bullets: [
      "Contratos de conservación y mantenimiento",
      "Flota de 16 vehículos propios",
      "Miembros de la Asociación Madrileña de Instaladores",
      "Urgencias los domingos de 09:00 a 14:00",
    ],
    image: "/images/flota-1.jpg",
    imageAlt: "Flota de vehículos de S.B.S Telecomunicaciones estacionados",
  },
];

export const process = [
  {
    code: "01",
    title: "Instalación",
    description: "Diseñamos e instalamos la infraestructura de telecomunicaciones, antenas, portería y seguridad de su edificio.",
  },
  {
    code: "02",
    title: "Reparación",
    description: "Diagnosticamos y solucionamos averías con atención de urgencia los domingos de 09:00 a 14:00 horas.",
  },
  {
    code: "03",
    title: "Mantenimiento",
    description: "Contratos de conservación que mantienen cada instalación funcionando con normativa y garantía al día.",
  },
] as const;

export const navLinks = [
  { href: "#servicios", label: "Servicios" },
  { href: "#empresa", label: "Empresa" },
  { href: "#urgencias", label: "Urgencias" },
  { href: "#contacto", label: "Contacto" },
] as const;

export const serviceFormOptions = services.map((s) => s.title);
