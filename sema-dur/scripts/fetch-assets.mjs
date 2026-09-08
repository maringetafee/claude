/**
 * Optimises the real Sema-Dur photography (vendored in _src-assets/, originally
 * from sema-dur.com/wp-content/uploads) into responsive AVIF + WebP under
 * public/images/. Run with `npm run assets`. Idempotent.
 *
 * Requires: sharp (devDependency).
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const SRC = "_src-assets";
const OUT = "public/images";
const WIDTHS = [480, 768, 1200, 1800];

/** map source filename -> { dir, name, widths?, keepAlpha? } */
const MAP = {
  "herramientasdecorte-2048x1365.jpg": { dir: "catalogo", name: "herramientas-corte" },
  "fresas.jpg": { dir: "catalogo", name: "fresas" },
  "cuchillasparacorte.jpg": { dir: "catalogo", name: "cuchillas" },
  "fabricantedeherramientasdecorte.jpg": { dir: "catalogo", name: "fabricacion" },
  "herramientaspcd.jpg": { dir: "catalogo", name: "pcd" },
  "drill-444493_1920.jpg": { dir: "hero", name: "brocas" },
  "empresa-herramientas-corte-2048x1638.jpg": { dir: "empresa", name: "taller" },
  "WhatsApp-Image-2024-06-18-at-22.17.05.jpeg": { dir: "empresa", name: "equipo-freud" },
  "WhatsApp-Image-2024-06-18-at-22.24.32.jpeg": { dir: "empresa", name: "produccion" },
  "resolucion-de-concesion.png": { dir: "empresa", name: "resolucion-concesion", keepAlpha: true },
  "proveedor-freud.png": { dir: "logos", name: "freud", keepAlpha: true, widths: [300, 600] },
  "proveedor-ceratizit.png": { dir: "logos", name: "ceratizit", keepAlpha: true, widths: [300, 600] },
  "cropped-diacort-sema-dur-png.png": { dir: "logo", name: "diacort-sema-dur", keepAlpha: true, widths: [220, 440] },
};

async function run() {
  const manifest = {};
  for (const file of readdirSync(SRC)) {
    const cfg = MAP[file];
    if (!cfg) continue;
    const input = join(SRC, file);
    const outDir = join(OUT, cfg.dir);
    if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

    const meta = await sharp(input).metadata();
    const targets = cfg.widths ?? WIDTHS;
    const widths = [...new Set(targets.map((w) => Math.min(w, meta.width)))].sort(
      (a, b) => a - b,
    );
    const key = `${cfg.dir}/${cfg.name}`;
    manifest[key] = {
      w: meta.width,
      h: meta.height,
      widths,
      ext: cfg.keepAlpha ? "png" : "jpg",
    };

    for (const w of manifest[key].widths) {
      const pipe = sharp(input).resize({ width: w, withoutEnlargement: true });
      await pipe
        .clone()
        .avif({ quality: 52, effort: 4 })
        .toFile(join(outDir, `${cfg.name}-${w}.avif`));
      await pipe
        .clone()
        .webp({ quality: 82 })
        .toFile(join(outDir, `${cfg.name}-${w}.webp`));
    }
    // A JPEG/PNG fallback at the largest width.
    const fbW = manifest[key].widths.at(-1);
    if (cfg.keepAlpha) {
      await sharp(input).resize({ width: fbW, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(join(outDir, `${cfg.name}.png`));
    } else {
      await sharp(input).resize({ width: fbW, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(outDir, `${cfg.name}.jpg`));
    }
    console.log(`✓ ${key}  ${meta.width}×${meta.height}  →  ${manifest[key].widths.join(", ")}`);
  }

  writeFileSync("src/data/image-manifest.json", JSON.stringify(manifest, null, 2) + "\n");
  console.log(`\nWrote src/data/image-manifest.json (${Object.keys(manifest).length} images)`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
