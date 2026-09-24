// Cada hora revisa las fuentes automáticas (Excel en OneDrive/SharePoint) y recarga las que tocan.
import type { Config } from "@netlify/functions";
import { runSource } from "../lib/ingest.ts";
import { db } from "../lib/store.ts";

export const config: Config = { schedule: "@hourly" };

export default async () => {
  const list = await db.sources();
  const now = Date.now();
  const due = list.filter((s) => !s.lastRun || now - Date.parse(s.lastRun) >= s.everyHours * 3600_000 - 5 * 60_000);
  for (const s of due) {
    const updated = await runSource(s);
    const fresh = await db.sources();
    await db.saveSources(fresh.map((x) => (x.id === s.id ? updated : x)));
  }
  return new Response(`ok: ${due.length} fuente(s)`);
};
