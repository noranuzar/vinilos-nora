import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, ShoppingBag } from 'lucide-react'
import { useCesta } from '../context/CestaContext'
import Logo from './Logo'

const ENLACES = [
  { a: '/catalogo', texto: 'Catálogo' },
  { a: '/trabajos', texto: 'Trabajos reales' },
]

export default function Cabecera() {
  const [abierto, setAbierto] = useState(false)
  const { totalUnidades } = useCesta()
  const cerrar = () => setAbierto(false)

  return (
    <header className="cabecera">
      <div className="contenedor cabecera__barra">
        <Link to="/" className="logo" onClick={cerrar} aria-label="Vinilos Nora, ir a la portada">
          <Logo />
        </Link>

        <nav className="nav" aria-label="Principal">
          {ENLACES.map((e) => (
            <NavLink key={e.a} to={e.a}>{e.texto}</NavLink>
          ))}
        </nav>

        <div className="cabecera__acciones">
          <Link
            to="/cesta"
            className="icono-boton"
            aria-label={`Cesta, ${totalUnidades} ${totalUnidades === 1 ? 'artículo' : 'artículos'}`}
            onClick={cerrar}
          >
            <ShoppingBag size={24} aria-hidden="true" />
            {totalUnidades > 0 && <span className="contador" aria-hidden="true">{totalUnidades}</span>}
          </Link>
          <button
            type="button"
            className="icono-boton solo-movil"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setAbierto((v) => !v)}
          >
            {abierto ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {abierto && (
        <nav id="menu-movil" className="menu-movil solo-movil" aria-label="Menú móvil">
          <ul>
            {ENLACES.map((e) => (
              <li key={e.a}><Link to={e.a} onClick={cerrar}>{e.texto}</Link></li>
            ))}
            <li><Link to="/cesta" onClick={cerrar}>Mi cesta</Link></li>
          </ul>
        </nav>
      )}
    </header>
  )
}
