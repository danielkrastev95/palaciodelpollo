// lib/supabase.ts — Clientes de Supabase tipados con el schema real

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const isConfigured =
  supabaseUrl && supabaseAnonKey &&
  supabaseUrl     !== "tu_url_de_supabase_aqui" &&
  supabaseAnonKey !== "tu_clave_publica_aqui"

// Cliente público — usa la anon key, sujeto a RLS
// Solo para lecturas públicas (menú, disponibilidad de slots)
export const supabase = isConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!)
  : null

// Cliente de servidor — usa la service_role key, bypassea RLS
// Solo se llama desde API routes (server-side), nunca desde componentes cliente
export const createServerSupabaseClient = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey || !supabaseUrl) {
    console.error("[supabase] SUPABASE_SERVICE_ROLE_KEY o URL no configurada")
    return null
  }
  return createClient<Database>(supabaseUrl, serviceKey)
}
