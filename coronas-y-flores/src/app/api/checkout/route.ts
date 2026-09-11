import { NextResponse } from "next/server";
import { z } from "zod";
import { BRAND } from "@/lib/brand";
import { slotsForDate } from "@/lib/delivery";
import { getSettings } from "@/lib/site-data";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import type { ShippingMethod } from "@/lib/types";

const text = (max: number) => z.string().trim().max(max);

const CheckoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.uuid(),
        variantId: z.uuid().nullable(),
        qty: z.number().int().min(1).max(20),
        ribbonText: text(80).default(""),
      }),
    )
    .min(1, "El carrito está vacío.")
    .max(40),
  customer: z.object({
    name: text(120).min(2, "Escribe tu nombre."),
    email: z.email("El email no es válido.").max(160),
    phone: text(30).min(9, "El teléfono no es válido."),
  }),
  shippingMethodId: z.uuid("Elige un método de entrega."),
  recipient: z
    .object({
      name: text(120).min(2, "Escribe el nombre de quien recibe el pedido."),
      phone: text(30).min(9, "El teléfono de entrega no es válido."),
      address: text(240).min(5, "Escribe la dirección de entrega."),
      postalCode: z.string().trim().regex(/^\d{5}$/, "El código postal debe tener 5 cifras."),
      city: text(80).min(2, "Escribe la localidad."),
    })
    .optional(),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha de entrega."),
  slotId: z.string().min(1, "Elige una franja horaria.").max(40),
  cardMessage: text(300).default(""),
  notes: text(500).default(""),
  acceptTerms: z.literal(true, "Debes aceptar las condiciones de venta."),
});

type ProductRow = {
  id: string;
  name: string;
  price_cents: number;
  stock: number | null;
  active: boolean;
  allow_ribbon: boolean;
  images: { url: string; sort_order: number }[];
  variants: { id: string; name: string; price_cents: number }[];
};

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const stripe = getStripe();
  const sb = getServiceSupabase();
  if (!stripe || !sb) return fail("Los pagos online aún no están activos. Llámanos y te preparamos el pedido.", 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Petición no válida.", 400);
  }
  const parsed = CheckoutSchema.safeParse(body);
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Revisa los datos del formulario.", 400);
  const input = parsed.data;

  // 1) Precios y stock siempre desde la base de datos, nunca desde el navegador
  const ids = [...new Set(input.items.map((i) => i.productId))];
  const { data: rows, error: productsError } = await sb
    .from("products")
    .select("id, name, price_cents, stock, active, allow_ribbon, images:product_images(url, sort_order), variants:product_variants(id, name, price_cents)")
    .in("id", ids);
  if (productsError) {
    console.error("[checkout] productos:", productsError.message);
    return fail("No hemos podido comprobar los productos. Inténtalo de nuevo.", 500);
  }
  const byId = new Map((rows as ProductRow[]).map((r) => [r.id, r]));

  const lines: {
    product: ProductRow;
    variantId: string | null;
    variantName: string | null;
    unit: number;
    qty: number;
    ribbon: string;
    image: string | null;
  }[] = [];
  const qtyByProduct = new Map<string, number>();

  for (const item of input.items) {
    const p = byId.get(item.productId);
    if (!p || !p.active) return fail("Uno de los productos del carrito ya no está disponible. Revísalo y vuelve a intentarlo.", 409);
    let unit = p.price_cents;
    let variantId: string | null = null;
    let variantName: string | null = null;
    if (p.variants.length) {
      const v = p.variants.find((x) => x.id === item.variantId);
      if (!v) return fail(`El tamaño elegido de «${p.name}» ya no está disponible. Vuelve a añadirlo al carrito.`, 409);
      unit = v.price_cents;
      variantId = v.id;
      variantName = v.name;
    }
    qtyByProduct.set(p.id, (qtyByProduct.get(p.id) ?? 0) + item.qty);
    const image = [...p.images].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null;
    lines.push({ product: p, variantId, variantName, unit, qty: item.qty, ribbon: p.allow_ribbon ? item.ribbonText : "", image });
  }

  for (const [productId, qty] of qtyByProduct) {
    const p = byId.get(productId)!;
    if (p.stock !== null && qty > p.stock) {
      return fail(p.stock === 0 ? `«${p.name}» se ha agotado.` : `Solo quedan ${p.stock} unidades de «${p.name}».`, 409);
    }
  }
  const subtotal = lines.reduce((s, l) => s + l.unit * l.qty, 0);

  // 2) Método de entrega y zona
  const { data: methodRow } = await sb
    .from("shipping_methods")
    .select("*")
    .eq("id", input.shippingMethodId)
    .eq("active", true)
    .maybeSingle();
  const method = methodRow as ShippingMethod | null;
  if (!method) return fail("Elige un método de entrega válido.", 400);

  const recipient = method.kind === "delivery" ? input.recipient : undefined;
  if (method.kind === "delivery") {
    if (!recipient) return fail("Completa la dirección de entrega.", 400);
    if (method.postal_codes.length && !method.postal_codes.includes(recipient.postalCode)) {
      return fail(`No repartimos en el código postal ${recipient.postalCode} con «${method.name}». Elige otro método de entrega.`, 400);
    }
  }
  const shippingCents = method.free_over_cents != null && subtotal >= method.free_over_cents ? 0 : method.price_cents;

  // 3) Fecha y franja (hora de Madrid)
  const settings = await getSettings();
  const slot = slotsForDate(settings.delivery, input.deliveryDate).find((s) => s.id === input.slotId);
  if (!slot) return fail("La fecha o la franja elegida ya no está disponible. Elige otra, por favor.", 409);

  // 4) Pedido "pendiente de pago"
  const { data: order, error: orderError } = await sb
    .from("orders")
    .insert({
      customer_name: input.customer.name,
      customer_email: input.customer.email.toLowerCase(),
      customer_phone: input.customer.phone,
      shipping_method_id: method.id,
      shipping_kind: method.kind,
      shipping_name: method.name,
      shipping_cents: shippingCents,
      recipient_name: recipient?.name ?? null,
      recipient_phone: recipient?.phone ?? null,
      address: recipient?.address ?? null,
      postal_code: recipient?.postalCode ?? null,
      city: recipient?.city ?? null,
      delivery_date: input.deliveryDate,
      delivery_slot: slot.label,
      card_message: input.cardMessage,
      notes: input.notes,
      subtotal_cents: subtotal,
      total_cents: subtotal + shippingCents,
    })
    .select("id, number")
    .single();
  if (orderError || !order) {
    console.error("[checkout] pedido:", orderError?.message);
    return fail("No hemos podido registrar el pedido. Inténtalo de nuevo.", 500);
  }

  const { error: itemsError } = await sb.from("order_items").insert(
    lines.map((l) => ({
      order_id: order.id,
      product_id: l.product.id,
      variant_id: l.variantId,
      product_name: l.product.name,
      variant_name: l.variantName,
      unit_price_cents: l.unit,
      quantity: l.qty,
      ribbon_text: l.ribbon,
      image_url: l.image,
    })),
  );
  if (itemsError) {
    console.error("[checkout] líneas:", itemsError.message);
    await sb.from("orders").delete().eq("id", order.id);
    return fail("No hemos podido registrar el pedido. Inténtalo de nuevo.", 500);
  }

  // 5) Sesión de pago de Stripe
  const origin = new URL(request.url).origin;
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "es",
      customer_email: input.customer.email,
      client_reference_id: order.id,
      metadata: { order_id: order.id, order_number: String(order.number) },
      payment_intent_data: {
        description: `Pedido #${order.number} · ${BRAND.name}`,
        metadata: { order_id: order.id, order_number: String(order.number) },
      },
      line_items: [
        ...lines.map((l) => ({
          quantity: l.qty,
          price_data: {
            currency: "eur",
            unit_amount: l.unit,
            product_data: {
              name: l.variantName ? `${l.product.name} · ${l.variantName}` : l.product.name,
              ...(l.image?.startsWith("https://") ? { images: [l.image] } : {}),
              ...(l.ribbon ? { description: `Cinta: ${l.ribbon}` } : {}),
            },
          },
        })),
        ...(shippingCents > 0
          ? [{ quantity: 1, price_data: { currency: "eur", unit_amount: shippingCents, product_data: { name: method.name } } }]
          : []),
      ],
      success_url: `${origin}/pedido/confirmado?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?cancelado=1`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
    });

    await sb.from("orders").update({ stripe_session_id: session.id }).eq("id", order.id);
    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] stripe:", err);
    await sb.from("orders").update({ status: "cancelled", admin_notes: "No se pudo crear el pago en Stripe." }).eq("id", order.id);
    return fail("No hemos podido iniciar el pago. Inténtalo de nuevo en unos minutos.", 502);
  }
}
