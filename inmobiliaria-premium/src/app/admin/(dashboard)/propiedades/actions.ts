"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminAction } from "@/lib/admin/auth";

export interface PropertyFormInput {
  reference: string;
  slug: string;
  title: string;
  description: string;
  type: string;
  operation: string;
  price: number;
  priceSuffix?: string;
  address?: string;
  city: string;
  zone: string;
  postalCode?: string;
  latitude: number;
  longitude: number;
  area: number;
  beds: number;
  baths: number;
  floor?: string;
  year?: number;
  state?: string;
  features: string[];
  featured: boolean;
  showcase: boolean;
  published: boolean;
}

function toRow(input: PropertyFormInput) {
  return {
    reference: input.reference,
    slug: input.slug,
    title: input.title,
    description: input.description,
    type: input.type,
    operation: input.operation,
    price: input.price,
    price_suffix: input.priceSuffix || null,
    address: input.address || null,
    city: input.city,
    zone: input.zone,
    postal_code: input.postalCode || null,
    latitude: input.latitude,
    longitude: input.longitude,
    area: input.area,
    beds: input.beds,
    baths: input.baths,
    floor: input.floor || null,
    year: input.year || null,
    state: input.state || null,
    features: input.features,
    featured: input.featured,
    showcase: input.showcase,
    published: input.published,
  };
}

function revalidatePublicPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/propiedades");
  if (slug) revalidatePath(`/propiedades/${slug}`);
}

async function clearOtherShowcases(supabase: Awaited<ReturnType<typeof requireAdminAction>>["supabase"], exceptId?: string) {
  const query = supabase.from("properties").update({ showcase: false }).eq("showcase", true);
  if (exceptId) query.neq("id", exceptId);
  await query;
}

export async function createProperty(input: PropertyFormInput) {
  const { supabase } = await requireAdminAction();

  if (input.showcase) await clearOtherShowcases(supabase);

  const { data, error } = await supabase
    .from("properties")
    .insert(toRow(input))
    .select("id, slug")
    .single();

  if (error) throw new Error(error.message);

  revalidatePublicPages(data.slug);
  revalidatePath("/admin/propiedades");
  redirect(`/admin/propiedades/${data.id}`);
}

export async function updateProperty(id: string, input: PropertyFormInput) {
  const { supabase } = await requireAdminAction();

  if (input.showcase) await clearOtherShowcases(supabase, id);

  const { error } = await supabase.from("properties").update(toRow(input)).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePublicPages(input.slug);
  revalidatePath("/admin/propiedades");
  revalidatePath(`/admin/propiedades/${id}`);
}

export async function deleteProperty(id: string) {
  const { supabase } = await requireAdminAction();

  const { data: property } = await supabase
    .from("properties")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { data: images } = await supabase
    .from("property_images")
    .select("url")
    .eq("property_id", id);

  if (images && images.length > 0) {
    const paths = images
      .map((img) => storagePathFromUrl(img.url))
      .filter((p): p is string => Boolean(p));
    if (paths.length > 0) await supabase.storage.from("property-images").remove(paths);
  }

  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePublicPages(property?.slug);
  revalidatePath("/admin/propiedades");
}

export async function togglePublished(id: string, published: boolean) {
  const { supabase } = await requireAdminAction();
  const { data, error } = await supabase
    .from("properties")
    .update({ published })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) throw new Error(error.message);
  revalidatePublicPages(data.slug);
  revalidatePath("/admin/propiedades");
}

export async function toggleFeatured(id: string, featured: boolean) {
  const { supabase } = await requireAdminAction();
  const { data, error } = await supabase
    .from("properties")
    .update({ featured })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) throw new Error(error.message);
  revalidatePublicPages(data.slug);
  revalidatePath("/admin/propiedades");
}

export async function duplicateProperty(id: string) {
  const { supabase } = await requireAdminAction();

  const { data: original, error: fetchError } = await supabase
    .from("properties")
    .select("*, property_images(url, alt, position, is_cover)")
    .eq("id", id)
    .single();
  if (fetchError) throw new Error(fetchError.message);

  const { id: _id, created_at, updated_at, property_images, ...rest } = original;
  void _id;
  void created_at;
  void updated_at;

  const { data: copy, error: insertError } = await supabase
    .from("properties")
    .insert({
      ...rest,
      reference: `${rest.reference}-COPIA`,
      slug: `${rest.slug}-copia-${Date.now().toString().slice(-5)}`,
      published: false,
      showcase: false,
    })
    .select("id")
    .single();
  if (insertError) throw new Error(insertError.message);

  if (property_images && property_images.length > 0) {
    await supabase.from("property_images").insert(
      property_images.map((img: { url: string; alt: string; position: number; is_cover: boolean }) => ({
        property_id: copy.id,
        url: img.url,
        alt: img.alt,
        position: img.position,
        is_cover: img.is_cover,
      }))
    );
  }

  revalidatePath("/admin/propiedades");
}

function storagePathFromUrl(url: string): string | null {
  const marker = "/property-images/";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

export async function uploadPropertyImage(propertyId: string, formData: FormData) {
  const { supabase } = await requireAdminAction();

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No se recibió ningún archivo");

  const { count } = await supabase
    .from("property_images")
    .select("id", { count: "exact", head: true })
    .eq("property_id", propertyId);

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${propertyId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from("property-images")
    .upload(path, buffer, { contentType: file.type || "image/jpeg" });
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("property-images").getPublicUrl(path);

  const isFirst = (count ?? 0) === 0;
  const { error: insertError } = await supabase.from("property_images").insert({
    property_id: propertyId,
    url: publicUrl,
    alt: "",
    position: count ?? 0,
    is_cover: isFirst,
  });
  if (insertError) throw new Error(insertError.message);

  revalidatePath(`/admin/propiedades/${propertyId}`);
}

export async function deletePropertyImage(propertyId: string, imageId: string) {
  const { supabase } = await requireAdminAction();

  const { data: image } = await supabase
    .from("property_images")
    .select("url")
    .eq("id", imageId)
    .maybeSingle();

  if (image) {
    const path = storagePathFromUrl(image.url);
    if (path) await supabase.storage.from("property-images").remove([path]);
  }

  const { error } = await supabase.from("property_images").delete().eq("id", imageId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/propiedades/${propertyId}`);
}

export async function setCoverImage(propertyId: string, imageId: string) {
  const { supabase } = await requireAdminAction();

  await supabase.from("property_images").update({ is_cover: false }).eq("property_id", propertyId);
  const { error } = await supabase
    .from("property_images")
    .update({ is_cover: true })
    .eq("id", imageId);
  if (error) throw new Error(error.message);

  revalidatePath(`/admin/propiedades/${propertyId}`);
}

export async function reorderPropertyImages(propertyId: string, orderedIds: string[]) {
  const { supabase } = await requireAdminAction();

  await Promise.all(
    orderedIds.map((imageId, index) =>
      supabase.from("property_images").update({ position: index }).eq("id", imageId)
    )
  );

  revalidatePath(`/admin/propiedades/${propertyId}`);
}
