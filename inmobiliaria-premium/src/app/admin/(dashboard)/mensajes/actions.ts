"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAction } from "@/lib/admin/auth";

export async function updateSubmissionStatus(id: string, status: "new" | "contacted" | "closed") {
  const { supabase } = await requireAdminAction();
  const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/mensajes");
}
