import { Link } from 'react-router-dom'
import { useCatalogo } from '../context/CatalogoContext'
import Icono from './Icono'

export default function AccesosTipo() {
  const { tipos } = useCatalogo()
  return (
    <div className="rejilla-tipos">
      {tipos.map((t) => (
        <Link key={t.id} to={`/catalogo?tipo=${t.id}`} className="tipo">
          <span className="tipo__icono"><Icono nombre={t.icono} size={28} /></span>
          <span>
            <strong>{t.nombre}</strong>
            <span className="tipo__desc">{t.descripcion}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
