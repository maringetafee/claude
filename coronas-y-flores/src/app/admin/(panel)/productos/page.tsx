import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin/auth";
import { formatEUR } from "@/lib/money";
import type { Category } from "@/lib/types";
import { toggleProductFlag } from "./actions";

export const metadata: Metadata = { title: "Productos" };

type Row = {
  id: string;
  slug: string;
  name: string;
  price_cents: number;
  stock: number | null;
  active: boolean;
  featured: boolean;
  category: { name: string } | null;
  images: { url: string; sort_order: number }[];
  variants: { price_cents: number }[];
};

type Props = { searchParams: Promise<{ q?: string; categoria?: string }> };

export default async function ProductsPage({ searchParams }: Props) {
  const { sb } = await requireAdmin();
  const { q = "", categoria = "" } = await searchParams;

  let query = sb
    .from("products")
    .select("id, slug, name, price_cents, stock, active, featured, category:categories(name), images:product_images(url, sort_order), variants:product_variants(price_cents)")
    .order("sort_order")
    .order("created_at", { ascending: false });
  const term = q.trim().replace(/[,()*%]/g, " ").trim();
  if (term) query = query.ilike("name", `%${term}%`);
  if (/^[0-9a-f-]{36}$/i.test(categoria)) query = query.eq("category_id", categoria);

  const [{ data, error }, { data: cats }] = await Promise.all([query, sb.from("categories").select("id, name").order("sort_order")]);
  const products = (data ?? []) as unknown as Row[];
  const categories = (cats ?? []) as Pick<Category, "id" | "name">[];

  return (
    <>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">Productos</h1>
          <p className="adm-sub">{products.length} productos · Pulsa en «Publicado» o «Destacado» para activarlo o desactivarlo al momento.</p>
        </div>
        <Link className="adm-btn adm-btn--primary" href="/admin/productos/nuevo">
          + Nuevo producto
        </Link>
      </div>

      <form className="adm-row" action="/admin/productos" style={{ marginBottom: 16 }}>
        <input className="adm-input" name="q" defaultValue={q} placeholder="Buscar por nombre" style={{ maxWidth: 260 }} />
        <select className="adm-input" name="categoria" defaultValue={categoria} style={{ maxWidth: 240 }}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <button className="adm-btn" type="submit">
          Filtrar
        </button>
      </form>

      <section className="adm-card">
        {error && <div className="adm-alert">No se han podido cargar los productos: {error.message}</div>}
        {products.length ? (
          <div className="adm-table-wrap">
            <table className="adm-table">
              <thead>
                <tr>
                  <th />
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Tienda</th>
                  <th>Portada</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const cover = [...p.images].sort((a, b) => a.sort_order - b.sort_order)[0];
                  const price = p.variants.length ? Math.min(...p.variants.map((v) => v.price_cents)) : p.price_cents;
                  return (
                    <tr key={p.id}>
                      <td style={{ width: 62 }}>{cover ? <img className="adm-thumb" src={cover.url} alt="" /> : <div className="adm-thumb" />}</td>
                      <td>
                        <Link className="row-link" href={`/admin/productos/${p.id}`}>
                          {p.name}
                        </Link>
                        <div className="adm-muted">{p.category?.name ?? "Sin categoría"}</div>
                      </td>
                      <td className="nowrap">
                        {p.variants.length > 1 ? "desde " : ""}
                        {formatEUR(price)}
                      </td>
                      <td>{p.stock == null ? <span className="adm-muted">—</span> : p.stock === 0 ? <span className="adm-badge adm-badge--cancelled">Agotado</span> : p.stock}</td>
                      <td>
                        <form action={toggleProductFlag.bind(null, p.id, "active", !p.active)}>
                          <button type="submit" className={`adm-badge adm-badge--${p.active ? "on" : "off"}`} style={{ border: 0, cursor: "pointer" }} title="Cambiar">
                            {p.active ? "Publicado" : "Oculto"}
                          </button>
                        </form>
                      </td>
                      <td>
                        <form action={toggleProductFlag.bind(null, p.id, "featured", !p.featured)}>
                          <button type="submit" className={`adm-badge adm-badge--${p.featured ? "paid" : "off"}`} style={{ border: 0, cursor: "pointer" }} title="Cambiar">
                            {p.featured ? "★ Destacado" : "☆ No"}
                          </button>
                        </form>
                      </td>
                      <td className="num">
                        <div className="adm-row adm-row--end">
                          <Link className="adm-btn adm-btn--sm" href={`/admin/productos/${p.id}`}>
                            Editar
                          </Link>
                          {p.active && (
                            <a className="adm-btn adm-btn--sm" href={`/producto/${p.slug}`} target="_blank" rel="noopener">
                              Ver ↗
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="adm-empty">
            <p>{term || categoria ? "Ningún producto coincide con el filtro." : "Todavía no hay productos."}</p>
            <Link className="adm-btn adm-btn--primary" href="/admin/productos/nuevo">
              Crear el primero
            </Link>
          </div>
        )}
      </section>
    </>
  );
}
