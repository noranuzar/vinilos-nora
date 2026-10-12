// PROVISIONAL — se construye en un paso posterior.
import { Link } from 'react-router-dom'

export default function Galeria() {
  return (
    <section className="contenedor provisional">
      <h1>Trabajos reales</h1>
      <p>Esta página se construye en un paso posterior.</p>
      <Link to="/" className="boton boton--secundario">Volver a la portada</Link>
    </section>
  )
}
