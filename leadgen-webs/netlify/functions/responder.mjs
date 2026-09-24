// Agente "Responder": Mario pega la conversacion con un negocio y el agente
// (Claude) devuelve diagnostico, estrategia de venta, la respuesta lista
// para enviar y las objeciones probables. Ademas lleva el pipeline de cada
// cliente (fase, lo que se le ha ofrecido, lo que ha contratado) en Netlify
// Blobs, store "pipeline".
//
// GET                      -> indice del pipeline { slug: {nombre, fase, ...} }
// GET  ?slug=X             -> ficha completa del pipeline de ese cliente
// POST {accion:"analizar", slug, lead, canal, conversacion, nota}
//                          -> respuesta en streaming NDJSON:
//                             {"t":"delta","n":<chars>}... {"t":"done","resultado":{...}}
//                             o {"t":"error","error":"..."}
// POST {accion:"guardar", slug, nombre?, tipo?, fase?, nota?, motivo?, contratado?:{servicio, unico, mensual}}
//                          -> cambios manuales (p. ej. registrar lo que ha pagado). Si la
//                             fase pasa a "cerrado_entrada" o "perdido", el agente extrae una
//                             leccion de esa conversacion (ver "Aprendizaje" mas abajo).
// GET  ?aprendizajes=1     -> { lecciones: [...], stats: {...} }
//
// Aprendizaje: no se reentrena el modelo; se acumulan lecciones (store
// "pipeline", key "_aprendizajes") de cada venta cerrada o perdida, con el
// motivo que da Mario, y se inyectan en cada analisis nuevo junto con la
// tasa de cierre por tipo de negocio y los motivos de perdida mas comunes.
//
// Precios, catalogo y reglas de venta: lib/makemyweb.mjs.
// Requiere la variable de entorno ANTHROPIC_API_KEY en Netlify.
import Anthropic from "@anthropic-ai/sdk";
import { getStore } from "@netlify/blobs";
import { CATALOGO, ESQUEMA_LECCION, ESQUEMA_SALIDA, FASES, FASE_A_ESTADO_PANEL, promptLeccion, systemPrompt } from "./lib/makemyweb.mjs";

const MODELO = "claude-opus-5";
const MAX_HISTORIAL = 20;
const INDICE = "_indice";
const APRENDIZAJES = "_aprendizajes";
const MAX_LECCIONES = 400;
const MAX_CONVERSACION = 20000;
const CANALES = { whatsapp: "WhatsApp", instagram: "Instagram DM", email: "Email", llamada: "Guion para llamada o visita" };

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });

function slugValido(slug) {
  return typeof slug === "string" && /^[a-z0-9][a-z0-9-]{0,120}$/.test(slug);
}

async function leerFicha(store, slug) {
  return (
    (await store.get(slug, { type: "json" })) || {
      slug,
      nombre: slug,
      fase: null,
      contratado: [],
      historial: [],
      notas: [],
      creado: new Date().toISOString(),
    }
  );
}

async function guardarFicha(store, ficha) {
  ficha.updatedAt = new Date().toISOString();
  await store.setJSON(ficha.slug, ficha);

  const indice = (await store.get(INDICE, { type: "json" })) || {};
  const ultimo = ficha.historial[ficha.historial.length - 1];
  indice[ficha.slug] = {
    nombre: ficha.nombre,
    tipo: ficha.tipo || "",
    fase: ficha.fase,
    potencial_12m_eur: ultimo?.valor_estimado?.potencial_12m_eur ?? null,
    contratado_unico: ficha.contratado.reduce((s, c) => s + (Number(c.unico) || 0), 0),
    contratado_mensual: ficha.contratado.reduce((s, c) => s + (Number(c.mensual) || 0), 0),
    updatedAt: ficha.updatedAt,
  };
  await store.setJSON(INDICE, indice);
}

// Mantiene el estado del panel (estado.mjs) al dia con la fase del pipeline,
// para que un lead en conversacion no caiga en el auto-rechazo de 15 dias.
// Nunca baja a un lead que ya es "cliente".
async function sincronizarEstadoPanel(slug, fase) {
  const destino = FASE_A_ESTADO_PANEL[fase];
  if (!destino) return;
  const store = getStore("estados");
  const data = (await store.get("overrides", { type: "json" })) || {};
  const actual = data[slug]?.estado;
  if (actual === destino || (actual === "cliente" && destino !== "cliente")) return;
  data[slug] = { estado: destino, updatedAt: new Date().toISOString() };
  await store.setJSON("overrides", data);
}

function mensajeUsuario({ lead, ficha, canal, conversacion, nota, aprendizajes }) {
  const previas = ficha.historial.slice(-5).map((h) => ({
    fecha: h.fecha,
    canal: h.canal,
    fase: h.fase,
    ofrecido: h.ofrecido,
    respuesta_propuesta: h.respuesta,
  }));
  return `${aprendizajes}

Fecha de hoy: ${new Date().toISOString().slice(0, 10)}
Canal por el que vamos a responder: ${CANALES[canal] || canal}

## Ficha del negocio (datos de Google Maps y de nuestra captación)
${JSON.stringify(lead || {}, null, 2)}

## Historial con este cliente en nuestro pipeline
Fase actual: ${ficha.fase || "sin registrar (primer análisis)"}
Servicios ya contratados: ${ficha.contratado.length ? JSON.stringify(ficha.contratado) : "ninguno"}
Notas de Mario: ${ficha.notas.length ? ficha.notas.map((n) => `[${n.fecha.slice(0, 10)}] ${n.texto}`).join(" | ") : "ninguna"}
Análisis anteriores (los más recientes al final): ${previas.length ? JSON.stringify(previas, null, 2) : "ninguno"}

## Conversación con el cliente (pegada por Mario, lo más reciente al final)
${conversacion?.trim() || "(todavía no hay conversación: hay que escribir el primer mensaje)"}

${nota?.trim() ? `## Nota de Mario para esta consulta\n${nota.trim()}\n` : ""}
Analiza el negocio y dime qué le respondo.`;
}

// ---------- Aprendizaje ----------

async function leerAprendizajes(store) {
  return (await store.get(APRENDIZAJES, { type: "json" })) || [];
}

function calcularStats(lecciones) {
  const porTipo = {};
  const motivosPerdida = {};
  for (const l of lecciones) {
    const t = l.tipo || "Otros";
    porTipo[t] ||= { cerradas: 0, perdidas: 0 };
    porTipo[t][l.resultado === "cerrado" ? "cerradas" : "perdidas"] += 1;
    if (l.resultado === "perdido" && l.categoria_motivo) {
      motivosPerdida[l.categoria_motivo] = (motivosPerdida[l.categoria_motivo] || 0) + 1;
    }
  }
  const cerradas = lecciones.filter((l) => l.resultado === "cerrado").length;
  return { total: lecciones.length, cerradas, perdidas: lecciones.length - cerradas, porTipo, motivosPerdida };
}

// Texto que se inyecta en cada analisis: stats + lecciones (primero las del
// mismo tipo de negocio). Va en el mensaje de usuario, no en el system, para
// no romper la cache del system prompt cada vez que se aprende algo.
function bloquePrecios(lecciones) {
  const lineas = preciosVigentes(lecciones).map((p) => `- ${p.id}: ${p.precio} € (${p.motivo})`);
  return `## Precios vigentes hoy (pago único; ajustados automáticamente según las ventas; las cuotas mensuales no cambian)\n${lineas.join("\n")}\nOfrece estos precios, no los del catálogo si difieren.`;
}

function bloqueAprendizajes(lecciones, tipo) {
  if (!lecciones.length) {
    return `${bloquePrecios(lecciones)}\n\n## Lo aprendido de ventas anteriores\nTodavía no hay ventas cerradas ni perdidas registradas.`;
  }
  const st = calcularStats(lecciones);
  const tasa = (c, p) => (c + p ? Math.round((100 * c) / (c + p)) + " %" : "—");
  const lineasTipo = Object.entries(st.porTipo)
    .map(([t, v]) => `${t}: ${v.cerradas} cerradas / ${v.perdidas} perdidas (cierre ${tasa(v.cerradas, v.perdidas)})`)
    .join("; ");
  const motivos = Object.entries(st.motivosPerdida)
    .sort((a, b) => b[1] - a[1])
    .map(([m, n]) => `${m} (${n})`)
    .join(", ");

  const mismoTipo = (l) => tipo && l.tipo === tipo;
  const mismas = lecciones.filter(mismoTipo).slice(-15);
  const otras = lecciones.filter((l) => !mismoTipo(l) && l.aplica_a === "todos").slice(-15);
  const fmt = (l) =>
    `- [${l.resultado.toUpperCase()} · ${l.tipo || "?"} · ${l.fecha.slice(0, 10)}] ${l.leccion} (motivo: ${l.motivo_real}; qué pasó: ${l.que_paso})`;

  return [
    bloquePrecios(lecciones),
    "",
    `## Lo aprendido de ventas anteriores (${st.total} registradas: ${st.cerradas} cerradas, ${st.perdidas} perdidas)`,
    `Tasa de cierre por tipo: ${lineasTipo}`,
    `Motivos de pérdida más frecuentes: ${motivos || "—"}`,
    mismas.length ? `\nLecciones con negocios del mismo tipo (${tipo}):\n${mismas.map(fmt).join("\n")}` : "",
    otras.length ? `\nLecciones generales:\n${otras.map(fmt).join("\n")}` : "",
    "\nAplica estas lecciones: repite lo que ha hecho cerrar ventas y evita lo que las ha hecho perder. Si una lección contradice la estrategia general, manda la lección (viene de datos reales) y dilo en \"alertas\".",
  ].filter(Boolean).join("\n");
}

// Precio dinamico por servicio, calculado en codigo (no a criterio del
// modelo) con las ultimas VENTANA ventas decididas de ese servicio:
//  - >= 30 % perdidas por precio           -> baja un paso (sin romper el suelo)
//  - >= 60 % cerradas y 0 perdidas por precio -> sube un paso (sin pasar del techo)
//  - si no, o con menos de MIN_MUESTRA ventas -> se mantiene
// El punto de partida es el precio al que se ofrecio en la ultima venta.
const VENTANA = 10;
const MIN_MUESTRA = 5;

function precioVigente(servicio, lecciones) {
  if (servicio.precio_eur == null) return null;
  const decididas = lecciones.filter((l) => l.ofrecido?.servicio_id === servicio.id).slice(-VENTANA);
  const base = { id: servicio.id, precio: servicio.precio_eur, muestra: decididas.length, motivo: "precio base" };
  if (decididas.length < MIN_MUESTRA) return { ...base, motivo: `precio base (${decididas.length}/${MIN_MUESTRA} ventas para empezar a ajustar)` };

  const ultimo = Number(decididas[decididas.length - 1].ofrecido?.precio_eur) || servicio.precio_eur;
  const actual = Math.min(servicio.max_eur, Math.max(servicio.min_eur, ultimo));
  const cerradas = decididas.filter((l) => l.resultado === "cerrado").length;
  const porPrecio = decididas.filter((l) => l.resultado === "perdido" && l.categoria_motivo === "precio").length;
  const n = decididas.length;
  const resumen = `${cerradas}/${n} cerradas, ${porPrecio} perdidas por precio`;

  if (porPrecio / n >= 0.3) {
    const precio = Math.max(servicio.min_eur, actual - servicio.paso_eur);
    return { ...base, precio, motivo: precio < actual ? `bajado: ${resumen}` : `en el suelo: ${resumen}` };
  }
  if (cerradas / n >= 0.6 && porPrecio === 0) {
    const precio = Math.min(servicio.max_eur, actual + servicio.paso_eur);
    return { ...base, precio, motivo: precio > actual ? `subido: ${resumen}` : `en el techo: ${resumen}` };
  }
  return { ...base, precio: actual, motivo: `se mantiene: ${resumen}` };
}

function preciosVigentes(lecciones) {
  return CATALOGO.map((s) => precioVigente(s, lecciones)).filter(Boolean);
}

// Al cerrar o perder una venta: Claude revisa la conversacion completa y el
// motivo que da Mario y saca una leccion accionable. Si la llamada falla, la
// venta se registra igual con el motivo en bruto (no se pierde el dato).
async function aprender(store, ficha, resultado, motivo) {
  const ultimo = ficha.historial[ficha.historial.length - 1] || {};
  const base = {
    fecha: new Date().toISOString(),
    slug: ficha.slug,
    nombre: ficha.nombre,
    tipo: ficha.tipo || "",
    resultado,
    motivo_mario: motivo || "",
    ofrecido: ultimo.ofrecido || null,
  };
  let leccion;
  try {
    const client = new Anthropic();
    const msg = await client.messages.create({
      model: MODELO,
      max_tokens: 4000,
      output_config: { effort: "low", format: { type: "json_schema", schema: ESQUEMA_LECCION } },
      messages: [{ role: "user", content: promptLeccion({ ficha, resultado, motivo }) }],
    });
    if (msg.stop_reason !== "end_turn") throw new Error(`stop_reason ${msg.stop_reason}`);
    const texto = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    leccion = { ...base, ...JSON.parse(texto) };
  } catch (err) {
    leccion = {
      ...base,
      motivo_real: motivo || "sin especificar",
      categoria_motivo: resultado === "perdido" ? "otro" : "n/a",
      que_paso: "(no se pudo analizar automáticamente)",
      leccion: motivo || "Sin lección extraída.",
      aplica_a: "tipo",
      error: String(err?.message || err).slice(0, 200),
    };
  }
  const lista = await leerAprendizajes(store);
  lista.push(leccion);
  await store.setJSON(APRENDIZAJES, lista.slice(-MAX_LECCIONES));
  return leccion;
}

async function analizar(body) {
  const { slug, lead, canal = "whatsapp", conversacion = "", nota = "" } = body;
  if (!slugValido(slug)) return json({ error: "slug invalido" }, 400);
  if (!process.env.ANTHROPIC_API_KEY) {
    return json({ error: "Falta ANTHROPIC_API_KEY en las variables de entorno de Netlify" }, 500);
  }

  const store = getStore("pipeline");
  const ficha = await leerFicha(store, slug);
  if (lead?.nombre) ficha.nombre = lead.nombre;
  if (lead?.tipo) ficha.tipo = lead.tipo;

  const aprendizajes = bloqueAprendizajes(await leerAprendizajes(store), lead?.tipo || ficha.tipo);
  const client = new Anthropic();
  const encoder = new TextEncoder();
  const enviar = (controller, obj) => controller.enqueue(encoder.encode(JSON.stringify(obj) + "\n"));

  const cuerpo = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.beta.messages.stream({
          model: MODELO,
          max_tokens: 16000,
          betas: ["server-side-fallback-2026-07-01"],
          fallbacks: "default",
          // medium: buena calidad de razonamiento comercial sin disparar la
          // latencia (la funcion de Netlify tiene limite de tiempo).
          output_config: { effort: "medium", format: { type: "json_schema", schema: ESQUEMA_SALIDA } },
          system: [{ type: "text", text: systemPrompt(), cache_control: { type: "ephemeral" } }],
          messages: [{ role: "user", content: mensajeUsuario({ lead, ficha, canal, conversacion, nota, aprendizajes }) }],
        });

        let chars = 0;
        for await (const ev of stream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            chars += ev.delta.text.length;
            enviar(controller, { t: "delta", n: chars });
          }
        }
        const msg = await stream.finalMessage();

        if (msg.stop_reason === "refusal") throw new Error("El modelo ha rechazado la petición.");
        if (msg.stop_reason === "max_tokens") throw new Error("Respuesta cortada por longitud; vuelve a intentarlo.");
        const texto = msg.content.filter((b) => b.type === "text").map((b) => b.text).join("");
        const resultado = JSON.parse(texto);

        ficha.fase = FASES.includes(resultado.fase) ? resultado.fase : ficha.fase;
        ficha.historial.push({
          fecha: new Date().toISOString(),
          canal,
          fase: resultado.fase,
          conversacion: conversacion.slice(-MAX_CONVERSACION),
          nota,
          ofrecido: resultado.estrategia.ofrecer_ahora,
          respuesta: resultado.respuesta.texto,
          valor_estimado: resultado.valor_estimado,
        });
        ficha.historial = ficha.historial.slice(-MAX_HISTORIAL);
        await guardarFicha(store, ficha);
        await sincronizarEstadoPanel(slug, ficha.fase).catch(() => {});

        enviar(controller, {
          t: "done",
          resultado,
          ficha: { fase: ficha.fase, contratado: ficha.contratado },
          uso: msg.usage,
        });
      } catch (err) {
        enviar(controller, { t: "error", error: err?.message || String(err) });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(cuerpo, {
    headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" },
  });
}

async function guardarManual(body) {
  const { slug, nombre, fase, nota, motivo, contratado } = body;
  if (!slugValido(slug)) return json({ error: "slug invalido" }, 400);
  if (fase && !FASES.includes(fase)) return json({ error: "fase invalida" }, 400);

  const store = getStore("pipeline");
  const ficha = await leerFicha(store, slug);
  if (nombre) ficha.nombre = nombre;
  if (body.tipo) ficha.tipo = String(body.tipo).slice(0, 60);
  const faseAnterior = ficha.fase;
  if (fase) ficha.fase = fase;
  if (nota?.trim()) ficha.notas.push({ fecha: new Date().toISOString(), texto: nota.trim().slice(0, 2000) });
  if (contratado?.servicio) {
    ficha.contratado.push({
      servicio: String(contratado.servicio).slice(0, 200),
      unico: Number(contratado.unico) || 0,
      mensual: Number(contratado.mensual) || 0,
      fecha: new Date().toISOString(),
    });
  }
  await guardarFicha(store, ficha);
  if (fase) await sincronizarEstadoPanel(slug, fase).catch(() => {});

  // Aprende de la venta cuando se cierra o se pierde (una vez por cambio de
  // fase, o de nuevo si Mario añade un motivo).
  let leccion = null;
  const resultado = fase === "cerrado_entrada" ? "cerrado" : fase === "perdido" ? "perdido" : null;
  if (resultado && (fase !== faseAnterior || motivo?.trim())) {
    leccion = await aprender(store, ficha, resultado, motivo?.trim().slice(0, 1000));
  }
  return json({ ok: true, ficha, leccion });
}

export default async (req) => {
  const store = getStore("pipeline");

  if (req.method === "GET") {
    const params = new URL(req.url).searchParams;
    if (params.get("aprendizajes")) {
      const lecciones = await leerAprendizajes(store);
      return json({ lecciones: lecciones.slice().reverse(), stats: calcularStats(lecciones), precios: preciosVigentes(lecciones) });
    }
    const slug = params.get("slug");
    if (slug) {
      if (!slugValido(slug)) return json({ error: "slug invalido" }, 400);
      return json((await store.get(slug, { type: "json" })) || null);
    }
    return json((await store.get(INDICE, { type: "json" })) || {});
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "JSON invalido" }, 400);
    }
    if (body?.accion === "analizar") return analizar(body);
    if (body?.accion === "guardar") return guardarManual(body);
    return json({ error: "accion desconocida" }, 400);
  }

  return new Response("Method not allowed", { status: 405 });
};
