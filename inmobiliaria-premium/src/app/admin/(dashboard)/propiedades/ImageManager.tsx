"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import type { PropertyImageRow } from "@/lib/types";
import { deletePropertyImage, reorderPropertyImages, setCoverImage, uploadPropertyImage } from "./actions";

async function compressImage(file: File, maxDimension = 1920, quality = 0.82): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo procesar la imagen");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo comprimir la imagen"))),
      "image/jpeg",
      quality
    );
  });
}

interface ImageManagerProps {
  propertyId: string;
  images: PropertyImageRow[];
}

export function ImageManager({ propertyId, images }: ImageManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      try {
        const compressed = await compressImage(file);
        const formData = new FormData();
        formData.set("file", compressed, file.name.replace(/\.[^.]+$/, "") + ".jpg");
        await uploadPropertyImage(propertyId, formData);
      } catch (err) {
        console.error("No se pudo subir la imagen", err);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function move(index: number, direction: -1 | 1) {
    const next = [...images];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    startTransition(() => reorderPropertyImages(propertyId, next.map((img) => img.id)));
  }

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line px-6 py-10 text-center text-[0.85rem] text-stone transition-colors duration-300 hover:border-ink hover:text-ink">
        <span>{uploading ? "Subiendo…" : "Arrastra imágenes aquí o haz clic para seleccionarlas"}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
        />
      </label>

      {images.length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div key={image.id} className="group relative aspect-[4/3] overflow-hidden border border-line">
              <Image src={image.url} alt={image.alt || ""} fill sizes="200px" className="object-cover" />
              {image.isCover && (
                <span className="absolute left-2 top-2 bg-ink px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.1em] text-paper">
                  Principal
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-ink/70 px-2 py-1.5 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    disabled={isPending || index === 0}
                    onClick={() => move(index, -1)}
                    className="text-paper disabled:opacity-30"
                    aria-label="Mover antes"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={isPending || index === images.length - 1}
                    onClick={() => move(index, 1)}
                    className="text-paper disabled:opacity-30"
                    aria-label="Mover después"
                  >
                    →
                  </button>
                </div>
                <div className="flex gap-2">
                  {!image.isCover && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => startTransition(() => setCoverImage(propertyId, image.id))}
                      className="text-[0.62rem] uppercase tracking-[0.08em] text-paper hover:underline"
                    >
                      Principal
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => startTransition(() => deletePropertyImage(propertyId, image.id))}
                    className="text-[0.62rem] uppercase tracking-[0.08em] text-paper hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
