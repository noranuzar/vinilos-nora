import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCatalogo } from '../context/CatalogoContext'
import Icono from './Icono'

// Tarjetas de sección de la portada: foto de un trabajo real sobre su soporte,
// título, descripción y «Crear». La primera ocupa todo el ancho en móvil;
// en escritorio, las dos primeras van grandes y las otras tres debajo.
// `imagen` es la ruta base: <ruta>-h-<ancho>.webp (horizontal) y <ruta>-v-<ancho>.webp (vertical).
export default function AccesosSeccion() {
  const { secciones } = useCatalogo()
  return (
    <ul className="tarjetas-seccion">
      {secciones.map((s, i) => (
        <li key={s.id} className={`tarjeta-seccion${i === 0 ? ' tarjeta-seccion--ancha' : ''}${i < 2 ? ' tarjeta-seccion--grande' : ''}`}>
          <Link to={`/seccion/${s.id}`}>
            <span className="tarjeta-seccion__foto">
              {s.imagen ? (
                <picture>
                  {i > 0 && <source media="(min-width: 760px)" type="image/webp"
                    srcSet={`${s.imagen}-h-450.webp 450w, ${s.imagen}-h-900.webp 900w`} sizes="(min-width: 1100px) 550px, 50vw" />}
                  <img src={`${s.imagen}-${i === 0 ? 'h' : 'v'}-450.webp`}
                    srcSet={`${s.imagen}-${i === 0 ? 'h' : 'v'}-450.webp 450w, ${s.imagen}-${i === 0 ? 'h' : 'v'}-900.webp 900w`}
                    sizes={i === 0 ? '(min-width: 760px) 550px, 100vw' : '50vw'} alt="" loading="lazy" />
                </picture>
              ) : (
                <span className="tarjeta-seccion__icono"><Icono nombre={s.icono} /></span>
              )}
            </span>
            <span className="tarjeta-seccion__cuerpo">
              <span className="tarjeta-seccion__titulo">{s.nombre}</span>
              <span className="tarjeta-seccion__texto">{s.descripcion}</span>
              <span className="tarjeta-seccion__ir">Crear <ArrowRight size={16} aria-hidden="true" /></span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
