import type Stripe from "stripe";
import { cancelPendingOrder, markOrderPaid } from "@/lib/orders";
import { getStripe } from "@/lib/stripe";

// Stripe → Developers → Webhooks → endpoint: https://TU-DOMINIO/api/stripe/webhook
// Eventos: checkout.session.completed, checkout.session.async_payment_succeeded,
//          checkout.session.async_payment_failed, checkout.session.expired
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return new Response("Stripe no configurado", { status: 503 });

  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Falta la firma", { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch (err) {
    console.error("[webhook] firma inválida:", err);
    return new Response("Firma inválida", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.order_id ?? session.client_reference_id;

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      if (orderId && session.payment_status === "paid") {
        const pi = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null;
        await markOrderPaid(orderId, pi, { revalidate: true });
      }
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      if (orderId) await cancelPendingOrder(orderId);
      break;
    }
  }

  return Response.json({ received: true });
}
