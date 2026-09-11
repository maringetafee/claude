import "server-only";
import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  stripe ??= new Stripe(key, { appInfo: { name: "Coronas y Flores tienda" } });
  return stripe;
}
