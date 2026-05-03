import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal y condiciones de uso de El Palacio del Pollo.",
}

export default function LegalPage() {
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
          Aviso <em>Legal</em>
        </h1>

        <p className="serif" style={{ fontSize: 20, color: "var(--ink-2)", marginBottom: 48, maxWidth: 600 }}>
          Información legal sobre el titular del sitio web, condiciones de uso
          y política de privacidad.
        </p>

        <div className="rule" style={{ marginBottom: 48 }} />

        {/* Content */}
        <article className="legal-content">
          <section className="legal-section">
            <h2>Datos identificativos</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio,
              de Servicios de la Sociedad de la Información y Comercio Electrónico,
              se informa de los siguientes datos:
            </p>
            <ul>
              <li><strong>Razón social:</strong> El Palacio del Pollo S.L.</li>
              <li><strong>CIF:</strong> B-XXXXXXXX</li>
              <li><strong>Domicilio social:</strong> Calle Pozo Chico 30, 28341 Valdemoro, Madrid</li>
              <li><strong>Teléfono:</strong> +34 918 95 32 16</li>
              <li><strong>Email:</strong> info@palaciodpollo.es</li>
              <li><strong>Inscripción:</strong> Registro Mercantil de Madrid, Tomo XXXXX, Folio XXX, Hoja M-XXXXXX</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Objeto y ámbito de aplicación</h2>
            <p>
              El presente aviso legal regula el uso del sitio web www.palaciodpollo.es
              (en adelante, el &quot;Sitio Web&quot;), del que es titular El Palacio del Pollo S.L.
            </p>
            <p>
              La navegación por el Sitio Web atribuye la condición de usuario del mismo
              e implica la aceptación plena y sin reservas de todas y cada una de las
              disposiciones incluidas en este Aviso Legal.
            </p>
          </section>

          <section className="legal-section">
            <h2>Condiciones de uso</h2>
            <p>
              El usuario se compromete a hacer un uso adecuado de los contenidos y
              servicios que El Palacio del Pollo S.L. ofrece a través de su Sitio Web y,
              con carácter enunciativo pero no limitativo, a no emplearlos para:
            </p>
            <ul>
              <li>Incurrir en actividades ilícitas, ilegales o contrarias a la buena fe y al orden público.</li>
              <li>Difundir contenidos o propaganda de carácter racista, xenófobo, pornográfico-ilegal,
                de apología del terrorismo o atentatorio contra los derechos humanos.</li>
              <li>Provocar daños en los sistemas físicos y lógicos de El Palacio del Pollo S.L.,
                de sus proveedores o de terceras personas.</li>
              <li>Introducir o difundir en la red virus informáticos o cualesquiera otros sistemas
                físicos o lógicos que sean susceptibles de provocar los daños anteriormente mencionados.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>Propiedad intelectual e industrial</h2>
            <p>
              El Palacio del Pollo S.L. es titular de todos los derechos de propiedad intelectual
              e industrial de su página web, así como de los elementos contenidos en la misma
              (a título enunciativo: imágenes, sonido, audio, vídeo, software, textos, marcas,
              logotipos, combinaciones de colores, estructura y diseño, selección de materiales
              usados, programas de ordenador necesarios para su funcionamiento, acceso y uso, etc.).
            </p>
            <p>
              Quedan expresamente prohibidas la reproducción, la distribución y la comunicación
              pública, incluida su modalidad de puesta a disposición, de la totalidad o parte
              de los contenidos de esta página web, con fines comerciales, en cualquier soporte
              y por cualquier medio técnico, sin la autorización de El Palacio del Pollo S.L.
            </p>
          </section>

          <section className="legal-section">
            <h2>Exclusión de garantías y responsabilidad</h2>
            <p>
              El Palacio del Pollo S.L. no se hace responsable, en ningún caso, de los daños y
              perjuicios de cualquier naturaleza que pudieran ocasionar, a título enunciativo:
              errores u omisiones en los contenidos, falta de disponibilidad del portal o la
              transmisión de virus o programas maliciosos o lesivos en los contenidos, a pesar
              de haber adoptado todas las medidas tecnológicas necesarias para evitarlo.
            </p>
          </section>

          <section className="legal-section">
            <h2>Política de privacidad</h2>
            <p>
              De conformidad con lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento
              Europeo y del Consejo, de 27 de abril de 2016 (RGPD), y la Ley Orgánica 3/2018,
              de 5 de diciembre (LOPDGDD), le informamos que los datos personales que nos
              proporcione serán tratados por El Palacio del Pollo S.L.
            </p>

            <h3>Finalidad del tratamiento</h3>
            <p>Sus datos serán tratados para las siguientes finalidades:</p>
            <ul>
              <li>Gestión de reservas de mesa en el restaurante.</li>
              <li>Gestión de pedidos para llevar (encargos).</li>
              <li>Atención a consultas y solicitudes de información.</li>
              <li>Envío de comunicaciones comerciales (si ha dado su consentimiento).</li>
            </ul>

            <h3>Base legal</h3>
            <ul>
              <li>Ejecución de un contrato o precontrato (reservas y pedidos).</li>
              <li>Consentimiento del interesado (comunicaciones comerciales).</li>
              <li>Interés legítimo del responsable (mejora del servicio).</li>
            </ul>

            <h3>Conservación de datos</h3>
            <p>
              Los datos se conservarán durante el tiempo necesario para cumplir con la
              finalidad para la que se recabaron y para determinar las posibles responsabilidades
              que se pudieran derivar de dicha finalidad y del tratamiento de los datos.
            </p>

            <h3>Derechos del usuario</h3>
            <p>
              Puede ejercer sus derechos de acceso, rectificación, supresión, limitación,
              portabilidad y oposición enviando un email a info@palaciodpollo.es o por correo
              postal a nuestra dirección, adjuntando copia de su DNI.
            </p>
            <p>
              También tiene derecho a presentar una reclamación ante la Agencia Española
              de Protección de Datos (www.aepd.es).
            </p>
          </section>

          <section className="legal-section">
            <h2>Enlaces externos</h2>
            <p>
              Las páginas del Sitio Web pueden contener enlaces (links) a otras páginas de terceros.
              Por lo tanto, El Palacio del Pollo S.L. no asume responsabilidad por el contenido
              que pueda aparecer en páginas de terceros.
            </p>
          </section>

          <section className="legal-section">
            <h2>Legislación aplicable y jurisdicción</h2>
            <p>
              La relación entre El Palacio del Pollo S.L. y el usuario se regirá por la normativa
              española vigente. Cualquier controversia se someterá a los Juzgados y Tribunales
              de la ciudad de Madrid, salvo que la ley disponga otra cosa.
            </p>
          </section>

          <section className="legal-section">
            <h2>Política de cookies</h2>
            <p>
              Para más información sobre el uso de cookies en este sitio web, consulta nuestra{" "}
              <Link href="/cookies" style={{ color: "var(--ember)", textDecoration: "underline" }}>
                Política de Cookies
              </Link>.
            </p>
          </section>

          <section className="legal-section">
            <h2>Modificación del aviso legal</h2>
            <p>
              El Palacio del Pollo S.L. se reserva el derecho a modificar el presente Aviso Legal
              para adaptarlo a novedades legislativas o jurisprudenciales, así como a prácticas
              de la industria. En dichos supuestos, se anunciará en esta página los cambios
              introducidos con razonable antelación a su puesta en práctica.
            </p>
            <p>
              <strong>Última actualización:</strong> Enero 2025
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

        /* Dark mode */
        body.dark .legal-section h2 {
          border-bottom-color: rgba(243, 237, 225, 0.12);
        }

        @media (max-width: 640px) {
          .legal-section h2 {
            font-size: 24px;
          }
        }
      `}</style>
    </section>
  )
}
