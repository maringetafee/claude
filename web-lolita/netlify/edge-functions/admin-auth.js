// Protege /admin con una pantalla de login propia (misma estética que el panel).
// La contraseña está en la variable de entorno ADMIN_PASSWORD de Netlify (no en el repo);
// sin ella, nadie puede entrar. El panel (admin/index.html) solo se sirve con sesión válida.

const USUARIO = "lolita";
const COOKIE = "lolita_admin";
const DURACION_S = 12 * 60 * 60;

async function tokenSesion(password) {
  const datos = new TextEncoder().encode(`lolita-admin:${password}`);
  const hash = await crypto.subtle.digest("SHA-256", datos);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function leerCookie(req, nombre) {
  const cookies = req.headers.get("cookie") || "";
  const m = cookies.match(new RegExp(`(?:^|;\\s*)${nombre}=([^;]+)`));
  return m ? m[1] : null;
}

function paginaLogin({ error = "", usuario = "", status = 200 } = {}) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Acceso · Lolita Café</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; background: #f7f3ee; font-family: Georgia, 'Times New Roman', serif; color: #2b2420;
         display: flex; align-items: center; justify-content: center; padding: 20px; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  form { background: #fff; border: 1px solid #e3dcd2; border-radius: 12px; padding: 28px; max-width: 320px; width: 100%;
         display: flex; flex-direction: column; gap: 12px; animation: fadeIn 0.3s ease; }
  h2 { margin: 0 0 4px; font-size: 20px; }
  p { margin: 0 0 8px; font-size: 13px; color: #7a6f63; }
  input { font-size: 15px; padding: 9px 10px; border: 1px solid #d8cfc2; border-radius: 6px; font-family: inherit; color: inherit; }
  input:focus { outline: 2px solid #3f5b45; outline-offset: -1px; }
  .error { font-size: 13px; color: #7a2f24; }
  button { font-size: 15px; padding: 10px; border: none; border-radius: 6px; background: #3f5b45; color: #fff; cursor: pointer; font-family: inherit; }
  button:hover { background: #344c3a; }
</style>
</head>
<body>
  <form method="post" action="/admin/login">
    <h2>Acceso privado</h2>
    <p>Panel de mesas — Lolita Café</p>
    <input name="usuario" placeholder="Usuario" autocomplete="username" autocapitalize="none" required value="${usuario.replace(/[&<>"]/g, "")}">
    <input name="password" type="password" placeholder="Contraseña" autocomplete="current-password" required ${usuario ? "autofocus" : ""}>
    ${error ? `<div class="error">${error}</div>` : ""}
    <button type="submit">Entrar</button>
  </form>
</body>
</html>`;
  return new Response(html, {
    status,
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" },
  });
}

export default async (req, context) => {
  const url = new URL(req.url);
  const password = Netlify.env.get("ADMIN_PASSWORD");
  const token = password ? await tokenSesion(password) : null;

  if (url.pathname === "/admin/logout") {
    return new Response(null, {
      status: 303,
      headers: { location: "/admin/", "set-cookie": `${COOKIE}=; Path=/admin; Max-Age=0; HttpOnly; Secure; SameSite=Lax` },
    });
  }

  if (url.pathname === "/admin/login") {
    if (req.method !== "POST") return Response.redirect(new URL("/admin/", url), 303);
    const form = await req.formData();
    const usuario = String(form.get("usuario") || "").trim();
    const dada = String(form.get("password") || "");
    if (token && usuario === USUARIO && dada === password) {
      return new Response(null, {
        status: 303,
        headers: {
          location: "/admin/",
          "set-cookie": `${COOKIE}=${token}; Path=/admin; Max-Age=${DURACION_S}; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }
    return paginaLogin({ error: "Usuario o contraseña incorrectos.", usuario, status: 401 });
  }

  if (token && leerCookie(req, COOKIE) === token) {
    const original = await context.next();
    const res = new Response(original.body, original);
    res.headers.set("cache-control", "no-store");
    return res;
  }

  return paginaLogin({ status: 401 });
};

export const config = { path: ["/admin", "/admin/*"] };
