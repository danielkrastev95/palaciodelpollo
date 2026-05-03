"use client"

import { useReducer, useCallback, useMemo, memo } from "react"
import Link from "next/link"
import { TIMES, toDateString, buildCalendarCells, buildToday } from "@/lib/calendar"
import { nameErr, phoneErr, emailErr } from "@/lib/validators"
import FieldError from "@/components/ui/FieldError"
import CalendarWidget from "@/components/ui/CalendarWidget"

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const TOTAL_TABLES = 20
const LOW_THRESHOLD = 4

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
type SlotState = "available" | "low" | "soldout" | "disabled"

interface State {
  step: 1 | 2
  viewYear: number
  viewMonth: number
  selectedDay: number | null
  selectedTime: string | null
  party: number
  name: string
  phone: string
  email: string
  submitted: boolean
  submitting: boolean
  submitError: boolean
  availability: Record<string, number>
  loadingSlots: boolean
  touched: Record<string, boolean>
}

type Action =
  | { type: "SET_STEP"; step: 1 | 2 }
  | { type: "SET_VIEW_MONTH"; year: number; month: number }
  | { type: "SELECT_DAY"; day: number }
  | { type: "SELECT_TIME"; time: string }
  | { type: "SET_PARTY"; party: number }
  | { type: "SET_FIELD"; field: "name" | "phone" | "email"; value: string }
  | { type: "TOUCH"; field: string }
  | { type: "TOUCH_ALL" }
  | { type: "START_LOADING_SLOTS" }
  | { type: "SET_AVAILABILITY"; counts: Record<string, number> }
  | { type: "START_SUBMIT" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR" }
  | { type: "RESET" }

// ─────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────
function createInitialState(): State {
  const now = new Date()
  return {
    step: 1,
    viewYear: now.getFullYear(),
    viewMonth: now.getMonth(),
    selectedDay: null,
    selectedTime: null,
    party: 2,
    name: "",
    phone: "",
    email: "",
    submitted: false,
    submitting: false,
    submitError: false,
    availability: {},
    loadingSlots: false,
    touched: {},
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step }

    case "SET_VIEW_MONTH":
      return {
        ...state,
        viewYear: action.year,
        viewMonth: action.month,
        selectedDay: null,
        selectedTime: null,
        availability: {},
      }

    case "SELECT_DAY":
      return {
        ...state,
        selectedDay: action.day,
        selectedTime: null,
        loadingSlots: true,
        availability: {},
      }

    case "SELECT_TIME":
      return { ...state, selectedTime: action.time }

    case "SET_PARTY":
      return { ...state, party: action.party }

    case "SET_FIELD":
      return { ...state, [action.field]: action.value }

    case "TOUCH":
      return { ...state, touched: { ...state.touched, [action.field]: true } }

    case "TOUCH_ALL":
      return { ...state, touched: { name: true, phone: true, email: true } }

    case "START_LOADING_SLOTS":
      return { ...state, loadingSlots: true, availability: {} }

    case "SET_AVAILABILITY":
      return { ...state, loadingSlots: false, availability: action.counts }

    case "START_SUBMIT":
      return { ...state, submitting: true, submitError: false }

    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, submitted: true }

    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: true }

    case "RESET":
      return createInitialState()

    default:
      return state
  }
}

// ─────────────────────────────────────────────────────────────
// Sub-components (memoized)
// ─────────────────────────────────────────────────────────────

const SubmitError = memo(function SubmitError() {
  return (
    <div
      style={{
        marginBottom: 20,
        padding: "12px 14px",
        background: "rgba(201,75,31,0.08)",
        border: "1px solid var(--ember)",
        borderRadius: 2,
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--ember)",
      }}
    >
      Error al guardar — llámanos al +34 918 95 32 16
    </div>
  )
})

const StepBar = memo(function StepBar({ step }: { step: 1 | 2 }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 28,
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
      }}
    >
      <StepIndicator num={1} label="Cuándo" active={step === 1} />
      <div
        style={{
          flex: 1,
          height: 1,
          background: step === 2 ? "var(--ember)" : "var(--ink-3)",
          opacity: 0.3,
          margin: "0 12px",
        }}
      />
      <StepIndicator num={2} label="Tus datos" active={step === 2} />
    </div>
  )
})

const StepIndicator = memo(function StepIndicator({
  num,
  label,
  active,
}: {
  num: number
  label: string
  active: boolean
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: active ? "var(--ember)" : "var(--ink-3)",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          border: `1px solid ${active ? "var(--ember)" : "var(--ink-3)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 9,
          background: active ? "var(--ember)" : "transparent",
          color: active ? "var(--cream)" : "var(--ink-3)",
        }}
      >
        {num}
      </span>
      {label}
    </div>
  )
})

const PartySelector = memo(function PartySelector({
  party,
  onSelect,
}: {
  party: number
  onSelect: (n: number) => void
}) {
  return (
    <div className="res-field">
      <label className="res-label" htmlFor="res-party">
        Comensales
      </label>
      <div className="party-row" role="group" aria-labelledby="res-party" id="res-party">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button
            key={n}
            className={`party-btn ${party === n ? "active" : ""}`}
            aria-pressed={party === n}
            aria-label={`${n} ${n === 1 ? "persona" : "personas"}`}
            onClick={() => onSelect(n)}
          >
            {n}
          </button>
        ))}
        <button
          className={`party-btn ${party === 9 ? "active" : ""}`}
          style={{ width: "auto", padding: "0 14px" }}
          aria-pressed={party === 9}
          aria-label="9 o más personas"
          onClick={() => onSelect(9)}
        >
          9+
        </button>
      </div>
    </div>
  )
})

interface TimeSlotProps {
  time: string
  state: SlotState
  remaining: number
  selected: boolean
  onSelect: (time: string) => void
}

const TimeSlot = memo(function TimeSlot({ time, state, remaining, selected, onSelect }: TimeSlotProps) {
  const disabled = state === "disabled" || state === "soldout"
  const slotDesc =
    state === "soldout"
      ? `${time} — completo`
      : state === "low"
        ? `${time} — ${remaining === 1 ? "última mesa" : `${remaining} mesas`}`
        : time

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
      <button
        className={`time-btn ${selected ? "active" : ""} ${disabled ? "disabled" : ""}`}
        style={{ width: "100%" }}
        disabled={disabled}
        aria-label={slotDesc}
        aria-pressed={selected}
        onClick={() => !disabled && onSelect(time)}
      >
        {time}
        {state === "soldout" && " ✕"}
      </button>
      {state === "low" && !selected && (
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--ember)",
          }}
        >
          {remaining === 1 ? "última mesa" : `${remaining} mesas`}
        </span>
      )}
      {state === "soldout" && (
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 8,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--ink-2)",
          }}
        >
          completo
        </span>
      )}
    </div>
  )
})

interface TimeSlotsGridProps {
  selectedDay: number | null
  selectedTime: string | null
  loadingSlots: boolean
  availability: Record<string, number>
  onSelectTime: (time: string) => void
}

const TimeSlotsGrid = memo(function TimeSlotsGrid({
  selectedDay,
  selectedTime,
  loadingSlots,
  availability,
  onSelectTime,
}: TimeSlotsGridProps) {
  const getSlotInfo = useCallback(
    (time: string): { state: SlotState; remaining: number } => {
      if (!selectedDay || loadingSlots) return { state: "disabled", remaining: TOTAL_TABLES }
      const taken = availability[time] ?? 0
      const remaining = Math.max(0, TOTAL_TABLES - taken)
      if (remaining === 0) return { state: "soldout", remaining: 0 }
      if (remaining <= LOW_THRESHOLD) return { state: "low", remaining }
      return { state: "available", remaining }
    },
    [selectedDay, loadingSlots, availability]
  )

  return (
    <div className="res-field">
      <label className="res-label" id="res-time-label">
        Hora
        {loadingSlots && (
          <span style={{ marginLeft: 8, opacity: 0.5 }} aria-live="polite">
            comprobando…
          </span>
        )}
      </label>
      <div
        className="times"
        style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
        role="group"
        aria-labelledby="res-time-label"
      >
        {TIMES.map((t) => {
          const { state, remaining } = getSlotInfo(t)
          return (
            <TimeSlot
              key={t}
              time={t}
              state={state}
              remaining={remaining}
              selected={selectedTime === t}
              onSelect={onSelectTime}
            />
          )
        })}
      </div>
    </div>
  )
})

interface FormFieldProps {
  id: string
  label: string
  type: "text" | "tel" | "email"
  value: string
  error: string
  touched: boolean
  placeholder: string
  className?: string
  autoFocus?: boolean
  onChange: (value: string) => void
  onBlur: () => void
}

const FormField = memo(function FormField({
  id,
  label,
  type,
  value,
  error,
  touched,
  placeholder,
  className = "",
  autoFocus = false,
  onChange,
  onBlur,
}: FormFieldProps) {
  const showError = touched && !!error
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value
      if (type === "tel") val = val.replace(/[^\d+\s\-().]/g, "")
      onChange(val)
    },
    [type, onChange]
  )

  return (
    <div className="res-field">
      <label className="res-label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        className={`res-input ${className}`}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-required="true"
        aria-invalid={showError}
        aria-describedby={showError ? `${id}-err` : undefined}
        style={{ borderColor: showError ? "var(--ember)" : undefined }}
      />
      {showError && <FieldError id={`${id}-err`} msg={error} />}
    </div>
  )
})

interface Step1SummaryProps {
  party: number
  dayName: string
  time: string
  onBack: () => void
}

const Step1Summary = memo(function Step1Summary({ party, dayName, time, onBack }: Step1SummaryProps) {
  return (
    <div
      style={{
        padding: "12px 16px",
        marginBottom: 24,
        background: "rgba(201,75,31,0.07)",
        borderLeft: "3px solid var(--ember)",
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        color: "var(--ink-2)",
        lineHeight: 1.8,
      }}
    >
      <div>
        {party} {party === 1 ? "persona" : "personas"} · {dayName}
      </div>
      <div>{time}h</div>
      <button
        onClick={onBack}
        style={{
          marginTop: 6,
          color: "var(--ember)",
          fontFamily: "var(--font-mono)",
          fontSize: 9,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        ← Cambiar
      </button>
    </div>
  )
})

interface SuccessViewProps {
  name: string
  dayName: string
  time: string
  party: number
  email: string
  onReset: () => void
}

const SuccessView = memo(function SuccessView({ name, dayName, time, party, email, onReset }: SuccessViewProps) {
  return (
    <div className="res-success">
      <div className="check">✓</div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 8 }}>
        Gracias, {name.split(" ")[0]}.
      </h3>
      <p className="serif" style={{ fontSize: 18, color: "var(--ink-2)", marginBottom: 18 }}>
        Te esperamos el {dayName} a las {time} — mesa de {party} {party === 1 ? "persona" : "personas"}.
      </p>
      <p className="mono" style={{ color: "var(--ink-3)", marginBottom: 24 }}>
        CONFIRMAMOS EN {email}
      </p>
      <button className="btn" onClick={onReset}>
        ← Nueva reserva
      </button>
    </div>
  )
})

const SideInfo = memo(function SideInfo() {
  return (
    <div>
      <h2 className="section-title">
        ¿Comes
        <br />
        <em>aquí</em>?
      </h2>
      <p className="res-lede">Reserva tu mesa y te esperamos. Sin prepago, confirmamos en menos de 24h.</p>

      <div
        style={{
          margin: "28px 0 32px",
          padding: "20px 22px",
          border: "1px solid var(--ink-3)",
          borderLeft: "3px solid var(--ember)",
          background: "var(--paper-2)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontStyle: "italic",
            fontSize: 16,
            color: "var(--ink-2)",
            marginBottom: 14,
            lineHeight: 1.4,
          }}
        >
          ¿Prefieres venir a recogerlo?
          <br />
          <span style={{ color: "var(--ink)" }}>Encarga online y lo tenemos listo.</span>
        </p>
        <Link href="/encargar" className="btn ghost" style={{ display: "inline-flex", fontSize: 11 }}>
          Encargar para recoger →
        </Link>
      </div>

      <div className="res-meta">
        <div className="res-meta-row">
          <span>Horario</span>
          <strong>12:00 — 16:00 todos los días</strong>
        </div>
        <div className="res-meta-row">
          <span>Dirección</span>
          <strong>Calle Pozo Chico 30 · Valdemoro</strong>
        </div>
        <div className="res-meta-row">
          <span>Teléfono</span>
          <strong>+34 918 95 32 16</strong>
        </div>
      </div>
    </div>
  )
})

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────
export default function ReservationSection() {
  const [state, dispatch] = useReducer(reducer, null, createInitialState)

  const { viewYear: y, viewMonth: m } = state
  const today = useMemo(() => buildToday(), [])
  const cells = useMemo(() => buildCalendarCells(y, m), [y, m])

  const dayName = useMemo(
    () =>
      state.selectedDay
        ? new Date(y, m, state.selectedDay).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
        : "",
    [y, m, state.selectedDay]
  )

  const errors = useMemo(
    () => ({
      name: nameErr(state.name),
      phone: phoneErr(state.phone),
      email: emailErr(state.email),
    }),
    [state.name, state.phone, state.email]
  )

  const step1Done = Boolean(state.selectedDay && state.selectedTime)
  const canSubmit = Boolean(step1Done && state.party && !errors.name && !errors.phone && !errors.email)

  // ─── Callbacks ───
  const fetchAvailability = useCallback(
    async (day: number) => {
      try {
        const res = await fetch(`/api/availability?date=${toDateString(y, m, day)}`)
        if (res.ok) {
          const json = await res.json()
          dispatch({ type: "SET_AVAILABILITY", counts: json.data?.counts ?? {} })
        } else {
          dispatch({ type: "SET_AVAILABILITY", counts: {} })
        }
      } catch {
        dispatch({ type: "SET_AVAILABILITY", counts: {} })
      }
    },
    [y, m]
  )

  const handleSelectDay = useCallback(
    (day: number) => {
      dispatch({ type: "SELECT_DAY", day })
      fetchAvailability(day)
    },
    [fetchAvailability]
  )

  const handleSelectTime = useCallback((time: string) => {
    dispatch({ type: "SELECT_TIME", time })
  }, [])

  const handleSetParty = useCallback((party: number) => {
    dispatch({ type: "SET_PARTY", party })
  }, [])

  const handlePrevMonth = useCallback(() => {
    dispatch({ type: "SET_VIEW_MONTH", year: m === 0 ? y - 1 : y, month: m === 0 ? 11 : m - 1 })
  }, [y, m])

  const handleNextMonth = useCallback(() => {
    dispatch({ type: "SET_VIEW_MONTH", year: m === 11 ? y + 1 : y, month: m === 11 ? 0 : m + 1 })
  }, [y, m])

  const handleFieldChange = useCallback((field: "name" | "phone" | "email", value: string) => {
    dispatch({ type: "SET_FIELD", field, value })
  }, [])

  const handleTouch = useCallback((field: string) => {
    dispatch({ type: "TOUCH", field })
  }, [])

  const handleGoToStep2 = useCallback(() => {
    dispatch({ type: "SET_STEP", step: 2 })
  }, [])

  const handleBackToStep1 = useCallback(() => {
    dispatch({ type: "SET_STEP", step: 1 })
  }, [])

  const handleReset = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  const handleSubmit = useCallback(async () => {
    dispatch({ type: "TOUCH_ALL" })
    if (!canSubmit || state.submitting) return

    dispatch({ type: "START_SUBMIT" })
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: state.name.trim(),
          email: state.email.trim(),
          phone: state.phone.trim(),
          date: toDateString(y, m, state.selectedDay!),
          time: state.selectedTime!,
          guests: state.party,
          notes: null,
        }),
      })
      if (!res.ok) throw new Error("Error del servidor")
      dispatch({ type: "SUBMIT_SUCCESS" })
    } catch (err) {
      console.error("[ReservationSection] Error al guardar:", err)
      dispatch({ type: "SUBMIT_ERROR" })
    }
  }, [canSubmit, state.submitting, state.name, state.email, state.phone, state.selectedDay, state.selectedTime, state.party, y, m])

  // ─── Render ───
  return (
    <section className="reservation" id="reservar">
      <div className="container">
        <div className="chapter">
          <span className="chapter-num">Cap. III</span>
          <span className="chapter-label">Reservas de Mesa</span>
          <span className="chapter-line" />
        </div>

        <div className="res-grid">
          <SideInfo />

          <div className="res-card">
            {state.submitted ? (
              <SuccessView
                name={state.name}
                dayName={dayName}
                time={state.selectedTime!}
                party={state.party}
                email={state.email}
                onReset={handleReset}
              />
            ) : (
              <div style={{ padding: 40 }}>
                <h3 className="res-card-title" style={{ marginBottom: 4 }}>
                  Reservar mesa
                </h3>
                <p className="res-card-sub" style={{ marginBottom: 24 }}>
                  Sin prepago · Confirmamos en menos de 24h
                </p>

                <StepBar step={state.step} />

                {state.step === 1 ? (
                  <>
                    <PartySelector party={state.party} onSelect={handleSetParty} />

                    <div className="res-field">
                      <label className="res-label" id="res-cal-label">
                        Día
                      </label>
                      <div role="group" aria-labelledby="res-cal-label">
                        <CalendarWidget
                          y={y}
                          m={m}
                          selectedDay={state.selectedDay}
                          today={today}
                          cells={cells}
                          loadingAvail={state.loadingSlots}
                          onPrev={handlePrevMonth}
                          onNext={handleNextMonth}
                          onSelect={handleSelectDay}
                        />
                      </div>
                    </div>

                    <TimeSlotsGrid
                      selectedDay={state.selectedDay}
                      selectedTime={state.selectedTime}
                      loadingSlots={state.loadingSlots}
                      availability={state.availability}
                      onSelectTime={handleSelectTime}
                    />

                    <button
                      className="btn ember"
                      style={{
                        width: "100%",
                        marginTop: 8,
                        justifyContent: "center",
                        padding: "14px",
                        opacity: step1Done ? 1 : 0.4,
                      }}
                      disabled={!step1Done}
                      onClick={handleGoToStep2}
                    >
                      Siguiente → Tus datos
                    </button>
                  </>
                ) : (
                  <>
                    <Step1Summary
                      party={state.party}
                      dayName={dayName}
                      time={state.selectedTime!}
                      onBack={handleBackToStep1}
                    />

                    {state.submitError && <SubmitError />}

                    <FormField
                      id="res-name"
                      label="Tu nombre"
                      type="text"
                      value={state.name}
                      error={errors.name}
                      touched={!!state.touched.name}
                      placeholder="Nombre y apellido"
                      className="italic"
                      autoFocus
                      onChange={(v) => handleFieldChange("name", v)}
                      onBlur={() => handleTouch("name")}
                    />

                    <FormField
                      id="res-phone"
                      label="Teléfono"
                      type="tel"
                      value={state.phone}
                      error={errors.phone}
                      touched={!!state.touched.phone}
                      placeholder="600 00 00 00"
                      className="mono"
                      onChange={(v) => handleFieldChange("phone", v)}
                      onBlur={() => handleTouch("phone")}
                    />

                    <FormField
                      id="res-email"
                      label="Email"
                      type="email"
                      value={state.email}
                      error={errors.email}
                      touched={!!state.touched.email}
                      placeholder="tu@email.com"
                      onChange={(v) => handleFieldChange("email", v)}
                      onBlur={() => handleTouch("email")}
                    />

                    <div aria-live="polite" aria-atomic="true" className="sr-only">
                      {state.submitting ? "Guardando reserva…" : ""}
                    </div>

                    <button
                      className="btn ember"
                      style={{
                        width: "100%",
                        marginTop: 24,
                        justifyContent: "center",
                        padding: "16px",
                        opacity: !canSubmit || state.submitting ? 0.5 : 1,
                      }}
                      onClick={handleSubmit}
                      disabled={!canSubmit || state.submitting}
                      aria-busy={state.submitting}
                    >
                      {state.submitting ? "Guardando…" : "Confirmar reserva →"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
