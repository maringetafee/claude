// Protege /admin con usuario/contraseña (HTTP Basic Auth).
// La contraseña está en la variable de entorno ADMIN_PASSWORD de Netlify (no en el repo).
// El usuario puede ser cualquiera; solo se comprueba la contraseña.

export default async (req, context) => {
  const password = Netlify.env.get("ADMIN_PASSWORD");
  const auth = req.headers.get("authorization") || "";

  if (password && auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const given = decoded.slice(decoded.indexOf(":") + 1);
      if (given === password) return context.next();
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
