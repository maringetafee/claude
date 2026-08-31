"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState, useTransition, type FormEvent } from "react";
import type { AdminProperty } from "@/lib/admin/properties";
import { slugify } from "@/lib/slugify";
import { cn } from "@/lib/cn";
import { createProperty, updateProperty, type PropertyFormInput } from "./actions";
import { ImageManager } from "./ImageManager";

const LocationPicker = dynamic(() => import("./LocationPicker"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-paper-dim" />,
});

const typeOptions = [
  "Piso",
  "Ático",
  "Chalet",
  "Casa",
  "Villa",
  "Dúplex",
  "Loft",
  "Local",
  "Oficina",
  "Terreno",
  "Garaje",
  "Otro",
];
const stateOptions = ["A reformar", "Buen estado", "Reformado", "Obra nueva"];

const sections = [
  { id: "informacion", label: "Información" },
  { id: "localizacion", label: "Localización" },
  { id: "caracteristicas", label: "Características" },
  { id: "imagenes", label: "Imágenes" },
  { id: "publicacion", label: "Publicación" },
];

const inputClass =
  "w-full border-b border-line bg-transparent py-2.5 font-sans text-[0.95rem] text-ink outline-none focus:border-ink";
const labelClass = "block text-[0.68rem] font-medium uppercase tracking-[0.14em] text-stone";

interface PropertyEditorProps {
  mode: "create" | "edit";
  property?: AdminProperty;
}

function defaultInput(): PropertyFormInput {
  return {
    reference: `IR-${Date.now().toString().slice(-6)}`,
    slug: "",
    title: "",
    description: "",
    type: "Piso",
    operation: "venta",
    price: 0,
    priceSuffix: "",
    address: "",
    city: "Madrid",
    zone: "Getafe",
    postalCode: "",
    latitude: 40.3057,
    longitude: -3.7327,
    area: 0,
    beds: 1,
    baths: 1,
    floor: "",
    year: undefined,
    state: "Buen estado",
    features: [],
    featured: false,
    showcase: false,
    published: false,
  };
}

export function PropertyEditor({ mode, property }: PropertyEditorProps) {
  const [form, setForm] = useState<PropertyFormInput>(
    property
      ? {
          reference: property.reference ?? "",
          slug: property.slug,
          title: property.title,
          description: property.description,
          type: property.category,
          operation: property.operation,
          price: property.price,
          priceSuffix: property.priceSuffix ?? "",
          address: property.address ?? "",
          city: property.city,
          zone: property.zone,
          postalCode: property.postalCode ?? "",
          latitude: property.latitude ?? 40.3057,
          longitude: property.longitude ?? -3.7327,
          area: property.area,
          beds: property.beds,
          baths: property.baths,
          floor: property.floor ?? "",
          year: property.year,
          state: property.state ?? "",
          features: property.features,
          featured: Boolean(property.featured),
          showcase: Boolean(property.showcase),
          published: Boolean(property.published),
        }
      : defaultInput()
  );
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [featureDraft, setFeatureDraft] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PropertyFormInput>(key: K, value: PropertyFormInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(value: string) {
    set("title", value);
    if (!slugTouched) set("slug", slugify(value));
  }

  function addFeature() {
    const value = featureDraft.trim();
    if (!value) return;
    set("features", [...form.features, value]);
    setFeatureDraft("");
  }

  function removeFeature(index: number) {
    set(
      "features",
      form.features.filter((_, i) => i !== index)
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        if (mode === "create") {
          await createProperty(form);
        } else if (property) {
          await updateProperty(property.id, form);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo guardar la propiedad");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="lg:grid lg:grid-cols-12 lg:gap-10">
      <nav className="lg:col-span-3">
        <div className="flex gap-4 overflow-x-auto pb-2 lg:sticky lg:top-28 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={cn(
                "whitespace-nowrap border-l-2 border-transparent py-2 pl-4 text-[0.78rem] uppercase tracking-[0.1em] text-stone transition-colors duration-300 hover:border-ink hover:text-ink",
                section.id === "imagenes" && mode === "create" && "pointer-events-none opacity-40"
              )}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="mt-10 space-y-16 lg:col-span-9 lg:mt-0">
        <section id="informacion" className="scroll-mt-28">
          <h2 className="font-serif text-2xl font-light text-ink">Información</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Referencia</label>
              <input
                value={form.reference}
                onChange={(e) => set("reference", e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Slug (URL)</label>
              <input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                className={inputClass}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Título</label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Descripción</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={cn(inputClass, "resize-none")}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Tipo</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Operación</label>
              <select value={form.operation} onChange={(e) => set("operation", e.target.value)} className={inputClass}>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Precio (€)</label>
              <input
                type="number"
                min={0}
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Sufijo de precio (opcional)</label>
              <input
                value={form.priceSuffix}
                onChange={(e) => set("priceSuffix", e.target.value)}
                placeholder="/mes"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Habitaciones</label>
              <input
                type="number"
                min={0}
                value={form.beds}
                onChange={(e) => set("beds", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Baños</label>
              <input
                type="number"
                min={0}
                value={form.baths}
                onChange={(e) => set("baths", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Metros cuadrados</label>
              <input
                type="number"
                min={0}
                value={form.area}
                onChange={(e) => set("area", Number(e.target.value))}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Planta</label>
              <input value={form.floor} onChange={(e) => set("floor", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Año de construcción</label>
              <input
                type="number"
                value={form.year ?? ""}
                onChange={(e) => set("year", e.target.value ? Number(e.target.value) : undefined)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Estado</label>
              <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputClass}>
                <option value="">Sin especificar</option>
                {stateOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section id="localizacion" className="scroll-mt-28">
          <h2 className="font-serif text-2xl font-light text-ink">Localización</h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Dirección</label>
              <input value={form.address} onChange={(e) => set("address", e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Ciudad</label>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Zona</label>
              <input value={form.zone} onChange={(e) => set("zone", e.target.value)} className={inputClass} required />
            </div>
            <div>
              <label className={labelClass}>Código postal</label>
              <input
                value={form.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Latitud</label>
              <input
                type="number"
                step="0.0001"
                value={form.latitude}
                onChange={(e) => set("latitude", Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Longitud</label>
              <input
                type="number"
                step="0.0001"
                value={form.longitude}
                onChange={(e) => set("longitude", Number(e.target.value))}
                className={inputClass}
              />
            </div>
          </div>
          <p className="mt-6 text-[0.8rem] text-stone">
            Haz clic en el mapa o arrastra el marcador para fijar la ubicación exacta.
          </p>
          <div className="mt-3 h-96 border border-line">
            <LocationPicker
              latitude={form.latitude}
              longitude={form.longitude}
              onChange={(lat, lng) => setForm((f) => ({ ...f, latitude: lat, longitude: lng }))}
            />
          </div>
        </section>

        <section id="caracteristicas" className="scroll-mt-28">
          <h2 className="font-serif text-2xl font-light text-ink">Características</h2>
          <div className="mt-6 flex gap-3">
            <input
              value={featureDraft}
              onChange={(e) => setFeatureDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addFeature();
                }
              }}
              placeholder="Ej. Terraza de 20 m²"
              className={inputClass}
            />
            <button
              type="button"
              onClick={addFeature}
              className="shrink-0 border border-ink px-5 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              Añadir
            </button>
          </div>
          {form.features.length > 0 && (
            <ul className="mt-5 space-y-2">
              {form.features.map((feature, i) => (
                <li
                  key={`${feature}-${i}`}
                  className="flex items-center justify-between border-b border-line py-2 text-[0.92rem] text-ink-soft"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(i)}
                    className="text-[0.72rem] uppercase tracking-[0.1em] text-accent hover:underline"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="imagenes" className="scroll-mt-28">
          <h2 className="font-serif text-2xl font-light text-ink">Imágenes</h2>
          {mode === "create" || !property ? (
            <p className="mt-4 text-[0.9rem] text-stone">
              Guarda la propiedad primero para poder añadir imágenes.
            </p>
          ) : (
            <div className="mt-6">
              <ImageManager propertyId={property.id} images={property.images} />
            </div>
          )}
        </section>

        <section id="publicacion" className="scroll-mt-28">
          <h2 className="font-serif text-2xl font-light text-ink">Publicación</h2>
          <div className="mt-6 space-y-4">
            <label className="flex items-center gap-3 text-[0.92rem] text-ink">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => set("published", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Publicada (visible en la web)
            </label>
            <label className="flex items-center gap-3 text-[0.92rem] text-ink">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Destacada (aparece en &ldquo;Propiedades seleccionadas&rdquo;)
            </label>
            <label className="flex items-center gap-3 text-[0.92rem] text-ink">
              <input
                type="checkbox"
                checked={form.showcase}
                onChange={(e) => set("showcase", e.target.checked)}
                className="h-4 w-4 accent-accent"
              />
              Protagonista (la propiedad a portada completa de la home)
            </label>
          </div>
        </section>

        {error && <p className="text-[0.9rem] text-accent">{error}</p>}

        <div className="flex items-center gap-6 border-t border-line pt-8">
          <button
            type="submit"
            disabled={isPending}
            className="bg-ink px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-paper transition-colors duration-300 hover:bg-accent disabled:opacity-60"
          >
            {isPending ? "Guardando…" : "Guardar propiedad"}
          </button>
          <Link href="/admin/propiedades" className="text-[0.72rem] uppercase tracking-[0.14em] text-stone hover:text-ink">
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}
