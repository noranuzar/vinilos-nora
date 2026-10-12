// Utilidades del diseño que la clienta está creando.

// Líneas de texto finales. En un diseño de ejemplo se sustituyen {nombre}, {edad}...
// Con usarEjemplos, los campos vacíos se rellenan con el ejemplo (solo para la vista previa).
export function lineasDelDiseno(diseno, plantillas, { usarEjemplos = false } = {}) {
  if (diseno.modo === 'plantilla') {
    const p = plantillas.find((x) => x.id === diseno.plantillaId)
    if (p) {
      return p.lineas.map((l) =>
        l.replace(/\{(\w+)\}/g, (_, k) => {
          const valor = (diseno.campos[k] || '').trim()
          if (valor) return valor
          return usarEjemplos ? p.campos.find((c) => c.id === k)?.ejemplo || '' : ''
        }).trim()
      )
    }
  }
  return diseno.lineas.map((l) => l.trim())
}

export function aplicarPlantilla(plantilla, diseno) {
  return {
    ...diseno,
    modo: 'plantilla',
    plantillaId: plantilla.id,
    // Si ya había escrito un nombre, lo mantenemos.
    campos: diseno.campos.nombre ? { nombre: diseno.campos.nombre } : {},
    fuenteId: plantilla.fuente,
    adornoId: plantilla.adorno,
    posicionAdorno: plantilla.posicionAdorno,
  }
}

// Colores que admite un producto con el tipo de vinilo elegido.
export function coloresPermitidos(producto, tipo, colores) {
  return colores.filter(
    (c) => c.tipo === tipo && (!producto.colores || producto.colores.includes(c.id))
  )
}

// Mantiene el color al cambiar de objeto (por nombre: "Oro" adhesivo ↔ "Oro" textil).
export function colorParaProducto(permitidos, colorNombre) {
  return permitidos.find((c) => c.nombre === colorNombre) || permitidos[0] || null
}

// Tamaño de letra de las muestras de ejemplo: más pequeño cuanto más larga la línea,
// para que no se parta ("20.06.2027" cabe entero).
export function tamMuestra(lineas) {
  const largo = Math.max(...lineas.map((l) => l.length), 1)
  return `${Math.max(0.95, Math.min(1.6, 13 / largo)).toFixed(2)}rem`
}
