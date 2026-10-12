import { formatearPrecio } from '../../lib/precio'

export default function ResumenPrecio({ precio, cantidad }) {
  return (
    <div className="resumen-precio" aria-live="polite">
      <dl>
        {precio.partes.map((p) => (
          <div key={p.concepto} className="resumen-precio__fila">
            <dt>{p.concepto}</dt>
            <dd>{p.valor == null ? 'a consultar' : formatearPrecio(p.valor)}</dd>
          </div>
        ))}
        <div className="resumen-precio__fila resumen-precio__total">
          <dt>Total ({cantidad} {cantidad === 1 ? 'unidad' : 'unidades'})</dt>
          <dd>{precio.total == null ? 'Te lo confirmo por WhatsApp' : formatearPrecio(precio.total)}</dd>
        </div>
      </dl>
    </div>
  )
}
