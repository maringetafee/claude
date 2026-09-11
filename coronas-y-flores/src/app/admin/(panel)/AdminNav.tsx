"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "../actions";

const ITEMS = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/pedidos", label: "Pedidos" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/envios", label: "Envíos y entregas" },
  { href: "/admin/contenido", label: "Contenido de la web" },
  { href: "/admin/ajustes", label: "Ajustes" },
];

export function AdminNav({ newOrders }: { newOrders: number }) {
  const pathname = usePathname();
  return (
    <nav className="adm-nav" aria-label="Panel">
      {ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} className={active ? "is-active" : undefined} aria-current={active ? "page" : undefined}>
            {item.label}
            {item.href === "/admin/pedidos" && newOrders > 0 && <span className="count">{newOrders}</span>}
          </Link>
        );
      })}
      <hr />
      <a href="/" target="_blank" rel="noopener">
        Ver la web ↗
      </a>
      <form action={signOut}>
        <button type="submit">Cerrar sesión</button>
      </form>
    </nav>
  );
}
