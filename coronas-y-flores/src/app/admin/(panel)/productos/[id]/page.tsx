import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { normalizeProduct, PRODUCT_SELECT } from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";
import { ProductEditor } from "./ProductEditor";

export const metadata: Metadata = { title: "Producto" };

type Props = { params: Promise<{ id: string }> };

export default async function ProductEditPage({ params }: Props) {
  const { id } = await params;
  const { sb } = await requireAdmin();
  const isNew = id === "nuevo";
  if (!isNew && !/^[0-9a-f-]{36}$/i.test(id)) notFound();

  const [productRes, catsRes] = await Promise.all([
    isNew ? Promise.resolve({ data: null }) : sb.from("products").select(PRODUCT_SELECT).eq("id", id).maybeSingle(),
    sb.from("categories").select("*").order("sort_order"),
  ]);
  if (!isNew && !productRes.data) notFound();
  const product = productRes.data ? normalizeProduct(productRes.data as Parameters<typeof normalizeProduct>[0]) : null;

  return (
    <>
      <Link className="adm-back" href="/admin/productos">
        ← Productos
      </Link>
      <div className="adm-head">
        <div>
          <h1 className="adm-title">{product ? product.name : "Nuevo producto"}</h1>
          {product && <p className="adm-sub">/producto/{product.slug}</p>}
        </div>
      </div>
      <ProductEditor key={product?.updated_at ?? "nuevo"} product={product as Product | null} categories={(catsRes.data ?? []) as Category[]} />
    </>
  );
}
