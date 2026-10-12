// Posición y tamaño del diseño dentro de la zona imprimible del producto.
// Alineación para todas las líneas a la vez o para cada línea por separado.
import { AlignLeft, AlignCenter, AlignRight, Crosshair } from 'lucide-react'
import { AJUSTE_INICIAL } from '../../context/DisenoContext'

const ALINEACIONES = [
  { id: 'izquierda', nombre: 'Izquierda', Icono: AlignLeft },
  { id: 'centro', nombre: 'Centro', Icono: AlignCenter },
  { id: 'derecha', nombre: 'Derecha', Icono: AlignRight },
]

export default function SelectorAjuste({ ajuste, lineas, onChange, conZona, verZona, onVerZona }) {
  const n = lineas.length
  const usadas = ajuste.alineaciones.slice(0, n)
  const todasIgual = usadas.every((a) => a === usadas[0]) ? usadas[0] : null
  const puedeMover = ajuste.escala < 100
  const centrado = todasIgual === 'centro' && ajuste.escala === 100 && ajuste.desX === 0 && ajuste.desY === 0

  const alinearTodas = (id) => onChange({ alineaciones: ajuste.alineaciones.map(() => id) })
  const alinearLinea = (i, id) => {
    const a = [...ajuste.alineaciones]
    a[i] = id
    onChange({ alineaciones: a })
  }

  return (
    <fieldset className="grupo-control">
      <legend>Posición y tamaño</legend>

      <div className="ajuste__fila">
        <div className="campo">
          <span className="leyenda-sec" id="lbl-alinear-todas">{n > 1 ? 'Alinear todas las líneas' : 'Alinear'}</span>
          <div className="posiciones" role="group" aria-labelledby="lbl-alinear-todas">
            {ALINEACIONES.map(({ id, nombre, Icono }) => (
              <button key={id} type="button" className="chip chip--icono" aria-pressed={todasIgual === id} onClick={() => alinearTodas(id)}>
                <Icono size={18} aria-hidden="true" /> {nombre}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="boton boton--secundario boton--compacto"
          onClick={() => onChange({ ...AJUSTE_INICIAL })}
          disabled={centrado}
        >
          <Crosshair size={18} aria-hidden="true" /> Centrar y ajustar
        </button>
      </div>

      {n > 1 && (
        <div className="campo">
          <span className="leyenda-sec">Alinear cada línea</span>
          <ul className="lineas-alin">
            {lineas.map((texto, i) => (
              <li key={i} className="linea-alin">
                <span className="linea-alin__texto" title={texto}>{texto}</span>
                <span className="linea-alin__botones" role="group" aria-label={`Línea ${i + 1}: ${texto}`}>
                  {ALINEACIONES.map(({ id, nombre, Icono }) => (
                    <button
                      key={id}
                      type="button"
                      className="chip chip--solo-icono"
                      aria-pressed={(ajuste.alineaciones[i] || 'centro') === id}
                      aria-label={`Alinear línea ${i + 1} a ${id === 'centro' ? 'el centro' : `la ${nombre.toLowerCase()}`}`}
                      onClick={() => alinearLinea(i, id)}
                    >
                      <Icono size={18} aria-hidden="true" />
                    </button>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {conZona && (
        <>
          <div className="campo">
            <label htmlFor="ajuste-escala">Tamaño en el producto <span className="contador-car">{ajuste.escala}%</span></label>
            <input id="ajuste-escala" type="range" min="40" max="100" step="5" value={ajuste.escala}
              onChange={(e) => onChange({ escala: Number(e.target.value) })}
              aria-valuetext={`${ajuste.escala} por ciento de la zona imprimible`} />
          </div>

          <div className="ajuste__mover">
            <div className="campo">
              <label htmlFor="ajuste-x">Mover a los lados</label>
              <input id="ajuste-x" type="range" min="-100" max="100" step="10" value={ajuste.desX} disabled={!puedeMover}
                onChange={(e) => onChange({ desX: Number(e.target.value) })}
                aria-valuetext={ajuste.desX === 0 ? 'centrado' : ajuste.desX < 0 ? 'hacia la izquierda' : 'hacia la derecha'} />
            </div>
            <div className="campo">
              <label htmlFor="ajuste-y">Mover arriba o abajo</label>
              <input id="ajuste-y" type="range" min="-100" max="100" step="10" value={ajuste.desY} disabled={!puedeMover}
                onChange={(e) => onChange({ desY: Number(e.target.value) })}
                aria-valuetext={ajuste.desY === 0 ? 'centrado' : ajuste.desY < 0 ? 'hacia arriba' : 'hacia abajo'} />
            </div>
          </div>
          {!puedeMover && <p className="ayuda">Al 100 % el texto ocupa toda la zona. Redúcelo para poder moverlo.</p>}

          <label className="casilla" htmlFor="ver-zona">
            <input id="ver-zona" type="checkbox" checked={verZona} onChange={(e) => onVerZona(e.target.checked)} />
            Ver la zona donde se puede poner el vinilo
          </label>
        </>
      )}
    </fieldset>
  )
}
