export default function SelectorAdorno({ adornos, posiciones, valor, posicion, onChange, onPosicion }) {
  return (
    <fieldset className="grupo-control">
      <legend>Adorno <span className="opcional">(opcional)</span></legend>
      <div className="adornos">
        <button type="button" className="adorno adorno--ninguno" aria-pressed={!valor} onClick={() => onChange(null)}>
          Sin adorno
        </button>
        {adornos.map((a) => (
          <button key={a.id} type="button" className="adorno" aria-pressed={valor === a.id} aria-label={a.nombre} title={a.nombre} onClick={() => onChange(a.id)}>
            <svg viewBox="0 0 100 100" width="30" height="30" aria-hidden="true"><path d={a.svg} fill="currentColor" /></svg>
          </button>
        ))}
      </div>
      {valor && (
        <div className="posiciones" role="group" aria-label="Posición del adorno">
          {posiciones.map((p) => (
            <button key={p.id} type="button" className="chip" aria-pressed={posicion === p.id} onClick={() => onPosicion(p.id)}>
              {p.nombre}
            </button>
          ))}
        </div>
      )}
    </fieldset>
  )
}
