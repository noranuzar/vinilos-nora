import { useEffect, useState } from 'react'
import { useCatalogo } from '../context/CatalogoContext'
import { enlaceWhatsApp } from '../lib/whatsapp'

// Diseño real del taller (dibujo fijo en SVG) con colores a elegir:
// dos colores (dibujo / nombre y corazones) o uno solo.
// El SVG usa las variables --oso y --txt, así que se recolorea sin tocar el archivo.
export default function DisenoTaller({ diseno, nombre }) {
  const { config } = useCatalogo()
  const paleta = config.paletaDisenos || []
  const [svg, setSvg] = useState('')
  const [dos, setDos] = useState(diseno.dosColores)
  const [colorDibujo, setColorDibujo] = useState(diseno.colorDibujo)
  const [colorTexto, setColorTexto] = useState(diseno.colorTexto)

  useEffect(() => {
    let vivo = true
    fetch(diseno.svg).then((r) => r.text()).then((t) => { if (vivo) setSvg(t) }).catch(() => {})
    return () => { vivo = false }
  }, [diseno.svg])

  const dibujo = dos ? colorDibujo : colorTexto
  const nombreColor = (hex) => paleta.find((c) => c.hex === hex)?.nombre || hex
  const que = diseno.queTexto || 'nombre'
  const texto = nombre || `(te digo el ${que})`
  const colores = dos
    ? `dibujo ${nombreColor(dibujo)}, nombre y corazones ${nombreColor(colorTexto)}`
    : `todo en ${nombreColor(colorTexto)}`
  const mensaje = `Hola Nora, quiero el diseño «${diseno.nombre}» con el ${que} «${texto}». Colores: ${colores}.`

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
      <div className="taller__lienzo" style={{ '--oso': dibujo, '--txt': colorTexto }}
        role="img" aria-label={`${diseno.nombre}, diseño de ejemplo`}
        dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="taller__cuerpo">
        <h3 className="taller__titulo">{diseno.nombre} <span className="etiqueta-real">Hecho en el taller</span></h3>
        {diseno.nota && <p className="taller__nota">{diseno.nota}</p>}
        {!diseno.unColor && (
          <div className="taller__modo" role="group" aria-label="Número de colores">
            <button type="button" aria-pressed={dos} onClick={() => setDos(true)}>Dos colores</button>
            <button type="button" aria-pressed={!dos} onClick={() => setDos(false)}>Un color</button>
          </div>
        )}
        {dos && (
          <>
            <p className="taller__etiqueta">Dibujo</p>
            <Paleta valor={colorDibujo} alElegir={setColorDibujo} etiqueta="Color del dibujo" />
          </>
        )}
        <p className="taller__etiqueta">{dos ? 'Nombre y corazones' : 'Color'}</p>
        <Paleta valor={colorTexto} alElegir={setColorTexto} etiqueta={dos ? 'Color del nombre y los corazones' : 'Color del diseño'} />
        <a className="boton boton--principal taller__pedir" href={enlaceWhatsApp(config.whatsapp, mensaje)}
          target="_blank" rel="noopener noreferrer">Lo quiero con mi {que}</a>
      </div>
    </article>
  )
}
