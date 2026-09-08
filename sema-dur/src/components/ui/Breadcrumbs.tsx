import Link from "next/link";
import Icon from "./Icon";

export default function Breadcrumbs({
  items,
  className = "",
}: {
  items: { name: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Ruta de navegación" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-[var(--color-ink-muted)]">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-[var(--color-brand)]"
                >
                  {item.name}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className={last ? "text-[var(--color-ink-soft)]" : undefined}>
                  {item.name}
                </span>
              )}
              {!last ? (
                <Icon name="chevron-right" size={13} className="text-[var(--color-line-strong)]" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
