import type { Metadata } from "next"
import { Award, Heart, Users, Clock, Flame, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Sobre Nosotros",
  description: "Conoce la historia de El Palacio del Pollo. Más de 20 años de tradición familiar asando pollos en Valdemoro, Madrid.",
  openGraph: {
    title: "Sobre Nosotros — El Palacio del Pollo",
    description: "Más de 20 años de tradición familiar asando pollos en Valdemoro, Madrid.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre Nosotros — El Palacio del Pollo",
    description: "Más de 20 años de tradición familiar asando pollos en Valdemoro, Madrid.",
  },
  alternates: { canonical: "/about" },
}

// Linea del tiempo de la historia del restaurante
const timeline = [
  {
    year: "2003",
    title: "Los origenes",
    description: "El abuelo Paco abre el primer local con una pequena brasa y la receta familiar que aprendio de su madre en el pueblo.",
  },
  {
    year: "2010",
    title: "El primer reconocimiento",
    description: "La Guia Gastronomica de Madrid nos distingue por primera vez. Las colas llegan a la calle.",
  },
  {
    year: "2015",
    title: "Ampliacion del local",
    description: "Triplicamos el aforo para dar cabida a todos nuestros clientes fieles y los nuevos que llegaban cada dia.",
  },
  {
    year: "2019",
    title: "Segunda generacion",
    description: "Los hijos de Paco toman las riendas del negocio, manteniendo la receta original pero con tecnicas modernas.",
  },
  {
    year: "2023",
    title: "Premio al Mejor Restaurante",
    description: "Mejor restaurante de pollo de Madrid 2023 segun la Guia Gastronomica. El orgullo de toda la familia.",
  },
]

// El equipo
const team = [
  {
    name: "Francisco 'Paco' Garcia",
    role: "Fundador",
    initials: "FG",
    bio: "Empezo con una brasa y un sueno. Hoy ve como su legado sigue vivo.",
  },
  {
    name: "Miguel Garcia",
    role: "Chef Ejecutivo",
    initials: "MG",
    bio: "Hijo de Paco. Formado en Paris, enamorado del pollo a la brasa.",
  },
  {
    name: "Laura Garcia",
    role: "Directora del Restaurante",
    initials: "LG",
    bio: "Hermana de Miguel. Garantiza que cada visita sea perfecta.",
  },
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

export default function AboutPage() {
  return (
    <div className="min-h-screen wood-panel">
      {/* Hero de la seccion */}
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
        {/* Gradiente inferior */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent, #120A04)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="flex justify-center mb-6">
            <span className="retro-label">Nuestra historia</span>
          </div>

          <h1 className="font-headline italic font-bold text-5xl md:text-7xl lg:text-8xl text-[#F2E8D0] mb-6 text-glow tracking-wide">
            Sobre Nosotros
          </h1>

          <Ornament wide />

          <p className="mt-6 text-[#C4906A]/55 max-w-lg mx-auto text-sm md:text-base font-headline italic leading-relaxed">
            Somos una familia apasionada por el buen pollo. Llevamos mas de 20 anos
            haciendo feliz a Madrid bocado a bocado.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-24">

        {/* Numeros rapidos */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {[
            { icon: Clock, number: "20+", label: "Anos de experiencia" },
            { icon: Users, number: "50K+", label: "Clientes al ano" },
            { icon: Heart, number: "3", label: "Generaciones" },
            { icon: Award, number: "8", label: "Premios recibidos" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="parchment-card rounded-sm p-6 text-center ambient-shadow"
              >
                <div
                  className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-sm"
                  style={{
                    border: "1px solid rgba(200, 130, 10, 0.30)",
                    outline: "1px solid rgba(200, 130, 10, 0.10)",
                    outlineOffset: "3px",
                    background: "rgba(107, 63, 6, 0.15)",
                  }}
                >
                  <Icon className="w-5 h-5 text-[#C8820A]" />
                </div>
                <p className="text-3xl font-bold text-[#F2E8D0] font-headline italic">{stat.number}</p>
                <p className="text-[#C4906A]/50 text-xs mt-1 tracking-wider uppercase font-semibold">{stat.label}</p>
              </div>
            )
          })}
        </div>

        {/* Historia principal */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <Ornament />
            <h2 className="font-headline italic font-bold text-3xl md:text-4xl text-[#F2E8D0] mt-4 mb-4 text-glow-sm">
              La Historia del Palacio
            </h2>
            <Ornament />
          </div>

          <div
            className="parchment-card rounded-sm p-8 md:p-10 ambient-shadow"
            style={{
              outline: "1px solid rgba(184, 148, 14, 0.06)",
              outlineOffset: "4px",
            }}
          >
            <div className="space-y-5 text-[#E8D5B0]/80 leading-relaxed font-headline italic">
              <p>
                Todo comenzo en 2003 cuando Francisco Garcia, conocido por todos como &ldquo;Paco&rdquo;, decidio
                abrir las puertas de un pequeno local en el centro de Madrid con una sola brasa, una receta
                familiar y mucha ilusion.
              </p>
              <p>
                La receta del pollo era la misma que su madre le enseno en su pueblo de Extremadura: marinado
                durante 24 horas en una mezcla de especias que Paco nunca ha querido revelar completamente,
                asado lentamente sobre brasas de carbon de encina.
              </p>
              <p>
                Hoy, mas de 20 anos despues, sus hijos Miguel y Laura llevan las riendas del restaurante,
                manteniendo esa receta original que hizo famoso al local, pero incorporando tecnicas modernas
                y una carta mas amplia para adaptarse a todos los gustos.
              </p>
            </div>

            {/* Sello decorativo */}
            <div className="flex justify-center mt-8">
              <div
                className="stamp-badge w-20 h-20"
                aria-hidden="true"
              >
                <div className="text-center">
                  <Flame className="w-5 h-5 text-[#C8820A] mx-auto" />
                  <span className="block text-[#C8820A] text-[0.5rem] font-bold tracking-[0.2em] uppercase mt-1">
                    Desde
                  </span>
                  <span className="block text-[#C8820A] text-sm font-headline italic font-bold">
                    2003
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linea del tiempo */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <Ornament />
            <h2 className="font-headline italic font-bold text-3xl md:text-4xl text-[#F2E8D0] mt-4 mb-4 text-glow-sm">
              Nuestra Trayectoria
            </h2>
            <Ornament />
          </div>

          <div className="relative">
            {/* Linea vertical */}
            <div
              className="absolute left-6 md:left-8 top-0 bottom-0 w-px"
              style={{
                background: "linear-gradient(to bottom, rgba(184, 148, 14, 0.4), rgba(184, 148, 14, 0.1))",
              }}
            />

            <div className="space-y-8">
              {timeline.map((event) => (
                <div key={event.year} className="flex gap-6 md:gap-8">
                  {/* Punto en la linea */}
                  <div className="relative shrink-0">
                    <div
                      className="w-12 h-12 md:w-16 md:h-16 rounded-sm flex items-center justify-center font-headline italic font-bold text-sm md:text-base text-[#C8820A] z-10 relative"
                      style={{
                        background: "rgba(107, 63, 6, 0.6)",
                        border: "1.5px solid rgba(200, 130, 10, 0.45)",
                        outline: "1px solid rgba(200, 130, 10, 0.15)",
                        outlineOffset: "2px",
                      }}
                    >
                      {event.year.slice(2)}
                    </div>
                  </div>

                  {/* Contenido */}
                  <div
                    className="parchment-card rounded-sm p-5 md:p-6 flex-1 transition-all duration-300 hover:border-[#C8820A]/25"
                    style={{
                      outline: "1px solid rgba(184, 148, 14, 0.06)",
                      outlineOffset: "3px",
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[#B8940E] font-bold text-xs tracking-wider">{event.year}</span>
                      <div className="h-px flex-1 bg-[#B8940E]/15" />
                    </div>
                    <h3 className="text-[#F2E8D0] font-headline italic font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-[#C4906A]/55 text-sm leading-relaxed">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* El equipo */}
        <div>
          <div className="text-center mb-12">
            <Ornament />
            <h2 className="font-headline italic font-bold text-3xl md:text-4xl text-[#F2E8D0] mt-4 mb-4 text-glow-sm">
              Nuestro Equipo
            </h2>
            <Ornament />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="parchment-card rounded-sm p-6 md:p-8 text-center ambient-shadow transition-all duration-300 hover:border-[#C8820A]/25"
                style={{
                  outline: "1px solid rgba(184, 148, 14, 0.06)",
                  outlineOffset: "3px",
                }}
              >
                {/* Avatar con iniciales */}
                <div
                  className="w-20 h-20 mx-auto mb-5 rounded-sm flex items-center justify-center font-headline italic font-bold text-2xl text-[#C8820A]"
                  style={{
                    background: "rgba(107, 63, 6, 0.4)",
                    border: "2px solid rgba(200, 130, 10, 0.35)",
                    outline: "1px solid rgba(200, 130, 10, 0.12)",
                    outlineOffset: "3px",
                  }}
                >
                  {member.initials}
                </div>

                {/* Ornamento */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="h-px w-6 bg-[#B8940E]/25" />
                  <Star className="w-3 h-3 text-[#B8940E]/40" />
                  <div className="h-px w-6 bg-[#B8940E]/25" />
                </div>

                <h3 className="text-[#F2E8D0] font-headline italic font-bold text-lg">{member.name}</h3>
                <p className="text-[#C8820A] text-xs font-bold tracking-[0.2em] uppercase mt-1 mb-4">{member.role}</p>
                <p className="text-[#C4906A]/55 text-sm italic font-headline">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Ornamento final */}
        <div className="mt-20">
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
