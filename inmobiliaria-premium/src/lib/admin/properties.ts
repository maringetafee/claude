import { createClient } from "@/lib/supabase/server";
import { PROPERTY_SELECT, mapProperty, type PropertyRow } from "@/lib/properties";
import type { Property, PropertyImageRow } from "@/lib/types";

export interface AdminPropertyFilters {
  operacion?: string;
  publicada?: "true" | "false";
  destacada?: "true" | "false";
  q?: string;
}

export interface AdminPropertyListItem extends Property {
  imagesCount: number;
}

export type AdminProperty = Property & { images: PropertyImageRow[] };

export async function getAllPropertiesAdmin(
  filters: AdminPropertyFilters = {}
): Promise<AdminPropertyListItem[]> {
  const supabase = await createClient();
  let query = supabase.from("properties").select(PROPERTY_SELECT);

  if (filters.operacion) query = query.eq("operation", filters.operacion);
  if (filters.publicada) query = query.eq("published", filters.publicada === "true");
  if (filters.destacada) query = query.eq("featured", filters.destacada === "true");
  if (filters.q) query = query.or(`title.ilike.%${filters.q}%,reference.ilike.%${filters.q}%`);

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as unknown as PropertyRow[]).map((row) => ({
    ...mapProperty(row),
    imagesCount: row.property_images?.length ?? 0,
  }));
}

export async function getPropertyByIdAdmin(id: string): Promise<AdminProperty | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const row = data as unknown as PropertyRow;
  const images: PropertyImageRow[] = [...(row.property_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      position: img.position,
      isCover: img.is_cover,
    }));

  return { ...mapProperty(row), images };
}
