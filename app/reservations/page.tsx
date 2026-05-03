"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Clock, Users, Phone, Mail, User, CheckCircle, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

const reservationSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Por favor introduce un email valido"),
  phone: z.string().regex(
    /^(\+34)?[6-9]\d{8}$/,
    "Introduce un telefono valido (ej: 612 345 678)"
  ),
  date: z.string().min(1, "Por favor selecciona una fecha"),
  time: z.string().min(1, "Por favor selecciona una hora"),
  guests: z.string()
    .refine((v) => !isNaN(parseInt(v)) && parseInt(v) >= 1, "Minimo 1 persona")
    .refine((v) => parseInt(v) <= 20, "Para grupos de mas de 20, llamanos directamente"),
  notes: z.string().optional(),
})

type ReservationForm = z.infer<typeof reservationSchema>

const timeSlots = [
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00",
]

function Ornament({ wide = false }: { wide?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div
        className={`h-px bg-gradient-to-r from-transparent to-[#B8940E]/40 ${
          wide ? "w-16 md:w-24" : "w-8 md:w-14"
        }`}
      />
      <div
        className="w-1.5 h-1.5 bg-[#B8940E]/50 shrink-0"
        style={{ transform: "rotate(45deg)" }}
      />
      {wide && (
        <>
          <div className="h-px w-6 bg-[#B8940E]/30" />
          <div
            className="w-1.5 h-1.5 bg-[#B8940E]/50 shrink-0"
            style={{ transform: "rotate(45deg)" }}
          />
        </>
      )}
      <div
        className={`h-px bg-gradient-to-l from-transparent to-[#B8940E]/40 ${
          wide ? "w-16 md:w-24" : "w-8 md:w-14"
        }`}
      />
    </div>
  )
}

export default function ReservationsPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorDetail, setErrorDetail] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReservationForm>({
    resolver: zodResolver(reservationSchema),
  })

  const onSubmit = async (data: ReservationForm) => {
    setSubmitStatus("loading")

    try {
      if (!supabase) {
        await new Promise(resolve => setTimeout(resolve, 800))
        setSubmitStatus("success")
        reset()
        return
      }
      const { error } = await supabase.from("reservations").insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: parseInt(data.guests),
        notes: data.notes || null,
        status: "pending",
      })

      if (error) throw error

      setSubmitStatus("success")
      reset()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : JSON.stringify(err)
      console.error("Error al guardar la reserva:", msg)
      setSubmitStatus("error")
      setErrorDetail(msg)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 60)
  const minDate = tomorrow.toISOString().split("T")[0]
  const maxDateStr = maxDate.toISOString().split("T")[0]

  const inputStyles = `w-full bg-[#1C0E06] rounded-sm px-4 py-3 text-[#F2E8D0] text-sm placeholder-[#C4906A]/30 font-headline italic focus:outline-none transition-colors duration-200`
  const inputBorder = { border: "1px solid rgba(184, 148, 14, 0.12)", outline: "1px solid rgba(184, 148, 14, 0.05)", outlineOffset: "2px" }

  return (
    <div className="min-h-screen wood-panel">
      {/* Cabecera */}
      <section
        className="relative pt-32 md:pt-36 pb-16 md:pb-20 px-4 overflow-hidden"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(18, 10, 4, 0.97) 0%,
              rgba(28, 14, 6, 0.6) 50%,
              rgba(18, 10, 4, 0.97) 100%
            ),
            repeating-linear-gradient(
              96deg,
              transparent,
              transparent 4px,
              rgba(90, 50, 15, 0.06) 4px,
              rgba(90, 50, 15, 0.06) 5px
            ),
            #120A04
          `,
        }}
      >
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #120A04)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <span className="retro-label">Asegura tu sitio</span>
          </div>

          <h1 className="font-headline italic font-bold text-5xl md:text-7xl lg:text-8xl text-[#F2E8D0] mb-6 text-glow tracking-wide">
            Reservar Mesa
          </h1>

          <Ornament wide />

          <p className="mt-6 text-[#C4906A]/55 max-w-lg mx-auto text-sm md:text-base font-headline italic leading-relaxed">
            Completa el formulario y te confirmaremos la reserva por email
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10 pb-24">

        {/* Mensaje de exito */}
        {submitStatus === "success" && (
          <div
            className="mb-8 parchment-card rounded-sm p-6 flex items-start gap-4"
            style={{
              border: "1px solid rgba(34, 197, 94, 0.3)",
              outline: "1px solid rgba(34, 197, 94, 0.1)",
              outlineOffset: "3px",
            }}
          >
            <div
              className="w-12 h-12 shrink-0 rounded-sm flex items-center justify-center"
              style={{
                border: "1px solid rgba(34, 197, 94, 0.4)",
                background: "rgba(34, 197, 94, 0.1)",
              }}
            >
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="text-green-400 font-headline italic font-bold text-lg">Reserva recibida!</h3>
              <p className="text-[#E8D5B0]/70 mt-1 text-sm leading-relaxed">
                Hemos recibido tu reserva. Nos pondremos en contacto contigo por telefono o email
                para confirmarla en menos de 24h. Si tienes prisa, llamanos al +34 91 123 45 67.
              </p>
            </div>
          </div>
        )}

        {/* Mensaje de error */}
        {submitStatus === "error" && (
          <div
            className="mb-8 parchment-card rounded-sm p-6 flex items-start gap-4"
            style={{
              border: "1px solid rgba(239, 68, 68, 0.3)",
              outline: "1px solid rgba(239, 68, 68, 0.1)",
              outlineOffset: "3px",
            }}
          >
            <div
              className="w-12 h-12 shrink-0 rounded-sm flex items-center justify-center"
              style={{
                border: "1px solid rgba(239, 68, 68, 0.4)",
                background: "rgba(239, 68, 68, 0.1)",
              }}
            >
              <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-red-400 font-headline italic font-bold text-lg">Ha habido un problema</h3>
              <p className="text-[#E8D5B0]/70 mt-1 text-sm leading-relaxed">
                No hemos podido procesar tu reserva. Por favor llamanos directamente al{" "}
                <a href="tel:+34911234567" className="text-[#C8820A] underline">+34 91 123 45 67</a>.
              </p>
              {errorDetail && (
                <p className="mt-2 text-xs text-red-300 font-mono bg-red-950/50 px-3 py-2 rounded-sm">
                  Error: {errorDetail}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Formulario */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="parchment-card rounded-sm p-6 md:p-8 ambient-shadow"
          style={{
            outline: "1px solid rgba(184, 148, 14, 0.06)",
            outlineOffset: "4px",
          }}
        >
          <div className="text-center mb-8">
            <Ornament />
            <h2 className="font-headline italic font-bold text-xl text-[#F2E8D0] mt-4 mb-4">
              Datos de la reserva
            </h2>
            <Ornament />
          </div>

          <div className="space-y-5">
            {/* Fila: Nombre y Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">
                  <User className="w-3.5 h-3.5 text-[#C8820A]" />
                  Nombre completo *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Juan Garcia"
                  className={inputStyles}
                  style={{
                    ...inputBorder,
                    borderColor: errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">
                  <Mail className="w-3.5 h-3.5 text-[#C8820A]" />
                  Email *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="juan@ejemplo.com"
                  className={inputStyles}
                  style={{
                    ...inputBorder,
                    borderColor: errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Campo Telefono */}
            <div>
              <label className="flex items-center gap-2 text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#C8820A]" />
                Telefono *
              </label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="+34 600 000 000"
                className={inputStyles}
                style={{
                  ...inputBorder,
                  borderColor: errors.phone ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = errors.phone ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-400">{errors.phone.message}</p>
              )}
            </div>

            {/* Separador */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-[#B8940E]/10" />
              <div className="w-1 h-1 bg-[#B8940E]/20" style={{ transform: "rotate(45deg)" }} />
              <div className="flex-1 h-px bg-[#B8940E]/10" />
            </div>

            {/* Fila: Fecha, Hora y Personas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-[#C8820A]" />
                  Fecha *
                </label>
                <input
                  {...register("date")}
                  type="date"
                  min={minDate}
                  max={maxDateStr}
                  className={inputStyles}
                  style={{
                    ...inputBorder,
                    colorScheme: "dark",
                    borderColor: errors.date ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.date ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                />
                {errors.date && (
                  <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#C8820A]" />
                  Hora *
                </label>
                <select
                  {...register("time")}
                  className={inputStyles}
                  style={{
                    ...inputBorder,
                    borderColor: errors.time ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.time ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                >
                  <option value="">Elige hora</option>
                  <optgroup label="Comida">
                    {timeSlots.filter(t => t < "17:00").map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Cena">
                    {timeSlots.filter(t => t >= "17:00").map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </optgroup>
                </select>
                {errors.time && (
                  <p className="mt-1 text-xs text-red-400">{errors.time.message}</p>
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">
                  <Users className="w-3.5 h-3.5 text-[#C8820A]" />
                  Personas *
                </label>
                <input
                  {...register("guests")}
                  type="number"
                  min={1}
                  max={20}
                  placeholder="2"
                  className={inputStyles}
                  style={{
                    ...inputBorder,
                    borderColor: errors.guests ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = errors.guests ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                />
                {errors.guests && (
                  <p className="mt-1 text-xs text-red-400">{errors.guests.message}</p>
                )}
              </div>
            </div>

            {/* Campo Notas */}
            <div>
              <label className="block text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">
                Peticiones especiales (opcional)
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                placeholder="Alergias, silla de bebe, mesa junto a la ventana, celebracion especial..."
                className={`${inputStyles} resize-none`}
                style={inputBorder}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(184, 148, 14, 0.12)" }}
              />
            </div>

            {/* Aviso de politica */}
            <p className="text-xs text-[#C4906A]/40 italic">
              * Campos obligatorios. La reserva se confirmara por email. Si no recibes confirmacion en 24h, llamanos.
            </p>

            {/* Separador antes de boton */}
            <div className="flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-[#B8940E]/10" />
              <div className="w-1 h-1 bg-[#B8940E]/20" style={{ transform: "rotate(45deg)" }} />
              <div className="flex-1 h-px bg-[#B8940E]/10" />
            </div>

            {/* Botones de envio */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitStatus === "loading" || submitStatus === "success"}
                className="flex-1 vintage-border-btn bg-[#6B3F06]/75 hover:bg-[#6B3F06] disabled:opacity-50 disabled:cursor-not-allowed text-[#F2E8D0] py-4 rounded-sm font-bold text-[0.8rem] tracking-[0.2em] uppercase transition-all duration-200 hover:shadow-xl hover:shadow-[#6B3F06]/30 font-headline"
              >
                {submitStatus === "loading" ? "Enviando..." :
                 submitStatus === "success" ? "Enviada" :
                 "Confirmar reserva"}
              </button>
              {submitStatus === "success" && (
                <button
                  type="button"
                  onClick={() => setSubmitStatus("idle")}
                  className="px-6 py-4 rounded-sm font-bold transition-all text-sm font-headline text-[#C4906A] hover:text-[#F2E8D0]"
                  style={{
                    border: "1px solid rgba(196, 144, 106, 0.25)",
                    outline: "1px solid rgba(196, 144, 106, 0.08)",
                    outlineOffset: "2px",
                  }}
                >
                  Otra reserva
                </button>
              )}
            </div>
          </div>
        </form>

        {/* Info adicional */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="parchment-card rounded-sm p-5 text-center"
            style={{
              outline: "1px solid rgba(184, 148, 14, 0.06)",
              outlineOffset: "3px",
            }}
          >
            <p className="text-[#C8820A] font-headline italic font-bold">Tienes dudas?</p>
            <p className="text-[#C4906A]/50 text-sm mt-1">Llamanos al</p>
            <a href="tel:+34911234567" className="text-[#F2E8D0] font-headline italic font-semibold hover:text-[#C8820A] transition-colors">
              +34 91 123 45 67
            </a>
          </div>
          <div
            className="parchment-card rounded-sm p-5 text-center"
            style={{
              outline: "1px solid rgba(184, 148, 14, 0.06)",
              outlineOffset: "3px",
            }}
          >
            <p className="text-[#C8820A] font-headline italic font-bold">Grupos grandes</p>
            <p className="text-[#C4906A]/50 text-sm mt-1">Para mas de 20 personas,</p>
            <p className="text-[#F2E8D0] font-headline italic font-semibold">contacta directamente</p>
          </div>
        </div>

        {/* Ornamento final */}
        <div className="mt-12">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#B8940E]/25" />
            <div className="w-1 h-1 bg-[#B8940E]/30 shrink-0" style={{ transform: "rotate(45deg)" }} />
            <div className="h-px w-4 bg-[#B8940E]/15" />
            <div className="w-1.5 h-1.5 bg-[#B8940E]/40 shrink-0" style={{ transform: "rotate(45deg)" }} />
            <div className="h-px w-4 bg-[#B8940E]/15" />
            <div className="w-1 h-1 bg-[#B8940E]/30 shrink-0" style={{ transform: "rotate(45deg)" }} />
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#B8940E]/25" />
          </div>
        </div>
      </div>
    </div>
  )
}
