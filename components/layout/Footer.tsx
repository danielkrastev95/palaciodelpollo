import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              El Palacio<br /><em>del Pollo.</em>
            </div>
            <p className="serif" style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 16, maxWidth: 340 }}>
              Asador casero en Valdemoro. Pollos, costillar y comida de siempre,
              para llevar o comer aquí.
            </p>
          </div>

          <div className="footer-col">
            <h5>Visitar</h5>
            <ul>
              <li><a href="https://maps.google.com/?q=Calle+Pozo+Chico+30+Valdemoro" target="_blank" rel="noopener noreferrer">Calle Pozo Chico 30</a></li>
              <li><a href="https://maps.google.com/?q=Calle+Pozo+Chico+30+Valdemoro" target="_blank" rel="noopener noreferrer">28341 Valdemoro, Madrid</a></li>
              <li><a href="https://maps.google.com/?q=Calle+Pozo+Chico+30+Valdemoro" target="_blank" rel="noopener noreferrer">Cómo llegar →</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Horario</h5>
            <ul>
              <li>Todos los días · 12:00 — 16:00</li>
              <li><a href="tel:+34918953216">+34 918 95 32 16</a></li>
              <li>Encargos · llamar o pedir online</li>
            </ul>
          </div>

          <div className="footer-col">
            <h5>Seguir</h5>
            <ul>
              <li><a href="https://www.instagram.com/palaciodelpollovaldemoro_28341" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="#">Prensa &amp; reseñas</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2004 — {year} El Palacio del Pollo SL</span>
          <span>Diseñado con <span style={{ color: "var(--ember)" }}>◆</span> en Madrid</span>
          <span>
            <Link href="/legal" style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>Aviso legal</Link>
            {" · "}
            <Link href="/cookies" style={{ textDecoration: "underline", textUnderlineOffset: 2 }}>Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
