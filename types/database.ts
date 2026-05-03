// types/database.ts
// Estructura de la base de datos tipada para @supabase/supabase-js v2.103+
// Las versiones recientes exigen: Relationships en cada tabla + Views/Functions en el schema.

export type Database = {
  public: {
    Tables: {
      // Categorías del menú (Entrantes, Pollos, Postres…)
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          display_order?: number
          created_at?: string
        }
        Relationships: []
      }

      // Platos del menú
      menu_items: {
        Row: {
          id: number
          name: string
          description: string | null
          price: number
          category_id: number
          image_url: string | null
          available: boolean
          featured: boolean
          display_order: number
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          price: number
          category_id: number
          image_url?: string | null
          available?: boolean
          featured?: boolean
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          price?: number
          category_id?: number
          image_url?: string | null
          available?: boolean
          featured?: boolean
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          }
        ]
      }

      // Reservas de mesa
      reservations: {
        Row: {
          id: number
          name: string
          email: string
          phone: string
          date: string
          time: string
          guests: number
          notes: string | null
          status: "pending" | "confirmed" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          phone: string
          date: string
          time: string
          guests: number
          notes?: string | null
          status?: "pending" | "confirmed" | "cancelled"
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          phone?: string
          date?: string
          time?: string
          guests?: number
          notes?: string | null
          status?: "pending" | "confirmed" | "cancelled"
          created_at?: string
        }
        Relationships: []
      }

      // Encargos para llevar
      encargos: {
        Row: {
          id: number
          name: string
          phone: string
          email: string | null
          date: string
          time: string
          notes: string
          status: "pending" | "confirmed" | "cancelled"
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          phone: string
          email?: string | null
          date: string
          time: string
          notes: string
          status?: "pending" | "confirmed" | "cancelled"
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          phone?: string
          email?: string | null
          date?: string
          time?: string
          notes?: string
          status?: "pending" | "confirmed" | "cancelled"
          created_at?: string
        }
        Relationships: []
      }

      // Mensajes del formulario de contacto
      contact_messages: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          subject: string
          message: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          subject?: string
          message?: string
          read?: boolean
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Shortcuts para usar en componentes
export type Category       = Database["public"]["Tables"]["categories"]["Row"]
export type MenuItem       = Database["public"]["Tables"]["menu_items"]["Row"]
export type Reservation    = Database["public"]["Tables"]["reservations"]["Row"]
export type Encargo        = Database["public"]["Tables"]["encargos"]["Row"]
export type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"]
