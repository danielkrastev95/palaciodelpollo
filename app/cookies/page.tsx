import type { Metadata } from "next"
import CookieSettingsButton from "./CookieSettingsButton"

export const metadata: Metadata = {
  title: "Política de Cookies",
  description: "Información sobre el uso de cookies en El Palacio del Pollo.",
}

export default function CookiesPage() {
  return (
    <section style={{ paddingTop: 60, paddingBottom: 100 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        {/* Header */}
        <div className="chapter">
          <span className="chapter-num">§</span>
          <span className="chapter-label">Legal</span>
          <div className="chapter-line" />
        </div>

        <h1 className="section-title" style={{ marginBottom: 16 }}>
          Política de <em>Cookies</em>
        </h1>

        <p className="serif" style={{ fontSize: 20, color: "var(--ink-2)", marginBottom: 48, maxWidth: 600 }}>
          En esta página explicamos qué son las cookies, qué tipos utilizamos
          y cómo puedes gestionarlas.
        </p>

        <div className="rule" style={{ marginBottom: 48 }} />

        {/* Content */}
        <article className="legal-content">
          <section className="legal-section">
            <h2>¿Qué son las cookies?</h2>
            <p>
              Las cookies son pequeños archivos de texto que los sitios web almacenan
              en tu dispositivo (ordenador, móvil o tablet) cuando los visitas.
              Permiten que el sitio recuerde información sobre tu visita, como tu
              idioma preferido y otras opciones, lo que puede facilitar tu próxima
              visita y hacer que el sitio te resulte más útil.
            </p>
          </section>

          <section className="legal-section">
            <h2>¿Quién es el responsable?</h2>
            <p>
              <strong>El Palacio del Pollo S.L.</strong><br />
              Calle Pozo Chico 30<br />
              28341 Valdemoro, Madrid<br />
              CIF: B-XXXXXXXX<br />
              Email: info@palaciodpollo.es
            </p>
          </section>

          <section className="legal-section">
            <h2>Tipos de cookies que utilizamos</h2>

            <h3>Cookies necesarias</h3>
            <p>
              Son imprescindibles para el funcionamiento del sitio web. Sin ellas,
              algunas funciones básicas no funcionarían correctamente. No almacenan
              información personal identificable.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Finalidad</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>cookie_consent</code></td>
                  <td>Almacena tus preferencias de cookies</td>
                  <td>1 año</td>
                </tr>
                <tr>
                  <td><code>theme</code></td>
                  <td>Recuerda si prefieres modo claro u oscuro</td>
                  <td>1 año</td>
                </tr>
                <tr>
                  <td><code>admin_authenticated</code></td>
                  <td>Sesión del panel de administración (solo admins)</td>
                  <td>8 horas</td>
                </tr>
              </tbody>
            </table>

            <h3>Cookies analíticas</h3>
            <p>
              Nos permiten contar visitas y fuentes de tráfico para medir y mejorar
              el rendimiento del sitio. Toda la información que recogen es agregada
              y anónima.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Proveedor</th>
                  <th>Finalidad</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>_ga</code></td>
                  <td>Google Analytics</td>
                  <td>Distinguir usuarios únicos</td>
                  <td>2 años</td>
                </tr>
                <tr>
                  <td><code>_gid</code></td>
                  <td>Google Analytics</td>
                  <td>Distinguir usuarios</td>
                  <td>24 horas</td>
                </tr>
              </tbody>
            </table>
            <p className="legal-note">
              * Solo se activan si aceptas las cookies analíticas.
            </p>

            <h3>Cookies de marketing</h3>
            <p>
              Permiten mostrarte publicidad relevante basada en tus intereses.
              También limitan el número de veces que ves un anuncio y ayudan a
              medir la efectividad de las campañas publicitarias.
            </p>
            <table className="legal-table">
              <thead>
                <tr>
                  <th>Cookie</th>
                  <th>Proveedor</th>
                  <th>Finalidad</th>
                  <th>Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>_fbp</code></td>
                  <td>Meta (Facebook)</td>
                  <td>Seguimiento de conversiones</td>
                  <td>3 meses</td>
                </tr>
              </tbody>
            </table>
            <p className="legal-note">
              * Solo se activan si aceptas las cookies de marketing.
            </p>
          </section>

          <section className="legal-section">
            <h2>¿Cómo gestionar las cookies?</h2>
            <p>
              Puedes cambiar tus preferencias de cookies en cualquier momento
              haciendo clic en el botón de abajo:
            </p>
            <CookieSettingsButton />
            <p style={{ marginTop: 24 }}>
              También puedes configurar tu navegador para que bloquee o elimine
              las cookies. Aquí tienes enlaces a las instrucciones de los
              navegadores más comunes:
            </p>
            <ul>
              <li>
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                  Google Chrome
                </a>
              </li>
              <li>
                <a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noopener noreferrer">
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">
                  Safari
                </a>
              </li>
              <li>
                <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-las-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                  Microsoft Edge
                </a>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Actualizaciones de esta política</h2>
            <p>
              Podemos actualizar esta Política de Cookies para reflejar cambios
              en las cookies que utilizamos o por otros motivos operativos,
              legales o reglamentarios. Te recomendamos revisar esta página
              periódicamente.
            </p>
            <p>
              <strong>Última actualización:</strong> Enero 2025
            </p>
          </section>

          <section className="legal-section">
            <h2>Contacto</h2>
            <p>
              Si tienes alguna pregunta sobre nuestra Política de Cookies, puedes
              contactarnos en:
            </p>
            <p>
              <strong>Email:</strong> info@palaciodpollo.es<br />
              <strong>Teléfono:</strong> +34 918 95 32 16<br />
              <strong>Dirección:</strong> Calle Pozo Chico 30, 28341 Valdemoro, Madrid
            </p>
          </section>
        </article>
      </div>

      <style>{`
        .legal-content {
          font-family: var(--font-ui);
          font-size: 16px;
          line-height: 1.7;
          color: var(--ink);
        }

        .legal-section {
          margin-bottom: 48px;
        }

        .legal-section h2 {
          font-family: var(--font-display);
          font-size: 28px;
          font-weight: 400;
          letter-spacing: -0.01em;
          margin-bottom: 16px;
          color: var(--ink);
          border-bottom: 1px solid rgba(26, 20, 16, 0.15);
          padding-bottom: 12px;
        }

        .legal-section h3 {
          font-family: var(--font-mono);
          font-size: 12px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ember);
          margin-top: 32px;
          margin-bottom: 12px;
        }

        .legal-section p {
          margin-bottom: 16px;
          color: var(--ink-2);
        }

        .legal-section strong {
          color: var(--ink);
        }

        .legal-section ul {
          list-style: none;
          padding: 0;
          margin: 16px 0;
        }

        .legal-section ul li {
          padding: 8px 0;
          padding-left: 20px;
          position: relative;
          color: var(--ink-2);
        }

        .legal-section ul li::before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--ember);
        }

        .legal-section ul li a {
          color: var(--ember);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .legal-section ul li a:hover {
          color: var(--ink);
        }

        .legal-table {
          width: 100%;
          border-collapse: collapse;
          margin: 16px 0;
          font-size: 14px;
        }

        .legal-table th,
        .legal-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid rgba(26, 20, 16, 0.15);
        }

        .legal-table th {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--ink-3);
          background: var(--paper-2);
        }

        .legal-table td {
          color: var(--ink-2);
        }

        .legal-table code {
          font-family: var(--font-mono);
          font-size: 12px;
          background: var(--paper-2);
          padding: 2px 6px;
          border-radius: 2px;
          color: var(--ink);
        }

        .legal-note {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.1em;
          color: var(--ink-3);
          font-style: normal !important;
        }

        /* Dark mode */
        body.dark .legal-section h2 {
          border-bottom-color: rgba(243, 237, 225, 0.12);
        }

        body.dark .legal-table th,
        body.dark .legal-table td {
          border-bottom-color: rgba(243, 237, 225, 0.12);
        }

        @media (max-width: 640px) {
          .legal-table {
            font-size: 12px;
          }

          .legal-table th,
          .legal-table td {
            padding: 8px 10px;
          }

          .legal-section h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  )
}
