/**
 * Stripe Checkout Session — DORMANT.
 *
 * This endpoint only does something once the environment provides
 * STRIPE_SECRET_KEY (and the catalogue has products with a real price).
 * Until then it responds 501 so the frontend can show "pago no disponible".
 *
 * Security: the secret key never reaches the browser. The client sends only
 * line references + quantities; prices are resolved here, server-side.
 *
 * To activate:
 *   1. `npm i stripe` in this project (kept out of the bundle until needed).
 *   2. Set STRIPE_SECRET_KEY and STRIPE_SUCCESS_URL / STRIPE_CANCEL_URL in the
 *      Netlify site environment.
 *   3. Give priced products a `price` (in cents) + `stripePriceId` in
 *      src/data/products.ts and map them below.
 *   4. Deploy netlify/functions/stripe-webhook.mjs to mark orders paid.
 */

export default async function handler(request) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return json(
      {
        pending: true,
        message:
          "El pago con tarjeta todavía no está activo. Envía tu solicitud de presupuesto y te confirmaremos el importe.",
      },
      501,
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const lines = Array.isArray(payload?.lines) ? payload.lines : [];
  if (lines.length === 0) return json({ error: "Empty cart" }, 400);

  try {
    // Lazy import so the dependency is optional until Stripe is enabled.
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });

    // TODO: resolve each line against the server-side catalogue and build
    // line_items from trusted prices (never from client-supplied amounts).
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((l) => ({
        price: l.stripePriceId,
        quantity: Math.max(1, Number(l.qty) || 1),
      })),
      success_url:
        process.env.STRIPE_SUCCESS_URL ??
        "https://www.sema-dur.com/gracias/?paid=1",
      cancel_url:
        process.env.STRIPE_CANCEL_URL ?? "https://www.sema-dur.com/carrito/",
      automatic_tax: { enabled: true },
    });

    return json({ url: session.url });
  } catch (err) {
    return json({ error: String(err?.message ?? err) }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
