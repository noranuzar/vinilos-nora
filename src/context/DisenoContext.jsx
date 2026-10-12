// Diseño en curso (texto, fuente, color, adorno). Vive aquí y no en la ficha
// para que no se pierda cuando la clienta cambia de objeto.
import { createContext, useContext, useState } from 'react'

export const DISENO_INICIAL = {
  modo: 'libre',          // 'libre' = escribe su texto · 'plantilla' = diseño de ejemplo
  plantillaId: null,
  campos: {},             // valores de {nombre}, {edad}... del diseño de ejemplo
  lineas: ['', ''],       // texto libre
  fuenteId: 'pacifico',
  colorNombre: 'Negro',
  adornoId: null,
  posicionAdorno: 'arriba',
  // Posición y tamaño dentro de la zona imprimible
  alineaciones: ['centro', 'centro', 'centro'],   // una por línea: 'izquierda' | 'centro' | 'derecha'
  escala: 100,            // % de la zona que ocupa el diseño (100 = lo más grande que cabe)
  desX: 0,                // desplazamiento -100 (izquierda) … 100 (derecha)
  desY: 0,                // desplazamiento -100 (arriba) … 100 (abajo)
}

export const AJUSTE_INICIAL = { alineaciones: ['centro', 'centro', 'centro'], escala: 100, desX: 0, desY: 0 }

const DisenoContext = createContext(null)

export function DisenoProvider({ children }) {
  const estado = useState(DISENO_INICIAL)
  return <DisenoContext.Provider value={estado}>{children}</DisenoContext.Provider>
}

export function useDiseno() {
  const ctx = useContext(DisenoContext)
  if (!ctx) throw new Error('useDiseno debe usarse dentro de DisenoProvider')
  return ctx
}
