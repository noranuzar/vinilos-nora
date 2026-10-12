import { Link } from 'react-router-dom'
import { useCatalogo } from '../context/CatalogoContext'
import Icono from './Icono'

export default function AccesosOcasion() {
  const { ocasiones } = useCatalogo()
  return (
    <ul className="rejilla-ocasiones">
      {ocasiones.map((o) => (
        <li key={o.id}>
          <Link to={`/catalogo?ocasion=${o.id}`} className="ocasion">
            <span className="ocasion__icono"><Icono nombre={o.icono} /></span>
            {o.nombre}
          </Link>
        </li>
      ))}
    </ul>
  )
}
