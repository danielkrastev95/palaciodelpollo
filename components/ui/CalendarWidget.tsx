// components/ui/CalendarWidget.tsx — Calendario de selección de día compartido

import { MONTH_NAMES, DAY_LABELS } from "@/lib/calendar"

const MONTH_LABELS_ES = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
]

interface Props {
  y: number
  m: number
  selectedDay: number | null
  today: Date
  cells: (number | null)[]
  loadingAvail?: boolean
  onPrev: () => void
  onNext: () => void
  onSelect: (d: number) => void
}

export default function CalendarWidget({
  y, m, selectedDay, today, cells, loadingAvail = false,
  onPrev, onNext, onSelect,
}: Props) {
  return (
    <>
      <div className="cal-nav">
        <button className="cal-btn" type="button" onClick={onPrev}>‹</button>
        <div className="cal-month">{MONTH_NAMES[m]} {y}</div>
        <button className="cal-btn" type="button" onClick={onNext}>›</button>
      </div>
      <div className="cal" style={{ opacity: loadingAvail ? 0.6 : 1 }}>
        {DAY_LABELS.map((d) => (
          <div className="cal-day-label" key={d} aria-hidden="true">{d}</div>
        ))}
        {cells.map((d, i) => {
          if (d === null) return <div key={`e${i}`} aria-hidden="true" />
          const thisDate = new Date(y, m, d)
          const isPast   = thisDate < today
          const isActive = selectedDay === d
          const isToday  = thisDate.getTime() === today.getTime()
          const cls = ["cal-day"]
          if (isPast)   cls.push("disabled")
          if (isActive) cls.push("active")
          if (isToday)  cls.push("today")
          const label = `${d} de ${MONTH_LABELS_ES[m]}${isToday ? " (hoy)" : ""}${isPast ? " (pasado)" : ""}`
          return (
            <button
              key={d}
              type="button"
              className={cls.join(" ")}
              disabled={isPast}
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => { if (!isPast) onSelect(d) }}
            >
              {d}
            </button>
          )
        })}
      </div>
    </>
  )
}
