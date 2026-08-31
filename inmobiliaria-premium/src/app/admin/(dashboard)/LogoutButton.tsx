"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="shrink-0 whitespace-nowrap text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-soft underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-ink hover:decoration-ink"
    >
      Cerrar sesión
    </button>
  );
}
