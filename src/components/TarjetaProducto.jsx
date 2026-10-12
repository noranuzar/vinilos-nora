import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageOff, Ruler } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import { textoPrecioDesde } from '../lib/precio'

export default function TarjetaProducto({ producto, nivelTitulo = 'h3' }) {
  const { ocasiones, tipos } = useCatalogo()
  const [sinFoto, setSinFoto] = useState(!producto.imagen)
  const Titulo = nivelTitulo
  const tipo = tipos.find((t) => t.id === producto.tipo)
  const nombresOcasion = producto.ocasiones
    .map((id) => ocasiones.find((o) => o.id === id)?.nombre)
    .filter(Boolean)

  return (
    <article className="tarjeta">
      <div className="tarjeta__foto">
        {sinFoto ? (
          <div className={`tarjeta__sin-foto${producto.medidas ? ' tarjeta__sin-foto--propio' : ''}`} aria-hidden="true">
            {producto.medidas ? <Ruler size={40} /> : <ImageOff size={28} />}
            <span>{producto.medidas ? 'Tú eliges el objeto y la medida' : 'Foto próximamente'}</span>
          </div>
        ) : (
          <img
            src={producto.imagen}
            alt=""
            loading="lazy"
            width="960"
            height="1200"
            onError={() => setSinFoto(true)}
          />
        )}
        <span className={`insignia insignia--${producto.tipo || 'libre'}`}>{tipo?.nombre || 'Adhesivo o textil'}</span>
      </div>
      <div className="tarjeta__cuerpo">
        <Titulo className="tarjeta__nombre">
          <Link to={`/producto/${producto.id}`} className="tarjeta__enlace">{producto.nombre}</Link>
        </Titulo>
        <p className="tarjeta__precio">{textoPrecioDesde(producto)}</p>
        <p className="tarjeta__ocasiones">{nombresOcasion.slice(0, 3).join(' · ')}</p>
      </div>
    </article>
  )
}
