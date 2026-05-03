import { RITUAL_STEPS } from "@/lib/content"

export default function Ritual() {
  return (
    <section className="ritual" id="ritual">
      <div className="container">
        <div className="chapter">
          <span className="chapter-num">Cap. I</span>
          <span className="chapter-label">El Ritual de la Casa</span>
          <span className="chapter-line" />
        </div>

        <div className="ritual-grid">
          <div>
            <h2 className="section-title"><em>Así</em> se hace<br />un pollo.</h2>
            <p className="ritual-lede">
              Nadie se sienta aquí a comer rápido. Vienen a oler la leña, a oír cómo crepita
              la grasa al caer sobre la brasa, a esperar los noventa minutos que tarda un
              pollo en convertirse en <em>el</em> pollo.
            </p>
          </div>

          <div className="ritual-steps">
            {RITUAL_STEPS.map((s) => (
              <div className="ritual-step" key={s.num}>
                <div className="ritual-step-num"><em>{s.num}</em></div>
                <div className="ritual-step-body">
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                </div>
                <div className="ritual-step-time">{s.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
