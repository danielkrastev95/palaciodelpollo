"use client"

import { useState } from "react"
import { Category, MenuItem } from "@/types/database"
import { Search } from "lucide-react"

/* ───────────────────────────────────────────
   ORNAMENTO — rombo con lineas a los lados
   ─────────────────────────────────────────── */
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

/* ───────────────────────────────────────────
   ORNAMENTO FINO — solo linea + punto
   para separar nombre de descripcion
   ─────────────────────────────────────────── */
function OrnamentSmall() {
  return (
    <div className="flex items-center justify-center gap-2 my-2.5">
      <div className="h-px w-5 bg-[#B8940E]/20" />
      <span className="text-[#B8940E]/40 text-[0.5rem]">{"\u2726"}</span>
      <div className="h-px w-5 bg-[#B8940E]/20" />
    </div>
  )
}

/* ───────────────────────────────────────────
   SEPARADOR ORNAMENTAL COMPLETO entre categorias
   ─────────────────────────────────────────── */
function CategoryDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-14 md:my-16">
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#B8940E]/25" />
      <div
        className="w-1 h-1 bg-[#B8940E]/30 shrink-0"
        style={{ transform: "rotate(45deg)" }}
      />
      <div className="h-px w-4 bg-[#B8940E]/15" />
      <div
        className="w-1.5 h-1.5 bg-[#B8940E]/40 shrink-0"
        style={{ transform: "rotate(45deg)" }}
      />
      <div className="h-px w-4 bg-[#B8940E]/15" />
      <div
        className="w-1 h-1 bg-[#B8940E]/30 shrink-0"
        style={{ transform: "rotate(45deg)" }}
      />
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#B8940E]/25" />
    </div>
  )
}

/* ───────────────────────────────────────────
   TARJETA DE PLATO — pizarra de taberna
   ─────────────────────────────────────────── */
function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div
      className="relative group rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: `
          repeating-linear-gradient(
            95deg,
            transparent,
            transparent 6px,
            rgba(120, 75, 20, 0.06) 6px,
            rgba(120, 75, 20, 0.06) 7px
          ),
          #3D2510
        `,
        border: "1px solid rgba(184, 148, 14, 0.20)",
        outline: "1px solid rgba(184, 148, 14, 0.08)",
        outlineOffset: "3px",
        opacity: item.available ? 1 : 0.55,
      }}
    >
      {/* --- Etiqueta "Recomendacion de la Casa" si es featured --- */}
      {item.featured && (
        <div
          className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-sm"
          style={{
            background: "rgba(107, 63, 6, 0.85)",
            border: "1px solid rgba(200, 130, 10, 0.35)",
          }}
        >
          <span
            className="text-[0.6rem] font-bold tracking-[0.2em] uppercase"
            style={{ color: "#C8820A" }}
          >
            Casa Recomendada
          </span>
        </div>
      )}

      {/* --- Imagen o franja decorativa superior --- */}
      {item.image_url ? (
        <div className="relative w-full h-[180px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.name}
            className="w-full h-full object-cover"
            style={{
              filter: "sepia(15%) saturate(0.85) brightness(0.88)",
            }}
          />
          {/* Vigneta interna */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow:
                "inset 0 -40px 40px -10px #3D2510, inset 0 0 60px rgba(61, 37, 16, 0.5)",
            }}
          />
        </div>
      ) : (
        /* Franja decorativa sin imagen */
        <div
          className="w-full h-14 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, rgba(200, 130, 10, 0.06) 0%, rgba(28, 14, 6, 0) 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-[#B8940E]/20" />
            <div
              className="w-1.5 h-1.5 bg-[#B8940E]/30"
              style={{ transform: "rotate(45deg)" }}
            />
            <div className="h-px w-8 bg-[#B8940E]/20" />
          </div>
        </div>
      )}

      {/* --- Contenido --- */}
      <div className="px-5 pb-6 pt-2">
        {/* Nombre del plato */}
        <h3 className="font-headline italic font-bold text-xl text-[#F2E8D0] group-hover:text-[#C8820A] transition-colors duration-200 leading-tight tracking-wide">
          {item.name}
        </h3>

        {/* Separador ornamental mini */}
        <OrnamentSmall />

        {/* Descripcion */}
        {item.description && (
          <p className="text-[#C4906A]/60 text-sm leading-relaxed italic line-clamp-3 mb-4">
            {item.description}
          </p>
        )}

        {/* Linea fina antes del precio */}
        <div className="h-px w-full bg-[#B8940E]/10 mb-4" />

        {/* Pie: precio + disponibilidad */}
        <div className="flex items-end justify-between">
          <p className="font-headline italic font-bold text-2xl text-[#B8940E]">
            {item.price.toFixed(2)}&euro;
          </p>

          {item.available ? (
            <span
              className="text-[0.6rem] font-bold tracking-[0.18em] uppercase pb-1"
              style={{ color: "rgba(184, 148, 14, 0.4)" }}
            >
              Disponible
            </span>
          ) : (
            <span
              className="text-[0.6rem] font-bold tracking-[0.18em] uppercase px-2 py-0.5 rounded-sm pb-1"
              style={{
                color: "#A07050",
                border: "1px solid rgba(160, 112, 80, 0.3)",
                background: "rgba(160, 112, 80, 0.08)",
              }}
            >
              Agotado
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/* ───────────────────────────────────────────
   COMPONENTE PRINCIPAL — PAGINA DE CARTA
   ─────────────────────────────────────────── */
interface Props {
  categories: Category[]
  menuItems: MenuItem[]
}

export default function MenuPageClient({ categories, menuItems }: Props) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar platos
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === null || item.category_id === activeCategory
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ??
        false)
    return matchesCategory && matchesSearch
  })

  // Agrupar por categoria
  const groupedItems = categories.reduce<Record<number, MenuItem[]>>(
    (acc, category) => {
      const items = filteredItems.filter(
        (item) => item.category_id === category.id
      )
      if (items.length > 0) {
        acc[category.id] = items
      }
      return acc
    },
    {}
  )

  const visibleCategoryIds = Object.keys(groupedItems).map(Number)

  return (
    <div className="min-h-screen wood-panel">
      {/* ═══════════════════════════════════════════════
          HERO DE LA CARTA
          ═══════════════════════════════════════════════ */}
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
        {/* Gradiente inferior para fundir con contenido */}
        <div
          className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent, #120A04)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Retro label superior */}
          <div className="flex justify-center mb-6">
            <span className="retro-label">El Palacio del Pollo</span>
          </div>

          {/* Titulo principal */}
          <h1 className="font-headline italic font-bold text-5xl md:text-7xl lg:text-8xl text-[#F2E8D0] mb-6 text-glow tracking-wide">
            Nuestra Carta
          </h1>

          {/* Ornamento doble */}
          <Ornament wide />

          {/* Subtitulo */}
          <p className="mt-6 text-[#C4906A]/55 max-w-lg mx-auto text-sm md:text-base font-headline italic leading-relaxed">
            Recetas transmitidas de generacion en generacion, ingredientes
            frescos cada dia, el sabor de siempre
          </p>

          {/* Sello Est. 2004 */}
          <div className="flex justify-center mt-8">
            <div
              className="stamp-badge w-20 h-20 md:w-24 md:h-24"
              aria-hidden="true"
            >
              <div className="text-center">
                <span className="block text-[#C8820A] text-[0.55rem] md:text-[0.6rem] font-bold tracking-[0.25em] uppercase leading-none">
                  Est.
                </span>
                <span className="block text-[#C8820A] text-lg md:text-xl font-headline italic font-bold leading-tight mt-0.5">
                  2004
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BUSCADOR Y FILTROS
          ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
        {/* Buscador estilo taberna */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C4906A]/40" />
          <input
            type="text"
            placeholder="Buscar en la carta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1C0E06] rounded-sm pl-11 pr-4 py-3 text-[#F2E8D0] text-sm placeholder-[#C4906A]/30 font-headline italic focus:outline-none transition-colors duration-200"
            style={{
              border: "1px solid rgba(184, 148, 14, 0.12)",
              outline: "1px solid rgba(184, 148, 14, 0.05)",
              outlineOffset: "2px",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(200, 130, 10, 0.3)"
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(184, 148, 14, 0.12)"
            }}
          />
        </div>

        {/* Filtros de categoria */}
        <div className="flex gap-3 overflow-x-auto pb-3 mb-2 scrollbar-hide justify-start md:justify-center">
          {/* Boton "Toda la Carta" */}
          <button
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 px-5 py-2.5 rounded-sm text-[0.68rem] font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
              activeCategory === null
                ? "vintage-border-btn bg-[#6B3F06] text-[#F2E8D0]"
                : "text-[#C4906A] hover:text-[#F2E8D0] hover:bg-[#1C0E06]"
            }`}
            style={
              activeCategory !== null
                ? { border: "1px solid rgba(196, 144, 106, 0.2)" }
                : undefined
            }
          >
            Toda la Carta
          </button>

          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`shrink-0 px-5 py-2.5 rounded-sm text-[0.68rem] font-bold tracking-[0.2em] uppercase transition-all duration-200 ${
                activeCategory === category.id
                  ? "vintage-border-btn bg-[#6B3F06] text-[#F2E8D0]"
                  : "text-[#C4906A] hover:text-[#F2E8D0] hover:bg-[#1C0E06]"
              }`}
              style={
                activeCategory !== category.id
                  ? { border: "1px solid rgba(196, 144, 106, 0.2)" }
                  : undefined
              }
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SECCIONES POR CATEGORIA
          ═══════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 pb-24 pt-6">
        {/* Estado vacio */}
        {visibleCategoryIds.length === 0 && (
          <div className="text-center py-24">
            <Ornament wide />
            <p className="mt-8 font-headline italic text-2xl md:text-3xl text-[#F2E8D0]/70 text-glow-sm">
              La cocina esta preparando...
            </p>
            <p className="mt-3 text-[#C4906A]/40 text-sm italic">
              {searchQuery
                ? `No hemos encontrado "${searchQuery}" en nuestra carta`
                : "No hay platos disponibles en esta categoria"}
            </p>
            <div className="mt-8">
              <Ornament />
            </div>
          </div>
        )}

        {/* Categorias con platos */}
        {categories.map((category) => {
          const items = groupedItems[category.id]
          if (!items) return null

          const isFirstVisible =
            visibleCategoryIds.indexOf(category.id) === 0

          return (
            <section key={category.id}>
              {/* Separador entre categorias (no antes de la primera) */}
              {!isFirstVisible && <CategoryDivider />}

              {/* Cabecera de categoria */}
              <div className="text-center mb-10">
                {/* Ornamento sobre el titulo */}
                <div className="mb-4">
                  <Ornament />
                </div>

                <h2 className="font-headline italic font-bold text-3xl md:text-4xl text-[#F2E8D0] text-glow-sm tracking-wide">
                  {category.name}
                </h2>

                {/* Descripcion de la categoria */}
                {category.description && (
                  <p className="mt-2 text-[#C4906A]/45 text-sm italic font-headline">
                    {category.description}
                  </p>
                )}

                {/* Ornamento bajo el titulo */}
                <div className="mt-4">
                  <Ornament />
                </div>
              </div>

              {/* Grid de tarjetas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {items.map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Ornamento final de la pagina */}
        {visibleCategoryIds.length > 0 && (
          <div className="mt-20 text-center">
            <CategoryDivider />
            <p className="font-headline italic text-[#C4906A]/35 text-sm tracking-wide">
              Precios con IVA incluido
            </p>
            <p className="font-headline italic text-[#C4906A]/25 text-xs mt-1 tracking-wide">
              Consulte alergenos con nuestro personal
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
