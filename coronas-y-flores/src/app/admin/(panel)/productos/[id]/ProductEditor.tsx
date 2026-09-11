"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { uploadImage } from "@/lib/admin/upload";
import { centsToInput, toCents } from "@/lib/money";
import { slugify } from "@/lib/product-utils";
import type { Category, Product } from "@/lib/types";
import { deleteProduct, saveProduct } from "../actions";

type VariantDraft = { key: string; id?: string; name: string; price: string };
type ImageDraft = { key: string; url: string; storage_path: string | null; alt: string };

function draftFrom(p: Product | null) {
  return {
    name: p?.name ?? "",
    slug: p?.slug ?? "",
    category_id: p?.category_id ?? "",
    short_description: p?.short_description ?? "",
    description: p?.description ?? "",
    price: centsToInput(p?.price_cents ?? null),
    compare_at: centsToInput(p?.compare_at_cents ?? null),
    stock: p?.stock == null ? "" : String(p.stock),
    active: p?.active ?? true,
    featured: p?.featured ?? false,
    allow_ribbon: p?.allow_ribbon ?? false,
    sort_order: String(p?.sort_order ?? 0),
    seo_title: p?.seo_title ?? "",
    seo_description: p?.seo_description ?? "",
    variants: (p?.variants ?? []).map<VariantDraft>((v) => ({ key: v.id, id: v.id, name: v.name, price: centsToInput(v.price_cents) })),
    images: (p?.images ?? []).map<ImageDraft>((i) => ({ key: i.id, url: i.url, storage_path: i.storage_path, alt: i.alt })),
  };
}
type Draft = ReturnType<typeof draftFrom>;

export function ProductEditor({ product, categories }: { product: Product | null; categories: Category[] }) {
  const router = useRouter();
  const [d, setD] = useState<Draft>(() => draftFrom(product));
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [uploading, setUploading] = useState(0);
  const [msg, setMsg] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setD((prev) => ({ ...prev, [key]: value }));
  const slug = slugTouched ? d.slug : slugify(d.name);

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    const list = Array.from(files);
    setUploading((n) => n + list.length);
    for (const file of list) {
      try {
        const { url, path } = await uploadImage(file, "productos");
        setD((prev) => ({ ...prev, images: [...prev.images, { key: path, url, storage_path: path, alt: prev.name }] }));
      } catch (err) {
        setMsg({ type: "error", text: (err as Error).message });
      } finally {
        setUploading((n) => n - 1);
      }
    }
  }

  function moveImage(index: number, dir: -1 | 1) {
    setD((prev) => {
      const images = [...prev.images];
      const target = index + dir;
      if (target < 0 || target >= images.length) return prev;
      [images[index], images[target]] = [images[target], images[index]];
      return { ...prev, images };
    });
  }

  function save() {
    setMsg(null);
    const price = d.price.trim() ? toCents(d.price) : null;
    const compareAt = d.compare_at.trim() ? toCents(d.compare_at) : null;
    const variants = d.variants.map((v) => ({ id: v.id, name: v.name, price_cents: toCents(v.price) }));
    if ((price !== null && Number.isNaN(price)) || (compareAt !== null && Number.isNaN(compareAt)) || variants.some((v) => Number.isNaN(v.price_cents))) {
      setMsg({ type: "error", text: "Revisa los precios: usa números, por ejemplo 24,90." });
      return;
    }
    const stock = d.stock.trim() === "" ? null : Number.parseInt(d.stock, 10);
    if (stock !== null && (Number.isNaN(stock) || stock < 0)) {
      setMsg({ type: "error", text: "El stock debe ser un número entero (o vacío para no controlarlo)." });
      return;
    }
    startTransition(async () => {
      const res = await saveProduct({
        id: product?.id ?? null,
        name: d.name,
        slug,
        category_id: d.category_id || null,
        short_description: d.short_description,
        description: d.description,
        price_cents: price,
        compare_at_cents: compareAt,
        stock,
        active: d.active,
        featured: d.featured,
        allow_ribbon: d.allow_ribbon,
        sort_order: Number.parseInt(d.sort_order, 10) || 0,
        seo_title: d.seo_title,
        seo_description: d.seo_description,
        variants,
        images: d.images.map(({ url, storage_path, alt }) => ({ url, storage_path, alt })),
      });
      if (!res.ok) {
        setMsg({ type: "error", text: res.error });
        return;
      }
      setMsg({ type: "ok", text: "Producto guardado. Los cambios ya se ven en la tienda." });
      if (!product) router.replace(`/admin/productos/${res.id}`);
      else router.refresh();
    });
  }

  function remove() {
    if (!product || !window.confirm(`¿Eliminar «${product.name}»? No se puede deshacer.`)) return;
    startTransition(async () => {
      const res = await deleteProduct(product.id);
      if (!res.ok) setMsg({ type: "error", text: res.error });
      else router.replace("/admin/productos");
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <div className="adm-split">
        <div>
          <section className="adm-card">
            <h2>Información</h2>
            <div className="adm-form">
              <label className="adm-field">
                <span>Nombre</span>
                <input className="adm-input" required value={d.name} onChange={(e) => set("name", e.target.value)} placeholder="Ramo de rosas rojas" />
              </label>
              <div className="adm-grid-2">
                <label className="adm-field">
                  <span>Categoría</span>
                  <select className="adm-input" value={d.category_id} onChange={(e) => set("category_id", e.target.value)}>
                    <option value="">Sin categoría</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {c.active ? "" : " (oculta)"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="adm-field">
                  <span>Dirección web (slug)</span>
                  <input
                    className="adm-input"
                    value={slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      set("slug", slugify(e.target.value));
                    }}
                  />
                  <span className="adm-hint">/producto/{slug || "…"}</span>
                </label>
              </div>
              <label className="adm-field">
                <span>Descripción corta</span>
                <input className="adm-input" value={d.short_description} maxLength={240} onChange={(e) => set("short_description", e.target.value)} placeholder="Una frase que aparece bajo el título" />
              </label>
              <label className="adm-field">
                <span>Descripción completa</span>
                <textarea className="adm-input" value={d.description} onChange={(e) => set("description", e.target.value)} style={{ minHeight: 160 }} />
                <span className="adm-hint">Deja una línea en blanco para separar párrafos.</span>
              </label>
            </div>
          </section>

          <section className="adm-card">
            <h2>
              Fotos <small>La primera es la portada · se optimizan automáticamente</small>
            </h2>
            <div className="adm-images">
              {d.images.map((img, i) => (
                <div className="adm-image" key={img.key}>
                  <div className={i === 0 ? "adm-image__cover" : undefined}>
                    <img src={img.url} alt="" />
                  </div>
                  <div className="adm-image__bar">
                    <button type="button" className="adm-btn adm-btn--icon" aria-label="Mover a la izquierda" disabled={i === 0} onClick={() => moveImage(i, -1)}>
                      ←
                    </button>
                    <button type="button" className="adm-btn adm-btn--icon" aria-label="Mover a la derecha" disabled={i === d.images.length - 1} onClick={() => moveImage(i, 1)}>
                      →
                    </button>
                    <button
                      type="button"
                      className="adm-btn adm-btn--icon adm-btn--danger"
                      aria-label="Quitar foto"
                      style={{ marginLeft: "auto" }}
                      onClick={() => set("images", d.images.filter((_, j) => j !== i))}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="adm-image__bar">
                    <input
                      className="adm-input"
                      value={img.alt}
                      placeholder="Texto alternativo"
                      aria-label="Texto alternativo de la foto"
                      onChange={(e) => set("images", d.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                    />
                  </div>
                </div>
              ))}
              <label className="adm-drop">
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => { void addFiles(e.target.files); e.target.value = ""; }} />
                {uploading ? `Subiendo ${uploading}…` : "+ Añadir fotos"}
              </label>
            </div>
          </section>

          <section className="adm-card">
            <h2>Precio y tamaños</h2>
            <div className="adm-form">
              {d.variants.length === 0 ? (
                <div className="adm-grid-2">
                  <label className="adm-field">
                    <span>Precio (€, IVA incluido)</span>
                    <input className="adm-input" inputMode="decimal" required value={d.price} onChange={(e) => set("price", e.target.value)} placeholder="35" />
                  </label>
                  <label className="adm-field">
                    <span>Precio anterior (opcional)</span>
                    <input className="adm-input" inputMode="decimal" value={d.compare_at} onChange={(e) => set("compare_at", e.target.value)} placeholder="Para mostrarlo tachado" />
                  </label>
                </div>
              ) : (
                <div className="adm-repeat">
                  {d.variants.map((v, i) => (
                    <div className="adm-repeat__row" key={v.key}>
                      <label className="adm-field">
                        <span>Tamaño</span>
                        <input className="adm-input" required value={v.name} onChange={(e) => set("variants", d.variants.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder="Mediano" />
                      </label>
                      <label className="adm-field">
                        <span>Precio (€)</span>
                        <input className="adm-input" inputMode="decimal" required value={v.price} onChange={(e) => set("variants", d.variants.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} />
                      </label>
                      <button type="button" className="adm-btn adm-btn--danger" aria-label="Quitar tamaño" onClick={() => set("variants", d.variants.filter((_, j) => j !== i))}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="adm-row">
                <button
                  type="button"
                  className="adm-btn adm-btn--sm"
                  onClick={() => set("variants", [...d.variants, { key: crypto.randomUUID(), name: "", price: d.variants.length ? "" : d.price }])}
                >
                  + Añadir tamaño
                </button>
                <span className="adm-hint">Con tamaños (pequeño, mediano, grande…) cada uno tiene su precio y el cliente elige.</span>
              </div>
            </div>
          </section>

          <section className="adm-card">
            <h2>
              SEO <small>Opcional · cómo aparece en Google</small>
            </h2>
            <div className="adm-form">
              <label className="adm-field">
                <span>Título para Google</span>
                <input className="adm-input" value={d.seo_title} maxLength={70} onChange={(e) => set("seo_title", e.target.value)} placeholder={d.name} />
                <span className="adm-hint">{d.seo_title.length}/70 · si lo dejas vacío se usa el nombre</span>
              </label>
              <label className="adm-field">
                <span>Descripción para Google</span>
                <textarea className="adm-input" value={d.seo_description} maxLength={170} onChange={(e) => set("seo_description", e.target.value)} style={{ minHeight: 80 }} placeholder={d.short_description} />
                <span className="adm-hint">{d.seo_description.length}/170 · si la dejas vacía se usa la descripción corta</span>
              </label>
            </div>
          </section>
        </div>

        <aside>
          <section className="adm-card">
            <h2>Estado</h2>
            <div className="adm-form">
              <label className="adm-check">
                <input type="checkbox" checked={d.active} onChange={(e) => set("active", e.target.checked)} />
                <span>
                  Publicado en la tienda<small>Si lo desmarcas, deja de verse pero no se borra.</small>
                </span>
              </label>
              <label className="adm-check">
                <input type="checkbox" checked={d.featured} onChange={(e) => set("featured", e.target.checked)} />
                <span>
                  Destacado en la portada<small>Se muestran hasta 4 destacados.</small>
                </span>
              </label>
              <label className="adm-check">
                <input type="checkbox" checked={d.allow_ribbon} onChange={(e) => set("allow_ribbon", e.target.checked)} />
                <span>
                  Pedir texto de cinta<small>Para coronas y centros funerarios.</small>
                </span>
              </label>
              <label className="adm-field">
                <span>Stock</span>
                <input className="adm-input" inputMode="numeric" value={d.stock} onChange={(e) => set("stock", e.target.value.replace(/\D/g, ""))} placeholder="Sin límite" />
                <span className="adm-hint">Déjalo vacío si lo preparáis por encargo. Con 0 aparece como agotado.</span>
              </label>
              <label className="adm-field">
                <span>Orden</span>
                <input className="adm-input" inputMode="numeric" value={d.sort_order} onChange={(e) => set("sort_order", e.target.value.replace(/[^\d-]/g, ""))} />
                <span className="adm-hint">Los números más bajos salen primero.</span>
              </label>
            </div>
          </section>
          <div className="adm-savebar" style={{ justifyContent: "stretch", flexDirection: "column", alignItems: "stretch" }}>
            {msg && <div className={`adm-alert${msg.type === "ok" ? " adm-alert--ok" : ""}`}>{msg.text}</div>}
            <button type="submit" className="adm-btn adm-btn--primary" disabled={pending || uploading > 0} style={{ minHeight: 46 }}>
              {pending ? "Guardando…" : uploading ? "Esperando a las fotos…" : product ? "Guardar cambios" : "Crear producto"}
            </button>
            {product && (
              <div className="adm-row" style={{ justifyContent: "space-between" }}>
                {product.active ? (
                  <a className="adm-btn adm-btn--sm" href={`/producto/${product.slug}`} target="_blank" rel="noopener">
                    Ver en la tienda ↗
                  </a>
                ) : (
                  <span />
                )}
                <button type="button" className="adm-btn adm-btn--sm adm-btn--danger" onClick={remove} disabled={pending}>
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </form>
  );
}
