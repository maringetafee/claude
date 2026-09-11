import "server-only";
import { Resend } from "resend";
import { BRAND } from "@/lib/brand";
import type { SiteContent } from "@/lib/content-shared";
import { formatDateLong } from "@/lib/delivery";
import { SITE_URL } from "@/lib/env";
import { formatEUR } from "@/lib/money";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

type OrderWithItems = Order & { items: OrderItem[] };

const esc = (s: string | null | undefined) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const nl2br = (s: string) => esc(s).replace(/\n/g, "<br>");

export async function sendEmail(opts: { to: string; subject: string; html: string; replyTo?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email] RESEND_API_KEY sin configurar. Omitido: "${opts.subject}" → ${opts.to}`);
    return false;
  }
  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || `${BRAND.name} <onboarding@resend.dev>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      replyTo: opts.replyTo,
    });
    if (error) {
      console.error("[email] Resend:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email]", err);
    return false;
  }
}

function layout(title: string, body: string, contact: SiteContent["contact"]) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#f0e3d3;font-family:Helvetica,Arial,sans-serif;color:#23281f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f0e3d3;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#faf5ee;border-radius:20px;overflow:hidden">
<tr><td style="background:#23281f;padding:28px 32px;color:#faf5ee">
  <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;font-style:italic">${esc(BRAND.name)}</div>
  <div style="margin-top:4px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d98a73">Floristería · ${esc(BRAND.city)}</div>
</td></tr>
<tr><td style="padding:32px">${body}</td></tr>
<tr><td style="padding:22px 32px;border-top:1px solid #e6d9c6;font-size:12px;line-height:1.6;color:#8d8271">
  ${esc(BRAND.name)} · ${esc(contact.address)}<br>
  Tel. ${esc(contact.phone)}${contact.email ? ` · ${esc(contact.email)}` : ""}<br>
  <a href="${SITE_URL}" style="color:#c2685a">${SITE_URL.replace(/^https?:\/\//, "")}</a>
</td></tr>
</table></td></tr></table></body></html>`;
}

function itemsTable(order: OrderWithItems) {
  const rows = order.items
    .map(
      (i) => `<tr>
  <td style="padding:10px 0;border-bottom:1px solid #eadfce;font-size:14px">
    <strong>${esc(i.product_name)}</strong>${i.variant_name ? ` · ${esc(i.variant_name)}` : ""} × ${i.quantity}
    ${i.ribbon_text ? `<div style="margin-top:4px;font-size:12px;color:#7a3b30">Cinta: «${esc(i.ribbon_text)}»</div>` : ""}
  </td>
  <td align="right" style="padding:10px 0;border-bottom:1px solid #eadfce;font-size:14px;white-space:nowrap">${formatEUR(i.unit_price_cents * i.quantity)}</td>
</tr>`,
    )
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:18px 0">${rows}
<tr><td style="padding:8px 0;font-size:14px;color:#6b6356">Subtotal</td><td align="right" style="font-size:14px">${formatEUR(order.subtotal_cents)}</td></tr>
<tr><td style="padding:4px 0;font-size:14px;color:#6b6356">${esc(order.shipping_name)}</td><td align="right" style="font-size:14px">${order.shipping_cents ? formatEUR(order.shipping_cents) : "Gratis"}</td></tr>
<tr><td style="padding:12px 0 0;font-family:Georgia,serif;font-size:22px">Total</td><td align="right" style="padding:12px 0 0;font-family:Georgia,serif;font-size:22px">${formatEUR(order.total_cents)}</td></tr>
</table>`;
}

function deliveryBlock(order: OrderWithItems) {
  const when = `${formatDateLong(order.delivery_date)} · ${esc(order.delivery_slot)}`;
  const where =
    order.shipping_kind === "pickup"
      ? "Recogida en tienda"
      : `${esc(order.recipient_name)} · ${esc(order.recipient_phone)}<br>${esc(order.address)}<br>${esc(order.postal_code)} ${esc(order.city)}`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fffaf3;border:1px solid #eadfce;border-radius:14px">
<tr><td style="padding:18px;font-size:14px;line-height:1.6">
  <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8d8271">${order.shipping_kind === "pickup" ? "Recogida" : "Entrega"}</div>
  <div style="margin-top:4px"><strong>${when}</strong></div>
  <div style="margin-top:6px">${where}</div>
  ${order.card_message ? `<div style="margin-top:12px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8d8271">Mensaje de la tarjeta</div><div style="margin-top:4px;font-family:Georgia,serif;font-style:italic">${nl2br(order.card_message)}</div>` : ""}
</td></tr></table>`;
}

export async function sendOrderPaidEmails(order: OrderWithItems, notifyEmail: string, contact: SiteContent["contact"]) {
  const customerHtml = layout(
    `Pedido #${order.number} confirmado`,
    `<h1 style="margin:0;font-family:Georgia,serif;font-weight:normal;font-size:30px">¡Gracias, ${esc(order.customer_name.split(" ")[0])}!</h1>
<p style="font-size:15px;line-height:1.6;color:#4a4a3f">Hemos recibido tu pedido <strong>#${order.number}</strong> y el pago se ha completado correctamente. Nos ponemos con él en el taller.</p>
${deliveryBlock(order)}
${itemsTable(order)}
<p style="font-size:13px;line-height:1.6;color:#6b6356">Si necesitas cambiar algo, responde a este email o llámanos al ${esc(contact.phone)} indicando tu número de pedido.</p>`,
    contact,
  );

  const shopHtml = layout(
    `Nuevo pedido #${order.number}`,
    `<h1 style="margin:0;font-family:Georgia,serif;font-weight:normal;font-size:28px">Nuevo pedido #${order.number} · ${formatEUR(order.total_cents)}</h1>
<p style="font-size:14px;line-height:1.6">
  <strong>${esc(order.customer_name)}</strong><br>
  <a href="mailto:${esc(order.customer_email)}" style="color:#c2685a">${esc(order.customer_email)}</a> · ${esc(order.customer_phone)}
</p>
${deliveryBlock(order)}
${itemsTable(order)}
${order.notes ? `<p style="font-size:14px"><strong>Notas del cliente:</strong><br>${nl2br(order.notes)}</p>` : ""}
<p><a href="${SITE_URL}/admin/pedidos/${order.id}" style="display:inline-block;padding:12px 22px;border-radius:999px;background:#c2685a;color:#fff;text-decoration:none;font-size:14px">Ver pedido en el panel</a></p>`,
    contact,
  );

  const tasks = [
    sendEmail({
      to: order.customer_email,
      subject: `Pedido #${order.number} confirmado · ${BRAND.name}`,
      html: customerHtml,
      replyTo: notifyEmail || contact.email || undefined,
    }),
  ];
  if (notifyEmail) {
    tasks.push(
      sendEmail({
        to: notifyEmail,
        subject: `🌸 Nuevo pedido #${order.number} · ${formatEUR(order.total_cents)} · ${order.delivery_date}`,
        html: shopHtml,
        replyTo: order.customer_email,
      }),
    );
  }
  await Promise.all(tasks);
}

const STATUS_COPY: Partial<Record<OrderStatus, { subject: string; text: string }>> = {
  preparing: { subject: "Estamos preparando tu pedido", text: "Ya estamos componiendo tu pedido en el taller con flor fresca del día." },
  ready: { subject: "Tu pedido está listo para recoger", text: "Tu pedido ya está listo. Puedes pasar a recogerlo en nuestro horario de apertura." },
  shipped: { subject: "Tu pedido está en reparto", text: "Tu pedido ha salido del taller y va de camino a su destino." },
  delivered: { subject: "Tu pedido se ha entregado", text: "Tu pedido se ha entregado. ¡Gracias por confiar en nosotros!" },
  cancelled: { subject: "Tu pedido se ha cancelado", text: "Tu pedido se ha cancelado. Si no esperabas este mensaje, contacta con nosotros." },
};

export async function sendStatusEmail(order: OrderWithItems, contact: SiteContent["contact"], replyTo?: string) {
  const copy = STATUS_COPY[order.status];
  if (!copy) return false;
  const html = layout(
    copy.subject,
    `<h1 style="margin:0;font-family:Georgia,serif;font-weight:normal;font-size:28px">${esc(copy.subject)}</h1>
<p style="font-size:15px;line-height:1.6;color:#4a4a3f">Hola ${esc(order.customer_name.split(" ")[0])}, ${esc(copy.text.charAt(0).toLowerCase() + copy.text.slice(1))}</p>
<p style="font-size:14px;color:#6b6356">Pedido <strong>#${order.number}</strong></p>
${deliveryBlock(order)}`,
    contact,
  );
  return sendEmail({ to: order.customer_email, subject: `${copy.subject} · Pedido #${order.number}`, html, replyTo });
}
