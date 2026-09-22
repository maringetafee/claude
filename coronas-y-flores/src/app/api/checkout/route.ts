import { NextResponse } from "next/server";
import { z } from "zod";
import { BRAND } from "@/lib/brand";
import { slotsForDate } from "@/lib/delivery";
import { activeDiscount, applyDiscount } from "@/lib/product-utils";
import { buildPaymentForm, getRedsysConfig, newRedsysOrder } from "@/lib/redsys";
import { getSettings } from "@/lib/site-data";
import { getServiceSupabase } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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
  payMethod: z.enum(["card", "bizum"]).default("card"),
  saveProfile: z.boolean().default(false),
  acceptTerms: z.literal(true, "Debes aceptar las condiciones de venta."),
});

type ProductRow = {
  id: string;
  name: string;
  price_cents: number;
  stock: number | null;
  active: boolean;
  allow_ribbon: boolean;
  discount_percent: number;
  sale_starts_on: string | null;
  sale_ends_on: string | null;
  images: { url: string; sort_order: number }[];
  variants: { id: string; name: string; price_cents: number }[];
};

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const redsys = getRedsysConfig();
  const sb = getServiceSupabase();
  if (!redsys || !sb) return fail("Los pagos online aún no están activos. Llámanos y te preparamos el pedido.", 503);

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
    .select(
      "id, name, price_cents, stock, active, allow_ribbon, discount_percent, sale_starts_on, sale_ends_on, images:product_images(url, sort_order), variants:product_variants(id, name, price_cents)",
    )
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
    original: number | null;
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
    // Oferta en vigor hoy (hora de Madrid), calculada aquí y no en el navegador
    const pct = activeDiscount(p);
    const original = pct > 0 ? unit : null;
    unit = applyDiscount(unit, pct);
    qtyByProduct.set(p.id, (qtyByProduct.get(p.id) ?? 0) + item.qty);
    const image = [...p.images].sort((a, b) => a.sort_order - b.sort_order)[0]?.url ?? null;
    lines.push({ product: p, variantId, variantName, unit, original, qty: item.qty, ribbon: p.allow_ribbon ? item.ribbonText : "", image });
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
  if (input.payMethod === "bizum" && !settings.payments.bizum) return fail("El pago con Bizum no está disponible. Elige tarjeta.", 400);

  // Cliente con sesión iniciada: el pedido queda en su cuenta
  const session = await createSupabaseServerClient();
  const {
    data: { user },
  } = await session.auth.getUser();

  // 4) Pedido "pendiente de pago"
  const { data: order, error: orderError } = await sb
    .from("orders")
    .insert({
      user_id: user?.id ?? null,
      payment_provider: "redsys",
      payment_method: input.payMethod,
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
      original_unit_price_cents: l.original,
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

  // 5) Guarda los datos en la cuenta del cliente para la próxima vez
  if (user && input.saveProfile) {
    const profile: Record<string, string> = { name: input.customer.name, phone: input.customer.phone };
    if (recipient && recipient.name === input.customer.name) {
      Object.assign(profile, { address: recipient.address, postal_code: recipient.postalCode, city: recipient.city });
    }
    const { error } = await sb.from("customers").update(profile).eq("id", user.id);
    if (error) console.error("[checkout] perfil:", error.message);
  }

  // 6) Formulario firmado para la pasarela de Redsys
  const origin = new URL(request.url).origin;
  const redsysOrder = newRedsysOrder(order.number as number);
  const { error: refError } = await sb.from("orders").update({ redsys_order: redsysOrder }).eq("id", order.id);
  if (refError) {
    console.error("[checkout] redsys_order:", refError.message);
    await sb.from("orders").update({ status: "cancelled", admin_notes: "No se pudo iniciar el pago." }).eq("id", order.id);
    return fail("No hemos podido iniciar el pago. Inténtalo de nuevo en unos minutos.", 500);
  }

  const form = buildPaymentForm(redsys, {
    order: redsysOrder,
    amountCents: subtotal + shippingCents,
    description: `Pedido #${order.number} · ${BRAND.name}`,
    holder: input.customer.name,
    merchantName: BRAND.name,
    notifyUrl: `${origin}/api/redsys/notificacion`,
    okUrl: `${origin}/pedido/${order.id}`,
    koUrl: `${origin}/checkout?cancelado=1`,
    method: input.payMethod,
  });
  return NextResponse.json({ redsys: form });
}
