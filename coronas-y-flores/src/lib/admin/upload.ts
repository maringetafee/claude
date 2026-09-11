"use client";

import { getBrowserSupabase } from "@/lib/supabase/browser";

const MAX_SIDE = 1800;

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Reduce la foto a 1800px como máximo y la convierte a WebP (o JPG si el navegador no sabe). */
export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) throw new Error(`«${file.name}» no es una imagen.`);
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(`No se puede leer «${file.name}». Usa JPG, PNG o WebP (las fotos HEIC del iPhone, compártelas como JPG).`);
  }
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Tu navegador no permite procesar imágenes.");
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const webp = await toBlob(canvas, "image/webp", 0.84);
  if (webp && webp.type === "image/webp") return webp;
  const jpg = await toBlob(canvas, "image/jpeg", 0.86);
  if (!jpg) throw new Error("No se pudo procesar la imagen.");
  return jpg;
}

export async function uploadImage(file: File, folder: string): Promise<{ url: string; path: string }> {
  const blob = await compressImage(file);
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  const sb = getBrowserSupabase();
  const { error } = await sb.storage.from("media").upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false });
  if (error) throw new Error(`No se pudo subir la foto: ${error.message}`);
  return { url: sb.storage.from("media").getPublicUrl(path).data.publicUrl, path };
}
