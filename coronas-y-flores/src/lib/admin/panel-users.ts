import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";

export type PanelUser = {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
};

const PER_PAGE = 1000;

async function listAllUsers(svc: SupabaseClient): Promise<User[]> {
  const all: User[] = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await svc.auth.admin.listUsers({ page, perPage: PER_PAGE });
    if (error) throw error;
    all.push(...data.users);
    if (data.users.length < PER_PAGE) break;
  }
  return all;
}

export async function findUserByEmail(svc: SupabaseClient, email: string): Promise<User | null> {
  const wanted = email.trim().toLowerCase();
  const users = await listAllUsers(svc);
  return users.find((u) => u.email?.toLowerCase() === wanted) ?? null;
}

/** Usuarios con acceso al panel (tabla admin_users + datos de Auth). Requiere service role. */
export async function getPanelUsers(svc: SupabaseClient): Promise<PanelUser[]> {
  const { data: rows, error } = await svc.from("admin_users").select("user_id, created_at");
  if (error) throw error;
  const byId = new Map((await listAllUsers(svc)).map((u) => [u.id, u]));
  return (rows ?? [])
    .map((r) => {
      const u = byId.get(r.user_id);
      return {
        id: r.user_id as string,
        email: u?.email ?? "(usuario eliminado)",
        createdAt: r.created_at as string,
        lastSignInAt: u?.last_sign_in_at ?? null,
      };
    })
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
