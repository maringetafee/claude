import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/shop/PageHero";
import { getCurrentCustomer } from "@/lib/customer";
import { formatDateLong } from "@/lib/delivery";
import { formatEUR } from "@/lib/money";
import { customerStatusLabel } from "@/lib/order-status";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";
import { signOutCustomer } from "./actions";
import { PasswordForm, ProfileForm } from "./AuthForms";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ bienvenida?: string; clave?: string }> };
type OrderRow = Pick<Order, "id" | "number" | "status" | "created_at" | "delivery_date" | "delivery_slot" | "shipping_kind" | "total_cents">;

export default async function AccountPage({ searchParams }: Props) {
  const [account, sp] = await Promise.all([getCurrentCustomer(), searchParams]);
  if (!account) redirect("/cuenta/entrar");
  const { user, customer } = account;

  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("orders")
    .select("id, number, status, created_at, delivery_date, delivery_slot, shipping_kind, total_cents")
    .eq("user_id", user.id)
    .neq("status", "pending_payment")
    .order("created_at", { ascending: false })
    .limit(50);
  const orders = (data ?? []) as OrderRow[];

  const name = customer?.name || (user.user_metadata?.name as string | undefined) || "";
  const first = name.split(" ")[0];

  return (
    <main id="main">
      <PageHero compact crumbs={[{ href: "/", label: "Inicio" }, { label: "Mi cuenta" }]} title={first ? `Hola, ${first}` : "Mi cuenta"} />
      <section className="shop account">
        <div className="container account__grid">
          <div>
            {sp.bienvenida && (
              <div className="alert alert--info" style={{ marginBottom: 28 }}>
                Cuenta creada. Ya puedes pedir con tus datos guardados.
              </div>
            )}
            {sp.clave && (
              <div className="alert alert--info" style={{ marginBottom: 28 }}>
                Contraseña actualizada.
              </div>
            )}

            <section className="step" aria-labelledby="mis-pedidos">
              <div className="step__head">
                <h2 className="step__title" id="mis-pedidos">
                  Mis pedidos
                </h2>
              </div>
              {orders.length ? (
                <ul className="orders-list">
                  {orders.map((o) => (
                    <li key={o.id}>
                      <Link href={`/cuenta/pedidos/${o.id}`} className="orders-list__row">
                        <span className="orders-list__num">#{o.number}</span>
                        <span className="orders-list__when">
                          {o.shipping_kind === "pickup" ? "Recogida" : "Entrega"} · {formatDateLong(o.delivery_date)}
                          <small>{o.delivery_slot}</small>
                        </span>
                        <span className={`status-pill status-pill--${o.status}`}>{customerStatusLabel(o.status)}</span>
                        <span className="orders-list__total">{formatEUR(o.total_cents)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="empty" style={{ padding: "44px 24px" }}>
                  <h2 style={{ fontSize: "1.8rem" }}>Aún no tienes pedidos</h2>
                  <p>Los pedidos que hagas con la sesión iniciada aparecerán aquí.</p>
                  <Link className="btn btn--solid" href="/tienda">
                    Ir a la tienda
                  </Link>
                </div>
              )}
            </section>

            <section className="step" aria-labelledby="mis-datos">
              <div className="step__head">
                <h2 className="step__title" id="mis-datos">
                  Mis datos
                </h2>
              </div>
              <p className="step__sub">Los rellenamos por ti al finalizar un pedido.</p>
              <ProfileForm
                initial={{
                  name,
                  phone: customer?.phone ?? "",
                  address: customer?.address ?? "",
                  postal_code: customer?.postal_code ?? "",
                  city: customer?.city ?? "",
                }}
              />
            </section>
          </div>

          <aside className="summary account__side">
            <h2 className="summary__title">Tu cuenta</h2>
            <p className="account__email">{user.email}</p>
            <PasswordForm email={user.email ?? ""} />
            <form action={signOutCustomer} className="account__signout">
              <button type="submit" className="link-btn">
                Cerrar sesión
              </button>
            </form>
          </aside>
        </div>
      </section>
    </main>
  );
}
