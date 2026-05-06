"use client"

// app/admin/_shared/ImageUpload.tsx
// Subida de imagen al bucket Supabase con preview.
// Sube a /api/admin/upload-image (auth admin), recibe URL pública.

import { useRef, useState } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"

const INK   = "#1A1410"
const INK3  = "#6B5D50"
const A     = "#C94B1F"
const PAPER = "#F3EDE1"

interface Props {
  value: string
  onChange: (url: string) => void
  /** Permite pegar también una URL externa (default: true). */
  allowUrlInput?: boolean
}

export default function ImageUpload({ value, onChange, allowUrlInput = true }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError]         = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok || !json.success) throw new Error(json.error ?? "Error al subir")
      onChange(json.data.url as string)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al subir la imagen")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
        onChange={onPick}
        style={{ display: "none" }}
      />

      {value ? (
        <div style={{
          display: "flex", gap: 12, alignItems: "flex-start",
          padding: 10, border: `1px solid rgba(26,20,16,0.15)`,
          borderRadius: 2, background: "#fff",
        }}>
          <div style={{
            position: "relative",
            width: 80, height: 80, flexShrink: 0,
            borderRadius: 2, overflow: "hidden",
            background: PAPER,
          }}>
            <Image
              src={value}
              alt="Preview"
              fill
              sizes="80px"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: 9,
              letterSpacing: "0.18em", textTransform: "uppercase",
              color: INK3, marginBottom: 6,
            }}>
              Imagen actual
            </div>
            <div style={{
              fontSize: 12, color: INK,
              wordBreak: "break-all", marginBottom: 10,
              maxHeight: 36, overflow: "hidden",
            }}>
              {value}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                style={btnSecondary}
              >
                {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                {uploading ? "Subiendo…" : "Cambiar"}
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                disabled={uploading}
                style={btnGhost}
              >
                <X size={13} />
                Quitar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={e => e.preventDefault()}
          onDrop={onDrop}
          style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 8, padding: "26px 16px",
            border: `1.5px dashed rgba(26,20,16,0.3)`,
            borderRadius: 2, background: "#fff",
            cursor: uploading ? "wait" : "pointer",
            transition: "border-color 0.2s, background 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = A }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(26,20,16,0.3)" }}
        >
          {uploading ? (
            <>
              <Loader2 size={20} color={A} className="animate-spin" />
              <span style={hintStyle}>Subiendo imagen…</span>
            </>
          ) : (
            <>
              <Upload size={20} color={INK3} />
              <span style={{ ...hintStyle, color: INK }}>
                Click o arrastra una imagen aquí
              </span>
              <span style={hintStyle}>JPG, PNG, WebP o HEIC · máx 10 MB · se optimiza al subir</span>
            </>
          )}
        </div>
      )}

      {allowUrlInput && (
        <div style={{ marginTop: 10 }}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: 8,
            letterSpacing: "0.2em", textTransform: "uppercase",
            color: INK3, marginBottom: 4,
          }}>
            O pegar URL externa
          </div>
          <input
            type="url"
            value={value.startsWith("http") ? value : ""}
            onChange={e => onChange(e.target.value)}
            placeholder="https://…"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#fff", border: "1px solid rgba(26,20,16,0.2)",
              borderRadius: 2, padding: "10px 12px",
              fontSize: 13, color: INK, fontFamily: "var(--font-ui)",
              outline: "none",
            }}
          />
        </div>
      )}

      {error && (
        <div style={{
          marginTop: 8, padding: "8px 10px",
          background: "rgba(201,75,31,0.08)",
          border: `1px solid ${A}`, borderRadius: 2,
          fontSize: 12, color: A,
        }}>
          {error}
        </div>
      )}
    </div>
  )
}

const btnSecondary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "6px 12px",
  background: INK, color: PAPER,
  fontFamily: "var(--font-mono)", fontSize: 9,
  letterSpacing: "0.18em", textTransform: "uppercase",
  border: "1px solid " + INK,
  borderRadius: 2, cursor: "pointer",
}

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "6px 12px",
  background: "transparent", color: INK,
  fontFamily: "var(--font-mono)", fontSize: 9,
  letterSpacing: "0.18em", textTransform: "uppercase",
  border: "1px solid rgba(26,20,16,0.25)",
  borderRadius: 2, cursor: "pointer",
}

const hintStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: 9,
  letterSpacing: "0.18em", textTransform: "uppercase",
  color: INK3,
}
