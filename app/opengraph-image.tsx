// app/opengraph-image.tsx
// Next.js genera automáticamente la imagen OG en /opengraph-image
// Se usa en WhatsApp, Twitter, LinkedIn, Facebook cuando se comparte el enlace

import { ImageResponse } from "next/og"

export const runtime     = "edge"
export const alt         = "El Palacio del Pollo — Asador en Valdemoro, Madrid"
export const size        = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "72px 80px",
        background: "#1A1410",
        position: "relative",
      }}
    >
      {/* Textura de fondo — grid sutil */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 70% 30%, rgba(201,75,31,0.15) 0%, transparent 60%)",
        display: "flex",
      }} />

      {/* Logotipo / nombre */}
      <div style={{
        fontSize: 88,
        fontWeight: 400,
        fontStyle: "italic",
        color: "#F3EDE1",
        lineHeight: 0.95,
        letterSpacing: "-0.02em",
        marginBottom: 32,
        display: "flex",
        flexDirection: "column",
      }}>
        <span style={{ color: "#F3EDE1" }}>El Palacio</span>
        <span style={{ color: "#C94B1F" }}>del Pollo</span>
      </div>

      {/* Separador */}
      <div style={{
        width: 60,
        height: 1,
        background: "rgba(243,237,225,0.3)",
        marginBottom: 28,
        display: "flex",
      }} />

      {/* Descripción */}
      <div style={{
        fontSize: 26,
        color: "rgba(243,237,225,0.7)",
        fontStyle: "italic",
        marginBottom: 28,
        display: "flex",
      }}>
        Pollos asados · Costillar BBQ · Valdemoro, Madrid
      </div>

      {/* Datos de contacto */}
      <div style={{
        display: "flex",
        gap: 32,
        fontSize: 16,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "rgba(243,237,225,0.45)",
      }}>
        <span>Calle Pozo Chico 30</span>
        <span style={{ color: "#C94B1F" }}>·</span>
        <span>+34 918 95 32 16</span>
        <span style={{ color: "#C94B1F" }}>·</span>
        <span>12:00 — 16:00</span>
      </div>
    </div>,
    { ...size }
  )
}
