// Agente "Responder": Mario pega la conversacion con un negocio y el agente
// (Claude) devuelve diagnostico, estrategia de venta, la respuesta lista
// para enviar y las objeciones probables. Lleva ademas el pipeline de cada
// cliente y aprende de las ventas cerradas y perdidas (ver lib/pipeline.mjs).
//
// GET                      -> indice del pipeline { slug: {nombre, fase, ...} }
// GET  ?slug=X             -> ficha completa del pipeline de ese cliente
// GET  ?aprendizajes=1     -> { lecciones, stats, precios }
// GET  ?job=ID             -> estado de un analisis lanzado en segundo plano:
//                             {estado:"en_curso"} | {estado:"listo", resultado, fase} | {estado:"error", error}
// POST {accion:"guardar", slug, nombre?, tipo?, fase?, nota?, motivo?, contratado?:{servicio, unico, mensual}}
//                          -> cambios manuales. Si la fase pasa a "cerrado_entrada" o
//                             "perdido", extrae una leccion de esa venta.
//
// El analisis en si (POST {jobId, slug, lead, canal, conversacion, nota})
// va a responder-background.mjs, porque tarda mas que el limite de 30 s de
// las funciones normales de Netlify.
import { getStore } from "@netlify/blobs";
import { INDICE, calcularStats, guardarManual, json, leerAprendizajes, preciosVigentes, slugValido } from "./lib/pipeline.mjs";

const MAX_ESPERA_MS = 5 * 60 * 1000;

export default async (req) => {
  const store = getStore("pipeline");

  if (req.method === "GET") {
    const params = new URL(req.url).searchParams;
    const job = params.get("job");
    if (job) {
      if (!/^[a-z0-9-]{8,64}$/.test(job)) return json({ error: "job invalido" }, 400);
      const data = await getStore("responder-jobs").get(job, { type: "json" });
      if (!data) return json({ estado: "en_curso" });
      if (data.estado === "en_curso" && Date.now() - new Date(data.inicio).getTime() > MAX_ESPERA_MS) {
        return json({ estado: "error", error: "El análisis ha tardado demasiado; vuelve a intentarlo." });
      }
      return json(data);
    }
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
    if (body?.accion === "guardar") return guardarManual(body);
    return json({ error: "accion desconocida" }, 400);
  }

  return new Response("Method not allowed", { status: 405 });
};
