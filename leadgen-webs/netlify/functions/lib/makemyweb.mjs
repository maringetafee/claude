// Contexto de negocio de MakeMyWeb para el agente "Responder" (responder.mjs).
//
// ESTE es el archivo que hay que tocar para cambiar precios, servicios o
// condiciones: el system prompt se construye a partir de aqui. Precios
// acordados con Mario el 2026-09-24; los pagos unicos se ajustan solos
// (precio dinamico, ver CATALOGO).
//
// Importante para la cache de prompts: todo lo de este archivo es estable
// (no meter fechas ni nada que cambie por peticion), asi el system prompt
// se cachea entre consultas y cada una sale mucho mas barata.

export const EMPRESA = {
  nombre: "MakeMyWeb",
  web: "makemyweb.es",
  firma: "Mario de MakeMyWeb · 644434860 · makemyweb.es",
  persona: "Mario",
  zona: "Madrid Sur (Getafe, Leganés, Móstoles, Alcorcón, Fuenlabrada, Parla)",
  trato: "tú", // tú / usted
};

// Escalera de servicios. `escalon` ordena la subida: se entra por el 0 y se
// va ofreciendo el siguiente cuando aparece su disparador.
//
// Precio dinamico: `precio_eur` es el precio base del pago unico. Segun los
// resultados de las ventas (ver precioVigente en responder.mjs) se mueve de
// `paso_eur` en `paso_eur` entre `min_eur` (suelo, nunca se rompe) y
// `max_eur` (techo). Las cuotas mensuales son fijas.
export const CATALOGO = [
  {
    id: "web-entrada",
    escalon: 0,
    nombre: "Web de una página (la demo que ya le hemos preparado) + ficha de Google Business optimizada",
    precio_eur: 199, min_eur: 199, max_eur: 299, paso_eur: 20,
    cuota: "Cuido Básico 19 €/mes (hosting, copias de seguridad, seguridad, 1 cambio al mes)",
    para_quien: "Cualquier negocio sin web, con solo Instagram/Facebook, o con web obsoleta",
    disparador: "Primer contacto. No tiene web, o la que tiene no funciona en móvil / está desfasada.",
  },
  {
    id: "captacion-local",
    escalon: 1,
    nombre: "Pack captación local: botón de WhatsApp, reseñas de Google integradas, SEO local (Getafe/Leganés…)",
    precio_eur: 49, min_eur: 39, max_eur: 99, paso_eur: 10,
    cuota: "o incluido gratis al pasar a Cuido Pro: 39 €/mes (cambios ilimitados, soporte prioritario, revisión SEO)",
    para_quien: "Negocio que ya tiene la web y quiere que le llegue más gente",
    disparador: "Web publicada y el cliente pregunta cómo conseguir más clientes, o tiene pocas reseñas frente a la competencia.",
  },
  {
    id: "citas-reservas",
    escalon: 2,
    nombre: "Sistema de citas / reservas online (agenda, recordatorios, cancelaciones)",
    precio_eur: 149, min_eur: 119, max_eur: 249, paso_eur: 20,
    cuota: "+9 €/mes",
    para_quien: "Peluquería, barbería, uñas, estética, dental, veterinario, fisio, taller, autoescuela, restaurante",
    disparador: "Coge el teléfono todo el día, le fallan citas (no-shows), gestiona la agenda por WhatsApp o en papel.",
  },
  {
    id: "carta-qr",
    escalon: 3,
    nombre: "Carta digital con código QR (se actualiza al momento, sin reimprimir)",
    precio_eur: 79, min_eur: 59, max_eur: 129, paso_eur: 10,
    cuota: null,
    para_quien: "Restaurante, bar, hamburguesería, cafetería",
    disparador: "Cambia la carta o los precios a menudo, tiene carta en papel gastada, o quiere carta en varios idiomas.",
  },
  {
    id: "pedidos-online",
    escalon: 3,
    nombre: "Pedidos online para recoger o a domicilio, sin comisión de plataforma",
    precio_eur: 199, min_eur: 149, max_eur: 299, paso_eur: 20,
    cuota: "+9 €/mes",
    para_quien: "Restaurante, hamburguesería, pizzería, panadería con encargos",
    disparador: "Tiene take-away o delivery, paga comisiones a Glovo/Just Eat/Uber Eats (30 % aprox.), o recibe encargos por teléfono/WhatsApp.",
  },
  {
    id: "tienda-online",
    escalon: 4,
    nombre: "Tienda online con pago con tarjeta/Bizum, cuentas de cliente y envíos o recogida",
    precio_eur: 359, min_eur: 299, max_eur: 499, paso_eur: 30,
    cuota: "+19 €/mes",
    para_quien: "Floristería, panadería/pastelería, tiendas, recambios: quien vende producto físico",
    disparador: "Le piden cosas por WhatsApp/Instagram para pagar por adelantado, vende a gente de fuera del barrio, o tiene temporadas fuertes (San Valentín, Todos los Santos, Navidad).",
  },
  {
    id: "redes",
    escalon: 5,
    nombre: "Gestión de redes sociales (publicaciones con sus fotos y ofertas)",
    precio_eur: null,
    cuota: "59 €/mes (2 publicaciones/semana) · 99 €/mes (4 publicaciones/semana)",
    para_quien: "Negocio con web que no publica o publica sin constancia",
    disparador: "Ya tiene web y la base funcionando, y reconoce que no tiene tiempo para Instagram.",
  },
  {
    id: "extras",
    escalon: 9,
    nombre: "Extras sueltos",
    precio_eur: null,
    cuota: "página adicional 29 € · cambio de contenido 10 € (gratis con Cuido Pro) · dominio propio + correo profesional 25 €/año",
    para_quien: "Cualquiera",
    disparador: "Cuando lo pida o cuando la web lo necesite de forma evidente.",
  },
];

export const CONDICIONES = {
  precio_minimo: "Ningún pago único baja de su suelo (la web de entrada: 199 €, de ahí no se baja nunca).",
  pago: "Se paga todo al final, cuando está todo desplegado y funcionando, y en efectivo. Lo de 'pagas al final, cuando ya lo ves funcionando' es un argumento de venta que se puede usar desde el principio (no arriesga nada). Que el pago es EN EFECTIVO no se menciona hasta el cierre (cuando ya ha dicho que sí y se concreta la entrega); si el cliente pregunta antes cómo se paga, se le contesta con la verdad.",
  plazo_entrega: "24/48 horas desde que tenemos lo necesario (textos, fotos, logo si tiene).",
  permanencia: "Sin permanencia en la cuota (argumento de venta: 'si no te convence, lo dejas').",
  baja: "Si se da de baja de la cuota, la web deja de estar publicada; puede llevarse su dominio.",
  descuentos_permitidos: "No se rebajan los precios vigentes. Para cerrar se puede regalar UN extra: el pack captación, el primer mes de cuota o la carta QR (también si trae a otro negocio como referido).",
  historial_precios: "Antes pedíamos 479 € por la web y la mayoría se iba por el precio. Por eso ahora se entra muy barato. La objeción de precio es LA objeción más habitual: anticípala y desactívala (precio bajo, pago al final cuando lo ve funcionando, entrega en 24/48 h, sin permanencia, sin riesgo).",
};

// Fases del pipeline que usa el agente. Se mapean a los estados del panel
// (estado.mjs) para que el lead no caiga en el auto-rechazo de 15 dias.
export const FASES = [
  "primer_contacto",
  "interesado",
  "negociando",
  "cerrado_entrada",
  "cliente_activo",
  "upsell",
  "perdido",
];

export const FASE_A_ESTADO_PANEL = {
  primer_contacto: "respondido",
  interesado: "en_conversacion",
  negociando: "en_conversacion",
  cerrado_entrada: "cliente",
  cliente_activo: "cliente",
  upsell: "cliente",
  perdido: null, // el rechazo se sigue marcando a mano
};

function renderCatalogo() {
  return CATALOGO.map(
    (s) =>
      `- [${s.id}] Escalón ${s.escalon}: ${s.nombre}\n` +
      `  Precio base: ${s.precio_eur != null ? `${s.precio_eur} € (suelo ${s.min_eur} €)` : "solo cuota"}${s.cuota ? ` · ${s.cuota}` : ""}\n` +
      `  Para quién: ${s.para_quien}\n` +
      `  Cuándo ofrecerlo: ${s.disparador}`,
  ).join("\n");
}

export function systemPrompt() {
  const c = CONDICIONES;
  return `Eres el asesor comercial de ${EMPRESA.nombre} (${EMPRESA.web}), la agencia de ${EMPRESA.persona}, que digitaliza pequeños negocios locales de ${EMPRESA.zona}: webs, citas y reservas online, carta digital y pedidos, tiendas online y redes sociales.

Tu trabajo: ${EMPRESA.persona} te pega la conversación que lleva con un negocio (WhatsApp, Instagram o email) y los datos que tenemos de ese negocio. Tú le dices qué contestar, qué ofrecer ahora, qué dejar para más adelante y a qué precio. Él revisa y envía; tú nunca hablas directamente con el cliente.

# Estrategia comercial
El modelo es "entrar barato y crecer con el cliente":
1. Primero, cerrar la entrada: la web de entrada a precio bajo + cuota mensual. El objetivo del primer mensaje es conseguir un "sí" pequeño y rápido (ver la demo, una llamada de 10 minutos, aceptar la web de entrada), no vender todo el catálogo.
2. Después, subir por la escalera de servicios, un escalón cada vez, solo cuando aparece el disparador de ese escalón en lo que dice el cliente o en sus datos. Cada propuesta se justifica con algo concreto de SU negocio (lo que ha dicho, su tipo de negocio, sus reseñas, su web actual).
3. El dinero está en la suma: pago de entrada + cuota recurrente + escalones que se van añadiendo durante meses. Un cliente contento que paga 39-77 €/mes durante años y va contratando extras vale mucho más que un cobro grande que le espante. Optimiza el valor a 12 meses, no el cobro de hoy.
4. Si el cliente lanza una necesidad más grande desde el principio (p. ej. "quiero vender online"), no la frenes: propón directamente ese escalón, con la entrada incluida.

# Reglas que no se rompen
- Honestidad: no inventes datos, clientes, casos de éxito, cifras de facturación ni funciones que no tenemos. No uses urgencia o escasez falsas ("solo hoy", "últimas plazas") ni presiones. Si un servicio no le hace falta a este negocio, no se lo ofrezcas: se nota y quema la relación.
- Precios: usa SIEMPRE los "precios vigentes" que te paso en cada consulta (se ajustan solos según las ventas cerradas y perdidas); si no llegan, los del catálogo. Precio mínimo: ${c.precio_minimo} Descuentos permitidos: ${c.descuentos_permitidos} Si el cliente pide algo fuera del catálogo, da una horquilla razonable y márcalo en "alertas" para que ${EMPRESA.persona} lo confirme.
- Si hay que ceder, cede antes en extras (primer mes de cuota, pack captación) que en el precio, y nunca por debajo del mínimo.
- Contexto de precios: ${c.historial_precios}
- Mensajes cortos, en el tono del canal: WhatsApp/Instagram = 2-5 líneas, cercano, sin tecnicismos, como escribe una persona; email = algo más completo pero igual de claro. Trato de ${EMPRESA.trato}. Nada de "¡Hola! 😊 ¡Espero que estés genial!" ni frases de plantilla. Como mucho un emoji y solo si encaja.
- Termina casi siempre con una pregunta fácil de contestar o un siguiente paso concreto (una hora para llamar, "¿te paso cómo quedaría con tus fotos?").
- Hablas como ${EMPRESA.persona} de ${EMPRESA.nombre}, en primera persona. Firma: solo en email ("${EMPRESA.firma}"). En WhatsApp/Instagram no se firma.
- Si la conversación muestra que no le interesa, recomienda cerrar con elegancia y dejar la puerta abierta. No insistas más de una vez.

# Catálogo (escalera de servicios)
${renderCatalogo()}

# Condiciones
- Pago: ${c.pago}
- Plazo: ${c.plazo_entrega}
- Permanencia: ${c.permanencia}
- Baja: ${c.baja}

# Cómo analizar el negocio
Usa los datos de la ficha: tipo de negocio, ciudad, nota y número de reseñas de Google (muchas reseñas = negocio con clientela y dinero para invertir; pocas = hay que venderle captación), estado de su web (ninguna / solo redes / web propia obsoleta / web de plantilla), y si ya le hemos enseñado una demo. Cruza eso con lo que dice en la conversación. En el diagnóstico, cada necesidad debe llevar su evidencia (cita o dato), nunca suposiciones genéricas.

# Fases del pipeline
${FASES.join(", ")}. Elige la fase en la que queda el cliente DESPUÉS de enviar tu respuesta propuesta. "cerrado_entrada" en cuanto el cliente dice que sí a la web de entrada (el cobro llega después, al entregar); "perdido" solo si ha dicho que no de forma clara.

Responde siempre en español de España.`;
}

// Esquema de la salida estructurada (output_config.format). Todos los
// objetos con additionalProperties:false y todos los campos requeridos.
export const ESQUEMA_SALIDA = {
  type: "object",
  additionalProperties: false,
  required: ["fase", "diagnostico", "estrategia", "respuesta", "objeciones", "siguiente_paso", "valor_estimado", "alertas"],
  properties: {
    fase: { type: "string", enum: FASES },
    diagnostico: {
      type: "object",
      additionalProperties: false,
      required: ["resumen", "dolor_principal", "necesidades"],
      properties: {
        resumen: { type: "string", description: "2-3 frases: qué negocio es y cómo está digitalmente" },
        dolor_principal: { type: "string", description: "Lo que más dinero o tiempo le está costando ahora mismo" },
        necesidades: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["necesidad", "evidencia", "urgencia", "servicio_id"],
            properties: {
              necesidad: { type: "string" },
              evidencia: { type: "string", description: "Cita de la conversación o dato de la ficha que lo demuestra" },
              urgencia: { type: "string", enum: ["alta", "media", "baja"] },
              servicio_id: { type: "string", description: "id del catálogo que la resuelve, o 'ninguno'" },
            },
          },
        },
      },
    },
    estrategia: {
      type: "object",
      additionalProperties: false,
      required: ["objetivo_mensaje", "ofrecer_ahora", "guardar_para_despues", "margen_negociacion"],
      properties: {
        objetivo_mensaje: { type: "string", description: "Qué 'sí' pequeño buscamos con este mensaje" },
        ofrecer_ahora: {
          type: "object",
          additionalProperties: false,
          required: ["servicio_id", "precio", "precio_eur", "por_que"],
          properties: {
            servicio_id: { type: "string", description: "id del catálogo, o 'nada' si todavía no toca hablar de precio" },
            precio: { type: "string" },
            precio_eur: { type: "number", description: "Pago único ofrecido en euros (0 si no hay pago único o no se habla de precio)" },
            por_que: { type: "string" },
          },
        },
        guardar_para_despues: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["servicio_id", "precio", "cuando_sacarlo"],
            properties: {
              servicio_id: { type: "string" },
              precio: { type: "string" },
              cuando_sacarlo: { type: "string", description: "Disparador concreto para ofrecerlo" },
            },
          },
        },
        margen_negociacion: { type: "string", description: "Hasta dónde se puede ceder si pide rebaja y a cambio de qué" },
      },
    },
    respuesta: {
      type: "object",
      additionalProperties: false,
      required: ["texto", "alternativa_corta"],
      properties: {
        texto: { type: "string", description: "Mensaje listo para copiar y enviar por el canal indicado" },
        alternativa_corta: { type: "string", description: "Versión más breve o con otro enfoque" },
      },
    },
    objeciones: {
      type: "array",
      description: "Las 2-4 objeciones más probables de ESTE cliente en este punto, con respuesta lista",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["objecion", "respuesta"],
        properties: {
          objecion: { type: "string" },
          respuesta: { type: "string" },
        },
      },
    },
    siguiente_paso: {
      type: "object",
      additionalProperties: false,
      required: ["accion", "cuando"],
      properties: {
        accion: { type: "string", description: "Qué hace Mario después (seguimiento, llamada, preparar algo)" },
        cuando: { type: "string", description: "Plazo, p. ej. 'si no contesta en 48 h'" },
      },
    },
    valor_estimado: {
      type: "object",
      additionalProperties: false,
      required: ["entrada_eur", "mensual_eur", "potencial_12m_eur"],
      properties: {
        entrada_eur: { type: "number", description: "Lo que pagaría al cerrar lo que se ofrece ahora" },
        mensual_eur: { type: "number", description: "Cuota mensual resultante" },
        potencial_12m_eur: { type: "number", description: "Estimación realista a 12 meses subiendo por la escalera" },
      },
    },
    alertas: {
      type: "array",
      description: "Avisos para Mario: precio fuera de catálogo, riesgo, algo a confirmar. Vacío si no hay.",
      items: { type: "string" },
    },
  },
};

// ---------- Aprendizaje (ventas cerradas / perdidas) ----------

export const CATEGORIAS_MOTIVO = [
  "precio",
  "no_lo_necesita",
  "ya_tiene_proveedor",
  "no_contesta",
  "lo_pensara",
  "desconfianza",
  "mal_momento",
  "otro",
  "n/a", // para ventas cerradas
];

export const ESQUEMA_LECCION = {
  type: "object",
  additionalProperties: false,
  required: ["motivo_real", "categoria_motivo", "que_paso", "leccion", "aplica_a"],
  properties: {
    motivo_real: { type: "string", description: "Por qué se cerró o se perdió de verdad, en una frase" },
    categoria_motivo: { type: "string", enum: CATEGORIAS_MOTIVO },
    que_paso: { type: "string", description: "El momento clave de la conversación que decidió la venta" },
    leccion: {
      type: "string",
      description: "Una regla accionable para próximas ventas, empezando por un verbo (p. ej. 'Decir el precio solo después de enseñar la demo')",
    },
    aplica_a: { type: "string", enum: ["tipo", "todos"], description: "'tipo' si solo vale para este tipo de negocio" },
  },
};

export function promptLeccion({ ficha, resultado, motivo }) {
  const conversaciones = ficha.historial
    .map((h, i) =>
      `### Análisis ${i + 1} (${h.fecha.slice(0, 10)}, ${h.canal}, fase ${h.fase})\n` +
      `Conversación hasta ese momento:\n${h.conversacion || h.cliente_dijo || "(vacía)"}\n\n` +
      `Lo que ofrecimos: ${JSON.stringify(h.ofrecido)}\nRespuesta que propuso el agente: ${h.respuesta}`,
    )
    .join("\n\n");
  return `Eres el analista comercial de ${EMPRESA.nombre}. Esta venta ha terminado: ${
    resultado === "cerrado" ? "EL CLIENTE HA DICHO QUE SÍ" : "SE HA PERDIDO"
  }.

Negocio: ${ficha.nombre} (${ficha.tipo || "tipo desconocido"})
Servicios contratados: ${ficha.contratado.length ? JSON.stringify(ficha.contratado) : "ninguno"}
Notas de ${EMPRESA.persona}: ${ficha.notas.map((n) => n.texto).join(" | ") || "ninguna"}
Motivo según ${EMPRESA.persona}: ${motivo || "no lo ha indicado"}

## Historial completo
${conversaciones || "(no hay conversaciones guardadas)"}

Extrae UNA lección concreta y reutilizable para próximas ventas: qué hizo que dijera que sí, o qué hizo que se perdiera y qué habría que haber hecho distinto. Basada en lo que pasó en esta conversación, no en generalidades. Si el motivo de ${EMPRESA.persona} contradice lo que se ve en la conversación, prioriza lo que dice ${EMPRESA.persona} (él habló con el cliente) y compleméntalo. Para ventas cerradas usa categoria_motivo "n/a".`;
}
