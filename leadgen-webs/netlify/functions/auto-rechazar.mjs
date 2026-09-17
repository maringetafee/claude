// Rechaza en automatico los leads que llevan 15+ dias en "enviado" sin que
// nadie haya tocado su estado (ni respuesta, ni conversacion, ni rechazo
// manual). Se ejecuta ella sola cada dia via Netlify Scheduled Functions
// (config.schedule mas abajo) — no depende de que el ordenador de nadie
// este encendido ni de rehacer el build.
//
// Solo toca Netlify Blobs (estados/overrides), igual que estado.mjs: pasa
// esos leads a "rechazado" para que el panel los quite de la lista al
// cargar. La limpieza del CSV versionado y el registro en la lista negra
// (para no volver a proponer el mismo negocio) los hace aparte
// scripts/sync_rechazados.py, a mano o en la rutina de sincronizacion.
import { getStore } from "@netlify/blobs";

const DIAS_LIMITE = 15;
const MS_LIMITE = DIAS_LIMITE * 24 * 60 * 60 * 1000;

export default async () => {
  const store = getStore("estados");
  const data = (await store.get("overrides", { type: "json" })) || {};
  const ahora = Date.now();
  const cambiados = [];

  for (const [slug, info] of Object.entries(data)) {
    if (info.estado !== "enviado") continue;
    const actualizado = new Date(info.updatedAt).getTime();
    if (Number.isNaN(actualizado)) continue;
    if (ahora - actualizado >= MS_LIMITE) {
      data[slug] = {
        estado: "rechazado",
        updatedAt: new Date().toISOString(),
        motivo: "auto_15_dias_sin_respuesta",
      };
      cambiados.push(slug);
    }
  }

  if (cambiados.length > 0) {
    await store.setJSON("overrides", data);
  }

  return new Response(JSON.stringify({ ok: true, cambiados }), {
    headers: { "content-type": "application/json" },
  });
};

export const config = { schedule: "@daily" };
