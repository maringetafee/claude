// Guarda el estado real de cada lead (pendiente/enviado/respondido/cliente/
// rechazado) en Netlify Blobs, para que el checkbox del panel funcione desde
// cualquier dispositivo sin depender de reconstruir el sitio desde los CSV.
//
// GET  -> devuelve { slug: { estado, updatedAt } } con todos los overrides.
// POST { slug, estado } -> guarda/actualiza el estado de un lead.
import { getStore } from "@netlify/blobs";

const ESTADOS_VALIDOS = ["pendiente", "enviado", "respondido", "cliente", "rechazado"];

export default async (req) => {
  const store = getStore("estados");

  if (req.method === "GET") {
    const data = (await store.get("overrides", { type: "json" })) || {};
    return new Response(JSON.stringify(data), {
      headers: { "content-type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "JSON invalido" }), { status: 400 });
    }
    const { slug, estado } = body || {};
    if (typeof slug !== "string" || !slug || !ESTADOS_VALIDOS.includes(estado)) {
      return new Response(JSON.stringify({ error: "slug o estado invalido" }), { status: 400 });
    }
    const data = (await store.get("overrides", { type: "json" })) || {};
    data[slug] = { estado, updatedAt: new Date().toISOString() };
    await store.setJSON("overrides", data);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};
