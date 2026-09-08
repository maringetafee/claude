/**
 * Stripe webhook — DORMANT.
 *
 * Receives `checkout.session.completed` and marks the corresponding order as
 * paid. Needs a datastore for orders (Netlify Blobs, a DB, or an email to
 * administracion@sema-dur.com) — see README before enabling.
 *
 * Env required: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET.
 */

export default async function handler(request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) {
    return new Response("Stripe webhook not configured", { status: 501 });
  }

  const sig = request.headers.get("stripe-signature");
  const body = await request.text();

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(secret, { apiVersion: "2024-06-20" });
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // TODO: look up the order by session.metadata.reference and set
      // status = "pagado"; notify administracion@sema-dur.com.
      console.log("Paid session", session.id, session.metadata);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(`Webhook error: ${err?.message ?? err}`, { status: 400 });
  }
}
