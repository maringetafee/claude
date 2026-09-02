const RESEND_ENDPOINT = "https://api.resend.com/emails";

function isValidEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function leadEmailHtml(email) {
  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <p style="font-size: 12px; letter-spacing: 2px; color: #1687b8; text-transform: uppercase; margin-bottom: 24px;">MAKEMYWEB</p>
    <h1 style="font-size: 22px; margin: 0 0 16px;">¡Gracias por escribirnos!</h1>
    <p style="font-size: 15px; line-height: 1.6;">
      Hemos recibido tu solicitud de presupuesto. Te contestamos en menos de 24 horas,
      pero aquí tienes ya toda la info para que puedas decidir con calma:
    </p>

    <h2 style="font-size: 16px; margin: 28px 0 8px;">Lo que incluye</h2>
    <ul style="font-size: 14px; line-height: 1.7; padding-left: 18px;">
      <li>Diseño + desarrollo, de principio a fin, desde <strong>799 €</strong></li>
      <li>Sitios listos en 24/48h (para proyectos sencillos)</li>
      <li>Revisión en móvil y una ronda de ajustes antes de publicar</li>
      <li>Ayuda con contenidos y SEO ya incluida, sin coste extra</li>
    </ul>

    <h2 style="font-size: 16px; margin: 28px 0 8px;">Cómo seguimos</h2>
    <p style="font-size: 14px; line-height: 1.6;">
      Para darte un presupuesto exacto solo necesitamos saber: a qué se dedica tu negocio,
      cuántas páginas necesitas y, si tienes, alguna web que te guste como referencia.
      Respondiendo a este correo nos vale.
    </p>

    <h2 style="font-size: 16px; margin: 28px 0 8px;">Después del lanzamiento</h2>
    <p style="font-size: 14px; line-height: 1.6;">
      Seguimos cuidando tu web con hosting, dominio, copias de seguridad y soporte:
      Mantenimiento Básico (39 €/mes) o Mantenimiento Pro (77 €/mes, cambios ilimitados).
    </p>

    <h2 style="font-size: 16px; margin: 28px 0 8px;">Así lucen nuestras webs</h2>
    <p style="font-size: 14px; line-height: 1.6;">
      <a href="https://esquinita.netlify.app/" style="color: #1687b8;">La Esquinita</a> ·
      <a href="https://lolitagetafe.netlify.app/" style="color: #1687b8;">Lolita Café</a> ·
      <a href="https://moccacafe.netlify.app/" style="color: #1687b8;">Mocca Café</a>
    </p>

    <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;" />

    <p style="font-size: 14px; line-height: 1.6;">
      ¿Prefieres hablar directamente? Escríbenos a
      <a href="mailto:makemyweb@gmail.com" style="color: #1687b8;">makemyweb@gmail.com</a>
      o llámanos al 689 87 23 20 / 644 43 48 60.
    </p>

    <p style="font-size: 13px; color: #888; margin-top: 32px;">
      Recibiste este correo porque pediste presupuesto en makemyweb.es con ${email}.
    </p>
  </div>`;
}

function internalEmailHtml(email, meta) {
  return `
  <div style="font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 480px;">
    <h1 style="font-size: 18px;">Nuevo lead desde makemyweb.es</h1>
    <p style="font-size: 14px;"><strong>Email:</strong> ${email}</p>
    <p style="font-size: 14px;"><strong>Fecha:</strong> ${meta.date}</p>
    <p style="font-size: 14px;"><strong>IP:</strong> ${meta.ip}</p>
    <p style="font-size: 14px;">
      <a href="mailto:${email}">Responder directamente</a>
    </p>
  </div>`;
}

async function sendEmail(apiKey, payload) {
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  let email;
  try {
    email = JSON.parse(event.body || "{}").email;
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  if (!isValidEmail(email)) {
    return { statusCode: 400, body: "Missing or invalid email" };
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not configured");
    return { statusCode: 200, body: JSON.stringify({ ok: false, reason: "not_configured" }) };
  }

  const from = process.env.RESEND_FROM || "MAKEMYWEB <hola@makemyweb.es>";
  const internalTo = process.env.INTERNAL_NOTIFY_EMAIL || "makemyweb@gmail.com";

  const meta = {
    date: new Date().toISOString(),
    ip: event.headers["x-nf-client-connection-ip"] || "desconocida",
  };

  const results = await Promise.allSettled([
    sendEmail(apiKey, {
      from,
      to: email,
      subject: "Tu presupuesto MAKEMYWEB — próximos pasos",
      html: leadEmailHtml(email),
    }),
    sendEmail(apiKey, {
      from,
      to: internalTo,
      subject: `Nuevo lead: ${email}`,
      html: internalEmailHtml(email, meta),
    }),
  ]);

  results.forEach((r) => {
    if (r.status === "rejected") console.error(r.reason);
  });

  return { statusCode: 200, body: JSON.stringify({ ok: true }) };
};
