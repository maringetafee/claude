// Protege el panel interno (index.html, datos.html) y la Netlify Function
// que guarda el estado en vivo (estado.mjs) con HTTP Basic Auth, en vez de
// depender de una ruta secreta no adivinable.
//
// El navegador se encarga de pedir usuario/contraseña con su propio dialogo
// nativo (no hace falta ningun formulario) y recuerda las credenciales para
// el resto de peticiones al mismo origen, incluidas las llamadas fetch() del
// panel a /.netlify/functions/estado.
const USUARIO = "make";
const CONTRASENA = "web";

export default async (request, context) => {
  const auth = request.headers.get("authorization") || "";
  const esperado = "Basic " + btoa(`${USUARIO}:${CONTRASENA}`);

  if (auth !== esperado) {
    return new Response("Autenticación requerida.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Panel interno", charset="UTF-8"',
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return context.next();
};
