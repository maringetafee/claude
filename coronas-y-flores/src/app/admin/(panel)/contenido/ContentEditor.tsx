"use client";

import { useState, useTransition } from "react";
import { ImageField } from "@/components/admin/ImageField";
import type { SiteContent } from "@/lib/content-shared";
import type { PerkIcon } from "@/lib/types";

const PERK_ICONS: { value: PerkIcon; label: string }[] = [
  { value: "truck", label: "Furgoneta" },
  { value: "clock", label: "Reloj" },
  { value: "leaf", label: "Hoja" },
  { value: "lock", label: "Candado" },
  { value: "gift", label: "Regalo" },
  { value: "heart", label: "Corazón" },
];
import { saveContent } from "./actions";

type Field<T> = { key: keyof T & string; label: string; area?: boolean; hint?: string };

function TextFields<T extends Record<string, unknown>>({ value, fields, onChange }: { value: T; fields: Field<T>[]; onChange: (v: T) => void }) {
  return (
    <>
      {fields.map((f) => (
        <label key={f.key} className="adm-field">
          <span>{f.label}</span>
          {f.area ? (
            <textarea className="adm-input" style={{ minHeight: 80 }} value={String(value[f.key] ?? "")} onChange={(e) => onChange({ ...value, [f.key]: e.target.value })} />
          ) : (
            <input className="adm-input" value={String(value[f.key] ?? "")} onChange={(e) => onChange({ ...value, [f.key]: e.target.value })} />
          )}
          {f.hint && <span className="adm-hint">{f.hint}</span>}
        </label>
      ))}
    </>
  );
}

function ListControls({ index, length, onMove, onRemove, min = 1 }: { index: number; length: number; onMove: (dir: -1 | 1) => void; onRemove: () => void; min?: number }) {
  return (
    <div className="adm-row">
      <button type="button" className="adm-btn adm-btn--icon" aria-label="Subir" disabled={index === 0} onClick={() => onMove(-1)}>
        ↑
      </button>
      <button type="button" className="adm-btn adm-btn--icon" aria-label="Bajar" disabled={index === length - 1} onClick={() => onMove(1)}>
        ↓
      </button>
      <button type="button" className="adm-btn adm-btn--icon adm-btn--danger" aria-label="Quitar" disabled={length <= min} onClick={onRemove}>
        ✕
      </button>
    </div>
  );
}

function move<T>(list: T[], index: number, dir: -1 | 1): T[] {
  const next = [...list];
  const target = index + dir;
  if (target < 0 || target >= next.length) return list;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function ContentEditor({ initial }: { initial: SiteContent }) {
  const [c, setC] = useState<SiteContent>(initial);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const set = <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => setC((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setMsg(null);
        startTransition(async () => {
          const res = await saveContent(c);
          setMsg(res.ok ? { ok: true, text: "Guardado. La web ya muestra los cambios." } : { ok: false, text: res.error });
        });
      }}
    >
      <section className="adm-card">
        <h2>Portada (primera pantalla)</h2>
        <div className="adm-form">
          <ImageField value={c.hero.image} onChange={(image) => set("hero", { ...c.hero, image })} folder="portada" />
          <div className="adm-grid-2">
            <TextFields
              value={c.hero}
              onChange={(hero) => set("hero", hero)}
              fields={[
                { key: "kicker", label: "Texto pequeño superior" },
                { key: "imageAlt", label: "Descripción de la foto (accesibilidad y Google)" },
                { key: "line1", label: "Título · línea 1" },
                { key: "line2", label: "Título · línea 2" },
                { key: "line3", label: "Título · línea 3 (en cursiva y color)" },
              ]}
            />
          </div>
          <TextFields value={c.hero} onChange={(hero) => set("hero", hero)} fields={[{ key: "copy", label: "Texto bajo el título", area: true }]} />
        </div>
      </section>

      <section className="adm-card">
        <h2>
          Servicios <small>Tarjetas del carrusel</small>
        </h2>
        {c.services.map((s, i) => (
          <div className="adm-sub-card" key={i}>
            <div className="adm-sub-card__head">
              Tarjeta {i + 1}
              <ListControls
                index={i}
                length={c.services.length}
                onMove={(dir) => set("services", move(c.services, i, dir))}
                onRemove={() => set("services", c.services.filter((_, j) => j !== i))}
              />
            </div>
            <div className="adm-form">
              <ImageField value={s.image} onChange={(image) => set("services", c.services.map((x, j) => (j === i ? { ...x, image } : x)))} folder="servicios" />
              <div className="adm-grid-2">
                <TextFields
                  value={s}
                  onChange={(v) => set("services", c.services.map((x, j) => (j === i ? v : x)))}
                  fields={[
                    { key: "title", label: "Título" },
                    { key: "alt", label: "Descripción de la foto" },
                    { key: "metaLeft", label: "Dato izquierdo", hint: "Ej.: Desde 25€" },
                    { key: "metaRight", label: "Dato derecho", hint: "Ej.: Recogida o entrega" },
                  ]}
                />
              </div>
              <TextFields value={s} onChange={(v) => set("services", c.services.map((x, j) => (j === i ? v : x)))} fields={[{ key: "text", label: "Texto", area: true }]} />
            </div>
          </div>
        ))}
        {c.services.length < 8 && (
          <button type="button" className="adm-btn adm-btn--sm" style={{ marginTop: 12 }} onClick={() => set("services", [...c.services, { title: "", text: "", metaLeft: "", metaRight: "", image: "", alt: "" }])}>
            + Añadir tarjeta
          </button>
        )}
      </section>

      <section className="adm-card">
        <h2>
          Cifras <small>La franja verde con números</small>
        </h2>
        <div className="adm-grid-2">
          {c.stats.map((s, i) => (
            <div className="adm-sub-card" key={i} style={{ margin: 0 }}>
              <div className="adm-grid-2">
                <label className="adm-field">
                  <span>Número</span>
                  <input
                    className="adm-input"
                    inputMode="numeric"
                    value={String(s.value)}
                    onChange={(e) => set("stats", c.stats.map((x, j) => (j === i ? { ...x, value: Number(e.target.value.replace(/\D/g, "")) || 0 } : x)))}
                  />
                </label>
                <label className="adm-field">
                  <span>Texto</span>
                  <input className="adm-input" value={s.label} onChange={(e) => set("stats", c.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                </label>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="adm-card">
        <h2>Opiniones</h2>
        <div className="adm-form">
          <div className="adm-grid-2">
            <TextFields
              value={c.reviews}
              onChange={(reviews) => set("reviews", reviews)}
              fields={[
                { key: "score", label: "Nota media", hint: "Ej.: 4,9" },
                { key: "count", label: "Texto bajo la nota", hint: "Ej.: 126 reseñas en Google" },
              ]}
            />
          </div>
          <TextFields value={c.reviews} onChange={(reviews) => set("reviews", reviews)} fields={[{ key: "intro", label: "Frase de presentación", area: true }]} />
          {c.reviews.items.map((r, i) => (
            <div className="adm-sub-card" key={i}>
              <div className="adm-sub-card__head">
                Opinión {i + 1}
                <ListControls
                  index={i}
                  length={c.reviews.items.length}
                  onMove={(dir) => set("reviews", { ...c.reviews, items: move(c.reviews.items, i, dir) })}
                  onRemove={() => set("reviews", { ...c.reviews, items: c.reviews.items.filter((_, j) => j !== i) })}
                />
              </div>
              <div className="adm-form">
                <TextFields
                  value={r}
                  onChange={(v) => set("reviews", { ...c.reviews, items: c.reviews.items.map((x, j) => (j === i ? v : x)) })}
                  fields={[
                    { key: "text", label: "Texto de la reseña", area: true },
                    { key: "author", label: "Autor", hint: "Nombre como aparece en Google (ej.: María G.)" },
                  ]}
                />
              </div>
            </div>
          ))}
          {c.reviews.items.length < 8 && (
            <button type="button" className="adm-btn adm-btn--sm" style={{ width: "fit-content" }} onClick={() => set("reviews", { ...c.reviews, items: [...c.reviews.items, { text: "", author: "" }] })}>
              + Añadir opinión
            </button>
          )}
        </div>
      </section>

      <section className="adm-card">
        <h2>
          Galería de trabajos <small>Sección «Trabajos del taller»</small>
        </h2>
        {c.gallery.map((g, i) => (
          <div className="adm-sub-card" key={i}>
            <div className="adm-sub-card__head">
              Foto {i + 1}
              <ListControls
                index={i}
                length={c.gallery.length}
                onMove={(dir) => set("gallery", move(c.gallery, i, dir))}
                onRemove={() => set("gallery", c.gallery.filter((_, j) => j !== i))}
              />
            </div>
            <div className="adm-form">
              <ImageField value={g.image} onChange={(image) => set("gallery", c.gallery.map((x, j) => (j === i ? { ...x, image } : x)))} folder="galeria" />
              <div className="adm-grid-3">
                <TextFields
                  value={g}
                  onChange={(v) => set("gallery", c.gallery.map((x, j) => (j === i ? v : x)))}
                  fields={[
                    { key: "title", label: "Título" },
                    { key: "caption", label: "Texto" },
                    { key: "alt", label: "Descripción de la foto" },
                  ]}
                />
              </div>
            </div>
          </div>
        ))}
        {c.gallery.length < 16 && (
          <button type="button" className="adm-btn adm-btn--sm" style={{ marginTop: 12 }} onClick={() => set("gallery", [...c.gallery, { image: "", alt: "", title: "", caption: "" }])}>
            + Añadir foto
          </button>
        )}
      </section>

      <section className="adm-card">
        <h2>Contacto</h2>
        <div className="adm-grid-2">
          <TextFields
            value={c.contact}
            onChange={(contact) => set("contact", contact)}
            fields={[
              { key: "address", label: "Dirección" },
              { key: "hours", label: "Horario" },
              { key: "phone", label: "Teléfono" },
              { key: "whatsapp", label: "WhatsApp (opcional)", hint: "Número; aparece un enlace en el pie." },
              { key: "email", label: "Email público (opcional)" },
              { key: "instagram", label: "Instagram (opcional)", hint: "Enlace completo: https://instagram.com/…" },
              { key: "area", label: "Barrio / zona" },
            ]}
          />
        </div>
      </section>

      <section className="adm-card" id="ficha">
        <h2>
          Ficha de producto <small>Textos generales de todas las fichas · cada producto puede cambiarlos en su editor</small>
        </h2>
        <div className="adm-form">
          <div className="adm-sub-card" style={{ marginTop: 0 }}>
            <div className="adm-sub-card__head">Lista de ventajas (bajo el botón de compra)</div>
            <div className="adm-repeat">
              {c.product.perks.map((perk, i) => (
                <div className="adm-repeat__row adm-repeat__row--perk" key={i}>
                  <label className="adm-field">
                    <span>Icono</span>
                    <select
                      className="adm-input"
                      value={perk.icon}
                      onChange={(e) => set("product", { ...c.product, perks: c.product.perks.map((x, j) => (j === i ? { ...x, icon: e.target.value as PerkIcon } : x)) })}
                    >
                      {PERK_ICONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="adm-field">
                    <span>Texto</span>
                    <input
                      className="adm-input"
                      value={perk.text}
                      onChange={(e) => set("product", { ...c.product, perks: c.product.perks.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
                    />
                  </label>
                  <ListControls
                    index={i}
                    length={c.product.perks.length}
                    min={0}
                    onMove={(dir) => set("product", { ...c.product, perks: move(c.product.perks, i, dir) })}
                    onRemove={() => set("product", { ...c.product, perks: c.product.perks.filter((_, j) => j !== i) })}
                  />
                </div>
              ))}
            </div>
            <div className="adm-row" style={{ marginTop: 10 }}>
              {c.product.perks.length < 8 && (
                <button type="button" className="adm-btn adm-btn--sm" onClick={() => set("product", { ...c.product, perks: [...c.product.perks, { icon: "leaf", text: "" }] })}>
                  + Añadir ventaja
                </button>
              )}
              <span className="adm-hint">
                {"{hora}"} se cambia por la hora límite para entregar en el día (Envíos y entregas). Si ese día no hay entrega en el día, la línea no se muestra.
              </span>
            </div>
          </div>
          <div className="adm-grid-3">
            <TextFields
              value={c.product}
              onChange={(product) => set("product", product)}
              fields={[
                { key: "addToCart", label: "Botón «Añadir al carrito»" },
                { key: "buyNow", label: "Botón «Comprar ahora»" },
                { key: "soldOut", label: "Texto de agotado" },
                { key: "sizeLabel", label: "Título de los tamaños" },
                { key: "lowStock", label: "Aviso de pocas unidades", hint: "{n} = unidades que quedan" },
                { key: "descriptionTitle", label: "Título de la descripción" },
                { key: "ribbonLabel", label: "Título del campo cinta" },
                { key: "ribbonPlaceholder", label: "Ejemplo dentro del campo cinta" },
                { key: "saleUntil", label: "Fin de la oferta", hint: "{fecha} = último día de la oferta" },
                { key: "relatedEyebrow", label: "Relacionados · texto pequeño" },
                { key: "relatedTitle", label: "Relacionados · título" },
              ]}
            />
          </div>
          <TextFields value={c.product} onChange={(product) => set("product", product)} fields={[{ key: "ribbonHint", label: "Ayuda bajo el campo cinta", area: true }]} />
        </div>
      </section>

      <section className="adm-card">
        <h2>
          Tienda y ofertas <small>Sección «Ofertas» de la portada y página /tienda/ofertas</small>
        </h2>
        <div className="adm-grid-2">
          <TextFields
            value={c.shop}
            onChange={(shop) => set("shop", shop)}
            fields={[
              { key: "offersEyebrow", label: "Ofertas · texto pequeño" },
              { key: "offersTitle", label: "Ofertas · título" },
              { key: "offersLead", label: "Ofertas · texto", area: true },
              { key: "secureNote", label: "Nota de pago seguro (carrito y checkout)", area: true },
            ]}
          />
        </div>
      </section>

      <section className="adm-card">
        <h2>Pie de página</h2>
        <div className="adm-grid-2">
          <TextFields
            value={c.footer}
            onChange={(footer) => set("footer", footer)}
            fields={[
              { key: "tagline", label: "Frase bajo el nombre", area: true },
              { key: "ordersNote", label: "Nota de pedidos", area: true },
            ]}
          />
        </div>
      </section>

      <div className="adm-savebar">
        {msg && <span className={`adm-alert${msg.ok ? " adm-alert--ok" : ""}`}>{msg.text}</span>}
        <button type="submit" className="adm-btn adm-btn--primary" disabled={pending} style={{ minHeight: 46 }}>
          {pending ? "Guardando…" : "Guardar contenido"}
        </button>
      </div>
    </form>
  );
}
