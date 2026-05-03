// lib/validators.ts — Validadores de formulario compartidos

export function nameErr(v: string): string {
  return v.trim().length < 2 ? "Nombre obligatorio" : ""
}

export function phoneErr(v: string): string {
  if (!v.trim()) return "Teléfono obligatorio"
  if (v.replace(/\D/g, "").length < 9) return "Mínimo 9 dígitos"
  return ""
}

export function emailErr(v: string): string {
  if (!v.trim()) return "Email obligatorio"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Email no válido"
  return ""
}
