// Precios. null en el JSON = "a consultar".

const formato = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' })

export function formatearPrecio(valor) {
  return valor == null ? null : formato.format(valor)
}

// Precio más bajo con el que se puede comprar el producto (para "desde X €").
export function precioDesde(producto) {
  const candidatos = []
  if (producto.precioBase != null) candidatos.push(producto.precioBase)
  for (const t of producto.tramosCantidad || []) {
    if (t.precioUnidad != null) candidatos.push(t.precioUnidad)
  }
  return candidatos.length ? Math.min(...candidatos) : null
}

export function textoPrecioDesde(producto) {
  const p = precioDesde(producto)
  if (p == null) return producto.medidas ? 'Precio según medidas' : 'Precio a consultar'
  return `Desde ${formatearPrecio(p)}`
}

// Tramo de precio que corresponde a una cantidad (el de "desde" más alto que se alcanza).
function tramoPara(producto, cantidad) {
  const tramos = [...(producto.tramosCantidad || [])].sort((a, b) => b.desde - a.desde)
  return tramos.find((t) => cantidad >= t.desde) || null
}

/**
 * Precio de un artículo personalizado.
 * Unidad = base (o precio del tramo) + 2.ª línea + tamaño + adorno.
 * Si alguna parte necesaria no tiene precio, el artículo queda "a consultar" (unidad = null).
 */
export function calcularPrecio(producto, { lineasUsadas, tamano, adorno, cantidad }) {
  const partes = []
  const tramo = tramoPara(producto, cantidad)
  if (tramo) {
    partes.push({ concepto: tramo.desde > 1 ? `Precio por unidad (desde ${tramo.desde} uds.)` : 'Precio por unidad', valor: tramo.precioUnidad })
  } else {
    partes.push({ concepto: 'Precio por unidad', valor: producto.precioBase })
  }
  if (lineasUsadas > 1) partes.push({ concepto: 'Segunda línea', valor: producto.extraSegundaLinea })
  if (tamano && tamano.extra !== 0) partes.push({ concepto: `Tamaño ${tamano.nombre}`, valor: tamano.extra })
  if (adorno) partes.push({ concepto: `Adorno: ${adorno.nombre}`, valor: adorno.extra })

  const unidad = partes.some((p) => p.valor == null)
    ? null
    : Math.round(partes.reduce((s, p) => s + p.valor, 0) * 100) / 100
  const total = unidad == null ? null : Math.round(unidad * cantidad * 100) / 100
  return { partes, unidad, total }
}
