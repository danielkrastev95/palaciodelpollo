"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"

const contactSchema = z.object({
  name: z.string().min(2, "Nombre demasiado corto"),
  email: z.string().email("Email no valido"),
  subject: z.string().min(5, "El asunto debe tener al menos 5 caracteres"),
  message: z.string().min(20, "El mensaje debe tener al menos 20 caracteres"),
})

type ContactForm = z.infer<typeof contactSchema>

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

export default function ContactPage() {
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setSubmitStatus("loading")
    try {
      if (!supabase) {
        await new Promise(resolve => setTimeout(resolve, 500))
        setSubmitStatus("success")
        reset()
        return
      }
      const { error } = await supabase.from("contact_messages").insert({
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        read: false,
      })
      if (error) throw error
      setSubmitStatus("success")
      reset()
    } catch {
      setSubmitStatus("error")
    }
  }

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
            <span className="retro-label">Estamos aqui para ti</span>
          </div>

          <h1 className="font-headline italic font-bold text-5xl md:text-7xl lg:text-8xl text-[#F2E8D0] mb-6 text-glow tracking-wide">
            Contacto
          </h1>

          <Ornament wide />

          <p className="mt-6 text-[#C4906A]/55 max-w-lg mx-auto text-sm md:text-base font-headline italic leading-relaxed">
            Tienes preguntas? Escribenos o visitanos directamente
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Columna izquierda: Informacion de contacto + mapa */}
          <div className="space-y-6">
            {/* Datos de contacto */}
            <div
              className="parchment-card rounded-sm p-6 md:p-8 ambient-shadow"
              style={{
                outline: "1px solid rgba(184, 148, 14, 0.06)",
                outlineOffset: "4px",
              }}
            >
              <div className="text-center mb-6">
                <Ornament />
                <h2 className="font-headline italic font-bold text-xl text-[#F2E8D0] mt-4 mb-4">
                  Informacion de contacto
                </h2>
                <Ornament />
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0 rounded-sm"
                    style={{
                      border: "1px solid rgba(200, 130, 10, 0.30)",
                      outline: "1px solid rgba(200, 130, 10, 0.10)",
                      outlineOffset: "3px",
                      background: "rgba(107, 63, 6, 0.15)",
                    }}
                  >
                    <MapPin className="w-5 h-5 text-[#C8820A]" />
                  </div>
                  <div>
                    <p className="text-[#F2E8D0] font-headline italic font-semibold">Direccion</p>
                    <p className="text-[#C4906A]/55 text-sm mt-1 leading-relaxed">
                      Calle del Pollo Dorado, 12<br />
                      Madrid, 28001, Espana
                    </p>
                  </div>
                </div>

                <div className="h-px w-full bg-[#B8940E]/10" />

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0 rounded-sm"
                    style={{
                      border: "1px solid rgba(200, 130, 10, 0.30)",
                      outline: "1px solid rgba(200, 130, 10, 0.10)",
                      outlineOffset: "3px",
                      background: "rgba(107, 63, 6, 0.15)",
                    }}
                  >
                    <Phone className="w-5 h-5 text-[#C8820A]" />
                  </div>
                  <div>
                    <p className="text-[#F2E8D0] font-headline italic font-semibold">Telefono</p>
                    <a href="tel:+34911234567" className="text-[#C4906A]/55 text-sm hover:text-[#C8820A] transition-colors mt-1 block">
                      +34 91 123 45 67
                    </a>
                  </div>
                </div>

                <div className="h-px w-full bg-[#B8940E]/10" />

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0 rounded-sm"
                    style={{
                      border: "1px solid rgba(200, 130, 10, 0.30)",
                      outline: "1px solid rgba(200, 130, 10, 0.10)",
                      outlineOffset: "3px",
                      background: "rgba(107, 63, 6, 0.15)",
                    }}
                  >
                    <Mail className="w-5 h-5 text-[#C8820A]" />
                  </div>
                  <div>
                    <p className="text-[#F2E8D0] font-headline italic font-semibold">Email</p>
                    <a href="mailto:hola@palaciodpollo.es" className="text-[#C4906A]/55 text-sm hover:text-[#C8820A] transition-colors mt-1 block">
                      hola@palaciodpollo.es
                    </a>
                  </div>
                </div>

                <div className="h-px w-full bg-[#B8940E]/10" />

                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 flex items-center justify-center shrink-0 rounded-sm"
                    style={{
                      border: "1px solid rgba(200, 130, 10, 0.30)",
                      outline: "1px solid rgba(200, 130, 10, 0.10)",
                      outlineOffset: "3px",
                      background: "rgba(107, 63, 6, 0.15)",
                    }}
                  >
                    <Clock className="w-5 h-5 text-[#C8820A]" />
                  </div>
                  <div>
                    <p className="text-[#F2E8D0] font-headline italic font-semibold">Horario</p>
                    <div className="text-[#C4906A]/55 text-sm mt-1 space-y-1">
                      <p>Lun-Vie: 13:00-16:00 | 20:00-23:30</p>
                      <p>Sab-Dom: 12:00-17:00 | 19:30-00:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mapa placeholder */}
            <div
              className="parchment-card rounded-sm overflow-hidden ambient-shadow"
              style={{
                outline: "1px solid rgba(184, 148, 14, 0.06)",
                outlineOffset: "4px",
              }}
            >
              <div
                className="h-64 flex items-center justify-center"
                style={{
                  background: `
                    repeating-linear-gradient(
                      95deg,
                      transparent,
                      transparent 6px,
                      rgba(120, 75, 20, 0.04) 6px,
                      rgba(120, 75, 20, 0.04) 7px
                    ),
                    rgba(28, 14, 6, 0.8)
                  `,
                }}
              >
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#C8820A]/60 mx-auto mb-3" />
                  <p className="text-[#F2E8D0] font-headline italic font-semibold">Calle del Pollo Dorado, 12</p>
                  <p className="text-[#C4906A]/50 text-sm mt-1">Madrid, 28001</p>
                  <a
                    href="https://maps.google.com/?q=Calle+del+Pollo+Dorado+12+Madrid+28001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-[#C8820A] hover:text-[#B8940E] text-sm font-headline italic transition-colors"
                  >
                    Ver en Google Maps
                    <span className="text-xs">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Formulario de contacto */}
          <div>
            <div
              className="parchment-card rounded-sm p-6 md:p-8 ambient-shadow"
              style={{
                outline: "1px solid rgba(184, 148, 14, 0.06)",
                outlineOffset: "4px",
              }}
            >
              <div className="text-center mb-6">
                <Ornament />
                <h2 className="font-headline italic font-bold text-xl text-[#F2E8D0] mt-4 mb-4">
                  Envianos un mensaje
                </h2>
                <Ornament />
              </div>

              {submitStatus === "success" ? (
                <div className="text-center py-10">
                  <div
                    className="w-20 h-20 mx-auto mb-6 rounded-sm flex items-center justify-center"
                    style={{
                      border: "2px solid rgba(34, 197, 94, 0.4)",
                      outline: "1px solid rgba(34, 197, 94, 0.15)",
                      outlineOffset: "3px",
                      background: "rgba(34, 197, 94, 0.1)",
                    }}
                  >
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-[#F2E8D0] font-headline italic font-bold text-xl mb-2">Mensaje recibido!</h3>
                  <p className="text-[#C4906A]/55 text-sm">Te responderemos en menos de 24 horas.</p>
                  <button
                    onClick={() => setSubmitStatus("idle")}
                    className="mt-6 text-[#C8820A] hover:text-[#B8940E] font-headline italic underline transition-colors"
                  >
                    Enviar otro mensaje
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">Nombre *</label>
                      <input
                        {...register("name")}
                        type="text"
                        placeholder="Tu nombre"
                        className={inputStyles}
                        style={{
                          ...inputBorder,
                          borderColor: errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = errors.name ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">Email *</label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="tu@email.com"
                        className={inputStyles}
                        style={{
                          ...inputBorder,
                          borderColor: errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = errors.email ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">Asunto *</label>
                    <input
                      {...register("subject")}
                      type="text"
                      placeholder="En que podemos ayudarte?"
                      className={inputStyles}
                      style={{
                        ...inputBorder,
                        borderColor: errors.subject ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = errors.subject ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                    />
                    {errors.subject && <p className="mt-1 text-xs text-red-400">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs text-[#C4906A]/60 mb-2 tracking-wider uppercase font-semibold">Mensaje *</label>
                    <textarea
                      {...register("message")}
                      rows={5}
                      placeholder="Escribe tu mensaje aqui..."
                      className={`${inputStyles} resize-none`}
                      style={{
                        ...inputBorder,
                        borderColor: errors.message ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)",
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)" }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = errors.message ? "rgba(239, 68, 68, 0.5)" : "rgba(184, 148, 14, 0.12)" }}
                    />
                    {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>}
                  </div>

                  {submitStatus === "error" && (
                    <p className="text-red-400 text-sm italic">Ha habido un error. Por favor llamanos directamente.</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitStatus === "loading"}
                    className="w-full vintage-border-btn bg-[#6B3F06]/75 hover:bg-[#6B3F06] disabled:opacity-50 text-[#F2E8D0] py-4 rounded-sm font-bold text-[0.8rem] tracking-[0.2em] uppercase transition-all duration-200 hover:shadow-xl hover:shadow-[#6B3F06]/30 font-headline flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {submitStatus === "loading" ? "Enviando..." : "Enviar mensaje"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
