import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { formatDateLong, madridNow } from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import { statusLabel } from "@/lib/order-status";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Pedidos" };

const TABS: { key: string; label: string; statuses: string[] | null }[] = [
  { key: "activos", label: "En curso", statuses: ["paid", "preparing", "ready", "shipped"] },
  { key: "paid", label: "Nuevos", statuses: ["paid"] },
  { key: "preparing", label: "En preparación", statuses: ["preparing"] },
  { key: "enviados", label: "Listos / en reparto", statuses: ["ready", "shipped"] },
  { key: "delivered", label: "Entregados", statuses: ["delivered"] },
  { key: "cancelled", label: "Cancelados", statuses: ["cancelled"] },
  { key: "pending_payment", label: "Sin pagar", statuses: ["pending_payment"] },
  { key: "todos", label: "Todos", statuses: null },
];

type Props = { searchParams: Promise<{ estado?: string; q?: string }> };

export default async function OrdersPage({ searchParams }: Props) {
  const { sb } = await requireAdmin();
  const { estado = "activos", q = "" } = await searchParams;
  const tab = TABS.find((t) => t.key === estado) ?? TABS[0];
  const active = tab.key === "activos" || ["paid", "preparing", "enviados"].includes(tab.key);

  let query = sb.from("orders").select("*, items:order_items(quantity)").limit(200);
  if (tab.statuses) query = query.in("status", tab.statuses);
  query = active
    ? query.order("delivery_date", { ascending: true }).order("created_at", { ascending: true })
    : query.order("created_at", { ascending: false });

  const term = q.trim().replace(/[,()*%]/g, " ").trim();
  if (term) {
    query = /^\d+$/.test(term)
      ? query.eq("number", Number(term))
      : query.or(`customer_name.ilike.*${term}*,customer_email.ilike.*${term}*,recipient_name.ilike.*${term}*`);
  }

  const { data, error } = await query;
  const orders = (data ?? []) as (Order & { items: { quantity: number }[] })[];
  const today = madridNow().date;

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Pedidos</h1>
          <p className="adm-sub">Cambia el estado de cada pedido desde su ficha. El cliente puede recibir un aviso por email.</p>
        </div>
        <form className="adm-row" action="/admin/pedidos">
          <input type="hidden" name="estado" value={tab.key} />
          <input className="adm-input" name="q" defaultValue={q} placeholder="Nº, nombre o email" style={{ width: 230 }} />
          <button className="adm-btn" type="submit">
            Buscar
          </button>
        </form>
      </div>

      <nav className="adm-tabs" aria-label="Filtrar por estado">
        {TABS.map((t) => (
          <Link key={t.key} href={`/admin/pedidos?estado=${t.key}`} className={t.key === tab.key ? "is-active" : undefined}>
            {t.label}
          </Link>
        ))}
      </nav>

      <section className="adm-card">
        {error && <div className="adm-alert">No se han podido cargar los pedidos: {error.message}</div>}
        {orders.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Entrega</th>
                  <th>Cliente</th>
                  <th>Método</th>
                  <th>Uds.</th>
                  <th>Estado</th>
                  <th className="num">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="nowrap">
                      <Link className="row-link" href={`/admin/pedidos/${o.id}`}>
                        #{o.number}
                      </Link>
                      <div className="adm-muted">{new Date(o.created_at).toLocaleDateString("es-ES", { timeZone: "Europe/Madrid" })}</div>
                    </td>
                    <td className="nowrap">
                      {o.delivery_date === today ? <strong>Hoy</strong> : formatDateLong(o.delivery_date)}
                      <div className="adm-muted">{o.delivery_slot}</div>
                    </td>
                    <td>
                      {o.customer_name}
                      <div className="adm-muted">{o.customer_phone}</div>
                    </td>
                    <td>{o.shipping_name}</td>
                    <td>{o.items.reduce((s, i) => s + i.quantity, 0)}</td>
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
          <p className="adm-empty">{term ? "Ningún pedido coincide con la búsqueda." : "No hay pedidos en este estado."}</p>
        )}
      </section>
    </>
  );
}
