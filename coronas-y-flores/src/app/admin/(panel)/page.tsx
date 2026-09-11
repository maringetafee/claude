import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateLong, madridNow } from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import { statusLabel } from "@/lib/order-status";
import { mergeSettings } from "@/lib/settings-shared";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Resumen" };

const ACTIVE = ["paid", "preparing", "ready", "shipped"];

export default async function DashboardPage() {
  const { sb } = await requireAdmin();
  const today = madridNow().date;
  const monthStart = `${today.slice(0, 8)}01T00:00:00Z`;

  const [newCount, todayRes, monthRes, productsCount, upcomingRes, settingsRes] = await Promise.all([
    sb.from("orders").select("id", { count: "exact", head: true }).eq("status", "paid"),
    sb.from("orders").select("id", { count: "exact", head: true }).eq("delivery_date", today).in("status", ACTIVE),
    sb.from("orders").select("total_cents").gte("paid_at", monthStart).neq("status", "cancelled"),
    sb.from("products").select("id", { count: "exact", head: true }).eq("active", true),
    sb.from("orders").select("*").in("status", ACTIVE).gte("delivery_date", today).order("delivery_date").order("created_at").limit(15),
    sb.from("store_settings").select("data").eq("id", 1).maybeSingle(),
  ]);

  const monthTotal = (monthRes.data ?? []).reduce((s, o) => s + (o.total_cents as number), 0);
  const upcoming = (upcomingRes.data ?? []) as Order[];
  const settings = mergeSettings(settingsRes.data?.data);

  const pending: string[] = [];
  if (!process.env.STRIPE_SECRET_KEY) pending.push("Clave secreta de Stripe (STRIPE_SECRET_KEY): sin ella no se puede pagar.");
  if (!process.env.STRIPE_WEBHOOK_SECRET) pending.push("Webhook de Stripe (STRIPE_WEBHOOK_SECRET): confirma los pagos aunque el cliente cierre la ventana.");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) pending.push("Service role de Supabase: necesaria para registrar pedidos.");
  if (!process.env.RESEND_API_KEY) pending.push("Clave de Resend: sin ella no se envían emails de confirmación.");
  if (!settings.notifyEmail) pending.push("Email de avisos de pedidos (Ajustes).");
  if (settings.legal.nif.startsWith("[")) pending.push("Datos legales del negocio: razón social y NIF (Ajustes).");

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Resumen</h1>
          <p className="adm-sub">{formatDateLong(today).replace(/^./, (c) => c.toUpperCase())}</p>
        </div>
        <Link className="adm-btn adm-btn--primary" href="/admin/productos/nuevo">
          + Nuevo producto
        </Link>
      </div>

      {pending.length > 0 && (
        <div className="adm-alert adm-alert--info" style={{ marginBottom: 18 }}>
          <strong>Pendiente de configurar</strong>
          <ul>
            {pending.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="adm-kpis">
        <Link href="/admin/pedidos?estado=paid" className={`adm-kpi${(newCount.count ?? 0) > 0 ? " adm-kpi--rose" : ""}`}>
          <span>Pedidos nuevos</span>
          <strong>{newCount.count ?? 0}</strong>
        </Link>
        <div className="adm-kpi">
          <span>Entregas hoy</span>
          <strong>{todayRes.count ?? 0}</strong>
        </div>
        <div className="adm-kpi">
          <span>Ventas del mes</span>
          <strong>{formatEUR(monthTotal)}</strong>
        </div>
        <Link href="/admin/productos" className="adm-kpi">
          <span>Productos publicados</span>
          <strong>{productsCount.count ?? 0}</strong>
        </Link>
      </div>

      <section className="adm-card">
        <h2>
          Próximas entregas <Link className="adm-link" href="/admin/pedidos">Ver todos los pedidos</Link>
        </h2>
        {upcoming.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Entrega</th>
                  <th>Cliente</th>
                  <th>Destino</th>
                  <th>Estado</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {upcoming.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <Link className="row-link" href={`/admin/pedidos/${o.id}`}>
                        #{o.number}
                      </Link>
                    </td>
                    <td className="nowrap">
                      {o.delivery_date === today ? <strong>Hoy</strong> : formatDateLong(o.delivery_date)}
                      <div className="adm-muted">{o.delivery_slot}</div>
                    </td>
                    <td>{o.customer_name}</td>
                    <td>{o.shipping_kind === "pickup" ? "Recogida en tienda" : `${o.address ?? ""}, ${o.city ?? ""}`}</td>
                    <td>
                      <span className={`adm-badge adm-badge--${o.status}`}>{statusLabel(o.status)}</span>
                    </td>
                    <td className="num">{formatEUR(o.total_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="adm-empty">No hay entregas pendientes. 🌿</p>
        )}
      </section>
    </>
  );
}
