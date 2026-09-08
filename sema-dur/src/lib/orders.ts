import type { CartLine } from "./cart";

/**
 * Local record of quote requests the visitor has sent from this browser.
 * Server-side order persistence is out of scope for this phase — it requires the
 * Stripe webhook + a datastore (see README). These records power /cuenta/solicitudes.
 */

export type QuoteRequestStatus =
  | "pendiente"
  | "presupuestado"
  | "pagado"
  | "preparando"
  | "enviado"
  | "completado"
  | "cancelado";

export const statusLabel: Record<QuoteRequestStatus, string> = {
  pendiente: "Pendiente de respuesta",
  presupuestado: "Presupuesto enviado",
  pagado: "Pagado",
  preparando: "En preparación",
  enviado: "Enviado",
  completado: "Completado",
  cancelado: "Cancelado",
};

export type StoredQuoteRequest = {
  reference: string;
  createdAt: string; // ISO
  status: QuoteRequestStatus;
  customer: {
    name: string;
    company?: string;
    email: string;
    phone: string;
    city?: string;
    country?: string;
  };
  lines: Pick<CartLine, "name" | "ref" | "qty" | "variant" | "slug">[];
  notes?: string;
};

const KEY = "semadur.requests.v1";

export function loadRequests(): StoredQuoteRequest[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredQuoteRequest[]) : [];
  } catch {
    return [];
  }
}

export function saveRequest(req: StoredQuoteRequest): void {
  try {
    const all = loadRequests();
    all.unshift(req);
    localStorage.setItem(KEY, JSON.stringify(all.slice(0, 50)));
  } catch {
    /* storage unavailable — the Netlify Forms submission still went through */
  }
}

export function findRequest(reference: string): StoredQuoteRequest | undefined {
  return loadRequests().find((r) => r.reference === reference);
}
