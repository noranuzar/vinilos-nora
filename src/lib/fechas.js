// Fechas en formato del input date (AAAA-MM-DD), en hora local.
const aISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function fechaMinima(dias, hoy = new Date()) {
  const d = new Date(hoy)
  d.setDate(d.getDate() + dias)
  return aISO(d)
}

export function formatearFecha(iso) {
  if (!iso) return ''
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
}
