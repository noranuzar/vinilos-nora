import { Link } from 'react-router-dom'
import { useCatalogo } from '../context/CatalogoContext'
import Icono from './Icono'

// Accesos de la portada: una tarjeta por sección (Bebé y niños, Equipos…).
// Reutiliza el estilo de las tarjetas de ocasión.
export default function AccesosSeccion() {
  const { secciones } = useCatalogo()
  return (
    <ul className="rejilla-ocasiones">
      {secciones.map((s) => (
        <li key={s.id}>
          <Link to={`/seccion/${s.id}`} className="ocasion">
            <span className="ocasion__icono"><Icono nombre={s.icono} /></span>
            {s.nombre}
          </Link>
        </li>
      ))}
    </ul>
  )
}
