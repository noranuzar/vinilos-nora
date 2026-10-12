// Búsqueda sin tildes ni mayúsculas sobre nombre, descripción, ocasiones y tipo.
export const normalizar = (s = '') =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

// Un producto puede admitir varios tipos (p. ej. "tu propio objeto").
export const tiposDe = (p) => p.tiposPermitidos || [p.tipo]

export function filtrarProductos(productos, { q, ocasion, tipo }, { ocasiones, tipos }) {
  const palabras = normalizar(q).split(/\s+/).filter(Boolean)

  return productos.filter((p) => {
    if (ocasion && !p.ocasiones.includes(ocasion)) return false
    if (tipo && !tiposDe(p).includes(tipo)) return false
    if (!palabras.length) return true

    const texto = normalizar([
      p.nombre,
      p.descripcion,
      ...tiposDe(p).map((id) => tipos.find((t) => t.id === id)?.nombre),
      p.tipo ? '' : 'propio mi objeto medida encargo',
      ...p.ocasiones.map((id) => ocasiones.find((o) => o.id === id)?.nombre),
    ].join(' '))
    return palabras.every((w) => texto.includes(w))
  })
}
