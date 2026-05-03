// app/menu/page.tsx
// Pagina de la carta — servidor: carga datos de Supabase y los pasa al cliente

import type { Metadata } from "next"
import MenuPageClient from "./MenuPageClient"
import { supabase } from "@/lib/supabase"
import { Category, MenuItem } from "@/types/database"

// Datos de muestra — se usan si Supabase no esta configurado
const sampleCategories: Category[] = [
  { id: 1, name: "Pollos", slug: "pollos", description: "Nuestros pollos a la brasa, asados con leña de encina", display_order: 1, created_at: "" },
  { id: 2, name: "Entrantes", slug: "entrantes", description: "Para abrir boca como manda la tradición", display_order: 2, created_at: "" },
  { id: 3, name: "Ensaladas", slug: "ensaladas", description: "Frescas y de temporada", display_order: 3, created_at: "" },
  { id: 4, name: "Guarniciones", slug: "guarniciones", description: "El acompañamiento perfecto", display_order: 4, created_at: "" },
  { id: 5, name: "Postres", slug: "postres", description: "El broche dulce de la casa", display_order: 5, created_at: "" },
  { id: 6, name: "Bebidas", slug: "bebidas", description: "Para acompañar el festín", display_order: 6, created_at: "" },
]

const sampleMenuItems: MenuItem[] = [
  // Pollos
  { id: 1, name: "Pollo Entero a la Brasa", description: "Pollo de corral marinado 24h en nuestras especias secretas y asado lentamente en brasa de carbón de encina. Servido con alioli de la casa.", price: 18.90, category_id: 1, image_url: null, available: true, featured: true, display_order: 1, created_at: "" },
  { id: 2, name: "Medio Pollo con Patatas", description: "Medio pollo jugoso acompañado de patatas fritas caseras crujientes cortadas a mano y salsa alioli.", price: 11.50, category_id: 1, image_url: null, available: true, featured: true, display_order: 2, created_at: "" },
  { id: 3, name: "Cuarto de Pollo", description: "Cuarto trasero o delantero a elegir. Acompañado de una guarnición a su gusto.", price: 6.90, category_id: 1, image_url: null, available: true, featured: false, display_order: 3, created_at: "" },
  { id: 4, name: "Pollo al Limón", description: "Pollo asado con marinada de limón fresco, romero del huerto y ajo confitado. Una versión suave y aromática.", price: 13.90, category_id: 1, image_url: null, available: true, featured: false, display_order: 4, created_at: "" },
  // Entrantes
  { id: 5, name: "Alitas Especiadas", description: "Alitas de pollo con mezcla de especias de la casa, servidas con salsa barbacoa artesanal.", price: 9.90, category_id: 2, image_url: null, available: true, featured: true, display_order: 1, created_at: "" },
  { id: 6, name: "Croquetas de Pollo", description: "Croquetas cremosas de bechamel con pollo asado desmechado. La receta de siempre. 8 unidades.", price: 7.50, category_id: 2, image_url: null, available: true, featured: false, display_order: 2, created_at: "" },
  { id: 7, name: "Pan de Ajo con Queso", description: "Pan artesano de masa madre tostado con mantequilla de ajo y queso manchego gratinado.", price: 5.90, category_id: 2, image_url: null, available: true, featured: false, display_order: 3, created_at: "" },
  { id: 8, name: "Jamón Ibérico de Cebo", description: "Lonchas finas de jamón ibérico servidas con regañás y tomate rallado.", price: 14.90, category_id: 2, image_url: null, available: true, featured: false, display_order: 4, created_at: "" },
  // Ensaladas
  { id: 9, name: "Ensalada del Palacio", description: "Pollo asado desmechado sobre cama de lechuga, tomate cherry, aguacate y vinagreta de limón.", price: 10.50, category_id: 3, image_url: null, available: true, featured: true, display_order: 1, created_at: "" },
  { id: 10, name: "Ensalada César", description: "Lechuga romana, pollo a la plancha, crutones caseros, parmesano y nuestra salsa César.", price: 9.90, category_id: 3, image_url: null, available: true, featured: false, display_order: 2, created_at: "" },
  // Guarniciones
  { id: 11, name: "Patatas Fritas Caseras", description: "Cortadas a mano cada mañana y fritas en aceite de oliva virgen. Con sal gruesa de Añana.", price: 3.50, category_id: 4, image_url: null, available: true, featured: false, display_order: 1, created_at: "" },
  { id: 12, name: "Arroz con Verduras", description: "Arroz salteado con verduras frescas de temporada al wok.", price: 4.50, category_id: 4, image_url: null, available: true, featured: false, display_order: 2, created_at: "" },
  { id: 13, name: "Pimientos Asados", description: "Pimientos rojos asados en horno de brasa con aceite de oliva virgen extra y flor de sal.", price: 4.90, category_id: 4, image_url: null, available: true, featured: false, display_order: 3, created_at: "" },
  // Postres
  { id: 14, name: "Tarta de Queso Artesana", description: "Nuestra tarta de queso horneada al estilo vasco, con mermelada de frutos rojos de temporada.", price: 5.90, category_id: 5, image_url: null, available: true, featured: true, display_order: 1, created_at: "" },
  { id: 15, name: "Flan Casero", description: "Flan de huevo tradicional con caramelo artesano. La receta de la abuela, inalterada desde 2004.", price: 4.50, category_id: 5, image_url: null, available: true, featured: false, display_order: 2, created_at: "" },
  { id: 16, name: "Natillas de la Casa", description: "Natillas caseras con canela de Ceilán y galleta artesana. Preparadas cada mañana.", price: 4.90, category_id: 5, image_url: null, available: false, featured: false, display_order: 3, created_at: "" },
  // Bebidas
  { id: 17, name: "Agua Mineral", description: "Botella 50cl — con gas o sin gas, a su elección.", price: 1.50, category_id: 6, image_url: null, available: true, featured: false, display_order: 1, created_at: "" },
  { id: 18, name: "Refrescos", description: "Coca-Cola, Fanta, Sprite, Nestea. Servidos en vaso con hielo. 33cl.", price: 2.50, category_id: 6, image_url: null, available: true, featured: false, display_order: 2, created_at: "" },
  { id: 19, name: "Cerveza Nacional", description: "Estrella Damm o Mahou bien tirada. Caña o jarra.", price: 2.90, category_id: 6, image_url: null, available: true, featured: false, display_order: 3, created_at: "" },
  { id: 20, name: "Vino de la Casa", description: "Tinto, blanco o rosado de bodegas manchegas. Copa, jarra o media botella.", price: 2.50, category_id: 6, image_url: null, available: true, featured: false, display_order: 4, created_at: "" },
  { id: 21, name: "Sangría Artesanal", description: "Preparada al momento con vino tinto, frutas de temporada y un toque de canela.", price: 8.90, category_id: 6, image_url: null, available: true, featured: true, display_order: 5, created_at: "" },
]

export const metadata: Metadata = {
  title: "La Carta",
  description: "Descubre nuestra carta completa: pollos a la brasa de leña, entrantes de la casa, ensaladas frescas, guarniciones caseras, postres artesanos y bebidas selectas. Valdemoro, Madrid.",
  openGraph: {
    title: "La Carta — El Palacio del Pollo",
    description: "Pollos a la brasa, costillar BBQ, entrantes, ensaladas, guarniciones y postres caseros. Valdemoro, Madrid.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "La Carta — El Palacio del Pollo",
    description: "Pollos a la brasa, costillar BBQ, entrantes, ensaladas, guarniciones y postres caseros.",
  },
  alternates: { canonical: "/menu" },
}

export default async function MenuPage() {
  let categories: Category[] = []
  let menuItems: MenuItem[] = []

  try {
    if (!supabase) throw new Error("Supabase not configured")

    const [catResult, itemsResult] = await Promise.all([
      supabase.from("categories").select("*").order("display_order"),
      supabase.from("menu_items").select("*").order("display_order"),
    ])

    categories = (!catResult.error && catResult.data && catResult.data.length > 0)
      ? catResult.data : sampleCategories
    menuItems = (!itemsResult.error && itemsResult.data && itemsResult.data.length > 0)
      ? itemsResult.data : sampleMenuItems
  } catch {
    categories = sampleCategories
    menuItems = sampleMenuItems
  }

  return <MenuPageClient categories={categories} menuItems={menuItems} />
}
