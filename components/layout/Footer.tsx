import Link from "next/link"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-row">
          <div className="footer-left">
            <div className="footer-brand">
              El Palacio<br /><em>del Pollo.</em>
            </div>
            <div className="footer-since">Desde 1978</div>
          </div>

          <div className="footer-right">
            <a
              className="footer-line"
              href="https://maps.google.com/?q=Calle+Pozo+Chico+30+Valdemoro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pozo Chico 30 · Valdemoro
            </a>
            <a className="footer-line" href="tel:+34918953216">
              +34 918 95 32 16
            </a>
            <a
              className="footer-line"
              href="https://www.instagram.com/palaciodelpollovaldemoro_28341"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} El Palacio del Pollo</span>
          <span>
            <Link href="/legal">Aviso legal</Link>
            {" · "}
            <Link href="/cookies">Cookies</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
