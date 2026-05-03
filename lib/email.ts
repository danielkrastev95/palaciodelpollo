/* =========================================================
   lib/email.ts — Plantillas y envío de emails con Resend
   HTML compatible con todos los clientes de email (tabla-based)
   ========================================================= */

const FROM  = process.env.RESEND_FROM    ?? "El Palacio del Pollo <onboarding@resend.dev>"
const RESTO = process.env.RESTAURANT_EMAIL ?? "info@palaciopollo.es"

/* ── Paleta hardcoded (los emails no soportan CSS variables) ── */
const C = {
  paper:  "#F3EDE1",
  cream:  "#FBF6EA",
  ink:    "#1A1410",
  ink2:   "#3A2F26",
  ink3:   "#6B5D50",
  ember:  "#C94B1F",
  border: "rgba(26,20,16,0.12)",
}

/* ── Fuentes ── */
const SERIF = "Georgia, 'Times New Roman', serif"
const MONO  = "'Courier New', Courier, monospace"

/* ── Componentes base ── */
function wrapper(content: string) {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:${C.paper};">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.paper};">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; background-color:${C.paper};">
          ${content}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

function header(title: string) {
  return `
  <tr>
    <td style="padding-bottom: 10px; font-family:${MONO}; font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:${C.ink3};">
      El Palacio del Pollo &nbsp;&middot;&nbsp; Valdemoro, Madrid
    </td>
  </tr>
  <tr>
    <td style="padding-bottom: 28px; font-family:${SERIF}; font-size:28px; font-weight:400; line-height:1.15; color:${C.ink};">
      ${title}
    </td>
  </tr>`
}

function row(label: string, value: string) {
  return `
  <tr>
    <td style="padding: 0; border-bottom: 1px solid rgba(26,20,16,0.1);">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding: 9px 0; font-family:${MONO}; font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:${C.ink3}; white-space:nowrap; padding-right:16px;">
            ${label}
          </td>
          <td align="right" style="padding: 9px 0; font-family:${SERIF}; font-size:14px; color:${C.ink}; font-weight:500;">
            ${value}
          </td>
        </tr>
      </table>
    </td>
  </tr>`
}

function divider() {
  return `
  <tr>
    <td style="padding: 20px 0 0; border-top: 1px solid rgba(26,20,16,0.2);"></td>
  </tr>`
}

function footer(msg: string) {
  return `
  ${divider()}
  <tr>
    <td style="padding-top: 16px; font-family:${SERIF}; font-size:14px; font-style:italic; color:${C.ink3}; line-height:1.5;">
      ${msg}
    </td>
  </tr>
  <tr>
    <td style="padding-top: 20px; font-family:${MONO}; font-size:9px; letter-spacing:0.14em; text-transform:uppercase; color:${C.ink3}; line-height:1.8;">
      El Palacio del Pollo &nbsp;&middot;&nbsp; Calle Pozo Chico 30 &nbsp;&middot;&nbsp; Valdemoro &nbsp;&middot;&nbsp; +34 918 95 32 16
    </td>
  </tr>`
}

/* ─────────────────────────────────────────
   PLANTILLAS
───────────────────────────────────────── */

export function tplNuevaReserva(d: {
  name: string; email: string; phone: string
  date: string; time: string; guests: number; notes?: string | null
}) {
  return {
    to: [RESTO],
    subject: `Nueva reserva — ${d.name} · ${d.date} ${d.time}`,
    html: wrapper(`
      ${header("Nueva reserva de mesa")}
      ${row("Cliente",  d.name)}
      ${row("Fecha",    d.date)}
      ${row("Hora",     d.time)}
      ${row("Personas", String(d.guests))}
      ${row("Teléfono", d.phone)}
      ${row("Email",    d.email)}
      ${d.notes ? row("Notas", d.notes) : ""}
      ${footer("Confirma o cancela desde el panel de administración.")}
    `),
  }
}

export function tplNuevoEncargo(d: {
  name: string; phone: string; email?: string | null
  date: string; time: string; notes: string
}) {
  const lines   = d.notes.split("\n")
  const divIdx  = lines.findIndex(l => l.startsWith("─"))
  const items   = divIdx >= 0 ? lines.slice(0, divIdx) : lines
  const totalLine = divIdx >= 0 ? lines[divIdx + 1] : ""
  const total   = totalLine.replace("TOTAL:", "").trim()

  const itemRows = items.map(l => {
    const parts  = l.split("×")
    const qty    = parts[0]?.trim() ?? ""
    const rest   = parts.slice(1).join("×")
    const dash   = rest.lastIndexOf("—")
    const name   = dash >= 0 ? rest.slice(0, dash).trim() : rest.trim()
    const price  = dash >= 0 ? rest.slice(dash + 1).trim() : ""
    return `
    <tr>
      <td style="padding: 7px 0; border-bottom: 1px solid rgba(26,20,16,0.07);">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="font-family:${SERIF}; font-size:14px; color:${C.ink}; padding-right:12px;">
              <span style="font-family:${MONO}; font-size:10px; color:${C.ember};">${qty}&times;</span>&nbsp;${name}
            </td>
            <td align="right" style="font-family:${MONO}; font-size:12px; color:${C.ink2}; white-space:nowrap;">${price}</td>
          </tr>
        </table>
      </td>
    </tr>`
  }).join("")

  return {
    to: [RESTO],
    subject: `Nuevo encargo — ${d.name} · ${d.date} ${d.time}`,
    html: wrapper(`
      ${header("Nuevo encargo para llevar")}
      ${row("Cliente",  d.name)}
      ${row("Recogida", `${d.date} a las ${d.time}`)}
      ${row("Teléfono", d.phone)}
      ${d.email ? row("Email", d.email) : ""}
      <tr><td style="padding-top: 20px;"></td></tr>
      <tr>
        <td style="font-family:${MONO}; font-size:9px; letter-spacing:0.2em; text-transform:uppercase; color:${C.ink3}; padding-bottom:8px;">
          Pedido
        </td>
      </tr>
      <tr>
        <td>
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${itemRows}
          </table>
        </td>
      </tr>
      ${total ? `
      <tr>
        <td style="padding-top: 12px; border-top: 1px solid rgba(26,20,16,0.15);">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:${SERIF}; font-size:16px; font-style:italic; color:${C.ink2};">Total estimado</td>
              <td align="right" style="font-family:${SERIF}; font-size:18px; font-style:italic; color:${C.ember}; font-weight:bold;">${total}</td>
            </tr>
          </table>
        </td>
      </tr>` : ""}
      ${footer("Confirma o cancela desde el panel de administración.")}
    `),
  }
}

/* ── Recibo al CLIENTE cuando envía la reserva (estado pendiente) ── */
export function tplReciboReserva(d: {
  name: string; email: string; date: string; time: string; guests: number
}) {
  const firstName = d.name.split(" ")[0]
  return {
    to: [d.email],
    subject: `Reserva recibida — ${d.date} a las ${d.time}`,
    html: wrapper(`
      ${header(`Reserva recibida,<br><em style="color:${C.ember}">${firstName}.</em>`)}
      <tr>
        <td style="padding-bottom: 24px; font-family:${SERIF}; font-size:17px; font-style:italic; color:${C.ink2}; line-height:1.55;">
          Hemos recibido tu solicitud para el ${d.date} a las ${d.time}.
          La confirmaremos en menos de 24&nbsp;h.
        </td>
      </tr>
      ${row("Fecha",    d.date)}
      ${row("Hora",     d.time)}
      ${row("Personas", String(d.guests))}
      ${footer("Si necesitas cancelar o cambiar algo, llámanos al +34\u00a0918\u00a095\u00a032\u00a016.")}
    `),
  }
}

/* ── Recibo al CLIENTE cuando envía el encargo (estado pendiente) ── */
export function tplReciboEncargo(d: {
  name: string; email: string; date: string; time: string; notes: string
}) {
  const firstName = d.name.split(" ")[0]
  const total = d.notes.split("\n").find(l => l.startsWith("TOTAL:"))?.replace("TOTAL:", "").trim() ?? ""
  return {
    to: [d.email],
    subject: `Pedido recibido — recogida ${d.date} a las ${d.time}`,
    html: wrapper(`
      ${header(`Pedido recibido,<br><em style="color:${C.ember}">${firstName}.</em>`)}
      <tr>
        <td style="padding-bottom: 24px; font-family:${SERIF}; font-size:17px; font-style:italic; color:${C.ink2}; line-height:1.55;">
          Hemos recibido tu pedido. Lo preparamos para que puedas recogerlo el ${d.date} a las ${d.time}.
        </td>
      </tr>
      ${row("Fecha recogida", d.date)}
      ${row("Hora",           d.time)}
      ${total ? row("Total estimado", `<span style="color:${C.ember}">${total}</span>`) : ""}
      ${footer("Si necesitas cambiar algo, llámanos al +34\u00a0918\u00a095\u00a032\u00a016 o responde a este email.")}
    `),
  }
}

export function tplConfirmarReserva(d: {
  name: string; email: string; date: string; time: string; guests: number
}) {
  const firstName = d.name.split(" ")[0]
  return {
    to: [d.email],
    subject: `Reserva confirmada — ${d.date} a las ${d.time}`,
    html: wrapper(`
      ${header(`Tu reserva está<br><em style="color:${C.ember}">confirmada.</em>`)}
      <tr>
        <td style="padding-bottom: 24px; font-family:${SERIF}; font-size:17px; font-style:italic; color:${C.ink2}; line-height:1.55;">
          Hola ${firstName}, te esperamos el ${d.date} a las ${d.time}.
          Mesa para ${d.guests} ${d.guests === 1 ? "persona" : "personas"}.
        </td>
      </tr>
      ${row("Fecha",    d.date)}
      ${row("Hora",     d.time)}
      ${row("Personas", String(d.guests))}
      ${footer("Si necesitas cambiar o cancelar tu reserva, llámanos al +34 918 95 32 16.")}
    `),
  }
}

export function tplConfirmarEncargo(d: {
  name: string; email: string; date: string; time: string; notes: string
}) {
  const firstName = d.name.split(" ")[0]
  const total = d.notes.split("\n").find(l => l.startsWith("TOTAL:"))?.replace("TOTAL:", "").trim() ?? ""
  return {
    to: [d.email],
    subject: `Encargo confirmado — recogida ${d.date} a las ${d.time}`,
    html: wrapper(`
      ${header(`Tu encargo está<br><em style="color:${C.ember}">confirmado.</em>`)}
      <tr>
        <td style="padding-bottom: 24px; font-family:${SERIF}; font-size:17px; font-style:italic; color:${C.ink2}; line-height:1.55;">
          Hola ${firstName}, tu pedido estará listo para recoger el ${d.date} a las ${d.time}.
        </td>
      </tr>
      ${row("Fecha recogida", d.date)}
      ${row("Hora",           d.time)}
      ${total ? row("Total estimado", `<span style="color:${C.ember}">${total}</span>`) : ""}
      ${footer("Si tienes alguna duda llámanos al +34 918 95 32 16.")}
    `),
  }
}

/* ─────────────────────────────────────────
   SEND — llama a la API de Resend
───────────────────────────────────────── */
export async function sendEmail(payload: {
  to: string[]
  subject: string
  html: string
}): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY no configurada — email omitido")
    return false
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: FROM, ...payload }),
    })
    if (!res.ok) {
      const err = await res.json()
      console.error("[email] Error Resend:", err)
      return false
    }
    return true
  } catch (e) {
    console.error("[email] Excepción:", e)
    return false
  }
}
