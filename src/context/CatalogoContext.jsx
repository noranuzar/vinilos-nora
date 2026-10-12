import { createContext, useContext, useEffect, useState } from 'react'
import { cargarCatalogo } from '../lib/datos'

const CatalogoContext = createContext(null)

export function CatalogoProvider({ children }) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarCatalogo().then(setDatos).catch(setError)
  }, [])

  if (error) {
    return <p role="alert" className="contenedor provisional">No se ha podido cargar el catálogo. Recarga la página.</p>
  }
  if (!datos) {
    return <p className="contenedor provisional" aria-live="polite">Cargando…</p>
  }
  return <CatalogoContext.Provider value={datos}>{children}</CatalogoContext.Provider>
}

export function useCatalogo() {
  const ctx = useContext(CatalogoContext)
  if (!ctx) throw new Error('useCatalogo debe usarse dentro de CatalogoProvider')
  return ctx
}
