import { createContext, useContext, useEffect, useState } from 'react'

const CLAVE = 'vinilos-nora-cesta'
const CestaContext = createContext(null)

function leerCesta() {
  try {
    const guardada = localStorage.getItem(CLAVE)
    return guardada ? JSON.parse(guardada) : []
  } catch {
    return []
  }
}

export function CestaProvider({ children }) {
  const [articulos, setArticulos] = useState(leerCesta)

  useEffect(() => {
    try { localStorage.setItem(CLAVE, JSON.stringify(articulos)) } catch { /* sin almacenamiento */ }
  }, [articulos])

  const anadir = (articulo) =>
    setArticulos((prev) => [...prev, { ...articulo, uid: crypto.randomUUID() }])
  const quitar = (uid) => setArticulos((prev) => prev.filter((a) => a.uid !== uid))
  const vaciar = () => setArticulos([])
  const totalUnidades = articulos.reduce((n, a) => n + (a.cantidad || 1), 0)

  return (
    <CestaContext.Provider value={{ articulos, anadir, quitar, vaciar, totalUnidades }}>
      {children}
    </CestaContext.Provider>
  )
}

export function useCesta() {
  const ctx = useContext(CestaContext)
  if (!ctx) throw new Error('useCesta debe usarse dentro de CestaProvider')
  return ctx
}
