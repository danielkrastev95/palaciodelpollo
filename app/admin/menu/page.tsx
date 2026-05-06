"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import { MenuItem, Category } from "@/types/database"
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react"
import ImageUpload from "@/app/admin/_shared/ImageUpload"

const A = "#C94B1F"
const INK = "#1A1410"
const INK2 = "#3A2F26"
const INK3 = "#6B5D50"
const PAPER = "#F3EDE1"
const CREAM = "#FBF6EA"
const BORDER = "rgba(26,20,16,0.12)"

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "#fff", border: "1px solid rgba(26,20,16,0.2)",
  borderRadius: 2, padding: "12px 14px",
  fontSize: 15, color: INK, fontFamily: "var(--font-ui)",
  outline: "none",
}

const labelStyle: React.CSSProperties = {
  display: "block", fontFamily: "var(--font-mono)",
  fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
  color: INK3, marginBottom: 6,
}

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)

  const [form, setForm] = useState({
    name: "", description: "", price: "", category_id: "",
    available: true, featured: false, image_url: "", display_order: "0",
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    if (!supabase) { setLoading(false); return }
    const [itemsResult, catsResult] = await Promise.all([
      supabase.from("menu_items").select("*").order("category_id").order("display_order"),
      supabase.from("categories").select("*").order("display_order"),
    ])
    if (itemsResult.data) setMenuItems(itemsResult.data)
    if (catsResult.data) setCategories(catsResult.data)
    setLoading(false)
  }

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item)
    setForm({ name: item.name, description: item.description ?? "", price: item.price.toString(), category_id: item.category_id.toString(), available: item.available, featured: item.featured, image_url: item.image_url ?? "", display_order: item.display_order.toString() })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar este plato?")) return
    if (!supabase) return
    const { error } = await supabase.from("menu_items").delete().eq("id", id)
    if (!error) setMenuItems(prev => prev.filter(i => i.id !== id))
  }

  const toggleAvailable = async (item: MenuItem) => {
    if (!supabase) return
    const { error } = await supabase.from("menu_items").update({ available: !item.available }).eq("id", item.id)
    if (!error) setMenuItems(prev => prev.map(i => i.id === item.id ? { ...i, available: !i.available } : i))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const itemData = {
      name: form.name, description: form.description || null,
      price: parseFloat(form.price), category_id: parseInt(form.category_id),
      available: form.available, featured: form.featured,
      image_url: form.image_url || null, display_order: parseInt(form.display_order),
    }
    if (!supabase) { closeForm(); return }
    if (editingItem) {
      const { error } = await supabase.from("menu_items").update(itemData).eq("id", editingItem.id)
      if (!error) setMenuItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...itemData } : i))
    } else {
      const { data, error } = await supabase.from("menu_items").insert(itemData).select().single()
      if (!error && data) setMenuItems(prev => [...prev, data])
    }
    closeForm()
  }

  const closeForm = () => {
    setShowForm(false); setEditingItem(null)
    setForm({ name: "", description: "", price: "", category_id: "", available: true, featured: false, image_url: "", display_order: "0" })
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.2em", color: INK3 }}>Cargando…</span>
    </div>
  )

  return (
    <div style={{ minHeight: "100vh", background: PAPER, padding: "40px 24px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Link href="/admin/dashboard" style={{ color: INK3, display: "flex" }}>
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: INK, lineHeight: 1 }}>Menú</h1>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: INK3, marginTop: 4 }}>
                {menuItems.length} platos
              </div>
            </div>
          </div>
          <button onClick={() => { setShowForm(true); setEditingItem(null) }} style={{
            display: "flex", alignItems: "center", gap: 8,
            background: A, color: CREAM, border: "none", borderRadius: 2,
            padding: "12px 20px", fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer",
          }}>
            <Plus size={14} /> Añadir plato
          </button>
        </div>

        {/* Formulario */}
        {showForm && (
          <div style={{ background: CREAM, border: `1px solid ${A}`, borderTop: `3px solid ${A}`, borderRadius: 2, padding: 32, marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, color: INK, marginBottom: 24 }}>
              {editingItem ? "Editar plato" : "Nuevo plato"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Nombre *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Categoría *</label>
                  <select required value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })} style={inputStyle}>
                    <option value="">Selecciona</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Descripción</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ ...inputStyle, resize: "none" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
                <div>
                  <label style={labelStyle}>Precio (€) *</label>
                  <input required type="number" step="0.01" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Orden</label>
                  <input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: e.target.value })} style={inputStyle} />
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Imagen</label>
                <ImageUpload
                  value={form.image_url}
                  onChange={url => setForm({ ...form, image_url: url })}
                />
              </div>

              <div style={{ display: "flex", gap: 24, marginBottom: 28 }}>
                {[
                  { key: "available", label: "Disponible" },
                  { key: "featured", label: "Destacado" },
                ].map(({ key, label }) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form[key as "available" | "featured"]}
                      onChange={e => setForm({ ...form, [key]: e.target.checked })}
                      style={{ width: 16, height: 16, accentColor: A }}
                    />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: INK2 }}>{label}</span>
                  </label>
                ))}
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button type="submit" style={{ background: A, color: CREAM, border: "none", borderRadius: 2, padding: "12px 24px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
                  {editingItem ? "Guardar cambios" : "Crear plato"}
                </button>
                <button type="button" onClick={closeForm} style={{ background: "transparent", border: `1px solid ${BORDER}`, borderRadius: 2, padding: "12px 24px", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: INK3, cursor: "pointer" }}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista agrupada por categoría */}
        {categories.map(cat => {
          const items = menuItems.filter(i => i.category_id === cat.id)
          if (items.length === 0) return null
          return (
            <div key={cat.id} style={{ marginBottom: 36 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 12, borderBottom: `1px solid ${BORDER}`, paddingBottom: 10 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 400, color: INK }}>{cat.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: INK3 }}>{items.length} platos</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {items.map(item => (
                  <div key={item.id} style={{
                    background: item.available ? CREAM : "rgba(243,237,225,0.5)",
                    border: `1px solid ${BORDER}`, borderRadius: 2,
                    padding: "14px 20px",
                    display: "flex", alignItems: "center", gap: 16,
                    opacity: item.available ? 1 : 0.6,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "var(--font-ui)", fontSize: 15, fontWeight: 500, color: INK }}>{item.name}</span>
                        {item.featured && <Star size={13} color={A} fill={A} />}
                        {!item.available && (
                          <span style={{ background: "#FDF2F2", color: "#9B2335", border: "1px solid #F0B8BF", fontFamily: "var(--font-mono)", fontSize: 8, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 8px", borderRadius: 100 }}>
                            No disponible
                          </span>
                        )}
                      </div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: A, marginTop: 2 }}>{item.price.toFixed(2)}€</div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <button onClick={() => toggleAvailable(item)} title={item.available ? "Ocultar" : "Mostrar"} style={{ padding: 8, background: "none", border: "none", color: INK3, cursor: "pointer", borderRadius: 2 }}>
                        {item.available ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <button onClick={() => handleEdit(item)} title="Editar" style={{ padding: 8, background: "none", border: "none", color: INK3, cursor: "pointer", borderRadius: 2 }}>
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} title="Eliminar" style={{ padding: 8, background: "none", border: "none", color: INK3, cursor: "pointer", borderRadius: 2 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
