// PROVISIONAL — se construye en un paso posterior.
// Mientras tanto avisa si la cesta guardada tiene colores que ya no están en el inventario.
// No cambia la selección: solo la señala para que el cliente elija otro color.
import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import { useCesta } from '../context/CestaContext'

function colorRetirado(articulo, colores, tipos) {
  if (!articulo.color) return false
  const tipoId = tipos.find((t) => t.nombre === articulo.tipo)?.id
  return !colores.some((c) => c.nombre === articulo.color && (!tipoId || c.tipo === tipoId))
}

export default function Cesta() {
  const { colores, tipos } = useCatalogo()
  const { articulos } = useCesta()
  const retirados = articulos.filter((a) => colorRetirado(a, colores, tipos))

  return (
    <section className="contenedor provisional">
      <h1>Cesta</h1>
      {retirados.length > 0 && (
        <div className="aviso aviso--atencion" role="status" style={{ textAlign: 'left', marginBottom: 20 }}>
          <AlertTriangle size={18} aria-hidden="true" />
          <div>
            <p>Algunos artículos guardados tienen un color que ya no está disponible. Tendrás que elegir otro color:</p>
            <ul>
              {retirados.map((a) => (
                <li key={a.uid}>{a.producto}: {a.color}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <p>Esta página se construye en un paso posterior.</p>
      <Link to="/" className="boton boton--secundario">Volver a la portada</Link>
    </section>
  )
}
