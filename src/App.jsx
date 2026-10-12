import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Cabecera from './components/Cabecera'
import Pie from './components/Pie'
import Portada from './pages/Portada'
import Catalogo from './pages/Catalogo'
import Ficha from './pages/Ficha'
import Cesta from './pages/Cesta'
import Galeria from './pages/Galeria'

function ArribaAlNavegar() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <a href="#principal" className="saltar">Saltar al contenido</a>
      <ArribaAlNavegar />
      <Cabecera />
      <main id="principal">
        <Routes>
          <Route path="/" element={<Portada />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Ficha />} />
          <Route path="/cesta" element={<Cesta />} />
          <Route path="/trabajos" element={<Galeria />} />
          <Route path="*" element={<Portada />} />
        </Routes>
      </main>
      <Pie />
    </>
  )
}
