// lib/calendar.ts — Constantes y helpers de calendario compartidos

export const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
]

export const DAY_LABELS = ["L","M","X","J","V","S","D"]

export const TIMES = [
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
]

/** "2024-03-05" */
export function toDateString(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
}

/** Devuelve array de 42 celdas (null = hueco inicial, number = día del mes) */
export function buildCalendarCells(y: number, m: number): (number | null)[] {
  const firstDow    = (new Date(y, m, 1).getDay() + 6) % 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  return cells
}

/** Hoy a medianoche (sin hora) */
export function buildToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/** Antelación mínima (ms) para reservar/encargar. Permite preparación en cocina. */
export const BOOKING_LEAD_MS = 60 * 60 * 1000  // 1 hora

/**
 * ¿Se puede reservar este slot? Devuelve false si la hora ya pasó o
 * está dentro del margen de antelación (BOOKING_LEAD_MS).
 *
 * @param dateStr "YYYY-MM-DD"
 * @param time    "HH:MM"
 * @param now     fecha actual (inyectable para tests)
 */
export function isSlotBookable(dateStr: string, time: string, now: Date = new Date()): boolean {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time)
  if (!dateMatch || !timeMatch) return false

  const [, ys, ms, ds] = dateMatch
  const [, hs, mins]   = timeMatch
  const slotDate = new Date(
    Number(ys), Number(ms) - 1, Number(ds),
    Number(hs), Number(mins), 0, 0,
  )
  return slotDate.getTime() - now.getTime() >= BOOKING_LEAD_MS
}
