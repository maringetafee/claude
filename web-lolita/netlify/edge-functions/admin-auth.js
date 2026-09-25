// Protege /admin con usuario/contraseña (HTTP Basic Auth).
// La contraseña está en la variable de entorno ADMIN_PASSWORD de Netlify (no en el repo).
// Sin ADMIN_PASSWORD definida, /admin queda siempre cerrado.

const USUARIO = "lolita";

export default async (req, context) => {
  const password = Netlify.env.get("ADMIN_PASSWORD");
  const auth = req.headers.get("authorization") || "";

  if (password && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const sep = decoded.indexOf(":");
      if (decoded.slice(0, sep) === USUARIO && decoded.slice(sep + 1) === password) return context.next();
    } catch (e) {
      // cabecera mal formada: se trata como no autorizado
    }
  }

  return new Response("Acceso restringido", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Admin Lolita", charset="UTF-8"' },
  });
};

export const config = { path: ["/admin", "/admin/*"] };
