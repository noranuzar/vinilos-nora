// Diseños de ejemplo de una ocasión, en el catálogo. Llevan a la ficha del
// objeto sugerido con el diseño ya aplicado; allí se puede cambiar de objeto.
import { Link } from 'react-router-dom'
import { useCatalogo } from '../context/CatalogoContext'
import { lineasDelDiseno, tamMuestra } from '../lib/diseno'

export default function EjemplosOcasion({ ocasion }) {
  const { plantillas, fuentes, ocasiones } = useCatalogo()
  const lista = plantillas.filter((p) => p.ocasion === ocasion)
  if (!lista.length) return null
  const nombre = ocasiones.find((o) => o.id === ocasion)?.nombre.toLowerCase()

  return (
    <section className="ejemplos-ocasion" aria-labelledby="titulo-ejemplos">
      <h2 id="titulo-ejemplos">Diseños de ejemplo para {nombre}</h2>
      <p className="seccion__intro">Elige uno, pon el nombre y pruébalo en el objeto que quieras.</p>
      <ul className="ejemplos-ocasion__lista">
        {lista.map((p) => {
          const f = fuentes.find((x) => x.id === p.fuente)
          const muestra = lineasDelDiseno({ modo: 'plantilla', plantillaId: p.id, campos: {} }, [p], { usarEjemplos: true })
          return (
            <li key={p.id}>
              <Link to={`/producto/${p.productoSugerido}?plantilla=${p.id}`} className="ejemplo-tarjeta">
                <span className="ejemplo__muestra" style={{ fontFamily: `"${f.familia}"`, fontWeight: f.peso, fontSize: tamMuestra(muestra) }} aria-hidden="true">
                  {muestra.map((l, i) => <span key={i} style={{ fontSize: `${p.tamLineas?.[i] ?? 1}em` }}>{l}</span>)}
                </span>
                <span className="ejemplo-tarjeta__pie">
                  <strong>{p.nombre}</strong>
                  <span>Personalizar →</span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
