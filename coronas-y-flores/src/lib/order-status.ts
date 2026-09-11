import type { OrderStatus } from "./types";

export const ORDER_STATUSES: { value: OrderStatus; label: string; customerLabel: string }[] = [
  { value: "pending_payment", label: "Pendiente de pago", customerLabel: "pendiente de pago" },
  { value: "paid", label: "Nuevo · pagado", customerLabel: "confirmado" },
  { value: "preparing", label: "En preparación", customerLabel: "en preparación" },
  { value: "ready", label: "Listo para recoger", customerLabel: "listo para recoger" },
  { value: "shipped", label: "En reparto", customerLabel: "en reparto" },
  { value: "delivered", label: "Entregado", customerLabel: "entregado" },
  { value: "cancelled", label: "Cancelado", customerLabel: "cancelado" },
];

export function statusLabel(s: OrderStatus): string {
  return ORDER_STATUSES.find((x) => x.value === s)?.label ?? s;
}

/** Estados en los que tiene sentido avisar al cliente por email */
export const NOTIFIABLE_STATUSES: OrderStatus[] = ["preparing", "ready", "shipped", "delivered", "cancelled"];
