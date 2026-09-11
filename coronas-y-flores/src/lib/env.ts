export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL || // lo define Netlify en build/runtime
  "http://localhost:3000"
).replace(/\/$/, "");

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const hasSupabase = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
