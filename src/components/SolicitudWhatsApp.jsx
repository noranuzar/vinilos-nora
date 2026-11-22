import { useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import { enlaceWhatsApp } from '../lib/whatsapp'

// Resumen previo y envío por WhatsApp, común a los trabajos reales y a las fichas.
// `filas`: [etiqueta, valor]; las filas sin valor no se muestran ni se envían.
// El mensaje contiene exactamente lo que el cliente ve en el resumen, más sus observaciones.
function mensajePedido(referencia, filas, observaciones) {
  const lineas = [`Hola Nora, quiero hacer este pedido.`, `Referencia: ${referencia}`]
  filas.filter(([, v]) => v).forEach(([e, v]) => lineas.push(`${e}: ${v}`))
  if (observaciones?.trim()) lineas.push(`Observaciones: ${observaciones.trim()}`)
  return lineas.join('\n')
}

export default function SolicitudWhatsApp({ referencia, filas, onEditar }) {
  const { config } = useCatalogo()
  const [observaciones, setObservaciones] = useState('')
  const visibles = filas.filter(([, v]) => v)
  const id = `obs-${referencia.replace(/[^A-Za-z0-9]/g, '')}`

  return (
    <div className="solicitud" role="region" aria-label="Resumen del pedido">
      <h3 className="solicitud__titulo">Resumen de tu pedido</h3>
      <dl className="solicitud__datos">
        <div><dt>Referencia</dt><dd>{referencia}</dd></div>
        {visibles.map(([e, v]) => (
          <div key={e}><dt>{e}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <div className="campo">
        <label htmlFor={id}>Observaciones (opcional)</label>
        <textarea id={id} rows={3} maxLength={500} value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Por ejemplo: medida de la pared, colores de la habitación…" />
      </div>
      <p className="solicitud__nota">Esto es exactamente lo que me llegará por WhatsApp. Te responderé para confirmar medida, precio y entrega.</p>
      <a className="boton boton--principal boton--ancho" href={enlaceWhatsApp(config.whatsapp, mensajePedido(referencia, filas, observaciones))}
        target="_blank" rel="noopener noreferrer">
        <MessageCircle size={20} aria-hidden="true" /> Enviar por WhatsApp
      </a>
      {onEditar && <button type="button" className="boton boton--secundario boton--ancho solicitud__editar" onClick={onEditar}>Seguir editando</button>}
    </div>
  )
}
