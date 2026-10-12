// Cambiar de objeto conservando el diseño.
import { Link } from 'react-router-dom'
import { Ruler } from 'lucide-react'

export default function SelectorObjeto({ productos, actual }) {
  return (
    <nav className="grupo-control" aria-labelledby="titulo-objetos">
      <p id="titulo-objetos" className="leyenda">Pruébalo en otro objeto</p>
      <ul className="objetos">
        {productos.map((p) => (
          <li key={p.id}>
            <Link to={`/producto/${p.id}`} className="objeto" aria-current={p.id === actual ? 'page' : undefined} replace>
              <span className="objeto__foto" aria-hidden="true">
                {p.imagen ? <img src={p.imagen} alt="" width="96" height="120" loading="lazy" /> : <Ruler size={26} />}
              </span>
              <span className="objeto__nombre">{p.nombre}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
