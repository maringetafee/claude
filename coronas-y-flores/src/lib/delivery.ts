// Reglas de fecha/franja de entrega. Funciones puras: se usan igual en el
// checkout (navegador) y en la validación del servidor, siempre en hora de Madrid.

export type DeliverySlot = {
  id: string;
  label: string;
  /** Hora límite "HH:MM" para pedir esta franja el mismo día. null = nunca en el día. */
  sameDayUntil: string | null;
};

export type DeliveryRules = {
  minDaysAhead: number;
  maxDaysAhead: number;
  /** 0 = domingo … 6 = sábado */
  closedWeekdays: number[];
  /** Festivos/cierres "YYYY-MM-DD" */
  closedDates: string[];
  slots: DeliverySlot[];
};

export const TIME_ZONE = "Europe/Madrid";

export type MadridNow = { date: string; minutes: number };

export function madridNow(at: Date = new Date()): MadridNow {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function toUTC(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(dateStr: string, days: number): string {
  const dt = toUTC(dateStr);
  dt.setUTCDate(dt.getUTCDate() + days);
  return dt.toISOString().slice(0, 10);
}

export function diffDays(from: string, to: string): number {
  return Math.round((toUTC(to).getTime() - toUTC(from).getTime()) / 86_400_000);
}

export function weekdayOf(dateStr: string): number {
  return toUTC(dateStr).getUTCDay();
}

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
}

export function isValidDateString(s: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(toUTC(s).getTime()) && toUTC(s).toISOString().startsWith(s);
}

export function isClosedDay(rules: DeliveryRules, dateStr: string): boolean {
  return rules.closedWeekdays.includes(weekdayOf(dateStr)) || rules.closedDates.includes(dateStr);
}

/** Franjas disponibles para una fecha concreta (vacío = no se puede entregar ese día). */
export function slotsForDate(rules: DeliveryRules, dateStr: string, now: MadridNow = madridNow()): DeliverySlot[] {
  if (!isValidDateString(dateStr)) return [];
  const offset = diffDays(now.date, dateStr);
  if (offset < 0 || offset < rules.minDaysAhead || offset > rules.maxDaysAhead) return [];
  if (isClosedDay(rules, dateStr)) return [];
  if (offset === 0) {
    return rules.slots.filter((s) => s.sameDayUntil && now.minutes < toMinutes(s.sameDayUntil));
  }
  return rules.slots;
}

/** Próximas fechas con al menos una franja libre. */
export function upcomingDates(rules: DeliveryRules, count: number, now: MadridNow = madridNow()): string[] {
  const out: string[] = [];
  for (let i = 0; i <= rules.maxDaysAhead && out.length < count; i++) {
    const d = addDays(now.date, i);
    if (slotsForDate(rules, d, now).length) out.push(d);
  }
  return out;
}

const longFmt = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const weekdayFmt = new Intl.DateTimeFormat("es-ES", { weekday: "short", timeZone: "UTC" });
const monthFmt = new Intl.DateTimeFormat("es-ES", { month: "short", timeZone: "UTC" });

/** "sábado, 13 de septiembre" */
export function formatDateLong(dateStr: string): string {
  return longFmt.format(toUTC(dateStr));
}

export function dateChipParts(dateStr: string, now: MadridNow = madridNow()) {
  const offset = diffDays(now.date, dateStr);
  const dt = toUTC(dateStr);
  const top = offset === 0 ? "Hoy" : offset === 1 ? "Mañana" : weekdayFmt.format(dt).replace(".", "");
  return { top, day: dt.getUTCDate(), month: monthFmt.format(dt).replace(".", "") };
}
