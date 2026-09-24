// Funcion en segundo plano de Netlify (sufijo -background: responde 202 al
// instante y puede correr hasta 15 min). Ejecuta el analisis del agente
// Responder y deja el resultado en Blobs (store "responder-jobs", key = jobId)
// para que la pagina lo recoja con GET /.netlify/functions/responder?job=ID.
//
// POST {jobId, slug, lead, canal, conversacion, nota}
import { getStore } from "@netlify/blobs";
import { ejecutarAnalisis } from "./lib/pipeline.mjs";

export default async (req) => {
  let body;
  try {
    body = await req.json();
  } catch {
    return;
  }
  const { jobId } = body || {};
  if (typeof jobId !== "string" || !/^[a-z0-9-]{8,64}$/.test(jobId)) return;

  const jobs = getStore("responder-jobs");
  await jobs.setJSON(jobId, { estado: "en_curso", inicio: new Date().toISOString() });
  try {
    const { resultado, fase, uso } = await ejecutarAnalisis(body);
    await jobs.setJSON(jobId, { estado: "listo", resultado, fase, uso, fin: new Date().toISOString() });
  } catch (err) {
    await jobs.setJSON(jobId, { estado: "error", error: String(err?.message || err).slice(0, 500) });
  }
};
