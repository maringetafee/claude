import { createClient } from "@/lib/supabase/server";
import type { Property, PropertyFilters } from "@/lib/types";

interface PropertyImageRowRaw {
  id: string;
  url: string;
  alt: string;
  position: number;
  is_cover: boolean;
}

export interface PropertyRow {
  id: string;
  reference: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  operation: string;
  price: number;
  price_suffix: string | null;
  address: string | null;
  city: string;
  zone: string;
  postal_code: string | null;
  latitude: number;
  longitude: number;
  area: number;
  beds: number;
  baths: number;
  floor: string | null;
  year: number | null;
  state: string | null;
  features: string[] | null;
  featured: boolean;
  showcase: boolean;
  published: boolean;
  created_at: string;
  property_images: PropertyImageRowRaw[] | null;
}

export const PROPERTY_SELECT = "*, property_images(id, url, alt, position, is_cover)";
const SELECT = PROPERTY_SELECT;

export function mapProperty(row: PropertyRow): Property {
  const images = [...(row.property_images ?? [])].sort((a, b) => a.position - b.position);
  const gallery = images.map((img) => ({ src: img.url, alt: img.alt }));
  const coverImg = images.find((img) => img.is_cover) ?? images[0];
  const cover = coverImg ? { src: coverImg.url, alt: coverImg.alt } : { src: "", alt: row.title };

  return {
    id: row.id,
    reference: row.reference,
    slug: row.slug,
    title: row.title,
    operation: row.operation as Property["operation"],
    category: row.type,
    zone: row.zone,
    city: row.city,
    address: row.address ?? undefined,
    postalCode: row.postal_code ?? undefined,
    price: Number(row.price),
    priceSuffix: row.price_suffix ?? undefined,
    beds: row.beds,
    baths: row.baths,
    floor: row.floor ?? undefined,
    year: row.year ?? undefined,
    state: row.state ?? undefined,
    area: Number(row.area),
    latitude: row.latitude,
    longitude: row.longitude,
    cover,
    gallery,
    description: row.description,
    features: row.features ?? [],
    featured: row.featured,
    showcase: row.showcase,
    published: row.published,
  };
}

export async function getProperties(filters: PropertyFilters = {}): Promise<Property[]> {
  const supabase = await createClient();
  let query = supabase.from("properties").select(SELECT).eq("published", true);

  if (filters.operacion) query = query.eq("operation", filters.operacion);
  if (filters.tipo) query = query.eq("type", filters.tipo);
  if (filters.zona) query = query.eq("zone", filters.zona);
  if (filters.min) query = query.gte("price", Number(filters.min));
  if (filters.max) query = query.lte("price", Number(filters.max));
  if (filters.habitaciones) query = query.gte("beds", Number(filters.habitaciones));

  query = query.order("created_at", { ascending: false });
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as unknown as PropertyRow[]).map(mapProperty);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProperty(data as unknown as PropertyRow) : null;
}

export async function getFeaturedProperties(limit = 5): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("published", true)
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return ((data ?? []) as unknown as PropertyRow[]).map(mapProperty);
}

export async function getShowcaseProperty(): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("published", true)
    .eq("showcase", true)
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapProperty(data as unknown as PropertyRow) : null;
}

export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("published", true)
    .neq("id", property.id)
    .order("created_at", { ascending: false });
  if (error) throw error;
  const rows = ((data ?? []) as unknown as PropertyRow[]).map(mapProperty);
  rows.sort((a, b) => {
    const aMatch = a.zone === property.zone ? 0 : 1;
    const bMatch = b.zone === property.zone ? 0 : 1;
    return aMatch - bMatch;
  });
  return rows.slice(0, limit);
}

export async function getPropertiesByIds(ids: string[]): Promise<Property[]> {
  if (ids.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("published", true)
    .in("id", ids);
  if (error) throw error;
  return ((data ?? []) as unknown as PropertyRow[]).map(mapProperty);
}
