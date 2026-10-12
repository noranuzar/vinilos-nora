// Diseños de ejemplo (plantillas) + opción de escribir texto propio.
import { lineasDelDiseno, tamMuestra } from '../../lib/diseno'

export default function Ejemplos({ plantillas, fuentes, diseno, onElegir, onLibre }) {
  if (!plantillas.length) return null
  return (
    <fieldset className="grupo-control">
      <legend>Empieza con un ejemplo</legend>
      <div className="ejemplos">
        {plantillas.map((p) => {
          const f = fuentes.find((x) => x.id === p.fuente)
          const muestra = lineasDelDiseno({ modo: 'plantilla', plantillaId: p.id, campos: {} }, [p], { usarEjemplos: true })
          const activo = diseno.modo === 'plantilla' && diseno.plantillaId === p.id
          return (
            <button key={p.id} type="button" className="ejemplo" aria-pressed={activo} onClick={() => onElegir(p)}>
              <span className="ejemplo__muestra" style={{ fontFamily: `"${f.familia}"`, fontWeight: f.peso, fontSize: tamMuestra(muestra) }} aria-hidden="true">
                {muestra.map((l, i) => <span key={i} style={{ fontSize: `${p.tamLineas?.[i] ?? 1}em` }}>{l}</span>)}
              </span>
              <span className="ejemplo__nombre">{p.nombre}</span>
            </button>
          )
        })}
        <button type="button" className="ejemplo ejemplo--libre" aria-pressed={diseno.modo === 'libre'} onClick={onLibre}>
          <span className="ejemplo__muestra" aria-hidden="true"><span>Aa</span></span>
          <span className="ejemplo__nombre">Mi propio texto</span>
        </button>
      </div>
    </fieldset>
  )
}
