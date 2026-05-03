// components/ui/FieldError.tsx — Componente de error de campo compartido

export default function FieldError({ id, msg }: { id?: string; msg: string }) {
  return (
    <span
      id={id}
      role="alert"
      style={{
        display: "block", marginTop: 5,
        fontFamily: "var(--font-mono)", fontSize: 9,
        letterSpacing: "0.12em", textTransform: "uppercase",
        color: "var(--ember)",
      }}
    >
      {msg}
    </span>
  )
}
