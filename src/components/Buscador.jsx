import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function Buscador({ inicial = '' }) {
  const [texto, setTexto] = useState(inicial)
  const navigate = useNavigate()

  const enviar = (e) => {
    e.preventDefault()
    const q = texto.trim()
    navigate(q ? `/catalogo?q=${encodeURIComponent(q)}` : '/catalogo')
  }

  return (
    <form role="search" className="buscador" onSubmit={enviar}>
      <label htmlFor="busqueda" className="sr-only">Buscar regalos</label>
      <input
        id="busqueda"
        type="search"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Taza, bolsa, boda, profe…"
        autoComplete="off"
        enterKeyHint="search"
      />
      <button type="submit" className="boton boton--principal">
        <Search size={20} aria-hidden="true" />
        <span>Buscar</span>
      </button>
    </form>
  )
}
