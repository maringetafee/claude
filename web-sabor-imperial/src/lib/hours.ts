import { restaurant, type DayHours } from '../content/restaurant'

const TIME_ZONE = 'Europe/Madrid'

function madridNow(): Date {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date())

  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? '0'
  return new Date(
    Number(get('year')),
    Number(get('month')) - 1,
    Number(get('day')),
    Number(get('hour')),
    Number(get('minute')),
    Number(get('second')),
  )
}

/** Monday-first weekday index (0=Mon..6=Sun) matching restaurant.hours order. */
function madridWeekdayIndex(date: Date): number {
  const jsDay = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, weekday: 'short' }).format(date)
  const map: Record<string, number> = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }
  return map[jsDay] ?? 0
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export type OpenStatus = {
  isOpen: boolean
  todayIndex: number
  label: string
}

export function getOpenStatus(): OpenStatus {
  const now = madridNow()
  const todayIndex = madridWeekdayIndex(now)
  const minutesNow = now.getHours() * 60 + now.getMinutes()
  const today = restaurant.hours[todayIndex] as DayHours

  if ('closed' in today) {
    return { isOpen: false, todayIndex, label: 'Cerrado hoy' }
  }

  const open = toMinutes(today.open)
  const close = toMinutes(today.close)
  const isOpen = minutesNow >= open && minutesNow < close

  if (isOpen) {
    return { isOpen: true, todayIndex, label: `Abierto ahora · cierra a las ${today.close}` }
  }

  if (minutesNow < open) {
    return { isOpen: false, todayIndex, label: `Cerrado · abre hoy a las ${today.open}` }
  }

  return { isOpen: false, todayIndex, label: 'Cerrado por hoy' }
}
