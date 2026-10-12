import { Link } from 'react-router-dom'
import { useCatalogo } from '../context/CatalogoContext'
import TarjetaProducto from './TarjetaProducto'

export default function Destacados() {
  const { productos } = useCatalogo()
  const lista = productos.filter((p) => p.destacado).slice(0, 4)
  if (!lista.length) return null
  return (
    <section className="seccion" aria-labelledby="titulo-destacados">
      <div className="contenedor">
        <h2 id="titulo-destacados" className="seccion__titulo">Los más pedidos</h2>
        <p className="seccion__intro">Personalízalos y mira cómo quedan.</p>
        <ul className="rejilla-productos">
          {lista.map((p) => <li key={p.id}><TarjetaProducto producto={p} /></li>)}
        </ul>
        <p className="centrado"><Link to="/catalogo" className="boton boton--secundario">Ver todo el catálogo</Link></p>
      </div>
    </section>
  )
}
