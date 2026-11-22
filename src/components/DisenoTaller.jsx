import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useCatalogo } from '../context/CatalogoContext'
import { enlaceWhatsApp } from '../lib/whatsapp'

// Diseño real del taller (dibujo fijo en SVG) con colores a elegir:
// dos colores (dibujo / nombre y corazones) o uno solo.
// El SVG usa las variables --oso y --txt, así que se recolorea sin tocar el archivo.
// Si el diseño tiene «lineas», el cliente puede cambiar el texto: mientras no escriba
// se ve el trabajo original; en cuanto escribe, se dibuja en directo con una fuente parecida.
export default function DisenoTaller({ diseno, nombre }) {
  const { config, superficies } = useCatalogo()
  const propias = (diseno.superficies || []).map((id) => superficies.find((s) => s.id === id)).filter(Boolean)
  const lugares = [...propias, ...superficies.filter((s) => !propias.includes(s))]
  const [lugarId, setLugarId] = useState(propias[0]?.id || 'blanco')
  const lugar = lugares.find((s) => s.id === lugarId)
  const paleta = config.paletaDisenos || []
  const [svg, setSvg] = useState('')
  const [dos, setDos] = useState(diseno.dosColores)
  const [colorDibujo, setColorDibujo] = useState(diseno.colorDibujo)
  const [colorTexto, setColorTexto] = useState(diseno.colorTexto)
  const lineas = diseno.lineas || []
  const [propio, setPropio] = useState({})

  useEffect(() => {
    let vivo = true
    fetch(diseno.svg).then((r) => r.text()).then((t) => { if (vivo) setSvg(t) }).catch(() => {})
    return () => { vivo = false }
  }, [diseno.svg])

  // Valor de cada línea: lo que escribe el cliente aquí o, si la línea lo permite, el nombre de la sección.
  const valor = (l) => propio[l.campo] ?? (l.deSeccion ? nombre : '')
  const escrito = lineas.some((l) => valor(l).trim() && valor(l).trim() !== l.ejemplo)
  const textos = lineas.map((l) => ({ ...l, texto: (valor(l).trim() || l.ejemplo || '') })).filter((l) => l.texto)

  const dibujo = dos ? colorDibujo : colorTexto
  const nombreColor = (hex) => paleta.find((c) => c.hex === hex)?.nombre || hex
  const que = diseno.queTexto || 'nombre'
  const colores = dos
    ? `${(diseno.etiquetaDibujo || 'dibujo').toLowerCase()} ${nombreColor(dibujo)}, ${(diseno.etiquetaTexto || 'nombre y corazones').toLowerCase()} ${nombreColor(colorTexto)}`
    : `todo en ${nombreColor(colorTexto)}`
  const detalle = diseno.sinTexto ? 'el texto tal cual' : lineas.length
    ? lineas.map((l) => `${l.etiqueta.toLowerCase()} «${valor(l).trim() || (l.ejemplo ? l.ejemplo : 'te lo digo')}»`).join(', ')
    : `el ${que} «${nombre || `(te digo el ${que})`}»`
  const mensaje = `Hola Nora, quiero el diseño «${diseno.nombre}» con ${detalle}. Colores: ${colores}.${lugar ? ` Lo he visto sobre: ${lugar.nombre.toLowerCase()}.` : ''}`

  const contenido = escrito
    ? { children: <TextoVivo lineas={textos} separacion={diseno.separacion || 0} /> }
    : { dangerouslySetInnerHTML: { __html: svg } }

  const Paleta = ({ valor, alElegir, etiqueta }) => (
    <div className="taller__paleta" role="group" aria-label={etiqueta}>
      {paleta.map((c) => (
        <button key={c.hex} type="button" className="taller__color" style={{ background: c.hex }}
          aria-label={c.nombre} title={c.nombre} aria-pressed={valor === c.hex} onClick={() => alElegir(c.hex)} />
      ))}
    </div>
  )

  return (
    <article className="taller">
      {lugar ? (
        <div className="taller__escena" style={{ backgroundImage: `url(${lugar.imagen})` }}
          role="img" aria-label={`${diseno.nombre} sobre ${lugar.nombre.toLowerCase()}, imagen de ejemplo`}>
          <div className="taller__zona" style={{
            left: `${lugar.zona.x - lugar.zona.ancho / 2}%`, top: `${lugar.zona.y - lugar.zona.alto / 2}%`,
            width: `${lugar.zona.ancho}%`, height: `${lugar.zona.alto}%`, '--oso': dibujo, '--txt': colorTexto,
          }} {...contenido} />
          <span className="taller__aviso">Imagen de ejemplo</span>
        </div>
      ) : (
        <div className="taller__lienzo" style={{ '--oso': dibujo, '--txt': colorTexto }}
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
        <a className="boton boton--principal taller__pedir" href={enlaceWhatsApp(config.whatsapp, mensaje)}
          target="_blank" rel="noopener noreferrer">{lineas.length || diseno.sinTexto ? 'Lo quiero así' : `Lo quiero con mi ${que}`}</a>
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
