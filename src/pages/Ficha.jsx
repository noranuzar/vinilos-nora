import { useEffect, useRef } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import { useDiseno } from '../context/DisenoContext'
import { aplicarPlantilla } from '../lib/diseno'
import Personalizador from '../components/personalizador/Personalizador'

export default function Ficha() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { productos, plantillas } = useCatalogo()
  const [, setDiseno] = useDiseno()
  const producto = productos.find((p) => p.id === id)

  // Si llega desde un diseño de ejemplo (?plantilla=...), se aplica una vez.
  const aplicada = useRef(null)
  useEffect(() => {
    const pid = params.get('plantilla')
    const p = plantillas.find((x) => x.id === pid)
    if (p && aplicada.current !== pid) {
      aplicada.current = pid
      setDiseno((d) => aplicarPlantilla(p, d))
    }
  }, [params, plantillas, setDiseno])

  if (!producto) {
    return (
      <section className="contenedor provisional">
        <h1>No encuentro este producto</h1>
        <p>Puede que ya no esté disponible.</p>
        <Link to="/catalogo" className="boton boton--principal">Ver el catálogo</Link>
      </section>
    )
  }

  return (
    <section className="seccion seccion--ficha">
      <div className="contenedor">
        <Link to="/catalogo" className="volver"><ChevronLeft size={18} aria-hidden="true" /> Catálogo</Link>
        <Personalizador key={producto.id} producto={producto} />
      </div>
    </section>
  )
}
