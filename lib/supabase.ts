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

// Hostname del bucket de Supabase Storage (deriva del env, no hardcoded)
export const SUPABASE_STORAGE_HOSTNAME = (() => {
  try { return supabaseUrl ? new URL(supabaseUrl).hostname : null } catch { return null }
})()

/**
 * ¿Está esta URL servida desde nuestro bucket de Supabase Storage?
 * Las imágenes propias pasan por la optimización de Next.js Image.
 * Las externas (Unsplash, etc.) se sirven con `unoptimized` para evitar
 * añadir cada dominio en next.config.
 */
export const isOwnImage = (url: string): boolean => {
  if (!url.startsWith("http")) return true  // ruta relativa local
  return SUPABASE_STORAGE_HOSTNAME ? url.includes(SUPABASE_STORAGE_HOSTNAME) : false
}
