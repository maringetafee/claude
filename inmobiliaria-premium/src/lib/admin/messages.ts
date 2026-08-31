import { createClient } from "@/lib/supabase/server";

export async function getNewSubmissionsCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("status", "new");

  return count ?? 0;
}
