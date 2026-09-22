import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { formatEUR } from "@/lib/money";
import type { Customer } from "@/lib/types";

export const metadata: Metadata = { title: "Clientes" };

type Props = { searchParams: Promise<{ q?: string }> };

const dateFmt = new Intl.DateTimeFormat("es-ES", { dateStyle: "medium", timeZone: "Europe/Madrid" });
const PAID = ["paid", "preparing", "ready", "shipped", "delivered"];

export default async function CustomersPage({ searchParams }: Props) {
  const { sb } = await requireAdmin();
  const { q = "" } = await searchParams;

  let query = sb.from("customers").select("*").order("created_at", { ascending: false }).limit(300);
  const term = q.trim().replace(/[,()*%]/g, " ").trim();
  if (term) query = query.or(`name.ilike.*${term}*,email.ilike.*${term}*,phone.ilike.*${term}*`);
  const { data, error } = await query;
  const customers = (data ?? []) as Customer[];

  // Pedidos pagados de estos clientes, para el nº de pedidos y el total gastado
  const ids = customers.map((c) => c.id);
  const { data: orderRows } = ids.length
    ? await sb.from("orders").select("user_id, total_cents").in("user_id", ids).in("status", PAID)
    : { data: [] as { user_id: string; total_cents: number }[] };
  const stats = new Map<string, { count: number; total: number }>();
  for (const o of (orderRows ?? []) as { user_id: string; total_cents: number }[]) {
    const s = stats.get(o.user_id) ?? { count: 0, total: 0 };
    s.count += 1;
    s.total += o.total_cents;
    stats.set(o.user_id, s);
  }

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Clientes</h1>
          <p className="adm-sub">Personas que se han creado una cuenta en la tienda. Quien compra sin registrarse aparece solo en Pedidos.</p>
        </div>
        <form className="adm-row" action="/admin/clientes">
          <input className="adm-input" name="q" defaultValue={q} placeholder="Nombre, email o teléfono" style={{ width: 230 }} />
          <button className="adm-btn" type="submit">
            Buscar
          </button>
        </form>
      </div>

      <section className="adm-card">
        {error && <div className="adm-alert">No se han podido cargar los clientes: {error.message}</div>}
        {customers.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Contacto</th>
                  <th>Localidad</th>
                  <th>Alta</th>
                  <th className="num">Pedidos</th>
                  <th className="num">Gastado</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => {
                  const s = stats.get(c.id);
                  return (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.name || "—"}</strong>
                      </td>
                      <td>
                        <a className="adm-link" href={`mailto:${c.email}`}>
                          {c.email}
                        </a>
                        {c.phone && <div className="adm-muted">{c.phone}</div>}
                      </td>
                      <td>{[c.postal_code, c.city].filter(Boolean).join(" ") || <span className="adm-muted">—</span>}</td>
                      <td className="nowrap">{dateFmt.format(new Date(c.created_at))}</td>
                      <td className="num">
                        {s?.count ? (
                          <Link className="row-link" href={`/admin/pedidos?estado=todos&q=${encodeURIComponent(c.email)}`}>
                            {s.count}
                          </Link>
                        ) : (
                          <span className="adm-muted">0</span>
                        )}
                      </td>
                      <td className="num">{s ? formatEUR(s.total) : <span className="adm-muted">—</span>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="adm-empty">{term ? "No hay clientes que coincidan con la búsqueda." : "Todavía no se ha registrado ningún cliente."}</p>
        )}
      </section>
    </>
  );
}
