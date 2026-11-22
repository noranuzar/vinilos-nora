import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useCatalogo } from '../context/CatalogoContext'
import SolicitudWhatsApp from './SolicitudWhatsApp'

// Diseño real del taller (dibujo fijo en SVG) con colores a elegir:
// dos colores (dibujo / nombre y corazones) o uno solo.
// El SVG usa las variables --oso y --txt, así que se recolorea sin tocar el archivo.
// Si el diseño tiene «lineas», el cliente puede cambiar el texto: mientras no escriba
// se ve el trabajo original; en cuanto escribe, se dibuja en directo con una fuente parecida.
export default function DisenoTaller({ diseno, nombre }) {
  const { config, superficies, colores: inventario } = useCatalogo()
  // Solo los soportes compatibles de este diseño.
  const lugares = (diseno.superficies || []).map((id) => superficies.find((s) => s.id === id)).filter(Boolean)
  const propias = lugares
  const [lugarId, setLugarId] = useState(propias[0]?.id || 'blanco')
  const lugar = lugares.find((s) => s.id === lugarId)
  // Colores reales del material del diseño; si el diseño limita colores, solo esos.
  const paleta = inventario.filter((c) => c.tipo === (diseno.material || 'adhesivo') && (!diseno.colores || diseno.colores.includes(c.id)))
  const hex = (id) => inventario.find((c) => c.id === id)?.hex
  // Colores muy claros (blanco, plateado, beige…) apenas se ven sobre fondos claros: solo en pantalla
  // se añade un contorno suave. No cambia el vector ni el color del vinilo.
  const claro = (id) => { const h = hex(id); if (!h) return false; const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.62 }
  const variantes = diseno.variantes || []
  const [varianteId, setVarianteId] = useState(variantes[0]?.id)
  const variante = variantes.find((v) => v.id === varianteId)
  const archivo = variante?.svg || diseno.svg
  const [svg, setSvg] = useState('')
  const [revisando, setRevisando] = useState(false)
  const raiz = useRef(null)
  // Nombre editable sobre el propio SVG (ositos): mismo texto, misma fuente y misma geometría que irá al corte.
  const ne = diseno.nombreEditable?.estado === 'activo' ? diseno.nombreEditable : null
  const nombreMostrado = ne ? (nombre?.trim() || ne.ejemplo) : null
  const [reduccion, setReduccion] = useState(1)
  const [dos, setDos] = useState(diseno.dosColores)
  const [colorDibujo, setColorDibujo] = useState(diseno.colorDibujo)
  const [colorTexto, setColorTexto] = useState(diseno.colorTexto)
  const lineas = diseno.lineas || []
  const [propio, setPropio] = useState({})

  useEffect(() => {
    let vivo = true
    fetch(archivo).then((r) => r.text()).then((t) => { if (vivo) setSvg(t) }).catch(() => {})
    return () => { vivo = false }
  }, [archivo])

  useLayoutEffect(() => {
    if (!ne || !svg) return
    let vivo = true
    const pintar = () => {
      const slot = raiz.current?.querySelector('#slot-nombre')
      if (vivo && slot) setReduccion(pintarNombre(slot, nombreMostrado, ne))
    }
    pintar()
    document.fonts?.load(`${ne.fuente.peso} 100px "${ne.fuente.familia}"`).then(pintar).catch(() => {})
    return () => { vivo = false }
  }, [svg, nombreMostrado, lugarId, ne])

  // Medida aproximada: el diseño se ajusta a la zona del soporte (anchoCm × altoCm) sin deformarse.
  const vb = svg.match(/viewBox="([^"]+)"/)?.[1]?.split(/[\s,]+/).map(Number)
  const z = lugar?.zona
  let medida = null
  if (!escritoVivo() && vb && z?.anchoCm && z?.altoCm) {
    const prop = vb[2] / vb[3]
    const ancho = Math.min(z.anchoCm, z.altoCm * prop)
    medida = `${Math.round(ancho)} × ${Math.round(ancho / prop)} cm`
  }

  function escritoVivo() { return (diseno.lineas || []).some((l) => { const v = (propio[l.campo] ?? (l.deSeccion ? nombre : '')).trim(); return v && v !== l.ejemplo }) }

  // Valor de cada línea: lo que escribe el cliente aquí o, si la línea lo permite, el nombre de la sección.
  const valor = (l) => propio[l.campo] ?? (l.deSeccion ? nombre : '')
  const escrito = lineas.some((l) => valor(l).trim() && valor(l).trim() !== l.ejemplo)
  const textos = lineas.map((l) => ({ ...l, texto: (valor(l).trim() || l.ejemplo || '') })).filter((l) => l.texto)

  const dibujo = dos ? colorDibujo : colorTexto
  const conContorno = claro(dibujo) || claro(colorTexto)
  const nombreColor = (id) => inventario.find((c) => c.id === id)?.nombre || id
  const que = diseno.queTexto || 'nombre'
  const colores = dos
    ? `${(diseno.etiquetaDibujo || 'dibujo').toLowerCase()} ${nombreColor(dibujo)}, ${(diseno.etiquetaTexto || 'nombre y corazones').toLowerCase()} ${nombreColor(colorTexto)}`
    : `todo en ${nombreColor(colorTexto)}`
  const textoPedido = diseno.sinTexto ? 'El texto del diseño, tal cual'
    : lineas.length ? lineas.map((l) => `${l.etiqueta}: ${valor(l).trim() || 'te lo digo por WhatsApp'}`).join(' · ')
    : (nombre?.trim() || 'Te lo digo por WhatsApp')
  const material = (diseno.material || 'adhesivo') === 'textil' ? 'Vinilo textil' : 'Vinilo adhesivo'
  const filas = [
    ['Diseño', `${diseno.nombre}${variante ? ` (${variante.nombre.toLowerCase()})` : ''}`],
    [diseno.sinTexto || lineas.length ? 'Texto' : (que === 'nombre' ? 'Nombre' : que), textoPedido],
    ['Colores', colores.charAt(0).toUpperCase() + colores.slice(1)],
    ne ? ['Tipo de letra', `${ne.fuente.nombre} (oficial provisional)`] : null,
    ['Material', material],
    ['Soporte', lugar ? lugar.nombre : 'Sin soporte (vista sobre fondo blanco)'],
  ]
  const filasResumen = filas.filter(Boolean)
  const referencia = (diseno.codigo || diseno.id).toUpperCase()

  const contenido = escrito
    ? { children: <TextoVivo lineas={textos} separacion={diseno.separacion || 0} /> }
    : { dangerouslySetInnerHTML: { __html: svg } }

  const Paleta = ({ valor, alElegir, etiqueta }) => (
    <div className="taller__paleta" role="group" aria-label={etiqueta}>
      {paleta.map((c) => (
        <button key={c.id} type="button" className="taller__color" style={{ background: c.hex }}
          aria-label={c.nombre} title={c.nombre} aria-pressed={valor === c.id} onClick={() => alElegir(c.id)} />
      ))}
    </div>
  )

  return (
    <article className="taller" ref={raiz}>
      {lugar ? (
        <div className="taller__escena" style={{ backgroundImage: `url(${lugar.imagen})` }}
          role="img" aria-label={`${diseno.nombre} sobre ${lugar.nombre.toLowerCase()}, imagen de ejemplo`}>
          <div className={`taller__zona${conContorno ? ' taller__contorno' : ''}`} style={{
            left: `${lugar.zona.x - lugar.zona.ancho / 2}%`, top: `${lugar.zona.y - lugar.zona.alto / 2}%`,
            width: `${lugar.zona.ancho}%`, height: `${lugar.zona.alto}%`, '--oso': hex(dibujo), '--txt': hex(colorTexto),
          }} {...contenido} />
          <span className="taller__aviso">Imagen de ejemplo</span>
        </div>
      ) : (
        <div className={`taller__lienzo${conContorno ? ' taller__contorno' : ''}`} style={{ '--oso': hex(dibujo), '--txt': hex(colorTexto) }}
          role="img" aria-label={`${diseno.nombre}, diseño de ejemplo`} {...contenido} />
      )}
      <div className="taller__lugares" role="group" aria-label="Ver el diseño sobre">
        {[{ id: 'blanco', nombre: 'Blanco' }, ...lugares].map((l) => (
          <button key={l.id} type="button" aria-pressed={lugarId === l.id} onClick={() => setLugarId(l.id)}>{l.nombre}</button>
        ))}
      </div>
      <div className="taller__cuerpo">
        <h3 className="taller__titulo">{diseno.nombre} <span className="etiqueta-real">Hecho en el taller</span></h3>
        {diseno.nota && <p className="taller__nota">{diseno.nota}</p>}
        {variantes.length > 1 && (
          <>
            <p className="taller__etiqueta">Composición</p>
            <div className="taller__modo taller__modo--varias" role="group" aria-label="Composición">
              {variantes.map((v) => (
                <button key={v.id} type="button" aria-pressed={varianteId === v.id} onClick={() => setVarianteId(v.id)}>{v.nombre}</button>
              ))}
            </div>
          </>
        )}
        {ne && reduccion < 0.995 && (
          <p className="taller__medida">Nombre largo: la letra se ha reducido al {Math.round(reduccion * 100)} % para que quepa en el diseño, sin deformarla. Lo revisaré contigo antes de cortar.</p>
        )}
        {medida && <p className="taller__medida">Medida aproximada en este soporte: <strong>{medida}</strong></p>}
        {lineas.map((l) => (
          <div className="campo taller__campo" key={l.campo}>
            <label htmlFor={`${diseno.id}-${l.campo}`}>{l.etiqueta}</label>
            <input id={`${diseno.id}-${l.campo}`} type="text" maxLength={l.maxLength || 30}
              inputMode={l.soloNumeros ? 'numeric' : undefined} placeholder={l.ejemplo || ''}
              value={valor(l)} onChange={(e) => {
                const v = l.soloNumeros ? e.target.value.replace(/\D/g, '') : e.target.value
                setPropio((p) => ({ ...p, [l.campo]: v }))
              }} />
          </div>
        ))}
        {!diseno.unColor && (
          <div className="taller__modo" role="group" aria-label="Número de colores">
            <button type="button" aria-pressed={dos} onClick={() => setDos(true)}>Dos colores</button>
            <button type="button" aria-pressed={!dos} onClick={() => setDos(false)}>Un color</button>
          </div>
        )}
        {dos && (
          <>
            <p className="taller__etiqueta">{diseno.etiquetaDibujo || 'Dibujo'}</p>
            <Paleta valor={colorDibujo} alElegir={setColorDibujo} etiqueta="Color del dibujo" />
          </>
        )}
        <p className="taller__etiqueta">{dos ? (diseno.etiquetaTexto || 'Nombre y corazones') : 'Color'}</p>
        <Paleta valor={colorTexto} alElegir={setColorTexto} etiqueta={dos ? 'Color del nombre y los corazones' : 'Color del diseño'} />
        {config.avisoColores && <p className="taller__medida">{config.avisoColores}</p>}
        {conContorno && <p className="taller__medida">El contorno gris de la imagen solo sirve para ver el color claro en pantalla; no forma parte del vinilo.</p>}
        {revisando
          ? <SolicitudWhatsApp referencia={referencia} filas={filasResumen} onEditar={() => setRevisando(false)} />
          : <button type="button" className="boton boton--principal taller__pedir" onClick={() => setRevisando(true)}>Revisar solicitud</button>}
      </div>
    </article>
  )
}

// Texto en directo. Cada línea tiene «alto» en cm (altura de mayúscula); se apilan de abajo arriba
// con «separacion» cm entre ellas. La última línea es la principal: es la que llena la zona de la
// superficie, y las demás quedan por encima a su escala real (p. ej. nombre de 4 cm sobre número de 22).
function TextoVivo({ lineas, separacion }) {
  const ref = useRef(null)
  const [caja, setCaja] = useState('0 -10 40 10')
  const CAP = 0.7
  let base = 0
  const filas = [...lineas].reverse().map((l, i) => {
    if (i > 0) base -= separacion
    const fila = { ...l, y: base }
    base -= l.alto
    return fila
  }).reverse()
  const clave = lineas.map((l) => l.texto + l.fuente).join('|')

  useLayoutEffect(() => {
    let vivo = true
    const medir = () => {
      const t = ref.current?.querySelector('text[data-principal]')
      if (!t || !vivo) return
      const b = t.getBBox()
      const alto = lineas[lineas.length - 1].alto
      setCaja(`${b.x} ${-alto} ${b.width} ${alto}`)
    }
    medir()
    document.fonts?.ready.then(medir)
    return () => { vivo = false }
  }, [clave])

  return (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" viewBox={caja} style={{ overflow: 'visible' }} aria-hidden="true">
      {filas.map((l, i) => (
        <text key={l.campo} x={0} y={l.y} data-principal={i === filas.length - 1 ? '' : undefined}
          textAnchor="middle"
          style={{ fill: 'var(--txt, #000)', fontFamily: l.fuente, fontWeight: l.peso || 400, fontStyle: l.estilo || 'normal',
            fontSize: `${l.alto / CAP}px`, textTransform: l.mayus ? 'uppercase' : 'none' }}>
          {l.texto}
        </text>
      ))}
    </svg>
  )
}

// Escribe el nombre en el hueco #slot-nombre del SVG (dentro de la máscara del texto, así las patas lo tapan).
// Tamaño: el que hace que el nombre de ejemplo ocupe el espacio original; los nombres más largos se reducen
// de forma uniforme hasta caber en el ancho original. Devuelve la reducción aplicada (1 = sin reducir).
function pintarNombre(slot, texto, ne) {
  const NS = 'http://www.w3.org/2000/svg'
  const { caja } = ne
  slot.textContent = ''
  const t = document.createElementNS(NS, 'text')
  t.setAttribute('fill', '#fff')
  t.setAttribute('font-family', `"${ne.fuente.familia}"`)
  t.setAttribute('font-weight', ne.fuente.peso)
  // «inicio»: la inicial empieza siempre donde empezaba la del original (p. ej. bajo el brazo del osito).
  const inicio = ne.alineacion === 'inicio'
  t.setAttribute('text-anchor', inicio ? 'start' : 'middle')
  t.setAttribute('x', inicio ? caja.x : caja.x + caja.w / 2)
  slot.appendChild(t)
  t.textContent = ne.ejemplo
  t.setAttribute('font-size', 100)
  let b = t.getBBox()
  if (!b.width) return 1
  const base = ne.apoyo === 'abajo'
    ? Math.min((100 * caja.w) / b.width, (100 * ne.altoLibre) / b.height)
    : Math.min((100 * caja.w) / b.width, (100 * caja.h) / b.height)
  t.textContent = texto
  t.setAttribute('font-size', base)
  b = t.getBBox()
  const tam = b.width > caja.w ? (base * caja.w) / b.width : base
  t.setAttribute('font-size', tam)
  t.setAttribute('y', 0)
  b = t.getBBox()
  const y = ne.apoyo === 'abajo'
    ? caja.y + caja.h - (ne.margenInferior || 0) - (b.y + b.height)
    : caja.y + caja.h / 2 - (b.y + b.height / 2)
  t.setAttribute('y', y)
  return tam / base
}
