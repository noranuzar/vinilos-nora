// Dibuja el texto (y el adorno) en SVG y ajusta el encuadre al contenido.
// Cada línea puede tener su propia alineación dentro del bloque de texto.
// Las fuentes se esperan antes de medir para que la vista previa sea fiel.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const TAM = 100            // tamaño de letra en unidades SVG
const INTERLINEA = 1.18
const ADORNO = 78          // tamaño del adorno
const HUECO = 18           // separación adorno-texto
export const MAYUSCULA = 0.7  // altura aprox. de una mayúscula respecto al tamaño de letra

const ANCLA = { izquierda: 'start', centro: 'middle', derecha: 'end' }
const ENCAJE = { izquierda: 'xMinYMid meet', centro: 'xMidYMid meet', derecha: 'xMaxYMid meet' }

// Alineación común si todas las líneas coinciden; si no, 'centro' para el conjunto.
export const alineacionGeneral = (alineaciones, n) => {
  const usadas = alineaciones.slice(0, Math.max(1, n))
  return usadas.every((a) => a === usadas[0]) ? usadas[0] : 'centro'
}

/**
 * Mide el ancho de cada línea, coloca cada una según su alineación
 * respecto al bloque (ancho de la línea más larga) y devuelve la caja total.
 */
// Base de cada línea: deja sitio a los rasgos bajos de la anterior y a la altura de la actual.
export function basesLineas(tamanos, tam = TAM) {
  const bases = []
  tamanos.forEach((f, i) => {
    bases.push(i === 0 ? 0 : bases[i - 1] + tam * (0.3 * tamanos[i - 1] + 0.9 * f) * (INTERLINEA / 1.2))
  })
  return bases
}

export function useTexto({ lineas, fuente, alineaciones, tamanos = [], tam = TAM }) {
  const refs = useRef([])
  const grupo = useRef(null)
  const [anchos, setAnchos] = useState([])
  const [caja, setCaja] = useState(null)
  const claveTexto = `${lineas.join('\n')}|${fuente.id}|${tam}|${tamanos.join(',')}`

  // 1) Anchos de cada línea (otra vez cuando la fuente termina de cargar).
  useLayoutEffect(() => {
    let cancelado = false
    const medir = () => {
      if (cancelado) return
      setAnchos(lineas.map((_, i) => refs.current[i]?.getComputedTextLength?.() || 0))
    }
    medir()
    if (document.fonts?.load) {
      document.fonts.load(`${fuente.peso} ${TAM}px "${fuente.familia}"`, lineas.join(' ') || 'Aa').then(medir, medir)
    }
    return () => { cancelado = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claveTexto])

  // 2) Caja final, ya con las líneas colocadas.
  useLayoutEffect(() => {
    if (!grupo.current) return
    const b = grupo.current.getBBox()
    setCaja({ x: b.x, y: b.y, width: b.width, height: b.height })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchos, alineaciones.join(',')])

  const bloque = Math.max(0, ...anchos)
  const xDe = (i) => {
    const a = alineaciones[i] || 'centro'
    return a === 'izquierda' ? -bloque / 2 : a === 'derecha' ? bloque / 2 : 0
  }
  return { refs, grupo, caja, xDe }
}

export function Lineas({ lineas, fuente, color, alineaciones, tamanos = [], tam = TAM, texto }) {
  const f = lineas.map((_, i) => tamanos[i] ?? 1)
  const bases = basesLineas(f, tam)
  return (
    <g ref={texto.grupo} fill={color.hex} style={{ fontFamily: `"${fuente.familia}"`, fontWeight: fuente.peso }}>
      {lineas.map((l, i) => (
        <text
          key={i}
          ref={(el) => { texto.refs.current[i] = el }}
          x={texto.xDe(i)}
          y={bases[i]}
          fontSize={tam * f[i]}
          textAnchor={ANCLA[alineaciones[i] || 'centro']}
        >
          {l}
        </text>
      ))}
    </g>
  )
}

// Posición del adorno respecto a la caja del texto.
export function cajaAdorno(caja, posicion, tam = ADORNO, hueco = HUECO, alineacion = 'centro') {
  if (!caja) return null
  const cy = caja.y + caja.height / 2
  if (posicion === 'izquierda') return { x: caja.x - hueco - tam, y: cy - tam / 2, s: tam }
  if (posicion === 'derecha') return { x: caja.x + caja.width + hueco, y: cy - tam / 2, s: tam }
  // Arriba: sigue la alineación del texto
  const x = alineacion === 'izquierda' ? caja.x
    : alineacion === 'derecha' ? caja.x + caja.width - tam
    : caja.x + caja.width / 2 - tam / 2
  return { x, y: caja.y - hueco - tam, s: tam }
}

export function Adorno({ adorno, caja, color }) {
  if (!adorno || !caja) return null
  return (
    <svg x={caja.x} y={caja.y} width={caja.s} height={caja.s} viewBox="0 0 100 100" aria-hidden="true">
      <path d={adorno.svg} fill={color.hex} />
    </svg>
  )
}

export function unir(...cajas) {
  const v = cajas.filter(Boolean)
  if (!v.length) return null
  const x1 = Math.min(...v.map((c) => c.x))
  const y1 = Math.min(...v.map((c) => c.y))
  const x2 = Math.max(...v.map((c) => c.x + (c.width ?? c.s)))
  const y2 = Math.max(...v.map((c) => c.y + (c.height ?? c.s)))
  return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
}

// Avisa al padre solo cuando la medida cambia (redondeada a milímetros).
export function useInformarMedida(medida, onMedida) {
  const ultima = useRef('')
  useEffect(() => {
    if (!onMedida) return
    const clave = medida ? `${medida.letraCm.toFixed(2)}|${medida.anchoCm.toFixed(1)}|${medida.altoCm.toFixed(1)}` : ''
    if (clave !== ultima.current) { ultima.current = clave; onMedida(medida) }
  })
}

// Texto + adorno que se encajan en el espacio disponible.
// zonaCm: medida real aproximada del espacio (ancho/alto en cm), para calcular la altura de letra.
export default function DisenoSvg({ lineas, fuente, color, adorno, posicion, alineaciones, tamanos = [], zonaCm, onMedida, sombra = false }) {
  const texto = useTexto({ lineas, fuente, alineaciones, tamanos })
  const general = alineacionGeneral(alineaciones, lineas.length)
  const cAdorno = adorno ? cajaAdorno(texto.caja, posicion, ADORNO, HUECO, general) : null
  const total = unir(texto.caja, cAdorno)
  // Margen pequeño según el lado corto (la zona del producto ya deja su margen de seguridad)
  const m = total ? Math.min(total.width, total.height) * 0.04 : 0
  const vb = total ? `${total.x - m} ${total.y - m} ${total.width + 2 * m} ${total.height + 2 * m}` : '-200 -100 400 200'

  // cm por unidad SVG: el encaje "meet" usa la menor de las dos escalas.
  let medida = null
  if (total && zonaCm) {
    const k = Math.min(zonaCm.ancho / (total.width + 2 * m), zonaCm.alto / (total.height + 2 * m))
    const mayor = Math.max(1, ...lineas.map((_, i) => tamanos[i] ?? 1))
    medida = { letraCm: TAM * mayor * MAYUSCULA * k, anchoCm: total.width * k, altoCm: total.height * k }
  }
  useInformarMedida(medida, onMedida)

  return (
    <svg
      className="diseno-svg"
      viewBox={vb}
      preserveAspectRatio={ENCAJE[general]}
      aria-hidden="true"
      style={sombra ? { filter: 'drop-shadow(0 0.5px 0.6px rgba(0,0,0,.25))' } : undefined}
    >
      <Lineas lineas={lineas} fuente={fuente} color={color} alineaciones={alineaciones} tamanos={tamanos} texto={texto} />
      <Adorno adorno={adorno} caja={cAdorno} color={color} />
    </svg>
  )
}
