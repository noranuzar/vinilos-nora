// Campos de texto: los del diseño de ejemplo (nombre, edad) o líneas libres.
export default function CamposTexto({ diseno, plantilla, producto, lineasFinales, lineasEjemplo, onCampo, onLinea, errores }) {
  const max = producto.texto.maxCaracteresLinea

  if (diseno.modo === 'plantilla' && plantilla) {
    return (
      <fieldset className="grupo-control">
        <legend>Tu texto</legend>
        <div className="campos">
          {plantilla.campos.map((c) => {
            const id = `campo-${c.id}`
            const err = errores[c.id]
            return (
              <div key={c.id} className="campo">
                <label htmlFor={id}>{c.etiqueta}</label>
                <input
                  id={id}
                  type="text"
                  inputMode={c.numerico ? 'numeric' : 'text'}
                  value={diseno.campos[c.id] || ''}
                  maxLength={c.max}
                  placeholder={`Ej.: ${c.ejemplo}`}
                  onChange={(e) => onCampo(c.id, c.numerico ? e.target.value.replace(/\D/g, '') : e.target.value)}
                  aria-invalid={!!err}
                  aria-describedby={err ? `${id}-err` : undefined}
                  autoComplete="off"
                />
                {err && <p id={`${id}-err`} className="campo__error">{err}</p>}
              </div>
            )
          })}
        </div>
        {plantilla.campos.some((c) => !(diseno.campos[c.id] || '').trim()) ? (
          <p className="ayuda">Ejemplo: <strong>{lineasEjemplo.join(' / ')}</strong>. Escribe tus datos y verás el resultado.</p>
        ) : (
          <p className="ayuda">Quedará así: <strong>{lineasFinales.filter(Boolean).join(' / ')}</strong></p>
        )}
        {errores.largo && <p className="campo__error">{errores.largo}</p>}
      </fieldset>
    )
  }

  return (
    <fieldset className="grupo-control">
      <legend>Tu texto</legend>
      <div className="campos">
        {Array.from({ length: producto.texto.maxLineas }, (_, i) => {
          const id = `linea-${i}`
          const valor = diseno.lineas[i] || ''
          const err = errores[`linea${i}`]
          return (
            <div key={i} className="campo">
              <label htmlFor={id}>
                Línea {i + 1}{i > 0 && <span className="opcional"> (opcional)</span>}
                <span className="contador-car" aria-hidden="true">{valor.length}/{max}</span>
              </label>
              <input
                id={id}
                type="text"
                value={valor}
                maxLength={max}
                placeholder={i === 0 ? 'Ej.: Lucía' : 'Ej.: 2026'}
                onChange={(e) => onLinea(i, e.target.value)}
                aria-invalid={!!err}
                aria-describedby={`${id}-ayuda${err ? ` ${id}-err` : ''}`}
                autoComplete="off"
              />
              <span id={`${id}-ayuda`} className="sr-only">Máximo {max} caracteres</span>
              {err && <p id={`${id}-err`} className="campo__error">{err}</p>}
            </div>
          )
        })}
      </div>
    </fieldset>
  )
}
