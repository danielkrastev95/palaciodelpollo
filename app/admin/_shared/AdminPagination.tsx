// app/admin/_shared/AdminPagination.tsx — Controles de paginación compartidos

import { INK, INK3, BORDER } from "./adminTheme"

interface Props {
  page: number
  totalPages: number
  onPrev: () => void
  onNext: () => void
}

export default function AdminPagination({ page, totalPages, onPrev, onNext }: Props) {
  if (totalPages <= 1) return null
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 32 }}>
      <button
        onClick={onPrev}
        disabled={page === 1}
        style={{
          padding: "7px 14px", border: `1px solid ${BORDER}`, background: "transparent",
          color: page === 1 ? INK3 : INK, cursor: page === 1 ? "not-allowed" : "pointer",
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", borderRadius: 2,
          opacity: page === 1 ? 0.4 : 1,
        }}
      >‹ Anterior</button>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.15em", textTransform: "uppercase", color: INK3 }}>
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page === totalPages}
        style={{
          padding: "7px 14px", border: `1px solid ${BORDER}`, background: "transparent",
          color: page === totalPages ? INK3 : INK, cursor: page === totalPages ? "not-allowed" : "pointer",
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.1em", borderRadius: 2,
          opacity: page === totalPages ? 0.4 : 1,
        }}
      >Siguiente ›</button>
    </div>
  )
}
