import "server-only";
import { cache } from "react";
import { getPublicSupabase } from "@/lib/supabase/public";
import { mergeContent, type SiteContent } from "@/lib/content-shared";
import { mergeSettings, type StoreSettings } from "@/lib/settings-shared";

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const sb = getPublicSupabase();
  if (!sb) return mergeContent(null);
  const { data, error } = await sb.from("site_content").select("data").eq("id", 1).maybeSingle();
  if (error) console.error("[content]", error.message);
  return mergeContent(data?.data);
});

export const getSettings = cache(async (): Promise<StoreSettings> => {
  const sb = getPublicSupabase();
  if (!sb) return mergeSettings(null);
  const { data, error } = await sb.from("store_settings").select("data").eq("id", 1).maybeSingle();
  if (error) console.error("[settings]", error.message);
  return mergeSettings(data?.data);
});
