import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresca la sesión de Supabase (panel, cuenta de cliente y checkout) y manda
// al login a quien no la tenga en las zonas privadas. La comprobación de "es
// administrador" se repite en cada página y acción del panel.
const PUBLIC_ACCOUNT = ["/cuenta/entrar", "/cuenta/recuperar", "/cuenta/restablecer"];
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const redirectTo = (pathname: string, next?: string) => {
    const target = request.nextUrl.clone();
    target.pathname = pathname;
    target.search = next ? `?next=${encodeURIComponent(next)}` : "";
    const res = NextResponse.redirect(target);
    // Conserva las cookies de sesión refrescadas
    response.cookies.getAll().forEach((c) => res.cookies.set(c));
    return res;
  };

  if (path.startsWith("/admin")) {
    if (!user && path !== "/admin/login") return redirectTo("/admin/login");
  } else if (path === "/cuenta" || path.startsWith("/cuenta/")) {
    if (!user && !PUBLIC_ACCOUNT.includes(path)) return redirectTo("/cuenta/entrar", path === "/cuenta" ? undefined : path);
  }

  if (path.startsWith("/admin") || path.startsWith("/cuenta")) response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/cuenta", "/cuenta/:path*", "/checkout", "/api/checkout"],
};
