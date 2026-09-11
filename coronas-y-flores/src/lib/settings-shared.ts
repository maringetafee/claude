import type { DeliveryRules } from "./delivery";

export type LegalData = {
  razonSocial: string;
  nif: string;
  domicilio: string;
  email: string;
  telefono: string;
  registro: string;
};

export type StoreSettings = {
  /** Email donde la floristería recibe los avisos de pedido nuevo */
  notifyEmail: string;
  delivery: DeliveryRules;
  legal: LegalData;
};

export const DEFAULT_SETTINGS: StoreSettings = {
  notifyEmail: "",
  delivery: {
    minDaysAhead: 0,
    maxDaysAhead: 60,
    closedWeekdays: [0],
    closedDates: [],
    slots: [
      { id: "manana", label: "Mañana · 10:00 – 14:00", sameDayUntil: "11:00" },
      { id: "tarde", label: "Tarde · 16:00 – 20:00", sameDayUntil: "15:00" },
    ],
  },
  legal: {
    razonSocial: "[RAZÓN SOCIAL]",
    nif: "[NIF/CIF]",
    domicilio: "C. Múnich, Pl. de Ondarreta, 6, Local 43, 28923 Alcorcón (Madrid)",
    email: "[EMAIL DE CONTACTO]",
    telefono: "+34 636 55 65 56",
    registro: "",
  },
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? (T[K] extends unknown[] ? T[K] : DeepPartial<T[K]>) : T[K] };

export function mergeSettings(stored: unknown): StoreSettings {
  const s = (stored && typeof stored === "object" ? stored : {}) as DeepPartial<StoreSettings>;
  const delivery = { ...DEFAULT_SETTINGS.delivery, ...(s.delivery ?? {}) } as DeliveryRules;
  if (!Array.isArray(delivery.slots) || !delivery.slots.length) delivery.slots = DEFAULT_SETTINGS.delivery.slots;
  return {
    notifyEmail: typeof s.notifyEmail === "string" ? s.notifyEmail : DEFAULT_SETTINGS.notifyEmail,
    delivery,
    legal: { ...DEFAULT_SETTINGS.legal, ...(s.legal ?? {}) },
  };
}
