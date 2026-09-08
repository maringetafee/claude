export type Faq = { q: string; a: string };

/** Neutral answers based on how Sema-Dur actually operates (quote-first, made to order). */
export const faqs: Faq[] = [
  {
    q: "¿Puedo comprar directamente en la web?",
    a: "El catálogo funciona por solicitud de presupuesto. Añades las herramientas que te interesan, envías la solicitud con tus datos y te respondemos con precio, disponibilidad y plazo. Gran parte de la herramienta es a medida, por lo que el precio depende de la configuración concreta.",
  },
  {
    q: "¿Por qué no aparecen precios?",
    a: "Porque casi toda la herramienta se fabrica o se adapta a cada aplicación: material, perfil, máquina y volumen cambian el precio. Preferimos darte un presupuesto real en lugar de una cifra orientativa que luego no se ajuste.",
  },
  {
    q: "¿Qué necesitáis para presupuestar una herramienta a medida?",
    a: "Un plano acotado, un archivo DXF o una muestra de la pieza; el material a cortar; y los datos de la máquina (tipo, eje o cono, revoluciones). Con eso podemos diseñar la herramienta y darte precio y plazo.",
  },
  {
    q: "¿Hacéis reafilado de herramienta de otras marcas?",
    a: "Sí. Reafilamos herramienta de corte de metal duro, acero rápido y PCD con independencia de su procedencia. El presupuesto se hace por herramienta según su estado.",
  },
  {
    q: "¿Cuál es el plazo de entrega?",
    a: "Depende del tipo de herramienta y de la carga del taller en cada momento. Lo confirmamos siempre junto con el presupuesto.",
  },
  {
    q: "¿Enviáis fuera de España?",
    a: "Sí. Además de toda España, trabajamos habitualmente con clientes de Portugal, Colombia, Venezuela y Guinea, entre otros. Indícanos la localización en la solicitud para calcular el envío.",
  },
  {
    q: "¿Cómo se paga un pedido?",
    a: "Las condiciones de pago se acuerdan con el presupuesto. La web está preparada para incorporar pago con tarjeta en las referencias que en el futuro se vendan con precio y stock cerrados.",
  },
];
