import type { Availability } from "@/data/products";
import { availabilityLabel } from "@/data/products";
import Icon from "./Icon";
import type { IconName } from "./Icon";

const styles: Record<Availability, { cls: string; icon: IconName }> = {
  consultar: {
    cls: "bg-[var(--color-brand-tint)] text-[var(--color-brand-strong)]",
    icon: "clock",
  },
  "a-medida": {
    cls: "bg-[var(--cyan-100)] text-[var(--color-accent-strong)]",
    icon: "wrench",
  },
  "bajo-pedido": {
    cls: "bg-[var(--steel-200)] text-[var(--color-ink-soft)]",
    icon: "file",
  },
};

export default function AvailabilityBadge({
  availability,
  className = "",
}: {
  availability: Availability;
  className?: string;
}) {
  const s = styles[availability];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] px-2 py-1 text-[0.72rem] font-semibold uppercase tracking-wide ${s.cls} ${className}`}
    >
      <Icon name={s.icon} size={13} />
      {availabilityLabel[availability]}
    </span>
  );
}
