export function formatPrice(value: number, suffix = ""): string {
  const formatted = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted}${suffix}`;
}

export function formatArea(value: number): string {
  return `${value} m²`;
}
